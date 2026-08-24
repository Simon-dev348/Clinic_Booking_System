import os
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.core.signing import BadSignature, TimestampSigner
from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.dateparse import parse_date
from rest_framework import generics, permissions
from .models import AppointmentSlot, Booking, ClinicProfile, Clinician, Location, Specialty
from .serializers import BookingReadSerializer, BookingSerializer, ClinicProfileSerializer, ClinicianSerializer, LocationSerializer, SignupSerializer, SlotSerializer, SpecialtySerializer

User = get_user_model()
signer = TimestampSigner()


def health(request):
    return JsonResponse({"status": "ok"})

def send_verification_email(recipient, verification_url):
    subject = "Verify your Carewise account"
    text = f"Verify your Carewise account by opening this link: {verification_url}"
    if not settings.RESEND_API_KEY:
        send_mail(subject, text, settings.DEFAULT_FROM_EMAIL, [recipient])
        return
    payload = json.dumps({"from": settings.RESEND_FROM_EMAIL, "to": [recipient], "subject": subject, "text": text}).encode()
    resend_request = Request("https://api.resend.com/emails", data=payload, headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}", "Content-Type": "application/json"}, method="POST")
    with urlopen(resend_request, timeout=15) as response:
        if response.status >= 300:
            raise OSError(f"Resend returned HTTP {response.status}")

class SignupView(generics.GenericAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        existing_user = User.objects.filter(username=email).first()
        if existing_user:
            if not settings.EMAIL_CONFIRMATION_REQUIRED and not existing_user.is_active and check_password(serializer.validated_data["password"], existing_user.password):
                existing_user.is_active = True
                existing_user.save(update_fields=["is_active"])
                return JsonResponse({"message": "Your account is ready. You can now sign in."}, status=200)
            if not existing_user.is_active and check_password(serializer.validated_data["password"], existing_user.password):
                token = signer.sign(existing_user.pk)
                verification_url = f"{request.scheme}://{request.get_host()}/api/auth/verify/{token}/"
                send_verification_email(email, verification_url)
                response = {"message": "This account is waiting for email verification. A new verification link has been sent."}
                if settings.DEBUG:
                    response["verification_url"] = verification_url
                return JsonResponse(response, status=200)
            return JsonResponse({"detail": "An account with this email already exists."}, status=400)
        user = User.objects.create_user(username=email, email=email, password=serializer.validated_data["password"], is_active=not settings.EMAIL_CONFIRMATION_REQUIRED)
        if not settings.EMAIL_CONFIRMATION_REQUIRED:
            return JsonResponse({"message": "Your account is ready. You can now sign in."}, status=201)
        token = signer.sign(user.pk)
        verification_url = f"{request.scheme}://{request.get_host()}/api/auth/verify/{token}/"
        send_verification_email(email, verification_url)
        response = {"message": "Check your email to verify your account."}
        if settings.DEBUG:
            response["verification_url"] = verification_url
        return JsonResponse(response, status=201)

class EmailTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        email = str(request.data.get("username", "")).lower()
        user = User.objects.filter(username=email).first()
        if user and not settings.EMAIL_CONFIRMATION_REQUIRED and not user.is_active and check_password(request.data.get("password", ""), user.password):
            user.is_active = True
            user.save(update_fields=["is_active"])
        elif user and settings.EMAIL_CONFIRMATION_REQUIRED and not user.is_active and check_password(request.data.get("password", ""), user.password):
            return JsonResponse({"detail": "Please verify your email before signing in. Check your inbox for the verification link."}, status=403)
        return super().post(request, *args, **kwargs)

class VerifySignupView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        try:
            user = User.objects.get(pk=signer.unsign(token, max_age=86400))
        except (BadSignature, User.DoesNotExist, ValueError):
            return JsonResponse({"detail": "This verification link is invalid or expired."}, status=400)
        user.is_active = True
        user.save(update_fields=["is_active"])
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        return redirect(f"{frontend_url}/?verified=1")

class GoogleLoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not settings.GOOGLE_CLIENT_ID:
            return JsonResponse({"detail": "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."}, status=503)
        query = urlencode({
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "select_account",
        })
        return redirect(f"https://accounts.google.com/o/oauth2/v2/auth?{query}")

class GoogleCallbackView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        code = request.query_params.get("code")
        if not code or not settings.GOOGLE_CLIENT_SECRET:
            return redirect(f"{settings.FRONTEND_URL}/?auth_error=google")
        try:
            token_request = Request("https://oauth2.googleapis.com/token", data=urlencode({
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            }).encode(), headers={"Content-Type": "application/x-www-form-urlencoded"})
            token_data = json.loads(urlopen(token_request).read())
            profile_request = Request("https://openidconnect.googleapis.com/v1/userinfo", headers={"Authorization": f"Bearer {token_data['access_token']}"})
            google_profile = json.loads(urlopen(profile_request).read())
            email = google_profile["email"].lower()
            user, _ = User.objects.get_or_create(username=email, defaults={"email": email, "first_name": google_profile.get("given_name", ""), "last_name": google_profile.get("family_name", "")})
            if not user.is_active:
                user.is_active = True
                user.save(update_fields=["is_active"])
            access = str(RefreshToken.for_user(user).access_token)
            return redirect(f"{settings.FRONTEND_URL}/?google_token={access}")
        except (KeyError, ValueError, OSError, json.JSONDecodeError):
            return redirect(f"{settings.FRONTEND_URL}/?auth_error=google")

class ClinicProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ClinicProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = ClinicProfile.objects.get_or_create(owner=self.request.user, defaults={"clinic_name": "", "location": ""})
        return profile

class ClinicProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = ClinicProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ClinicProfile.objects.filter(owner=self.request.user).order_by("id")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, onboarding_complete=True)

class ClinicProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ClinicProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ClinicProfile.objects.filter(owner=self.request.user)

class LocationList(generics.ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

class SpecialtyList(generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [permissions.AllowAny]

class ClinicianList(generics.ListAPIView):
    serializer_class = ClinicianSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Clinician.objects.select_related("specialty").prefetch_related("locations")
        location = self.request.query_params.get("location")
        specialty = self.request.query_params.get("specialty")
        if location:
            queryset = queryset.filter(locations__id=location)
        if specialty:
            queryset = queryset.filter(specialty__id=specialty)
        return queryset.distinct()

class SlotList(generics.ListAPIView):
    serializer_class = SlotSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = AppointmentSlot.objects.filter(is_available=True).select_related("clinician__specialty").prefetch_related("clinician__locations")
        clinician = self.request.query_params.get("clinician")
        date = parse_date(self.request.query_params.get("date", ""))
        if clinician:
            queryset = queryset.filter(clinician_id=clinician)
        if date:
            queryset = queryset.filter(starts_at__date=date)
        return queryset

class BookingCreate(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookingList(generics.ListAPIView):
    serializer_class = BookingReadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(patient=self.request.user).select_related("slot__clinician__specialty").prefetch_related("slot__clinician__locations")

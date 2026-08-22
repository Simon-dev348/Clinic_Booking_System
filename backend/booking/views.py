from django.http import JsonResponse
from django.utils.dateparse import parse_date
from rest_framework import generics, permissions
from .models import AppointmentSlot, Clinician, Location, Specialty
from .serializers import BookingSerializer, ClinicianSerializer, LocationSerializer, SlotSerializer, SpecialtySerializer


def health(request):
    return JsonResponse({"status": "ok"})

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

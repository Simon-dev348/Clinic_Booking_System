from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from booking.views import health
from booking.views import EmailTokenObtainPairView, GoogleCallbackView, GoogleLoginView, SignupView, VerifySignupView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/auth/token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/signup/", SignupView.as_view()),
    path("api/auth/verify/<str:token>/", VerifySignupView.as_view()),
    path("api/auth/google/", GoogleLoginView.as_view()),
    path("api/auth/google/callback/", GoogleCallbackView.as_view()),
    path("api/", include("booking.urls")),
]

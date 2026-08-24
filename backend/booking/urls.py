from django.urls import path
from .views import BookingCreate, BookingList, ClinicProfileDetailView, ClinicProfileListCreateView, ClinicProfileView, ClinicianList, LocationList, SlotList, SpecialtyList

urlpatterns = [
    path("locations/", LocationList.as_view()),
    path("specialties/", SpecialtyList.as_view()),
    path("clinicians/", ClinicianList.as_view()),
    path("slots/", SlotList.as_view()),
    path("bookings/", BookingCreate.as_view()),
    path("my-bookings/", BookingList.as_view()),
    path("clinic-profile/", ClinicProfileView.as_view()),
    path("clinic-profiles/", ClinicProfileListCreateView.as_view()),
    path("clinic-profiles/<int:pk>/", ClinicProfileDetailView.as_view()),
]

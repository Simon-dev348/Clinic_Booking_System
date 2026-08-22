from django.urls import path
from .views import BookingCreate, ClinicianList, LocationList, SlotList, SpecialtyList

urlpatterns = [
    path("locations/", LocationList.as_view()),
    path("specialties/", SpecialtyList.as_view()),
    path("clinicians/", ClinicianList.as_view()),
    path("slots/", SlotList.as_view()),
    path("bookings/", BookingCreate.as_view()),
]

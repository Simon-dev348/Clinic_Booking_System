from django.contrib import admin
from .models import AppointmentSlot, Booking, Clinician, Location, Specialty

admin.site.register([Location, Specialty, Clinician, AppointmentSlot, Booking])

from django.conf import settings
from django.db import models

class Location(models.Model):
    name = models.CharField(max_length=120)
    city = models.CharField(max_length=80)
    address = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}, {self.city}"

class Specialty(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Clinician(models.Model):
    name = models.CharField(max_length=120)
    title = models.CharField(max_length=120)
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name="clinicians")
    locations = models.ManyToManyField(Location, related_name="clinicians")
    accent = models.CharField(max_length=7, default="#1e6655")

    def __str__(self):
        return self.name

class AppointmentSlot(models.Model):
    clinician = models.ForeignKey(Clinician, on_delete=models.CASCADE, related_name="slots")
    starts_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["starts_at"]

class Booking(models.Model):
    slot = models.OneToOneField(AppointmentSlot, on_delete=models.PROTECT, related_name="booking")
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

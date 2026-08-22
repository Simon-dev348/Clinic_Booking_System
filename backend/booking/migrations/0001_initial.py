from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(name="Location", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("name", models.CharField(max_length=120)), ("city", models.CharField(max_length=80)), ("address", models.CharField(max_length=200))]),
        migrations.CreateModel(name="Specialty", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("name", models.CharField(max_length=100)), ("description", models.TextField(blank=True))]),
        migrations.CreateModel(name="Clinician", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("name", models.CharField(max_length=120)), ("title", models.CharField(max_length=120)), ("accent", models.CharField(default="#1e6655", max_length=7)), ("locations", models.ManyToManyField(related_name="clinicians", to="booking.location")), ("specialty", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="clinicians", to="booking.specialty"))]),
        migrations.CreateModel(name="AppointmentSlot", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("starts_at", models.DateTimeField()), ("duration_minutes", models.PositiveIntegerField(default=30)), ("is_available", models.BooleanField(default=True)), ("clinician", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="slots", to="booking.clinician"))], options={"ordering": ["starts_at"]}),
        migrations.CreateModel(name="Booking", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("notes", models.TextField(blank=True)), ("created_at", models.DateTimeField(auto_now_add=True)), ("patient", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="bookings", to=settings.AUTH_USER_MODEL)), ("slot", models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name="booking", to="booking.appointmentslot"))]),
    ]

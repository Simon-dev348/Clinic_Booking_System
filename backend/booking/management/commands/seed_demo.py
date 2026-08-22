from datetime import datetime, timedelta, timezone
from django.core.management.base import BaseCommand
from booking.models import AppointmentSlot, Clinician, Location, Specialty

class Command(BaseCommand):
    help = "Create demo clinic data"

    def handle(self, *args, **options):
        downtown, _ = Location.objects.get_or_create(name="Downtown Clinic", city="Portland", defaults={"address": "125 Alder Street"})
        riverside, _ = Location.objects.get_or_create(name="Riverside Health", city="Portland", defaults={"address": "48 Water Avenue"})
        primary, _ = Specialty.objects.get_or_create(name="Primary care", defaults={"description": "Preventive care and everyday health needs"})
        dermatology, _ = Specialty.objects.get_or_create(name="Dermatology", defaults={"description": "Skin, hair, and nail health"})
        clinicians = [
            ("Dr. Maya Chen", "Family physician", primary, "#1e6655"),
            ("Dr. Elias Brooks", "Dermatologist", dermatology, "#c45c3c"),
            ("Dr. Noor Patel", "Family physician", primary, "#9a6b2f"),
        ]
        for name, title, specialty, accent in clinicians:
            clinician, _ = Clinician.objects.get_or_create(name=name, defaults={"title": title, "specialty": specialty, "accent": accent})
            clinician.locations.add(downtown if name != "Dr. Noor Patel" else riverside)
            for day in range(5):
                for hour in (9, 10, 11, 14, 15):
                    start = datetime.now(timezone.utc).replace(hour=hour, minute=0, second=0, microsecond=0) + timedelta(days=day + 1)
                    AppointmentSlot.objects.get_or_create(clinician=clinician, starts_at=start)
        self.stdout.write(self.style.SUCCESS("Demo clinic data is ready."))

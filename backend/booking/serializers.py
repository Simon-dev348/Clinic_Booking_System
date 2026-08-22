from rest_framework import serializers
from .models import AppointmentSlot, Booking, Clinician, Location, Specialty

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "name", "city", "address"]

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ["id", "name", "description"]

class ClinicianSerializer(serializers.ModelSerializer):
    specialty = SpecialtySerializer(read_only=True)
    location_ids = serializers.PrimaryKeyRelatedField(source="locations", many=True, read_only=True)

    class Meta:
        model = Clinician
        fields = ["id", "name", "title", "specialty", "location_ids", "accent"]

class SlotSerializer(serializers.ModelSerializer):
    clinician = ClinicianSerializer(read_only=True)
    location = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentSlot
        fields = ["id", "clinician", "location", "starts_at", "duration_minutes"]

    def get_location(self, slot):
        location = slot.clinician.locations.first()
        return LocationSerializer(location).data if location else None

class BookingSerializer(serializers.ModelSerializer):
    slot = serializers.PrimaryKeyRelatedField(queryset=AppointmentSlot.objects.filter(is_available=True))

    class Meta:
        model = Booking
        fields = ["id", "slot", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        slot = validated_data["slot"]
        slot.is_available = False
        slot.save(update_fields=["is_available"])
        return Booking.objects.create(patient=self.context["request"].user, **validated_data)

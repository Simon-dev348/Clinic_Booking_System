from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("booking", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ClinicProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("clinic_name", models.CharField(max_length=160)),
                ("location", models.CharField(max_length=160)),
                ("practitioners", models.JSONField(default=list)),
                ("services", models.JSONField(default=list)),
                ("onboarding_complete", models.BooleanField(default=False)),
                ("owner", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="clinic_profile", to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
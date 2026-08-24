from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("booking", "0002_clinicprofile")]

    operations = [
        migrations.AlterField(
            model_name="clinicprofile",
            name="owner",
            field=models.ForeignKey(
                on_delete=models.deletion.CASCADE,
                related_name="clinic_profiles",
                to="auth.user",
            ),
        ),
    ]
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("booking", "0003_clinicprofile_multiple")]

    operations = [
        migrations.AddField(
            model_name="clinicprofile",
            name="availability",
            field=models.JSONField(default=dict),
        ),
    ]
from django.db import migrations
from django.contrib.sites.models import Site

def create_default_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    Site.objects.get_or_create(domain='localhost:8000', name='localhost')

class Migration(migrations.Migration):

    dependencies = [
        ('sites', '0002_alter_domain_unique'),
        ('data', '0006_rename_vector_store_path_processeddocument_collection_name'),  # Replace with your actual previous migration
    ]

    operations = [
        migrations.RunPython(create_default_site),
    ]


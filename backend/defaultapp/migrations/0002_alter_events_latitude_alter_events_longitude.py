# Generated by Django 5.1.4 on 2025-01-25 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('defaultapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='events',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=7, max_digits=11, null=True),
        ),
        migrations.AlterField(
            model_name='events',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=7, max_digits=11, null=True),
        ),
    ]

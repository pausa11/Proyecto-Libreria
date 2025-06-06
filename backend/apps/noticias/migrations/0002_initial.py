# Generated by Django 4.2.21 on 2025-05-21 07:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('libros', '0001_initial'),
        ('noticias', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='suscripcion',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='suscripciones', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='noticia',
            name='autor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='noticias', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='noticia',
            name='libro_relacionado',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='noticias', to='libros.libro'),
        ),
        migrations.AlterUniqueTogether(
            name='suscripcion',
            unique_together={('usuario',)},
        ),
    ]

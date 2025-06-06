# Generated by Django 4.2.21 on 2025-05-21 07:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ForoPersonal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('esta_activo', models.BooleanField(default=True, verbose_name='Está activo')),
            ],
            options={
                'verbose_name': 'Foro Personal',
                'verbose_name_plural': 'Foros Personales',
                'ordering': ['-fecha_creacion'],
            },
        ),
        migrations.CreateModel(
            name='Mensaje',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contenido', models.TextField(verbose_name='Contenido')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('estado_mensaje', models.CharField(choices=[('ABIERTO', 'Abierto'), ('RESPONDIDO', 'Respondido'), ('CERRADO', 'Cerrado')], default='ABIERTO', max_length=10, verbose_name='Estado del Mensaje')),
                ('es_respuesta', models.BooleanField(default=False, verbose_name='Es respuesta')),
            ],
            options={
                'verbose_name': 'Mensaje',
                'verbose_name_plural': 'Mensajes',
                'ordering': ['-fecha_creacion'],
            },
        ),
        migrations.CreateModel(
            name='NotificacionMensaje',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('leido', models.BooleanField(default=False, verbose_name='Leído')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('mensaje', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notificaciones', to='mensajeria.mensaje', verbose_name='Mensaje')),
            ],
            options={
                'verbose_name': 'Notificación de Mensaje',
                'verbose_name_plural': 'Notificaciones de Mensajes',
                'ordering': ['-fecha_creacion'],
            },
        ),
    ]

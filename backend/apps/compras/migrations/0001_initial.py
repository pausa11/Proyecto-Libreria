# Generated by Django 4.2.20 on 2025-03-10 04:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("libros", "0002_categoria_alter_libro_options_libro_año_publicacion_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Carrito",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("fecha", models.DateTimeField(auto_now_add=True)),
                ("libros", models.ManyToManyField(to="libros.libro")),
            ],
        ),
    ]

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator

# Create your models here.

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
    
    def __str__(self):
        return self.nombre

class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    isbn = models.CharField(max_length=13, unique=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='libros')
    editorial = models.CharField(max_length=100, null=True, blank=True)  # Hacemos el campo opcional
    año_publicacion = models.IntegerField(
        validators=[
            MinValueValidator(1000),
            MaxValueValidator(2100)
        ],
        null=True
    )
    descripcion = models.TextField(blank=True)
    portada = models.ImageField(
        upload_to='portadas/',
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp'])],
        blank=True,
        null=True,
        help_text='Portada del libro (formatos: JPG, PNG, WebP)'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Libro"
        verbose_name_plural = "Libros"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.titulo} - {self.autor}"

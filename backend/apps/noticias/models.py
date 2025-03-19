from django.db import models
from django.contrib.auth import get_user_model
from apps.libros.models import Libro, Categoria
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class EstadoNoticia(models.TextChoices):
    BORRADOR = 'BORRADOR', _('Borrador')
    PUBLICADO = 'PUBLICADO', _('Publicado')

class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    autor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='noticias')
    libro_relacionado = models.ForeignKey(
        Libro, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='noticias'
    )
    imagen = models.ImageField(upload_to='noticias/', null=True, blank=True)
    estado_noticia = models.CharField(
        max_length=10,
        choices=EstadoNoticia.choices,
        default=EstadoNoticia.BORRADOR,
        verbose_name=_('Estado de la Noticia')
    )
    tags = models.CharField(max_length=200, blank=True)  # Almacenará tags separados por comas

    class Meta:
        ordering = ['-fecha_publicacion']
        verbose_name = 'Noticia'
        verbose_name_plural = 'Noticias'

    def __str__(self):
        return self.titulo

    def get_tags_list(self):
        """Retorna la lista de tags como una lista de Python"""
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]

class Suscripcion(models.Model):
    usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='suscripciones'
    )
    categorias_interes = models.ManyToManyField(
        Categoria, 
        related_name='suscriptores'
    )
    activo = models.BooleanField(default=True)
    fecha_suscripcion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Suscripción'
        verbose_name_plural = 'Suscripciones'
        unique_together = ['usuario']  # Un usuario solo puede tener una suscripción

    def __str__(self):
        return f"Suscripción de {self.usuario.username}"

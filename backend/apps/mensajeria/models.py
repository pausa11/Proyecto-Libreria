from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class ForoPersonal(models.Model):
    """
    Modelo que representa un foro personal para cada usuario.
    Cada usuario tendrá un único foro donde podrá crear consultas y recibir respuestas.
    """
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='foro_personal',
        verbose_name=_('Usuario')
    )
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Fecha de creación')
    )
    esta_activo = models.BooleanField(
        default=True,
        verbose_name=_('Está activo')
    )

    class Meta:
        verbose_name = _('Foro Personal')
        verbose_name_plural = _('Foros Personales')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f'Foro de {self.usuario.username}'

class Mensaje(models.Model):
    """
    Modelo para los mensajes dentro de un foro personal.
    Puede ser tanto una consulta inicial como una respuesta a otro mensaje.
    """
    class EstadoMensaje(models.TextChoices):
        ABIERTO = 'ABIERTO', _('Abierto')
        RESPONDIDO = 'RESPONDIDO', _('Respondido')
        CERRADO = 'CERRADO', _('Cerrado')

    foro = models.ForeignKey(
        ForoPersonal,
        on_delete=models.CASCADE,
        related_name='mensajes',
        verbose_name=_('Foro')
    )
    autor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='mensajes_creados',
        verbose_name=_('Autor')
    )
    contenido = models.TextField(
        verbose_name=_('Contenido')
    )
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Fecha de creación')
    )
    estado = models.CharField(
        max_length=10,
        choices=EstadoMensaje.choices,
        default=EstadoMensaje.ABIERTO,
        verbose_name=_('Estado')
    )
    es_respuesta = models.BooleanField(
        default=False,
        verbose_name=_('Es respuesta')
    )
    mensaje_original = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='respuestas',
        verbose_name=_('Mensaje original')
    )

    class Meta:
        verbose_name = _('Mensaje')
        verbose_name_plural = _('Mensajes')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f'Mensaje de {self.autor.username} - {self.fecha_creacion}'

class NotificacionMensaje(models.Model):
    """
    Modelo para gestionar las notificaciones de mensajes.
    Se crea una notificación cuando se recibe una respuesta o cuando se crea un nuevo mensaje.
    """
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notificaciones_mensajes',
        verbose_name=_('Usuario')
    )
    mensaje = models.ForeignKey(
        Mensaje,
        on_delete=models.CASCADE,
        related_name='notificaciones',
        verbose_name=_('Mensaje')
    )
    leido = models.BooleanField(
        default=False,
        verbose_name=_('Leído')
    )
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Fecha de creación')
    )

    class Meta:
        verbose_name = _('Notificación de Mensaje')
        verbose_name_plural = _('Notificaciones de Mensajes')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f'Notificación para {self.usuario.username} - {self.mensaje}'

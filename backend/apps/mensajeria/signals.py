from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import ForoPersonal, Mensaje, NotificacionMensaje

User = get_user_model()

@receiver(post_save, sender=User)
def crear_foro_personal(sender, instance, created, **kwargs):
    """
    Crea automáticamente un foro personal cuando se registra un nuevo usuario.
    """
    if created:
        ForoPersonal.objects.create(usuario=instance)

@receiver(post_save, sender=Mensaje)
def crear_notificacion_mensaje(sender, instance, created, **kwargs):
    """
    Crea notificaciones automáticamente cuando:
    1. Se crea un nuevo mensaje en un foro (notifica al dueño del foro)
    2. Se crea una respuesta a un mensaje (notifica al autor del mensaje original)
    """
    if created:
        if instance.es_respuesta and instance.mensaje_original:
            # Notificar al autor del mensaje original
            NotificacionMensaje.objects.create(
                usuario=instance.mensaje_original.autor,
                mensaje=instance
            )
        elif not instance.es_respuesta:
            # Notificar al dueño del foro si no es una respuesta
            NotificacionMensaje.objects.create(
                usuario=instance.foro.usuario,
                mensaje=instance
            )

@receiver(post_save, sender=Mensaje)
def actualizar_estado_mensaje(sender, instance, created, **kwargs):
    """
    Actualiza el estado del mensaje original cuando se crea una respuesta.
    """
    if created and instance.es_respuesta and instance.mensaje_original:
        mensaje_original = instance.mensaje_original
        if mensaje_original.estado == 'ABIERTO':
            mensaje_original.estado = 'RESPONDIDO'
            mensaje_original.save(update_fields=['estado']) 
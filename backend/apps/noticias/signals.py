from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from apps.libros.models import Libro
from .models import Noticia, Suscripcion
from .notifications import enviar_notificacion_nueva_noticia, enviar_confirmacion_suscripcion

User = get_user_model()

@receiver(post_save, sender=Libro)
def crear_noticia_nuevo_libro(sender, instance, created, **kwargs):
    """
    Crea automáticamente una noticia cuando se agrega un nuevo libro
    """
    if created:  # Solo si es un libro nuevo
        # Intentamos obtener un superusuario para asignarlo como autor
        autor = User.objects.filter(is_superuser=True).first()
        if not autor:
            # Si no hay superusuario, usamos el primer staff user
            autor = User.objects.filter(is_staff=True).first()
        
        if autor:
            noticia = Noticia.objects.create(
                titulo=f"¡Nuevo libro disponible: {instance.titulo}!",
                contenido=f"Nos complace anunciar que hemos añadido '{instance.titulo}' a nuestro catálogo. "
                         f"Este libro de {instance.autor} ya está disponible para su compra.\n\n"
                         f"Descripción: {instance.descripcion if instance.descripcion else 'No disponible'}",
                autor=autor,
                libro_relacionado=instance,
                estado='publicado',
                tags=f"nuevo,{instance.categoria.nombre if instance.categoria else ''}"
            )
            # Ya no enviamos el email aquí, se enviará en la señal de noticia

@receiver(post_save, sender=Noticia)
def notificar_nueva_noticia(sender, instance, created, **kwargs):
    """
    Envía notificaciones cuando se publica una nueva noticia
    Solo envía la notificación si:
    1. La noticia está publicada
    2. Es una noticia nueva O ha cambiado de estado a 'publicado'
    """
    if instance.estado == 'publicado':
        # Obtener el estado anterior si existe
        try:
            noticia_anterior = Noticia.objects.get(id=instance.id)
            estado_anterior = noticia_anterior.estado
        except Noticia.DoesNotExist:
            estado_anterior = None

        # Enviar notificación solo si:
        # - Es una noticia nueva (created=True)
        # - O si cambió de estado a 'publicado'
        if created or estado_anterior != 'publicado':
            enviar_notificacion_nueva_noticia(instance)

@receiver(post_save, sender=Suscripcion)
def notificar_suscripcion(sender, instance, created, **kwargs):
    """
    Envía email de confirmación cuando un usuario se suscribe
    """
    if created:
        enviar_confirmacion_suscripcion(instance) 
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from apps.finanzas.models import Saldo
from apps.compras.models import Carrito

Usuario = get_user_model()

@receiver(post_save, sender=Usuario)
def crear_saldo_para_usuario(sender, instance, created, **kwargs):
    """
    Crea un saldo inicial de 0 para el nuevo usuario.
    """
    if created and instance.tipo_usuario == 'LECTOR':
        # Aquí puedes crear el saldo inicial para el usuario
        Saldo.objects.create(usuario=instance, saldo=0.00)
        

@receiver(post_save, sender=Usuario)
def crear_carrito_para_usuario(sender, instance, created, **kwargs):
    """
    Crea un carrito inicial para el nuevo usuario.
    """
    if created and instance.tipo_usuario == 'LECTOR':
        # Aquí puedes crear el carrito inicial para el usuario
        Carrito.objects.create(usuario=instance)
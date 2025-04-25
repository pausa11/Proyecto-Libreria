from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class Usuario(AbstractUser):
    TIPO_USUARIO_CHOICES = [
        ('ADMIN', 'Administrador'),
        ('BIBLIOTECARIO', 'Bibliotecario'),
        ('LECTOR', 'Lector'),
    ]

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES,
        default='LECTOR'
    )
    
    numero_identificacion = models.CharField(
        max_length=20,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\d{8,20}$',
                message='El número de identificación debe tener entre 8 y 20 dígitos'
            )
        ]
    )
    
    telefono = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message='El número de teléfono debe estar en formato: "+999999999".'
            )
        ],
        blank=True,
        null=True
    )
    
    direccion = models.TextField(blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    
    # Campos de metadatos
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_tipo_usuario_display()})"

    @property
    def nombre_completo(self):
        return self.get_full_name() or self.username


class UsuarioPreferencias(models.Model):
    """
    Modelo para almacenar las preferencias de suscripción y contenido del usuario.
    """
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='preferencias'
    )
    
    # Preferencias de suscripción
    recibir_actualizaciones = models.BooleanField(default=True)
    recibir_noticias = models.BooleanField(default=True)
    recibir_descuentos = models.BooleanField(default=True)
    recibir_mensajes_foro = models.BooleanField(default=True)
    
    # Campos de metadatos
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Preferencia de Usuario"
        verbose_name_plural = "Preferencias de Usuarios"
    
    def __str__(self):
        return f"Preferencias de {self.usuario.nombre_completo}"

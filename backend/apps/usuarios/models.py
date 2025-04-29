from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
import uuid
from datetime import timedelta
from django.utils import timezone

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
    foto_perfil = models.ImageField(upload_to='fotos_perfil/', blank=True, null=True)
    nacionalidad = models.TextField(blank=True, null=True)
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


class TokenRecuperacionPassword(models.Model):
    """
    Modelo para almacenar tokens de recuperación de contraseña con vencimiento.
    """
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='tokens_recuperacion')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_expiracion = models.DateTimeField()
    usado = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Token de {self.usuario.username} - {'Usado' if self.usado else 'Activo'}"
    
    def save(self, *args, **kwargs):
        if not self.fecha_expiracion:
            # Por defecto, el token expira en 15 minutos
            self.fecha_expiracion = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)
    
    @property
    def esta_activo(self):
        """Verifica si el token sigue siendo válido."""
        return (not self.usado and 
                timezone.now() < self.fecha_expiracion)
    
    @classmethod
    def generar_token(cls, usuario):
        """
        Genera un nuevo token para un usuario, invalidando cualquier token previo.
        """
        # Marcar como usados todos los tokens previos del usuario
        cls.objects.filter(usuario=usuario, usado=False).update(usado=True)
        
        # Crear un nuevo token
        return cls.objects.create(usuario=usuario)

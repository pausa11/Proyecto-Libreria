from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import RegexValidator, FileExtensionValidator
import uuid
import os
from datetime import timedelta
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from apps.libros.models import Categoria, Libro

def user_profile_image_path(instance, filename):
    # Obtener la extensión del archivo original
    ext = filename.split('.')[-1]
    # Crear un nombre de archivo usando el username y un identificador único
    filename = f"{instance.username}_{uuid.uuid4().hex[:8]}.{ext}"
    # Devolver la ruta donde se guardará
    return os.path.join('perfiles', filename)

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        if not username:
            raise ValueError('El username es obligatorio')
        
        email = self.normalize_email(email)
        
        # Only set fields that actually exist in the Usuario model
        if 'numero_identificacion' not in extra_fields:
            extra_fields['numero_identificacion'] = f"ADMIN-{username}"
        
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        # Set unique identification for superuser
        extra_fields.setdefault('numero_identificacion', f"SUPER-{username}")
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superuser debe tener is_superuser=True.')
        
        return self.create_user(username, email, password, **extra_fields)

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
    foto_perfil = models.ImageField(
        upload_to=user_profile_image_path,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp'])],
        blank=True,
        null=True,
        help_text='Foto de perfil (formatos: JPG, PNG, WebP)'
    )
    departamento = models.TextField(blank=True, null=True)
    nacionalidad = models.TextField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    
    # Campos de metadatos
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    objects = CustomUserManager()
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_tipo_usuario_display()})"

    @property
    def nombre_completo(self):
        return self.get_full_name() or self.username

    def save(self, *args, **kwargs):
        # Sincronizar is_staff e is_superuser basado en tipo_usuario
        if self.tipo_usuario == 'ADMIN':
            self.is_staff = True
        elif self.tipo_usuario == 'BIBLIOTECARIO':
            self.is_staff = True
        elif self.tipo_usuario == 'LECTOR':
            self.is_staff = False
            
        # Los superusers mantienen sus privilegios independientemente del tipo_usuario
        if self.is_superuser:
            self.is_staff = True
            self.is_active = True
            # Si es superuser, asegurar que tenga un tipo_usuario apropiado
            if not self.tipo_usuario or self.tipo_usuario == 'LECTOR':
                self.tipo_usuario = 'ADMIN'
        
        # Sincronizar activo con is_active
        if hasattr(self, 'activo'):
            self.is_active = self.activo
        else:
            self.activo = self.is_active
            
        print(f"💾 Guardando usuario {self.username}:")
        print(f"  - is_staff: {self.is_staff}")
        print(f"  - is_superuser: {self.is_superuser}")
        print(f"  - tipo_usuario: {self.tipo_usuario}")
        print(f"  - activo: {getattr(self, 'activo', 'N/A')}")
        print(f"  - is_active: {self.is_active}")
            
        super().save(*args, **kwargs)

class UsuarioPreferencias(models.Model):
    """
    Modelo para almacenar las preferencias de suscripción y contenido del usuario.
    """
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='preferencias'
    )
    preferencias=ArrayField(models.CharField(max_length=100), blank=True, default=list)
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
    
    def agregar_preferencia(self, preferencia):
        """
        Agrega una preferencia a la lista de preferencias del usuario.
        """
        for autor, categoria in zip(Libro.objects.values_list("autor", flat=True), Categoria.objects.values_list('nombre', flat=True)):
            if preferencia == autor or preferencia == categoria:
                print(f"Preferencia: {preferencia}, Autor: {autor}, Categoria: {categoria}")
                if preferencia not in self.preferencias:
                    self.preferencias.append(preferencia)
                    self.save()
                else:
                    raise ValueError("La preferencia ya existe en la lista.")
        
        raise ValueError("Preferencia no válida. Debe ser un autor o una categoría existente.")
    
    def eliminar_preferencia(self, preferencia):
        """
        Elimina una preferencia de la lista de preferencias del usuario.
        """
        if self.preferencias == []:
            raise ValueError("No hay preferencias para eliminar.")
        if preferencia in self.preferencias:
            self.preferencias.remove(preferencia)
            self.save()
        else:
            raise ValueError("Preferencia no encontrada en la lista.")

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

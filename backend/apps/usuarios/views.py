from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample, OpenApiResponse, OpenApiTypes
from .serializers import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
    CambioContraseñaSerializer,
    RecuperarContraseñaSerializer,
    ProfileUpdateSerializer,
    PreferenciasUsuarioSerializer,
    ValidarTokenSerializer,
    RestablecerContraseñaSerializer
)
from .models import UsuarioPreferencias, TokenRecuperacionPassword
from django.utils.http import urlencode

Usuario = get_user_model()

# Definición de tags para agrupar endpoints en Swagger
USUARIO_TAG = "Gestión de usuarios"
PERFIL_TAG = "Perfil de usuario" 
AUTENTICACION_TAG = "Autenticación"
PREFERENCIAS_TAG = "Preferencias"

@extend_schema_view(
    list=extend_schema(
        description="Obtiene la lista de todos los usuarios",
        responses={200: UsuarioSerializer(many=True)},
        tags=[USUARIO_TAG]
    ),
    retrieve=extend_schema(
        description="Obtiene un usuario específico por su ID",
        responses={
            200: UsuarioSerializer,
            404: OpenApiResponse(description="Usuario no encontrado")
        },
        tags=[USUARIO_TAG]
    ),
    create=extend_schema(
        description="Registra un nuevo usuario",
        request=UsuarioRegistroSerializer,
        responses={
            201: UsuarioSerializer,
            400: OpenApiResponse(description="Datos inválidos")
        },
        examples=[
            OpenApiExample(
                'Ejemplo Registro',
                value={
                    "email": "usuario@ejemplo.com",
                    "username": "usuario1",
                    "password": "contraseña123",
                    "password2": "contraseña123",
                    "first_name": "Nombre",
                    "last_name": "Apellido",
                    "tipo_usuario": "LECTOR",
                    "nacionalidad" : "Colombia",
                }
            )
        ],
        tags=[USUARIO_TAG]
    ),
    update=extend_schema(
        description="Actualiza todos los campos de un usuario existente",
        request=UsuarioSerializer,
        responses={
            200: UsuarioSerializer,
            400: OpenApiResponse(description="Datos inválidos"),
            404: OpenApiResponse(description="Usuario no encontrado")
        },
        tags=[USUARIO_TAG]
    ),
    partial_update=extend_schema(
        description="Actualiza parcialmente los campos de un usuario existente",
        request=UsuarioSerializer,
        responses={
            200: UsuarioSerializer,
            400: OpenApiResponse(description="Datos inválidos"),
            404: OpenApiResponse(description="Usuario no encontrado")
        },
        tags=[USUARIO_TAG]
    ),
    destroy=extend_schema(
        description="Elimina un usuario existente",
        responses={
            204: None,
            404: OpenApiResponse(description="Usuario no encontrado")
        },
        tags=[USUARIO_TAG]
    )
)
class UsuarioViewSet(viewsets.ModelViewSet):
    """
    Viewset para operaciones CRUD básicas de usuarios.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]  # Permitir registro público
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioRegistroSerializer
        return self.serializer_class


@extend_schema_view(
    cambiar_contraseña=extend_schema(
        description="Cambia la contraseña de un usuario",
        request=CambioContraseñaSerializer,
        responses={
            200: OpenApiResponse(description="Contraseña actualizada correctamente"),
            400: OpenApiResponse(description="Contraseña actual incorrecta o datos inválidos")
        },
        examples=[
            OpenApiExample(
                'Ejemplo Cambio Contraseña',
                value={
                    "old_password": "contraseña_actual",
                    "new_password": "nueva_contraseña",
                    "new_password2": "nueva_contraseña"
                }
            )
        ],
        tags=[AUTENTICACION_TAG]
    ),
    recuperar_contraseña=extend_schema(
        description="Solicita un token para recuperar la contraseña",
        request=RecuperarContraseñaSerializer,
        responses={
            200: OpenApiResponse(description="Correo enviado correctamente"),
            400: OpenApiResponse(description="Email no proporcionado"),
            404: OpenApiResponse(description="Usuario no encontrado")
        },
        examples=[
            OpenApiExample(
                "Ejemplo de solicitud",
                value={"email": "usuario@ejemplo.com"},
                description="Ejemplo de cómo enviar el correo electrónico en el cuerpo de la solicitud"
            )
        ],
        tags=[AUTENTICACION_TAG]
    ),
    validar_token=extend_schema(
        description="Valida un token de recuperación de contraseña",
        request=ValidarTokenSerializer,
        responses={
            200: OpenApiResponse(description="Token válido"),
            400: OpenApiResponse(description="Token inválido o expirado")
        },
        examples=[
            OpenApiExample(
                "Ejemplo de solicitud",
                value={"token": "550e8400-e29b-41d4-a716-446655440000"},
                description="Ejemplo de cómo validar un token de recuperación"
            )
        ],
        tags=[AUTENTICACION_TAG]
    ),
    restablecer_contraseña=extend_schema(
        description="Restablece la contraseña usando un token válido",
        request=RestablecerContraseñaSerializer,
        responses={
            200: OpenApiResponse(description="Contraseña restablecida correctamente"),
            400: OpenApiResponse(description="Datos inválidos o token expirado")
        },
        examples=[
            OpenApiExample(
                "Ejemplo de solicitud",
                value={
                    "token": "550e8400-e29b-41d4-a716-446655440000",
                    "new_password": "NuevaContraseña123",
                    "new_password2": "NuevaContraseña123"
                },
                description="Ejemplo de cómo restablecer una contraseña con un token"
            )
        ],
        tags=[AUTENTICACION_TAG]
    ),
)
class AutenticacionViewSet(viewsets.GenericViewSet):
    """
    Viewset para la gestión de autenticación y contraseñas.
    """
    queryset = Usuario.objects.all()
    
    def get_permissions(self):
        if self.action in ['recuperar_contraseña', 'validar_token', 'restablecer_contraseña']:
            return [AllowAny()]
        return [IsAuthenticated()]
        
    def get_serializer_class(self):
        if self.action == 'cambiar_contraseña':
            return CambioContraseñaSerializer
        elif self.action == 'recuperar_contraseña':
            return RecuperarContraseñaSerializer
        elif self.action == 'validar_token':
            return ValidarTokenSerializer
        elif self.action == 'restablecer_contraseña':
            return RestablecerContraseñaSerializer
        return UsuarioSerializer

    @action(detail=False, methods=['post'])
    def cambiar_contraseña(self, request):
        usuario = request.user
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            if not usuario.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": "Contraseña incorrecta"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            usuario.set_password(serializer.validated_data['new_password'])
            usuario.save()
            return Response(
                {'message': 'Contraseña actualizada correctamente'},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def recuperar_contraseña(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email no proporcionado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            usuario = Usuario.objects.get(email=email)
            
            # Generar token de recuperación
            token_obj = TokenRecuperacionPassword.generar_token(usuario)
            token = token_obj.token
            
            # Enviar email con el token
            frontend_url = "https://pausa11.github.io/Proyecto-Libreria/#/reset-password"
            reset_url = f"{frontend_url}?token={token}"
            
            # Construir mensaje de correo
            mensaje = f"""
Hola {usuario.username},

Has solicitado restablecer tu contraseña. Para crear una nueva contraseña, haz clic en el siguiente enlace:

{reset_url}

Este enlace será válido durante 15 minutos.

Si no has solicitado cambiar tu contraseña, puedes ignorar este mensaje.

Saludos,
El equipo de Librería Aurora
"""
            
            send_mail(
                'Recuperación de contraseña - Librería Aurora',
                mensaje,
                'auroralibreria05@gmail.com',
                [email],
                fail_silently=False,
            )
            return Response(
                {'message': 'Correo de recuperación enviado'},
                status=status.HTTP_200_OK
            )
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def validar_token(self, request):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            return Response(
                {'message': 'Token válido'},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def restablecer_contraseña(self, request):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            token_str = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            # Obtener el token y el usuario
            try:
                token_obj = TokenRecuperacionPassword.objects.get(token=token_str, usado=False)
                if not token_obj.esta_activo:
                    return Response(
                        {'error': 'El token ha expirado'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Actualizar contraseña
                usuario = token_obj.usuario
                usuario.set_password(new_password)
                usuario.save()
                
                # Marcar token como usado
                token_obj.usado = True
                token_obj.save()
                
                return Response(
                    {'message': 'Contraseña restablecida correctamente'},
                    status=status.HTTP_200_OK
                )
            
            except TokenRecuperacionPassword.DoesNotExist:
                return Response(
                    {'error': 'Token inválido o ya utilizado'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema_view(
    perfil=extend_schema(
        description="Obtiene el perfil del usuario autenticado",
        responses={
            200: UsuarioSerializer,
            401: OpenApiResponse(description="No autenticado")
        },
        tags=[PERFIL_TAG]
    ),
    actualizar_perfil=extend_schema(
        description="Permite al usuario actualizar su información de perfil",
        request=ProfileUpdateSerializer,
        responses={
            200: UsuarioSerializer,
            400: OpenApiResponse(description="Datos inválidos"),
        },
        examples=[
            OpenApiExample(
                'Ejemplo de actualización de perfil',
                value={
                    "first_name": "Nuevo Nombre",
                    "last_name": "Nuevo Apellido",
                    "telefono": "+573001234567",
                    "direccion": "Nueva Dirección #123",
                    "fecha_nacimiento": "1990-01-01"
                }
            )
        ],
        tags=[PERFIL_TAG]
    )
)
class PerfilViewSet(viewsets.GenericViewSet):
    """
    Viewset para la gestión del perfil de usuario.
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'actualizar_perfil':
            return ProfileUpdateSerializer
        return UsuarioSerializer

    @action(detail=False, methods=['get'])
    def perfil(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def actualizar_perfil(self, request):
        usuario = request.user
        serializer = self.get_serializer(usuario, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            # Devolver los datos actualizados usando el serializer completo
            return Response(
                UsuarioSerializer(usuario).data,
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema_view(
    preferencias=extend_schema(
        description="Obtiene las preferencias de suscripción del usuario",
        responses={
            200: PreferenciasUsuarioSerializer,
            404: OpenApiResponse(description="Preferencias no encontradas")
        },
        tags=[PREFERENCIAS_TAG]
    ),
    actualizar_preferencias=extend_schema(
        description="Actualiza las preferencias de suscripción del usuario",
        request=PreferenciasUsuarioSerializer,
        responses={
            200: PreferenciasUsuarioSerializer,
            400: OpenApiResponse(description="Datos inválidos")
        },
        examples=[
            OpenApiExample(
                'Ejemplo de actualización de preferencias',
                value={
                    "recibir_actualizaciones": True,
                    "recibir_noticias": False,
                    "recibir_descuentos": True,
                    "recibir_mensajes_foro": False
                }
            )
        ],
        tags=[PREFERENCIAS_TAG]
    )
)
class PreferenciasViewSet(viewsets.GenericViewSet):
    """
    Viewset para la gestión de preferencias del usuario.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PreferenciasUsuarioSerializer
    
    @action(detail=False, methods=['get'], url_path='mis-preferencias')
    def preferencias(self, request):
        """
        Obtiene las preferencias de suscripción del usuario autenticado.
        Si no existen, las crea con valores predeterminados.
        """
        usuario = request.user
        preferencias, created = UsuarioPreferencias.objects.get_or_create(usuario=usuario)
        
        serializer = self.get_serializer(preferencias)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], url_path='actualizar')
    def actualizar_preferencias(self, request):
        """
        Actualiza las preferencias de suscripción del usuario autenticado.
        Si no existen, las crea con los valores proporcionados.
        """
        usuario = request.user
        preferencias, created = UsuarioPreferencias.objects.get_or_create(usuario=usuario)
        
        serializer = self.get_serializer(preferencias, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

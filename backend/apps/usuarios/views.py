from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
    CambioContraseñaSerializer
)
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample

Usuario = get_user_model()

@extend_schema_view(
    list=extend_schema(
        description="Obtiene la lista de todos los usuarios",
        responses={200: UsuarioSerializer(many=True)}
    ),
    retrieve=extend_schema(
        description="Obtiene un usuario específico por su ID",
        parameters=[
            OpenApiParameter(name='id', description='ID del usuario', required=True, type=int)
        ],
        responses={
            200: UsuarioSerializer,
            404: {"description": "Usuario no encontrado"}
        }
    ),
    create=extend_schema(
        description="Registra un nuevo usuario",
        request=UsuarioRegistroSerializer,
        responses={
            201: UsuarioSerializer,
            400: {"description": "Datos inválidos"}
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
                    "tipo_usuario": "LECTOR"
                }
            )
        ]
    ),
    update=extend_schema(
        description="Actualiza todos los campos de un usuario existente",
        request=UsuarioSerializer,
        responses={
            200: UsuarioSerializer,
            400: {"description": "Datos inválidos"},
            404: {"description": "Usuario no encontrado"}
        }
    ),
    partial_update=extend_schema(
        description="Actualiza parcialmente los campos de un usuario existente",
        request=UsuarioSerializer,
        responses={
            200: UsuarioSerializer,
            400: {"description": "Datos inválidos"},
            404: {"description": "Usuario no encontrado"}
        }
    ),
    destroy=extend_schema(
        description="Elimina un usuario existente",
        responses={
            204: None,
            404: {"description": "Usuario no encontrado"}
        }
    )
)
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioRegistroSerializer
        return self.serializer_class

    @extend_schema(
        description="Cambia la contraseña de un usuario",
        request=CambioContraseñaSerializer,
        responses={
            200: {"description": "Contraseña actualizada correctamente"},
            400: {"description": "Contraseña actual incorrecta o datos inválidos"},
            404: {"description": "Usuario no encontrado"}
        },
        examples=[
            OpenApiExample(
                'Ejemplo Cambio Contraseña',
                value={
                    "old_password": "contraseña_actual",
                    "new_password": "nueva_contraseña"
                }
            )
        ]
    )
    @action(detail=True, methods=['post'])
    def cambiar_contraseña(self, request, pk=None):
        usuario = self.get_object()
        serializer = CambioContraseñaSerializer(data=request.data)
        
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

    @extend_schema(
        description="Obtiene el perfil del usuario autenticado",
        responses={
            200: UsuarioSerializer,
            401: {"description": "No autenticado"}
        }
    )
    @action(detail=False, methods=['get'])
    def perfil(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

# Create your views here.

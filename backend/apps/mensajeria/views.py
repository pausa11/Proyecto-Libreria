from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import ForoPersonal, Mensaje, NotificacionMensaje
from .serializers import (
    ForoPersonalSerializer,
    MensajeSerializer,
    MensajeDetalladoSerializer,
    NotificacionMensajeSerializer
)

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Permiso personalizado que solo permite a los propietarios del foro o al staff
    acceder a los objetos.
    """
    def has_object_permission(self, request, view, obj):
        # El staff siempre tiene permiso
        if request.user.is_staff:
            return True
        
        # Para ForoPersonal
        if isinstance(obj, ForoPersonal):
            return obj.usuario == request.user
        
        # Para Mensaje
        if isinstance(obj, Mensaje):
            return obj.foro.usuario == request.user or obj.autor == request.user
        
        # Para NotificacionMensaje
        if isinstance(obj, NotificacionMensaje):
            return obj.usuario == request.user
        
        return False

@extend_schema(
    tags=['Foros Personales'],
    parameters=[
        OpenApiParameter(
            name='id',
            type=int,
            location=OpenApiParameter.PATH,
            description='ID del foro personal'
        )
    ]
)
class ForoPersonalViewSet(viewsets.ModelViewSet):
    serializer_class = ForoPersonalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        if self.request.user.is_staff:
            return ForoPersonal.objects.all()
        return ForoPersonal.objects.filter(usuario=self.request.user)

@extend_schema(
    tags=['Mensajes'],
    parameters=[
        OpenApiParameter(
            name='id',
            type=int,
            location=OpenApiParameter.PATH,
            description='ID del mensaje'
        )
    ]
)
class MensajeViewSet(viewsets.ModelViewSet):
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MensajeDetalladoSerializer
        return MensajeSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Mensaje.objects.all()
        return Mensaje.objects.filter(
            Q(foro__usuario=user) | Q(autor=user)
        ).distinct()

    @extend_schema(
        description=_('Responder a un mensaje existente'),
        responses={201: MensajeSerializer},
        parameters=[
            OpenApiParameter(
                name='id',
                type=int,
                location=OpenApiParameter.PATH,
                description='ID del mensaje al que se responderá'
            )
        ]
    )
    @action(detail=True, methods=['post'])
    def responder(self, request, pk=None):
        mensaje_original = self.get_object()
        serializer = self.get_serializer(data={
            'foro': mensaje_original.foro.id,
            'contenido': request.data.get('contenido'),
            'es_respuesta': True,
            'mensaje_original': mensaje_original.id
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Actualizar estado del mensaje original
        mensaje_original.estado_mensaje = 'RESPONDIDO'
        mensaje_original.save()
        
        # Crear notificación
        NotificacionMensaje.objects.create(
            usuario=mensaje_original.autor,
            mensaje=serializer.instance
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        description=_('Cerrar un mensaje'),
        responses={200: None},
        parameters=[
            OpenApiParameter(
                name='id',
                type=int,
                location=OpenApiParameter.PATH,
                description='ID del mensaje a cerrar'
            )
        ]
    )
    @action(detail=True, methods=['post'])
    def cerrar(self, request, pk=None):
        mensaje = self.get_object()
        mensaje.estado_mensaje = 'CERRADO'
        mensaje.save()
        return Response(status=status.HTTP_200_OK)

@extend_schema(
    tags=['Notificaciones'],
    parameters=[
        OpenApiParameter(
            name='id',
            type=int,
            location=OpenApiParameter.PATH,
            description='ID de la notificación'
        )
    ]
)
class NotificacionMensajeViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionMensajeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return NotificacionMensaje.objects.filter(usuario=self.request.user)

    @extend_schema(
        description=_('Marcar una notificación como leída'),
        responses={200: None},
        parameters=[
            OpenApiParameter(
                name='id',
                type=int,
                location=OpenApiParameter.PATH,
                description='ID de la notificación a marcar como leída'
            )
        ]
    )
    @action(detail=True, methods=['post'])
    def marcar_leido(self, request, pk=None):
        notificacion = self.get_object()
        notificacion.leido = True
        notificacion.save()
        return Response({'status': 'notificación marcada como leída'})

from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
import logging  # Añadimos logging para diagnosticar problemas

from .models import ForoPersonal, Mensaje, NotificacionMensaje
from .serializers import (
    ForoPersonalSerializer,
    MensajeSerializer,
    MensajeDetalladoSerializer,
    NotificacionMensajeSerializer
)

# Configuramos un logger
logger = logging.getLogger(__name__)

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
    """
    API para gestionar mensajes en foros personales.
    """
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            logger.info(f"Staff user {user.username} accessing all messages")
            return Mensaje.objects.all()
        
        logger.info(f"User {user.username} accessing their messages")
        return Mensaje.objects.filter(
            Q(foro__usuario=user) | Q(autor=user)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MensajeDetalladoSerializer
        return MensajeSerializer

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)
    
    # Corrigiendo el método responder para manejar correctamente los parámetros
    @action(detail=True, methods=['post'])
    def responder(self, request, **kwargs):
        try:
            mensaje_original = self.get_object()
            user = request.user
            
            pk = self.kwargs.get(self.lookup_url_kwarg)
            logger.info(f"User {user.username} attempting to reply to message {pk}")
            
            # Verificamos los datos de la solicitud
            logger.debug(f"Request data: {request.data}")
            if 'contenido' not in request.data:
                logger.error(f"Missing 'contenido' in request data for message {pk}")
                return Response(
                    {"error": "El contenido es obligatorio"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear la respuesta
            respuesta = Mensaje.objects.create(
                autor=user,
                foro=mensaje_original.foro,
                contenido=request.data['contenido'],
                es_respuesta=True,
                mensaje_original=mensaje_original
            )
            
            # Actualizar el estado del mensaje original si estaba ABIERTO
            if mensaje_original.estado_mensaje == 'ABIERTO':
                mensaje_original.estado_mensaje = 'RESPONDIDO'
                mensaje_original.save()
                logger.info(f"Message {pk} status updated to RESPONDIDO")
            
            # Crear notificación para el autor del mensaje original
            if mensaje_original.autor != user:
                NotificacionMensaje.objects.create(
                    usuario=mensaje_original.autor,
                    mensaje=respuesta,
                    tipo='RESPUESTA'  # Asegurar que se envía el tipo correcto
                )
                logger.info(f"Notification created for user {mensaje_original.autor.username}")
            
            logger.info(f"Reply to message {pk} created successfully with ID {respuesta.id}")
            return Response(MensajeSerializer(respuesta).data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error in responder action: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error al responder el mensaje: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Corrigiendo también el método cerrar por consistencia
    @action(detail=True, methods=['post'])
    def cerrar(self, request, **kwargs):
        try:
            mensaje = self.get_object()
            
            # Actualizar estado del mensaje
            mensaje.estado_mensaje = 'CERRADO'  # Corregido estado → estado_mensaje
            mensaje.save()
            
            return Response(
                {"mensaje": "Mensaje cerrado correctamente"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error in cerrar action: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error al cerrar el mensaje: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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

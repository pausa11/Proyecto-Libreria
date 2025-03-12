from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Noticia, Suscripcion
from .serializers import NoticiaSerializer, SuscripcionSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter

# Create your views here.

class NoticiaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para ver y gestionar noticias.
    
    * Requiere autenticación JWT para operaciones de escritura.
    * Cualquier usuario puede ver las noticias publicadas.
    * Solo el staff puede crear, editar y eliminar noticias.
    """
    queryset = Noticia.objects.all()
    serializer_class = NoticiaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'autor']
    search_fields = ['titulo', 'contenido', 'tags']
    ordering_fields = ['fecha_publicacion', 'fecha_actualizacion']
    ordering = ['-fecha_publicacion']

    @extend_schema(
        description='Lista todas las noticias. Los usuarios normales solo ven noticias publicadas.',
        responses={200: NoticiaSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        description='Crea una nueva noticia. Solo disponible para staff.',
        request=NoticiaSerializer,
        responses={201: NoticiaSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def get_permissions(self):
        """
        Asignar permisos según la acción:
        - Lectura: cualquier usuario
        - Escritura: solo staff
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filtrar noticias:
        - Staff: todas las noticias
        - Usuarios normales: solo noticias publicadas
        """
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(estado='publicado')
        return queryset

class SuscripcionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar suscripciones a noticias.
    
    * Requiere autenticación JWT.
    * Cada usuario solo puede ver y gestionar su propia suscripción.
    * Incluye endpoint especial para ver noticias según las categorías suscritas.
    """
    serializer_class = SuscripcionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Cada usuario solo puede ver y gestionar su propia suscripción"""
        return Suscripcion.objects.filter(usuario=self.request.user)

    @extend_schema(
        description='Obtiene las noticias según las categorías suscritas por el usuario.',
        responses={200: NoticiaSerializer(many=True)}
    )
    @action(detail=False, methods=['GET'])
    def mis_noticias(self, request):
        """
        Endpoint para obtener noticias según las categorías suscritas
        """
        try:
            suscripcion = self.get_queryset().first()
            if not suscripcion or not suscripcion.activo:
                return Response({
                    "detail": "No tienes una suscripción activa"
                }, status=400)

            categorias = suscripcion.categorias_interes.all()
            noticias = Noticia.objects.filter(
                Q(estado='publicado') &
                (Q(libro_relacionado__categoria__in=categorias) | 
                 Q(libro_relacionado__isnull=True))
            ).distinct()

            page = self.paginate_queryset(noticias)
            if page is not None:
                serializer = NoticiaSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = NoticiaSerializer(noticias, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                "detail": "Error al obtener las noticias",
                "error": str(e)
            }, status=500)

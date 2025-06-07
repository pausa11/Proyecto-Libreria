from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Libro, Categoria
from .serializers import LibroSerializer, CategoriaSerializer

@extend_schema_view(
    list=extend_schema(description="Obtener lista de libros"),
    create=extend_schema(description="Crear un nuevo libro"),
    retrieve=extend_schema(description="Obtener detalles de un libro"),
    update=extend_schema(description="Actualizar un libro completamente"),
    partial_update=extend_schema(description="Actualizar parcialmente un libro"),
    destroy=extend_schema(description="Eliminar un libro"),
)
class LibroViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar libros.
    """
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    permission_classes = [permissions.AllowAny]  # Permitir acceso público a la lista de libros
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'editorial', 'año_publicacion']
    search_fields = ['titulo', 'autor', 'isbn', 'descripcion', 'editorial']
    ordering_fields = ['titulo', 'autor', 'precio', 'año_publicacion', 'fecha_creacion']
    ordering = ['-fecha_creacion']

    def create(self, request, *args, **kwargs):
        """Crear un nuevo libro con soporte para subida de portada"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Guardar el libro
        libro = serializer.save()
        
        # Si hay una portada, renombrarla según el título
        if libro.portada and libro.titulo:
            try:
                nuevo_nombre = libro.normalize_title_for_filename()
                if libro.portada.public_id != nuevo_nombre:
                    import cloudinary.uploader as uploader
                    uploader.rename(libro.portada.public_id, nuevo_nombre)
                    libro.portada.public_id = nuevo_nombre
                    libro.save(update_fields=['portada'])
            except Exception as e:
                print(f"Error al renombrar imagen: {e}")
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """Actualizar libro con soporte para subida de portada"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Guardar los cambios
        libro = serializer.save()
        
        # Si se actualizó la portada o el título, renombrar la imagen
        if libro.portada and libro.titulo:
            try:
                nuevo_nombre = libro.normalize_title_for_filename()
                if libro.portada.public_id != nuevo_nombre:
                    import cloudinary.uploader as uploader
                    uploader.rename(libro.portada.public_id, nuevo_nombre)
                    libro.portada.public_id = nuevo_nombre
                    libro.save(update_fields=['portada'])
            except Exception as e:
                print(f"Error al renombrar imagen: {e}")
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """Actualización parcial con soporte para subida de portada"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def categorias(self, request):
        """Retorna todas las categorías disponibles"""
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data)

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para consultar categorías disponibles.
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]

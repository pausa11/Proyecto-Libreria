from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from .models import Libro, Categoria
from .serializers import LibroSerializer, CategoriaSerializer

# Create your views here.

class LibroViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar libros.
    """
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    permission_classes = [AllowAny]  # Permitir acceso público a la lista de libros
    filterset_fields = ['autor', 'titulo', 'categoria', 'editorial', 'año_publicacion']
    search_fields = ['autor', 'titulo', 'isbn', 'descripcion', 'editorial']
    ordering_fields = ['precio', 'fecha_creacion', 'titulo', 'autor', 'año_publicacion']
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    # Si necesitas lógica personalizada para la subida de imágenes:
    def create(self, request, *args, **kwargs):
        # Verificar tamaño de imagen si deseas (opcional)
        if 'portada' in request.FILES and request.FILES['portada'].size > 2 * 1024 * 1024:  # 2MB
            return Response(
                {"error": "La imagen no debe exceder 2MB"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return super().create(request, *args, **kwargs)
    
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
    permission_classes = [AllowAny]

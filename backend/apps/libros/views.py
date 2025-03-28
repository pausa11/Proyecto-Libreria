from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Libro
from .serializers import LibroSerializer

# Create your views here.

class LibroViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar libros.
    """
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['autor', 'titulo']
    search_fields = ['autor', 'titulo', 'isbn']
    ordering_fields = ['precio', 'fecha_creacion']
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

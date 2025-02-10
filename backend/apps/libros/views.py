from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
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

'''from django.shortcuts import render
from rest_framework import viewsets
from .models import Carrito
from .serializers import CarritoSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Create your views here.

class CarritoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar carritos.
    """
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['fecha']
    search_fields = ['fecha']
    ordering_fields = ['fecha']'''
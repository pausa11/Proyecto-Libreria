from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from .models import Carrito
from .serializers import CarritoSerializer

@extend_schema_view(
    list=extend_schema(description="Obtiene la lista de todos los carritos"),
    retrieve=extend_schema(description="Obtiene un carrito específico por su ID"),
    create=extend_schema(description="Crea un nuevo carrito"),
    update=extend_schema(description="Actualiza un carrito existente"),
    destroy=extend_schema(description="Elimina un carrito existente"),
)
class CarritoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para ver y editar carritos.
    
    Este ViewSet permite gestionar los carritos de compra con operaciones CRUD completas.
    Se pueden agregar y quitar libros del carrito, así como calcular el total.
    """
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @extend_schema(
        description="Vacía un carrito eliminando todos sus libros",
        responses={200: CarritoSerializer}
    )
    @action(detail=True, methods=['post'])
    def vaciar(self, request, pk=None):
        carrito = self.get_object()
        carrito.limpiar_carrito()
        return Response(self.get_serializer(carrito).data)
    
    @extend_schema(
        description="Agrega un libro al carrito",
        parameters=[
            OpenApiParameter(name='libro_id', description='ID del libro a agregar', required=True, type=int)
        ],
        responses={200: CarritoSerializer, 400: None}
    )
    @action(detail=True, methods=['post'])
    def agregar_libro(self, request, pk=None):
        carrito = self.get_object()
        libro_id = request.data.get('libro_id')
        
        if not libro_id:
            return Response({"error": "Se requiere el ID del libro"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from apps.libros.models import Libro
            libro = Libro.objects.get(id=libro_id)
            carrito.agregar_libro(libro)
            return Response(self.get_serializer(carrito).data)
        except Libro.DoesNotExist:
            return Response({"error": "Libro no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        description="Quita un libro del carrito",
        parameters=[
            OpenApiParameter(name='libro_id', description='ID del libro a quitar', required=True, type=int)
        ],
        responses={200: CarritoSerializer, 400: None}
    )
    @action(detail=True, methods=['post'])
    def quitar_libro(self, request, pk=None):
        carrito = self.get_object()
        libro_id = request.data.get('libro_id')
        
        if not libro_id:
            return Response({"error": "Se requiere el ID del libro"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from apps.libros.models import Libro
            libro = Libro.objects.get(id=libro_id)
            carrito.quitar_libro(libro)
            return Response(self.get_serializer(carrito).data)
        except Libro.DoesNotExist:
            return Response({"error": "Libro no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
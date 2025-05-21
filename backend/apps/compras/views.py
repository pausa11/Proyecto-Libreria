from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from .models import Carrito
from .serializers import CarritoSerializer, AgregarLibroSerializer

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
        request = AgregarLibroSerializer,
        responses={200: "Libro agregado: (Nombre del libro)", 400: None}
    )
    @action(detail=False, methods=['post'])
    def agregar_libro(self, request, pk=None):
        carrito = Carrito.objects.get(usuario=request.user)
        serializer = AgregarLibroSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({"error": "Se requiere el ID del libro"}, status=status.HTTP_400_BAD_REQUEST)
        
        libro_id = serializer.validated_data.get('libro_id')

        try:
            from apps.libros.models import Libro
            libro = Libro.objects.get(id=libro_id)
            carrito.agregar_libro(libro)
            carrito.save()
            return Response({"Libro agregado": libro.titulo}, status=status.HTTP_200_OK)
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
        

    @extend_schema(description = "Obtiene el total del carrito", responses = {200: CarritoSerializer})
    @action(detail=False, methods=['get'])
    def total(self, request):
        carrito = self.get_object()
        total = carrito.total()
        return Response({"total": total})
    
    extend_schema(description="Obtiene el número total de libros en el carrito", responses={200: CarritoSerializer})
    @action(detail=False, methods=['get'])
    def total_libros(self, request):
        carrito = self.get_object()
        total = carrito.total_libros()
        return Response({"total": total})
    
    @extend_schema(description="Obtiene una lista de los libros en el carrito", responses={200: "Libros: []", 400: None})
    @action(detail=False, methods=['get'])
    def obtener_libros(self, request):
        carrito = self.get_object()
        libros = carrito.obtener_libros()
        if libros.count() == 0:
            return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"libros": libros})

    @extend_schema(description="Pagar", responses={200: "Carrito pagado con exito", 400: None})
    @action(detail=False, methods=['post'])
    def pagar(self, request):
        carrito = self.get_object()
        if carrito.total_libros() == 0:
            return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)
        else: 
            return Response(carrito.pagar())

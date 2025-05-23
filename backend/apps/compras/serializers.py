from rest_framework import serializers
from .models import Carrito, Pedidos, CarritoLibro, PedidoLibro
from apps.libros.models import Libro

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrito
        fields = '__all__'
        read_only_fields = ('fecha',)  # Debe ser una tupla con coma al final si solo hay un elemento

class AgregaroQuitarLibroSerializer(serializers.Serializer):
    libro_id = serializers.IntegerField(required=True)
    cantidad = serializers.IntegerField(required=False, default=1)
    

class PedidosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedidos
        fields = '__all__'
        read_only_fields = ('fecha',)  # Debe ser una tupla con coma al final si solo hay un elemento
        
    
class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__'

class PedidoLibroSerializer(serializers.ModelSerializer):
    libro = LibroSerializer(read_only=True)  # Muestra el objeto libro completo

    class Meta:
        model = PedidoLibro
        fields = ['libro', 'cantidad']

class PedidosSerializer(serializers.ModelSerializer):
    pedidolibro_set = PedidoLibroSerializer(many=True, read_only=True)

    class Meta:
        model = Pedidos
        fields = ['id', 'fecha', 'usuario', 'estado', 'pedidolibro_set']
        read_only_fields = ('fecha',)

# Si quieres mostrar los libros y cantidades en el carrito:
class CarritoLibroSerializer(serializers.ModelSerializer):
    libro = LibroSerializer(read_only=True)

    class Meta:
        model = CarritoLibro
        fields = ['libro', 'cantidad']
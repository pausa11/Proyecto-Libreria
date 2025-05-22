from rest_framework import serializers
from .models import Carrito

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrito
        fields = '__all__'
        read_only_fields = ('fecha',)  # Debe ser una tupla con coma al final si solo hay un elemento

class AgregaroQuitarLibroSerializer(serializers.Serializer):
    libro_id = serializers.IntegerField(required=True)
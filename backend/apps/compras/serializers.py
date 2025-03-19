from rest_framework import serializers
from .models import Carrito

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrito
        fields = '__all__'
        read_only_fields = ('fecha')
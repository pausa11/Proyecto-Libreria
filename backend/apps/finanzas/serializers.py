from rest_framework import serializers
from .models import Tarjeta, Saldo

class TarjetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarjeta
        fields = '__all__'
        
class SaldoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saldo
        fields = '__all__'
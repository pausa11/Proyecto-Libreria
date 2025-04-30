from rest_framework import serializers
from apps.usuarios.models import Usuario
from .models import Tarjeta, Saldo

class TarjetaSerializer(serializers.ModelSerializer):
    usuario_id = serializers.PrimaryKeyRelatedField(
        source='usuario',
        queryset=Usuario.objects.all()
    )

    class Meta:
        model = Tarjeta
        fields = '__all__'
    

        
class SaldoSerializer(serializers.ModelSerializer):
    usuario_id = serializers.PrimaryKeyRelatedField(
        source='usuario',
        queryset=Usuario.objects.all()
    )
    class Meta:
        model = Saldo
        fields = '__all__'

    
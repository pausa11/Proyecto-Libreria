from rest_framework import serializers
from apps.usuarios.models import Usuario
from .models import Tarjeta, Saldo

class TarjetaSerializer(serializers.ModelSerializer):
    # Eliminamos el campo usuario_id para evitar conflictos
    # y nos basamos únicamente en el campo usuario para la relación
    
    class Meta:
        model = Tarjeta
        fields = ['id', 'numero', 'fecha_expiracion', 'cvv', 'titular', 'usuario']
        # Hacemos que usuario sea opcional al crear, para asignarlo automáticamente
        extra_kwargs = {
            'usuario': {'required': False, 'allow_null': True}
        }
        
    def create(self, validated_data):
        # Si estamos creando un nuevo objeto y hay un usuario en el contexto de la solicitud,
        # lo usamos automáticamente
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            # Solo establecer usuario si no se proporciona explícitamente
            if 'usuario' not in validated_data:
                validated_data['usuario'] = request.user
        return super().create(validated_data)
        
class SaldoSerializer(serializers.ModelSerializer):
    # También simplificamos este serializer
    
    class Meta:
        model = Saldo
        fields = ['id', 'saldo', 'usuario']
        extra_kwargs = {
            'usuario': {'required': False, 'allow_null': True}
        }
        
    def create(self, validated_data):
        # Mismo comportamiento que el TarjetaSerializer
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            if 'usuario' not in validated_data:
                validated_data['usuario'] = request.user
        return super().create(validated_data)
        
class CambiarSaldoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saldo
        fields = ['saldo']
        extra_kwargs = {
            'saldo': {'required': True, 'allow_null': False}
        }



from rest_framework import serializers
from .models import Libro

class LibroSerializer(serializers.ModelSerializer):
    # Agregar campo para obtener la URL completa
    portada_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Libro
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')
        extra_kwargs = {
            'portada': {'write_only': True}
        }
    
    def get_portada_url(self, obj):
        """Devuelve la URL completa de la portada"""
        if obj.portada:
            return obj.portada.url
        return None

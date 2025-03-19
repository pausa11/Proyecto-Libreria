from rest_framework import serializers
from .models import Noticia, Suscripcion
from apps.libros.serializers import LibroSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class NoticiaSerializer(serializers.ModelSerializer):
    autor = AutorSerializer(read_only=True)
    libro_relacionado = LibroSerializer(read_only=True)
    tags_list = serializers.ListField(source='get_tags_list', read_only=True)

    class Meta:
        model = Noticia
        fields = [
            'id', 'titulo', 'contenido', 'fecha_publicacion',
            'fecha_actualizacion', 'autor', 'libro_relacionado',
            'imagen', 'estado_noticia', 'tags', 'tags_list'
        ]
        read_only_fields = ['fecha_publicacion', 'fecha_actualizacion', 'autor']

    def create(self, validated_data):
        # Asignar el usuario actual como autor
        validated_data['autor'] = self.context['request'].user
        return super().create(validated_data)

class SuscripcionSerializer(serializers.ModelSerializer):
    usuario = AutorSerializer(read_only=True)
    
    class Meta:
        model = Suscripcion
        fields = ['id', 'usuario', 'categorias_interes', 'activo', 'fecha_suscripcion']
        read_only_fields = ['fecha_suscripcion', 'usuario']

    def create(self, validated_data):
        # Asignar el usuario actual como suscriptor
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data) 
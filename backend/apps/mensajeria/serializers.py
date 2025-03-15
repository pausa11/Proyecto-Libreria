from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import ForoPersonal, Mensaje, NotificacionMensaje

class ForoPersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForoPersonal
        fields = ['id', 'usuario', 'fecha_creacion', 'esta_activo']
        read_only_fields = ['fecha_creacion']

class MensajeSerializer(serializers.ModelSerializer):
    autor_username = serializers.CharField(source='autor.username', read_only=True)
    respuestas_count = serializers.IntegerField(source='respuestas.count', read_only=True)

    class Meta:
        model = Mensaje
        fields = [
            'id', 'foro', 'autor', 'autor_username', 'contenido',
            'fecha_creacion', 'estado_mensaje', 'es_respuesta',
            'mensaje_original', 'respuestas_count'
        ]
        read_only_fields = ['fecha_creacion', 'autor', 'estado_mensaje']

    def validate(self, data):
        # Validar que un mensaje de respuesta tenga mensaje_original
        if data.get('es_respuesta') and not data.get('mensaje_original'):
            raise serializers.ValidationError(
                _('Una respuesta debe tener un mensaje original asociado')
            )
        return data

    def create(self, validated_data):
        # Asignar el autor automáticamente
        validated_data['autor'] = self.context['request'].user
        return super().create(validated_data)

class NotificacionMensajeSerializer(serializers.ModelSerializer):
    mensaje_contenido = serializers.CharField(source='mensaje.contenido', read_only=True)

    class Meta:
        model = NotificacionMensaje
        fields = [
            'id', 'usuario', 'mensaje', 'mensaje_contenido',
            'leido', 'fecha_creacion'
        ]
        read_only_fields = ['fecha_creacion']

class MensajeDetalladoSerializer(MensajeSerializer):
    respuestas = MensajeSerializer(many=True, read_only=True)

    class Meta(MensajeSerializer.Meta):
        fields = MensajeSerializer.Meta.fields + ['respuestas'] 
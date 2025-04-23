from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UsuarioPreferencias

Usuario = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'tipo_usuario', 'numero_identificacion', 'telefono',
            'direccion', 'fecha_nacimiento', 'fecha_registro',
            'ultima_actualizacion', 'activo'
        )
        read_only_fields = ('id', 'fecha_registro', 'ultima_actualizacion')

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar los datos del perfil de usuario.
    No permite actualizar campos sensibles como tipo_usuario o número de identificación.
    """
    class Meta:
        model = Usuario
        fields = (
            'first_name', 'last_name', 'telefono',
            'direccion', 'fecha_nacimiento'
        )
        
    def validate(self, attrs):
        # Aquí se pueden agregar validaciones específicas si es necesario
        return attrs
        
    def update(self, instance, validated_data):
        # Actualización de los campos permitidos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class UsuarioRegistroSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    numero_identificacion = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = (
            'username', 'password', 'password2', 'email', 'first_name',
            'last_name', 'tipo_usuario', 'numero_identificacion',
            'telefono', 'direccion', 'fecha_nacimiento'
        )

    def validate(self, attrs):
        if Usuario.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Ya existe un usuario con este nombre de usuario"})
        
        if Usuario.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Ya existe un usuario con este correo electrónico"})
        
        if Usuario.objects.filter(numero_identificacion=attrs['numero_identificacion']).exists():
            raise serializers.ValidationError({"numero_identificacion": "Ya existe un usuario con este número de identificación"})
        
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = Usuario.objects.create_user(**validated_data)
        return user

class CambioContraseñaSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Las contraseñas no coinciden"})
        return attrs

class RecuperarContraseñaSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            Usuario.objects.get(email=value)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("No existe un usuario con este correo electrónico")
        return value

class PreferenciasUsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para gestionar las preferencias de suscripción del usuario.
    """
    class Meta:
        model = UsuarioPreferencias
        fields = (
            'recibir_actualizaciones',
            'recibir_noticias',
            'recibir_descuentos',
            'recibir_mensajes_foro',
            'fecha_actualizacion'
        )
        read_only_fields = ('fecha_actualizacion',)
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

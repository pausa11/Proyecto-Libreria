from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UsuarioPreferencias, TokenRecuperacionPassword

Usuario = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'tipo_usuario', 'numero_identificacion', 'telefono',
            'direccion', 'fecha_nacimiento', 'fecha_registro',
            'ultima_actualizacion', 'activo', 'foto_perfil', 
            'nacionalidad', 'departamento',
            # ESTOS CAMPOS SON CRÍTICOS - DEBEN ESTAR PRESENTES
            'is_staff', 'is_superuser', 'is_active'
        )
        read_only_fields = ('id', 'fecha_registro', 'ultima_actualizacion')
    
    def to_representation(self, instance):
        """Sobrescribimos para asegurar que todos los campos estén presentes y correctos"""
        print(f"🔥 SERIALIZER DEBUG - Usuario: {instance.username}")
        print(f"🔥 Instance type: {type(instance)}")
        print(f"🔥 Has is_staff attr: {hasattr(instance, 'is_staff')}")
        print(f"🔥 Has is_superuser attr: {hasattr(instance, 'is_superuser')}")
        
        # Llamar al método padre primero
        data = super().to_representation(instance)
        print(f"🔥 Data after super(): {data}")
        
        # Verificar valores directos de la instancia del modelo
        instance_is_staff = getattr(instance, 'is_staff', None)
        instance_is_superuser = getattr(instance, 'is_superuser', None)
        instance_tipo_usuario = getattr(instance, 'tipo_usuario', None)
        instance_activo = getattr(instance, 'activo', None)
        
        print(f"🔥 Raw instance values:")
        print(f"  - is_staff: {instance_is_staff} (type: {type(instance_is_staff)})")
        print(f"  - is_superuser: {instance_is_superuser} (type: {type(instance_is_superuser)})")
        print(f"  - tipo_usuario: {instance_tipo_usuario}")
        print(f"  - activo: {instance_activo}")
        
        # FORZAR estos valores en el resultado
        data['is_staff'] = bool(instance_is_staff) if instance_is_staff is not None else False
        data['is_superuser'] = bool(instance_is_superuser) if instance_is_superuser is not None else False
        data['is_active'] = bool(instance_activo if instance_activo is not None else getattr(instance, 'is_active', True))
        data['activo'] = bool(instance_activo if instance_activo is not None else getattr(instance, 'is_active', True))
        
        print(f"🔥 Final serialized data:")
        print(f"  - is_staff: {data['is_staff']}")
        print(f"  - is_superuser: {data['is_superuser']}")
        print(f"  - is_active: {data['is_active']}")
        print(f"  - tipo_usuario: {data.get('tipo_usuario')}")
        print(f"🔥 END SERIALIZER DEBUG\n")
        
        return data

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar los datos del perfil de usuario.
    No permite actualizar campos sensibles como tipo_usuario o número de identificación.
    """
    class Meta:
        model = Usuario
        fields = (
            'username', 'first_name', 'last_name', 'telefono',
            'direccion', 'fecha_nacimiento', 'foto_perfil',
            'nacionalidad', 'departamento'
        )
    
    def get_foto_perfil_url(self, usuario):
        """Devuelve la foto de perfil del usuario"""
        if usuario.foto_perfil:
            return usuario.foto_perfil.url
        return None    
    
    def validate(self, attrs):
        # Validar que el username sea único si se intenta cambiar
        if 'username' in attrs:
            # No estamos validando el username del usuario actual
            username = attrs['username']
            usuario = self.instance
            
            # Verificar si existe otro usuario con el mismo nombre
            if Usuario.objects.exclude(pk=usuario.pk).filter(username=username).exists():
                raise serializers.ValidationError({"username": "Ya existe un usuario con este nombre de usuario"})
        
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
    nacionalidad = serializers.CharField(required=True)
    numero_identificacion = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = (
            'username', 'password', 'password2', 'email', 'first_name',
            'last_name', 'tipo_usuario', 'numero_identificacion',
            'telefono', 'direccion', 'fecha_nacimiento', 'nacionalidad', 'departamento'
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
    
        if attrs['nacionalidad'] == '':
            raise serializers.ValidationError({"nacionalidad": "La nacionalidad no puede estar vacía"})
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

class ValidarTokenSerializer(serializers.Serializer):
    """
    Serializer para validar un token de recuperación de contraseña.
    """
    token = serializers.UUIDField(required=True)
    
    def validate_token(self, value):
        try:
            token = TokenRecuperacionPassword.objects.get(token=value, usado=False)
            if not token.esta_activo:
                raise serializers.ValidationError("El token ha expirado")
        except TokenRecuperacionPassword.DoesNotExist:
            raise serializers.ValidationError("Token inválido o ya utilizado")
        return value

class RestablecerContraseñaSerializer(serializers.Serializer):
    """
    Serializer para restablecer la contraseña utilizando un token.
    """
    token = serializers.UUIDField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)
    
    def validate_token(self, value):
        try:
            token = TokenRecuperacionPassword.objects.get(token=value, usado=False)
            if not token.esta_activo:
                raise serializers.ValidationError("El token ha expirado")
        except TokenRecuperacionPassword.DoesNotExist:
            raise serializers.ValidationError("Token inválido o ya utilizado")
        return value
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Las contraseñas no coinciden"})
        return attrs

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
    
class PreferenciasUsuarioPorCategoriauAutorSerializer(serializers.ModelSerializer):
    """
    Serializer para listar las preferencias de libros por categoría o autor.
    """
    preferencias = serializers.CharField(max_length=100, allow_blank=False)
    
    class Meta:
        model = UsuarioPreferencias
        fields = ['preferencias']
        read_only_fields = ['preferencias']

class ListaPreferenciasSerializer(serializers.ModelSerializer):
    """
    Serializer para obtener o reemplazar toda la lista de preferencias del usuario.
    """
    preferencias = serializers.ListField(
        child=serializers.CharField(max_length=100),
        allow_empty=True
    )

    class Meta:
        model = UsuarioPreferencias
        fields = ['preferencias']





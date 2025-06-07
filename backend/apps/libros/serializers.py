from rest_framework import serializers
from .models import Libro, Categoria
from drf_spectacular.utils import extend_schema_field
from rest_framework.fields import URLField

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class LibroSerializer(serializers.ModelSerializer):
    portada_url = serializers.SerializerMethodField()
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Libro
        fields = ['id', 'titulo', 'autor', 'isbn', 'categoria', 'categoria_nombre', 'editorial', 
                  'precio', 'stock', 'año_publicacion', 'descripcion', 'portada', 'portada_url',
                  'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion', 'portada_url')

    @extend_schema_field(URLField)
    def get_portada_url(self, obj):
        """Obtiene la URL de la portada desde Cloudinary"""
        if obj.portada:
            try:
                # CloudinaryField tiene una URL directa
                if hasattr(obj.portada, 'url'):
                    return obj.portada.url
                # Si no, construir usando cloudinary_url
                elif obj.portada:
                    from cloudinary.utils import cloudinary_url
                    url, _ = cloudinary_url(obj.portada.public_id if hasattr(obj.portada, 'public_id') else str(obj.portada))
                    return url
            except Exception as e:
                print(f"Error obteniendo URL de portada para libro {obj.id}: {e}")
        return None
    
    def create(self, validated_data):
        """Crear un nuevo libro con manejo de portada"""
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Actualizar libro con manejo de portada"""
        return super().update(instance, validated_data)

    def validate_isbn(self, value):
        """Validar que el ISBN sea único"""
        if self.instance and self.instance.isbn == value:
            return value
        
        if Libro.objects.filter(isbn=value).exists():
            raise serializers.ValidationError("Ya existe un libro con este ISBN.")
        return value

    def validate_año_publicacion(self, value):
        """Validar que el año de publicación sea válido"""
        import datetime
        current_year = datetime.datetime.now().year
        
        if value < 1000 or value > current_year + 1:
            raise serializers.ValidationError(
                f"El año de publicación debe estar entre 1000 y {current_year + 1}."
            )
        return value

    def validate_precio(self, value):
        """Validar que el precio sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        return value

    def validate_stock(self, value):
        """Validar que el stock no sea negativo"""
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo.")
        return value

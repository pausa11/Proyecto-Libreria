import os
import sys
import django
import cloudinary
import cloudinary.api
import re

# Configurar entorno Django
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Importar la configuración de Django y modelos
from django.conf import settings
from apps.libros.models import Libro

# Configurar explícitamente Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
    api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
)

def normalize_filename(title):
    """Convierte un título en un nombre de archivo normalizado"""
    title = title.replace(":", "")
    return title.replace(" ", "_")

# Obtener todos los libros de la base de datos
libros = Libro.objects.all()

print(f"Actualizando referencias de imágenes para {libros.count()} libros:")
for libro in libros:
    # Generar nombre de archivo a partir del título
    filename = normalize_filename(libro.titulo)
    
    # Verificar si la imagen existe en Cloudinary
    try:
        result = cloudinary.api.resource(filename)
        
        # Actualizar el campo portada del libro usando el public_id
        libro.portada = filename  # Para CloudinaryField, asignar directamente el public_id
        libro.save()
        
        print(f"✅ Actualizado libro: '{libro.titulo}'")
        print(f"   Con imagen: {filename}")
        print(f"   URL: {result['secure_url']}")
    except Exception as e:
        print(f"❌ Error al actualizar '{libro.titulo}'")
        print(f"   Imagen buscada: {filename}")
        print(f"   Error: {str(e)}")

print("Proceso completado.")
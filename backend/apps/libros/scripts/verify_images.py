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

# Importar la configuración de Django y el modelo Libro
from django.conf import settings
from apps.libros.models import Libro

# Configurar explícitamente Cloudinary con los valores de settings.py
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

print(f"Verificando imágenes para {libros.count()} libros:")
for libro in libros:
    # Generar nombre de archivo a partir del título
    filename = normalize_filename(libro.titulo)
    
    try:
        # Intentar obtener información de la imagen en Cloudinary
        result = cloudinary.api.resource(filename)
        print(f"✅ Imagen encontrada para: '{libro.titulo}'")
        print(f"   URL: {result['secure_url']}")
    except Exception as e:
        print(f"❌ No se encontró imagen para: '{libro.titulo}'")
        print(f"   Nombre buscado: {filename}")
        print(f"   Error: {str(e)}")

print("Verificación completada.")
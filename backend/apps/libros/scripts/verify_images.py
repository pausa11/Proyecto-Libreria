import os
import sys
import django
import cloudinary
import cloudinary.api

# Configurar entorno Django
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Importar la configuración de Django
from django.conf import settings

# Configurar explícitamente Cloudinary con los valores de settings.py
cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
    api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
)

# Libros a verificar
books = [
    "Cien_años_de_soledad",
    "El_principito",
    "Breve_historia_del_tiempo",
    "Cálculo_Una_variable"
]

# Verificar si las imágenes existen en Cloudinary
print("Verificando imágenes en Cloudinary:")
for book in books:
    try:
        # Intentar obtener información de la imagen
        result = cloudinary.api.resource(book)
        print(f"✅ Imagen encontrada: {book}")
        print(f"   URL: {result['secure_url']}")
    except Exception as e:
        print(f"❌ No se encontró: {book}")
        print(f"   Error: {str(e)}")

print("Verificación completada.")
import os
import sys
import django
import cloudinary
import cloudinary.api

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

# Mapeo de títulos de libros a nombres de imágenes en Cloudinary
libro_imagenes = {
    "Cien años de soledad": "Cien_años_de_soledad.jpg",
    "El principito": "El_principito.jpg",
    "Breve historia del tiempo": "Breve_historia_del_tiempo.jpg",
    "Cálculo: Una variable": "Cálculo_Una_variable.jpg"
}

print("Actualizando referencias de imágenes en la base de datos:")
for titulo, imagen in libro_imagenes.items():
    # Buscar el libro por título (aproximado)
    libros = Libro.objects.filter(titulo__icontains=titulo)
    
    if libros.exists():
        for libro in libros:
            # Verificar si la imagen existe en Cloudinary
            try:
                result = cloudinary.api.resource(imagen.split('.')[0])  # Nombre sin extensión
                
                # Actualizar el campo portada del libro
                libro.portada = imagen
                libro.save()
                
                print(f"✅ Actualizado libro: '{libro.titulo}'")
                print(f"   Con imagen: {imagen}")
                print(f"   URL: {result['secure_url']}")
            except Exception as e:
                print(f"❌ Error al actualizar '{libro.titulo}'")
                print(f"   Imagen: {imagen}")
                print(f"   Error: {str(e)}")
    else:
        print(f"⚠️ No se encontró libro con título similar a: '{titulo}'")

print("Proceso completado.")
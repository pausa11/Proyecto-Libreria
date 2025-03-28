import os
import sys
import json
import django
import cloudinary
import cloudinary.api

# Configurar entorno Django
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Importar la configuración de Django
from django.conf import settings

# Configurar explícitamente Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
    api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
)

# Ruta al archivo fixture
FIXTURE_PATH = os.path.join(os.path.dirname(__file__), '../fixtures/libros_prueba.json')

def verify_mode():
    """Verifica que las imágenes en el fixture existan en Cloudinary"""
    with open(FIXTURE_PATH, 'r', encoding='utf-8') as file:
        fixtures = json.load(file)
    
    # Filtrar solo los libros
    libros = [f for f in fixtures if f['model'] == 'libros.libro']
    print(f"Verificando {len(libros)} libros en el fixture:")
    
    for libro in libros:
        titulo = libro['fields']['titulo']
        portada = libro['fields'].get('portada')
        
        if not portada:
            print(f"⚠️ El libro '{titulo}' no tiene portada definida")
            continue
        
        # Extraer nombre base sin extensión
        image_name = os.path.splitext(portada)[0]
        
        try:
            # Verificar si existe en Cloudinary
            result = cloudinary.api.resource(image_name)
            print(f"✅ Imagen encontrada para: '{titulo}'")
            print(f"   URL: {result['secure_url']}")
        except Exception as e:
            print(f"❌ No se encontró imagen para: '{titulo}'")
            print(f"   Nombre buscado: {image_name}")
            print(f"   Error: {str(e)}")
    
    print("Verificación completada.")

def normalize_mode():
    """Normaliza los nombres de las portadas en el fixture basándose en los títulos"""
    with open(FIXTURE_PATH, 'r', encoding='utf-8') as file:
        fixtures = json.load(file)
    
    # Filtrar solo los libros
    modified = False
    for fixture in fixtures:
        if fixture['model'] == 'libros.libro':
            titulo = fixture['fields']['titulo']
            normalized_name = titulo
            
            if fixture['fields'].get('portada') != normalized_name:
                print(f"Actualizando portada de '{titulo}'")
                print(f"  De: {fixture['fields'].get('portada', 'No definida')}")
                print(f"  A: {normalized_name}")
                fixture['fields']['portada'] = normalized_name
                modified = True
    
    if modified:
        # Guardar cambios
        with open(FIXTURE_PATH, 'w', encoding='utf-8') as file:
            json.dump(fixtures, file, indent=4, ensure_ascii=False)
        print("Fixture actualizado correctamente.")
    else:
        print("No se requirieron cambios en el fixture.")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Gestión de imágenes para libros')
    parser.add_argument('--mode', choices=['verify', 'normalize'], 
                      default='verify', help='Modo de operación')
    
    args = parser.parse_args()
    
    if args.mode == 'verify':
        verify_mode()
    elif args.mode == 'normalize':
        normalize_mode()
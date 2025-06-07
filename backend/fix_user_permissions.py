"""
Script para corregir los permisos de usuarios que tienen tipo_usuario
pero no tienen is_staff configurado correctamente.
"""

import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.usuarios.models import Usuario

def fix_user_permissions():
    print("🔧 Iniciando corrección de permisos de usuarios...")
    
    # Encontrar usuarios con tipo_usuario ADMIN o BIBLIOTECARIO pero sin is_staff
    users_to_fix = Usuario.objects.filter(
        tipo_usuario__in=['ADMIN', 'BIBLIOTECARIO'],
        is_staff=False
    )
    
    print(f"📋 Encontrados {users_to_fix.count()} usuarios para corregir:")
    
    for user in users_to_fix:
        print(f"  - {user.username} (tipo: {user.tipo_usuario}, is_staff: {user.is_staff})")
        
        # Aplicar la lógica de sincronización
        if user.tipo_usuario in ['ADMIN', 'BIBLIOTECARIO']:
            user.is_staff = True
            user.save()
            print(f"    ✅ Corregido - is_staff ahora es: {user.is_staff}")
    
    # Verificar superusers
    superusers = Usuario.objects.filter(is_superuser=True)
    print(f"\n👑 Verificando {superusers.count()} superusuarios:")
    
    for user in superusers:
        print(f"  - {user.username}: is_staff={user.is_staff}, tipo_usuario={user.tipo_usuario}")
        needs_update = False
        
        if not user.is_staff:
            user.is_staff = True
            needs_update = True
            
        if user.tipo_usuario not in ['ADMIN']:
            user.tipo_usuario = 'ADMIN'
            needs_update = True
            
        if needs_update:
            user.save()
            print(f"    ✅ Superuser corregido")
    
    print("\n🎉 Corrección completada!")

if __name__ == "__main__":
    fix_user_permissions()

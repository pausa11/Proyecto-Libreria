from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

Usuario = get_user_model()

class Command(BaseCommand):
    help = 'Sincroniza los campos is_staff e is_superuser con tipo_usuario para usuarios existentes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Solo muestra qué cambios se harían sin aplicarlos',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('🔍 MODO SIMULACIÓN - No se aplicarán cambios'))
        
        usuarios_actualizados = 0
        usuarios_procesados = 0
        
        with transaction.atomic():
            for usuario in Usuario.objects.all():
                usuarios_procesados += 1
                cambios = []
                
                # Determinar valores correctos basado en tipo_usuario y is_superuser actual
                nuevo_is_staff = False
                
                if usuario.is_superuser:
                    # Los superusers siempre deben ser staff
                    nuevo_is_staff = True
                    if usuario.tipo_usuario != 'ADMIN':
                        cambios.append(f"tipo_usuario: {usuario.tipo_usuario} -> ADMIN")
                        if not dry_run:
                            usuario.tipo_usuario = 'ADMIN'
                elif usuario.tipo_usuario in ['ADMIN', 'BIBLIOTECARIO']:
                    # Admins y bibliotecarios deben ser staff
                    nuevo_is_staff = True
                else:
                    # Lectores no son staff
                    nuevo_is_staff = False
                
                # Verificar si is_staff necesita cambio
                if usuario.is_staff != nuevo_is_staff:
                    cambios.append(f"is_staff: {usuario.is_staff} -> {nuevo_is_staff}")
                    if not dry_run:
                        usuario.is_staff = nuevo_is_staff
                
                # Sincronizar is_active con activo si existe
                if hasattr(usuario, 'activo'):
                    if usuario.is_active != usuario.activo:
                        cambios.append(f"is_active: {usuario.is_active} -> {usuario.activo}")
                        if not dry_run:
                            usuario.is_active = usuario.activo
                
                # Mostrar cambios y aplicar si no es dry_run
                if cambios:
                    usuarios_actualizados += 1
                    self.stdout.write(
                        f"👤 Usuario: {usuario.username} (ID: {usuario.id}, Tipo: {usuario.tipo_usuario})"
                    )
                    for cambio in cambios:
                        self.stdout.write(f"  📝 {cambio}")
                    
                    if not dry_run:
                        # Guardar sin disparar el método save() personalizado
                        Usuario.objects.filter(pk=usuario.pk).update(
                            is_staff=usuario.is_staff,
                            is_active=usuario.is_active,
                            tipo_usuario=usuario.tipo_usuario
                        )
                        self.stdout.write(f"  ✅ Aplicado")
                    else:
                        self.stdout.write(f"  ⏸️ Simulación")
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"\n🔍 Simulación completada: {usuarios_actualizados} de {usuarios_procesados} usuarios necesitan sincronización"
                )
            )
            self.stdout.write("▶️ Ejecuta sin --dry-run para aplicar los cambios")
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"\n✅ Sincronización completada: {usuarios_actualizados} de {usuarios_procesados} usuarios sincronizados"
                )
            )
            self.stdout.write("🔄 Reinicia el servidor Django para que los cambios surtan efecto")

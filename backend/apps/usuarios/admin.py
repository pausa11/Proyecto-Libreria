from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Usuario, UsuarioPreferencias, TokenRecuperacionPassword

# Register your models here.

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Agregar campos personalizados a la vista de lista
    list_display = ('username', 'email', 'first_name', 'last_name', 'tipo_usuario', 'is_staff', 'is_superuser', 'activo', 'fecha_registro')
    list_filter = ('tipo_usuario', 'is_staff', 'is_superuser', 'activo', 'fecha_registro')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'numero_identificacion')
    
    # Personalizar los fieldsets para mostrar todos los campos relevantes
    fieldsets = UserAdmin.fieldsets + (
        (_('Información Adicional'), {
            'fields': ('tipo_usuario', 'numero_identificacion', 'telefono', 'direccion', 
                      'fecha_nacimiento', 'nacionalidad', 'departamento', 'foto_perfil', 'activo')
        }),
    )
    
    # Campos para el formulario de creación
    add_fieldsets = UserAdmin.add_fieldsets + (
        (_('Información Adicional'), {
            'fields': ('tipo_usuario', 'numero_identificacion', 'telefono', 'nacionalidad', 'departamento')
        }),
    )
    
    readonly_fields = ('fecha_registro', 'ultima_actualizacion')
    
    # Agregar acciones personalizadas
    actions = ['sincronizar_roles_usuarios']
    
    def sincronizar_roles_usuarios(self, request, queryset):
        """Acción para sincronizar roles de usuarios seleccionados"""
        usuarios_actualizados = 0
        
        for usuario in queryset:
            cambios_realizados = False
            
            # Sincronizar is_staff basado en tipo_usuario
            if usuario.is_superuser and not usuario.is_staff:
                usuario.is_staff = True
                cambios_realizados = True
            elif usuario.tipo_usuario in ['ADMIN', 'BIBLIOTECARIO'] and not usuario.is_staff:
                usuario.is_staff = True
                cambios_realizados = True
            elif usuario.tipo_usuario == 'LECTOR' and usuario.is_staff and not usuario.is_superuser:
                usuario.is_staff = False
                cambios_realizados = True
            
            # Sincronizar is_active con activo
            if hasattr(usuario, 'activo') and usuario.is_active != usuario.activo:
                usuario.is_active = usuario.activo
                cambios_realizados = True
            
            if cambios_realizados:
                # Usar update para evitar disparar save()
                Usuario.objects.filter(pk=usuario.pk).update(
                    is_staff=usuario.is_staff,
                    is_active=usuario.is_active
                )
                usuarios_actualizados += 1
        
        self.message_user(
            request,
            f"Se sincronizaron {usuarios_actualizados} usuarios correctamente."
        )
    
    sincronizar_roles_usuarios.short_description = "🔄 Sincronizar roles de usuarios seleccionados"

@admin.register(UsuarioPreferencias)
class UsuarioPreferenciasAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'recibir_actualizaciones', 'recibir_noticias', 'recibir_descuentos', 'fecha_actualizacion')
    list_filter = ('recibir_actualizaciones', 'recibir_noticias', 'recibir_descuentos', 'recibir_mensajes_foro')
    search_fields = ('usuario__username', 'usuario__email')

@admin.register(TokenRecuperacionPassword)
class TokenRecuperacionPasswordAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'token', 'fecha_creacion', 'fecha_expiracion', 'usado', 'esta_activo')
    list_filter = ('usado', 'fecha_creacion')
    search_fields = ('usuario__username', 'usuario__email')
    readonly_fields = ('token', 'fecha_creacion', 'esta_activo')

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Usuario, UsuarioPreferencias

# Register your models here.

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'tipo_usuario', 'is_active')
    list_filter = ('tipo_usuario', 'is_active', 'is_staff', 'fecha_registro')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'numero_identificacion')
    ordering = ('-fecha_registro',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Información Personal'), {
            'fields': (
                'first_name', 'last_name', 'email', 'tipo_usuario',
                'numero_identificacion', 'telefono', 'direccion',
                'fecha_nacimiento'
            )
        }),
        (_('Permisos'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Fechas importantes'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'tipo_usuario', 'numero_identificacion'),
        }),
    )


@admin.register(UsuarioPreferencias)
class UsuarioPreferenciasAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'recibir_actualizaciones', 'recibir_noticias', 'recibir_descuentos', 'recibir_mensajes_foro')
    list_filter = ('recibir_actualizaciones', 'recibir_noticias', 'recibir_descuentos', 'recibir_mensajes_foro')
    search_fields = ('usuario__username', 'usuario__email')
    raw_id_fields = ('usuario',)
    fieldsets = (
        (_('Usuario'), {'fields': ('usuario',)}),
        (_('Preferencias de comunicación'), {
            'fields': (
                'recibir_actualizaciones', 'recibir_noticias',
                'recibir_descuentos', 'recibir_mensajes_foro'
            )
        }),
        (_('Metadatos'), {'fields': ('fecha_actualizacion',)}),
    )
    readonly_fields = ('fecha_actualizacion',)

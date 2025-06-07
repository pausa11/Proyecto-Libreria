from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Libro, Categoria

# Register your models here.

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'categoria', 'precio', 'stock', 'isbn', 'portada_preview')
    list_filter = ('categoria', 'año_publicacion')
    search_fields = ('titulo', 'autor', 'isbn')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion', 'portada_preview')
    fieldsets = (
        ('Información Básica', {
            'fields': ('titulo', 'autor', 'isbn', 'categoria')
        }),
        ('Detalles', {
            'fields': ('editorial', 'año_publicacion', 'descripcion', 'portada', 'portada_preview')
        }),
        ('Inventario', {
            'fields': ('precio', 'stock')
        }),
        ('Metadata', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )

    def portada_preview(self, obj):
        """Muestra una vista previa de la portada en el admin"""
        if obj.portada:
            try:
                return mark_safe(f'<img src="{obj.portada.url}" style="max-height: 100px; max-width: 70px;" />')
            except:
                return "Error al cargar imagen"
        return "Sin portada"
    
    portada_preview.short_description = "Vista previa"

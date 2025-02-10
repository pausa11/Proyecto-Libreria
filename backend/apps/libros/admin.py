from django.contrib import admin
from .models import Libro, Categoria

# Register your models here.

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'categoria', 'precio', 'stock', 'isbn')
    list_filter = ('categoria', 'año_publicacion')
    search_fields = ('titulo', 'autor', 'isbn')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    fieldsets = (
        ('Información Básica', {
            'fields': ('titulo', 'autor', 'isbn', 'categoria')
        }),
        ('Detalles', {
            'fields': ('editorial', 'año_publicacion', 'descripcion', 'portada')
        }),
        ('Inventario', {
            'fields': ('precio', 'stock')
        }),
        ('Metadata', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )

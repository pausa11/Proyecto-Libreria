from django.contrib import admin
from .models import Noticia, Suscripcion

@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'fecha_publicacion', 'estado', 'libro_relacionado')
    list_filter = ('estado', 'fecha_publicacion', 'autor')
    search_fields = ('titulo', 'contenido', 'tags')
    readonly_fields = ('fecha_publicacion', 'fecha_actualizacion')
    list_per_page = 20
    date_hierarchy = 'fecha_publicacion'
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si es una nueva noticia
            obj.autor = request.user
        super().save_model(request, obj, form, change)

@admin.register(Suscripcion)
class SuscripcionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'activo', 'fecha_suscripcion')
    list_filter = ('activo', 'fecha_suscripcion')
    search_fields = ('usuario__username', 'usuario__email')
    filter_horizontal = ('categorias_interes',)
    readonly_fields = ('fecha_suscripcion',)

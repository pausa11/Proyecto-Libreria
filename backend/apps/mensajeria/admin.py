from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import ForoPersonal, Mensaje, NotificacionMensaje

@admin.register(ForoPersonal)
class ForoPersonalAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'fecha_creacion', 'esta_activo')
    list_filter = ('esta_activo', 'fecha_creacion')
    search_fields = ('usuario__username', 'usuario__email')
    date_hierarchy = 'fecha_creacion'

@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ('autor', 'foro', 'estado', 'es_respuesta', 'fecha_creacion')
    list_filter = ('estado', 'es_respuesta', 'fecha_creacion')
    search_fields = ('autor__username', 'contenido')
    date_hierarchy = 'fecha_creacion'
    raw_id_fields = ('autor', 'foro', 'mensaje_original')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(foro__usuario=request.user)

@admin.register(NotificacionMensaje)
class NotificacionMensajeAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'mensaje', 'leido', 'fecha_creacion')
    list_filter = ('leido', 'fecha_creacion')
    search_fields = ('usuario__username', 'mensaje__contenido')
    date_hierarchy = 'fecha_creacion'
    raw_id_fields = ('usuario', 'mensaje')

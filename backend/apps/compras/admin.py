from django.contrib import admin
from .models import Carrito
from apps.libros.models import Libro

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha', 'total_libros', 'nombre_libros', 'total')
    list_filter = ('fecha',)
    search_fields = ('libros__titulo',)
    actions = ['vaciar_carrito', 'agregar_libro']

    def total(self, obj):
        return obj.total()
    total.short_description = 'Total sin descuento'

    def vaciar_carrito(self, request, queryset):
        for carrito in queryset:
            carrito.limpiar_carrito()
        self.message_user(request, "Carritos vacíos con éxito.")
    vaciar_carrito.short_description = "Vaciar todos los carritos seleccionados"
        
    def agregar_libro(self, request, queryset):
        for carrito in queryset:
            carrito.agregar_libro(Libro.objects.first())
        self.message_user(request, "Libro agregado con éxito.")
        

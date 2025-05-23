from django.contrib import admin
from .models import Carrito
from apps.libros.models import Libro

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha', 'total_libros', 'total')
    list_filter = ('fecha',)
    actions = ['vaciar_carrito', 'agregar_libro']

    def total(self, obj):
        return f"${obj.total()}"
    total.short_description = 'Total sin descuento'

    def total_libros(self, obj):
        return obj.total_libros()

    def vaciar_carrito(self, request, queryset):
        for carrito in queryset:
            carrito.limpiar_carrito()
        self.message_user(request, "Carritos vacíos con éxito.")
    vaciar_carrito.short_description = "Vaciar todos los carritos seleccionados"
        
    def agregar_libro(self, request, queryset):
        for carrito in queryset:
            carrito.agregar_libro(Libro.objects.first())
        self.message_user(request, "Libro agregado con éxito.")
    
    def quitar_libro(self, request, queryset):
        for carrito in queryset:
            carrito.quitar_libro(Libro.objects.first())
        self.message_user(request, "Libro quitado con éxito.")
    
    def pagar(self, request, queryset):
        for carrito in queryset:
            carrito.pagar()
        self.message_user(request, "Pago procesado con éxito.")


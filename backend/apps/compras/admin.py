'''from django.contrib import admin
from .models import Carrito
# Register your models here.
@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('libro_en_carrito','fecha', 'total_libros', 'total')
    list_filter = ('fecha',)
    search_fields = ('fecha',)
    ordering = ('fecha',)'''
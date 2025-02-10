from django.contrib import admin
from .models import Libro

# Register your models here.

@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'isbn', 'precio', 'stock')
    list_filter = ('autor',)
    search_fields = ('titulo', 'autor', 'isbn')
    ordering = ('titulo',)

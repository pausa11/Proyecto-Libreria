from django.contrib import admin
from .models import Tarjeta, Saldo

# Register your models here.
@admin.register(Tarjeta)
class TarjetaAdmin(admin.ModelAdmin):
    list_display = ('numero', 'titular')
    search_fields = ('numero', 'titular')
    ordering = ('numero',)

@admin.register(Saldo)
class SaldoAdmin(admin.ModelAdmin):
    list_display = ('saldo',)
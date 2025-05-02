from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TarjetaViewSet, SaldoViewSet, HistorialSaldoViewSet

# Configuración del router para las vistas basadas en ViewSet
router = DefaultRouter()
router.register(r'tarjetas', TarjetaViewSet, basename='Tarjeta')
router.register(r'saldos', SaldoViewSet, basename='Saldo')
router.register(r'historial', HistorialSaldoViewSet, basename='HistorialSaldo')

urlpatterns = [
    path('', include(router.urls)),
]
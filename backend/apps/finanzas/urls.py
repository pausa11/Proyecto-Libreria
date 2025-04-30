from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TarjetaViewSet, SaldoViewSet

# Configuración del router para las vistas basadas en ViewSet
router = DefaultRouter()
router.register(r'tarjetas', TarjetaViewSet, basename='Tarjeta')
router.register(r'saldos', SaldoViewSet, basename='Saldo')

urlpatterns = [
    path('', include(router.urls)),
]
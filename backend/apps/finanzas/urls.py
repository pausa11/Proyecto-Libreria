from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TarjetaViewSet

# Configuración del router para las vistas basadas en ViewSet
router = DefaultRouter()
router.register(r'tarjetas', TarjetaViewSet, basename='Tarjeta')

urlpatterns = [
    path('', include(router.urls)),
]
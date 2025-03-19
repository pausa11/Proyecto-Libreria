from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarritoViewSet

# Configuración del router para las vistas basadas en ViewSet
router = DefaultRouter()
router.register(r'carritos', CarritoViewSet, basename='carrito')

urlpatterns = [
    path('', include(router.urls)),
]
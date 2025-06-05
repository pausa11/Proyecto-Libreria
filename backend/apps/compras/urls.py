from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarritoViewSet, ReservaViewSet, PedidoViewSet

# Configuración del router para las vistas basadas en ViewSet
router = DefaultRouter()
router.register(r'carritos', CarritoViewSet, basename='carrito')
router.register(r'reservas', ReservaViewSet, basename='reserva')
router.register(r'pedidos', PedidoViewSet, basename='pedidos') 

urlpatterns = [
    path('', include(router.urls)),
]
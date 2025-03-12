from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticiaViewSet, SuscripcionViewSet

router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet, basename='noticia')
router.register(r'suscripciones', SuscripcionViewSet, basename='suscripcion')

urlpatterns = [
    path('', include(router.urls)),
] 
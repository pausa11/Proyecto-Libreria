from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'foros', views.ForoPersonalViewSet, basename='foro')
router.register(r'mensajes', views.MensajeViewSet, basename='mensaje')
router.register(r'notificaciones', views.NotificacionMensajeViewSet, basename='notificacion')

app_name = 'mensajeria'

urlpatterns = [
    path('', include(router.urls)),
] 
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, 
    AutenticacionViewSet, 
    PerfilViewSet,
    PreferenciasViewSet
)

# Router principal para usuarios
router = DefaultRouter()
router.register('usuarios', UsuarioViewSet, basename='usuarios')

# Router para autenticación
auth_router = DefaultRouter()
auth_router.register('', AutenticacionViewSet, basename='autenticacion')

# Router para perfil
perfil_router = DefaultRouter()
perfil_router.register('', PerfilViewSet, basename='perfil')

# Router para preferencias
preferencias_router = DefaultRouter()
preferencias_router.register('', PreferenciasViewSet, basename='preferencias')

urlpatterns = [
    # Endpoints de usuarios básicos (CRUD)
    path('', include(router.urls)),
    
    # Endpoints de autenticación
    path('auth/', include(auth_router.urls)),
    
    # Endpoints de perfil
    path('perfil/', include(perfil_router.urls)),
    
    # Endpoints de preferencias
    path('preferencias/', include(preferencias_router.urls)),
]

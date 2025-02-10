"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Schema documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints
    path('api/libros/', include('apps.libros.urls')),
    # TODO: Implementar y descomentar las siguientes URLs cuando estén listas
    # path('api/compras/', include('apps.compras.urls')),
    # path('api/usuarios/', include('apps.usuarios.urls')),
    # path('api/noticias/', include('apps.noticias.urls')),
    # path('api/busqueda/', include('apps.busqueda.urls')),
    # path('api/finanzas/', include('apps.finanzas.urls')),
    # path('api/mensajeria/', include('apps.mensajeria.urls')),
    # path('api/recomendaciones/', include('apps.recomendaciones.urls')),
]

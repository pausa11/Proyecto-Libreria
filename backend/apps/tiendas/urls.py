from rest_framework.routers import DefaultRouter
from .views import TiendaViewSet

router = DefaultRouter()
router.register(r'tiendas', TiendaViewSet)

urlpatterns = router.urls
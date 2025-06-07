from rest_framework import viewsets, permissions
from .models import Tienda
from .serializers import TiendaSerializer

class TiendaViewSet(viewsets.ModelViewSet):
    queryset = Tienda.objects.all()
    serializer_class = TiendaSerializer
    permission_classes = [permissions.AllowAny]  # Permitir acceso público a todas las operaciones
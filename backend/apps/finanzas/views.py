from rest_framework import viewsets
from models import Tarjeta, Saldo
from serializers import TarjetaSerializer, SaldoSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Create your views here.

class TarjetaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar tarjetas.
    """
    queryset = Tarjeta.objects.all()
    serializer_class = TarjetaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['numero']
    search_fields = ['numero']
    ordering_fields = ['numero']

class SaldoViewSet(viewsets.ModelViewSet): 
    """
    API endpoint para gestionar saldos.
    """
    queryset = Saldo.objects.all()
    serializer_class = SaldoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['saldo']
    search_fields = ['saldo']
    ordering_fields = ['saldo']
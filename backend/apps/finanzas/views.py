from rest_framework import viewsets
from .models import Tarjeta, Saldo
from .serializers import TarjetaSerializer, SaldoSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response

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

    @extend_schema(
        description="Muestra la información de la tarjeta",
        responses={200: TarjetaSerializer, 404: None}
    )
    @action(detail=True, methods=['get'])
    def mostrar_informacion(self, request, pk=None):
        try:
            tarjeta = self.get_object()
            return Response({"informacion": tarjeta.mostrar_informacion()})
        except Tarjeta.DoesNotExist:
            return Response({"error": "Tarjeta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    @extend_schema(
        description="Actualiza la información de la tarjeta",
        responses={200: TarjetaSerializer, 400: None}
    )
    @action(detail=True, methods=['put'])
    def actualizar_informacion(self, request, pk=None):
        try:
            tarjeta = self.get_object()
            tarjeta.modificar_informacion(
                numero=request.data.get('numero'),
                fecha_expiracion=request.data.get('fecha_expiracion'),
                cvv=request.data.get('cvv'),
                titular=request.data.get('titular')
            )
            tarjeta.save()
            return Response(self.get_serializer(tarjeta).data, status=status.HTTP_200_OK)
        except:
            return Response({"error": "Error al actualizar la tarjeta"}, status=status.HTTP_400_BAD_REQUEST)
    

        

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
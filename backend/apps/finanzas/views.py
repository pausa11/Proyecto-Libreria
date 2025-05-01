from rest_framework import viewsets
from .models import Tarjeta, Saldo
from .serializers import CambiarSaldoSerializer, TarjetaSerializer, SaldoSerializer
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
        description="Muestra la información de la tarjeta del usuario registrado",
        responses={200: TarjetaSerializer, 404: None}
    )
    @action(detail=False, methods=['get'])
    def mostrar_informacion(self, request):
        try:
            tarjeta = Tarjeta.objects.get(usuario=request.user)
            return Response(TarjetaSerializer(tarjeta).data, status=status.HTTP_200_OK)
        except Tarjeta.DoesNotExist:
            return Response({"error": "Tarjeta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    @extend_schema(
        description="Actualiza la información de la tarjeta del usuario registrado",
        request=TarjetaSerializer,
        responses={200: TarjetaSerializer, 400: None}
    )
    @action(detail=False, methods=['put'])
    def actualizar_informacion(self, request):
        try:
            tarjeta = Tarjeta.objects.get(usuario=request.user)
            tarjeta.modificar_informacion(
                numero=request.data.get('numero'),
                fecha_expiracion=request.data.get('fecha_expiracion'),
                cvv=request.data.get('cvv'),
                titular=request.data.get('titular')
            )
            return Response(TarjetaSerializer(tarjeta).data, status=status.HTTP_200_OK)
        except Tarjeta.DoesNotExist:
            return Response({"error": "Tarjeta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        

class SaldoViewSet(viewsets.ModelViewSet): 
    """
    API endpoint para gestionar saldos.
    """
    
    permision_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = SaldoSerializer
    
    @extend_schema(
        description="Muestra el saldo del usuario registrado",
        responses={200: SaldoSerializer, 404: None}
    )
    @action(detail=False, methods=['get'])
    def mostrar_saldo(self, request):
        try:
            saldo = Saldo.objects.get(usuario=request.user)
            return Response({"saldo": saldo.mostrar_saldo()})
        except Saldo.DoesNotExist:
            return Response({"error": "Saldo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    @extend_schema(
        description="Recarga el saldo del usuario registrado",
        request=CambiarSaldoSerializer,
        responses={200: SaldoSerializer, 400: None}
    )
    @action(detail=False, methods=['post'])
    def cambiar_saldo(self, request):
        try:
            saldo = Saldo.objects.get(usuario=request.user)
            saldo.modificar_saldo(request.data.get('saldo'))
            saldo.save()
            return Response(self.get_serializer(saldo).data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
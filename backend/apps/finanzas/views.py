from rest_framework import viewsets, status
from .models import Tarjeta, Saldo
from .serializers import CambiarSaldoSerializer, TarjetaSerializer, SaldoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response

# Create your views here.

class TarjetaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar tarjetas.
    """
    serializer_class = TarjetaSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['numero']
    search_fields = ['numero']
    ordering_fields = ['numero']

    def get_queryset(self):
        """
        Limita las tarjetas a las del usuario autenticado
        """
        # Si es superuser, puede ver todas las tarjetas
        if self.request.user.is_superuser:
            return Tarjeta.objects.all()
        # Si es usuario normal, solo ve su tarjeta
        return Tarjeta.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Asigna el usuario actual a la tarjeta al crearla
        """
        # Verificamos si ya existe una tarjeta para este usuario
        if Tarjeta.objects.filter(usuario=self.request.user).exists():
            # En lugar de fallar, actualizamos la tarjeta existente
            old_tarjeta = Tarjeta.objects.get(usuario=self.request.user)
            old_tarjeta.delete()
            
        serializer.save(usuario=self.request.user)

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
    serializer_class = SaldoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Limita los saldos al del usuario autenticado
        """
        # Si es superuser, puede ver todos los saldos
        if self.request.user.is_superuser:
            return Saldo.objects.all()
        # Si es usuario normal, solo ve su saldo
        return Saldo.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Asigna el usuario actual al saldo al crearlo
        """
        # Verificamos si ya existe un saldo para este usuario
        if Saldo.objects.filter(usuario=self.request.user).exists():
            # En este caso, actualizamos el saldo existente en lugar de crear uno nuevo
            old_saldo = Saldo.objects.get(usuario=self.request.user)
            # Si se proporciona un nuevo valor, lo usamos, de lo contrario mantenemos el actual
            nuevo_valor = serializer.validated_data.get('saldo', old_saldo.saldo)
            old_saldo.saldo = nuevo_valor
            old_saldo.save()
            return
        
        serializer.save(usuario=self.request.user)
    
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
            # Si no existe, creamos uno con saldo cero
            saldo = Saldo.objects.create(usuario=request.user, saldo=0)
            return Response({"saldo": saldo.mostrar_saldo()})
    
    @extend_schema(
        description="Recarga el saldo del usuario registrado",
        request=CambiarSaldoSerializer,
        responses={200: SaldoSerializer, 400: None}
    )
    @action(detail=False, methods=['post'])
    def cambiar_saldo(self, request):
        try:
            # Intentamos obtener el saldo existente
            try:
                saldo = Saldo.objects.get(usuario=request.user)
            except Saldo.DoesNotExist:
                # Si no existe, creamos uno nuevo con saldo cero
                saldo = Saldo.objects.create(usuario=request.user, saldo=0)
            
            monto = request.data.get('saldo')
            
            if monto is None:
                return Response({"error": "Debe proporcionar un monto"}, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                monto = float(monto)  # Convertir a número
                saldo.saldo += monto  # Sumamos el monto al saldo actual
                saldo.save()
                return Response({"saldo": saldo.saldo}, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

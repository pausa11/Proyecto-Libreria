from rest_framework import viewsets, status
from .models import Tarjeta, Saldo, HistorialSaldo
from .serializers import (
    CambiarSaldoSerializer, TarjetaSerializer, SaldoSerializer, 
    RecargaSaldoSerializer, DescontarSaldoSerializer, HistorialSaldoSerializer
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.db.models import Q

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
        Asigna el usuario actual a la tarjeta al crearla.
        Si ya existe una tarjeta para el usuario, la actualiza en lugar de crear una nueva.
        """
        try:
            # Verificamos si ya existe una tarjeta para este usuario
            if Tarjeta.objects.filter(usuario=self.request.user).exists():
                # En lugar de fallar, actualizamos la tarjeta existente
                tarjeta_existente = Tarjeta.objects.get(usuario=self.request.user)
                
                # Actualizamos los campos con los nuevos valores
                for attr, value in serializer.validated_data.items():
                    setattr(tarjeta_existente, attr, value)
                
                tarjeta_existente.save()
                return tarjeta_existente
            else:
                # Si no existe, creamos una nueva
                serializer.save(usuario=self.request.user)
        except Exception as e:
            raise ValidationError(f"Error al gestionar la tarjeta: {str(e)}")

    def update(self, request, *args, **kwargs):
        """
        Sobreescribe el método update para manejar la actualización de tarjetas.
        Asegura que un usuario solo pueda actualizar su propia tarjeta.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Verificar que el usuario sea el propietario de la tarjeta
        if instance.usuario != self.request.user and not self.request.user.is_superuser:
            return Response(
                {"error": "No tienes permiso para actualizar esta tarjeta"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

    def perform_update(self, serializer):
        """
        Realiza la actualización de la tarjeta asegurando que el usuario sea correcto.
        """
        serializer.save()

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
        responses={200: TarjetaSerializer, 400: None, 404: None}
    )
    @action(detail=False, methods=['put', 'patch'])
    def actualizar_informacion(self, request):
        try:
            tarjeta = Tarjeta.objects.get(usuario=request.user)
            
            # Versión mejorada que usa el serializer para validación
            serializer = self.get_serializer(tarjeta, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Tarjeta.DoesNotExist:
            # Si no existe una tarjeta, intentamos crearla
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(usuario=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        description="Verifica si un número de tarjeta ya está registrado en el sistema",
        parameters=[
            OpenApiParameter(name='numero', description='Número de tarjeta a verificar', required=True, type=str)
        ],
        responses={
            200: {"type": "object", "properties": {
                "exists": {"type": "boolean", "description": "Indica si la tarjeta ya está registrada"},
                "is_own": {"type": "boolean", "description": "Indica si la tarjeta pertenece al usuario actual"}
            }}
        }
    )
    @action(detail=False, methods=['get'])
    def verificar_tarjeta(self, request):
        numero = request.query_params.get('numero')
        if not numero:
            return Response(
                {"error": "Debe proporcionar un número de tarjeta"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificamos si la tarjeta existe
        tarjeta_existe = Tarjeta.objects.filter(numero=numero).exists()
        
        # Verificamos si la tarjeta pertenece al usuario actual
        es_propia = False
        if tarjeta_existe:
            es_propia = Tarjeta.objects.filter(
                numero=numero, usuario=request.user
            ).exists()
        
        return Response({
            "existe": tarjeta_existe,
            "es_propia": es_propia
        })


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
        description="Recarga el saldo del usuario con un monto específico",
        request=RecargaSaldoSerializer,
        responses={200: {"properties": {"saldo": {"type": "number"}, "mensaje": {"type": "string"}}}, 400: None, 404: None}
    )
    @action(detail=False, methods=['post'])
    def recargar_saldo(self, request):
        try:
            # Primero verificamos si el usuario tiene una tarjeta registrada
            if not Tarjeta.objects.filter(usuario=request.user).exists():
                return Response({
                    "error": "Debe registrar una tarjeta antes de poder recargar saldo"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validamos los datos con el serializer
            serializer = RecargaSaldoSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            monto = serializer.validated_data['monto']
            
            # Intentamos obtener el saldo existente
            try:
                saldo = Saldo.objects.get(usuario=request.user)
            except Saldo.DoesNotExist:
                # Si no existe, creamos uno nuevo con saldo cero
                saldo = Saldo.objects.create(usuario=request.user, saldo=0)
                
            # Recargamos el saldo utilizando el método que valida y registra
            try:
                nuevo_saldo = saldo.recargar_saldo(monto)
                return Response({
                    "saldo": nuevo_saldo,
                    "mensaje": f"Se ha recargado ${monto} a su saldo correctamente"
                }, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @extend_schema(
        description="Descuenta saldo del usuario (para compras)",
        request=DescontarSaldoSerializer,
        responses={200: {"properties": {"saldo": {"type": "number"}, "mensaje": {"type": "string"}}}, 400: None}
    )
    @action(detail=False, methods=['post'])
    def descontar_saldo(self, request):
        try:
            # Validamos los datos con el serializer
            serializer = DescontarSaldoSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            monto = serializer.validated_data['monto']
            
            # Intentamos obtener el saldo existente
            try:
                saldo = Saldo.objects.get(usuario=request.user)
            except Saldo.DoesNotExist:
                return Response({
                    "error": "No tiene saldo disponible"
                }, status=status.HTTP_400_BAD_REQUEST)
                
            # Descontamos el saldo utilizando el método que valida
            try:
                nuevo_saldo = saldo.descontar_saldo(monto)
                return Response({
                    "saldo": nuevo_saldo,
                    "mensaje": f"Se ha descontado ${monto} de su saldo correctamente"
                }, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HistorialSaldoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para consultar el historial de transacciones de saldo.
    """
    serializer_class = HistorialSaldoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Limita el historial al del usuario autenticado
        """
        # Si es superuser, puede ver todas las transacciones
        if self.request.user.is_superuser:
            return HistorialSaldo.objects.all()
        # Si es usuario normal, solo ve sus transacciones
        return HistorialSaldo.objects.filter(usuario=self.request.user)

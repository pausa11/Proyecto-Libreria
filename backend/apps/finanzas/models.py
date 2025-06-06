from django.db import models
from apps.usuarios.models import Usuario
from django.core.exceptions import ValidationError
from decimal import Decimal

class Tarjeta(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    numero = models.CharField(max_length=16)
    fecha_expiracion = models.DateField()
    cvv = models.CharField(max_length=3)
    titular = models.CharField(max_length=100)
    
    def mostrar_informacion(self):
        return f'{self.numero} - {self.titular}'

    def __str__(self):
        return self.mostrar_informacion()
    
    def modificar_informacion(self, numero=None, fecha_expiracion=None, cvv=None, titular=None):
        if numero:
            self.numero = numero
        if fecha_expiracion:
            self.fecha_expiracion = fecha_expiracion
        if cvv:
            self.cvv = cvv
        if titular:
            self.titular = titular
        self.save()
    
class Saldo(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def recargar_saldo(self, cantidad):
        """
        Recarga el saldo sumando la cantidad dada.
        La cantidad debe ser un número entero positivo.
        """
        try:
            # Convertir explícitamente a Decimal para evitar problemas de tipo
            if isinstance(cantidad, float) or isinstance(cantidad, int) or isinstance(cantidad, str):
                cantidad_decimal = Decimal(str(cantidad))
            elif isinstance(cantidad, Decimal):
                cantidad_decimal = cantidad
            else:
                raise ValidationError(f"Tipo de dato no soportado: {type(cantidad)}")
            
            # Validamos que sea un valor positivo
            if cantidad_decimal <= Decimal('0'):
                raise ValidationError("La cantidad de recarga debe ser un valor positivo")
            
            # Aseguramos que sea un valor entero
            if cantidad_decimal != cantidad_decimal.quantize(Decimal('1')):
                # Si hay decimales, redondeamos hacia abajo (floor)
                cantidad_decimal = cantidad_decimal.quantize(Decimal('1'), rounding='ROUND_DOWN')
            
            # Sumamos al saldo (esto debería funcionar correctamente ahora)
            self.saldo += cantidad_decimal
            self.save()
            
            # Registrar la transacción
            HistorialSaldo.objects.create(
                usuario=self.usuario,
                tipo_transaccion='RECARGA',
                monto=cantidad_decimal,
                saldo_resultante=self.saldo
            )
            
            return self.saldo
            
        except (ValueError, TypeError) as e:
            # Capturamos errores específicos de conversión
            raise ValidationError(f"Error en el formato de la cantidad: {str(e)}")
        except Exception as e:
            # Capturamos cualquier otro error inesperado
            raise ValidationError(f"Error inesperado al procesar la recarga: {str(e)}")
    
    def descontar_saldo(self, cantidad):
        """
        Descuenta saldo. La cantidad debe ser positiva y no debe superar el saldo disponible.
        """
        try:
            # Convertir explícitamente a Decimal para evitar problemas de tipo
            if isinstance(cantidad, float) or isinstance(cantidad, int) or isinstance(cantidad, str):
                cantidad_decimal = Decimal(str(cantidad))
            elif isinstance(cantidad, Decimal):
                cantidad_decimal = cantidad
            else:
                raise ValidationError(f"Tipo de dato no soportado: {type(cantidad)}")
            
            if cantidad_decimal <= Decimal('0'):
                raise ValidationError("La cantidad a descontar debe ser un valor positivo")
            
            if self.saldo < cantidad_decimal:
                raise ValidationError("Saldo insuficiente para realizar esta operación")
            
            self.saldo -= cantidad_decimal
            self.save()
            
            # Registrar la transacción
            HistorialSaldo.objects.create(
                usuario=self.usuario,
                tipo_transaccion='COMPRA',
                monto=cantidad_decimal,
                saldo_resultante=self.saldo
            )
            
            return self.saldo
        except (ValueError, TypeError) as e:
            raise ValidationError(f"Error en el formato de la cantidad: {str(e)}")
        except Exception as e:
            # Capturamos cualquier otro error inesperado
            raise ValidationError(f"Error inesperado al procesar el descuento: {str(e)}")
    
    def mostrar_saldo(self):
        return self.saldo
    
    def __str__(self):
        return f"Saldo de {self.usuario}: ${self.saldo}"

class HistorialSaldo(models.Model):
    """
    Modelo para registrar el historial de transacciones del saldo
    """
    TIPO_TRANSACCION_CHOICES = [
        ('RECARGA', 'Recarga'),
        ('COMPRA', 'Compra'),
        ('AJUSTE', 'Ajuste administrativo')
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='historial_saldo')
    fecha = models.DateTimeField(auto_now_add=True)
    tipo_transaccion = models.CharField(max_length=20, choices=TIPO_TRANSACCION_CHOICES)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_resultante = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        ordering = ['-fecha']
        
    def __str__(self):
        return f"{self.tipo_transaccion}: {self.monto} - Usuario: {self.usuario} - Fecha: {self.fecha}"
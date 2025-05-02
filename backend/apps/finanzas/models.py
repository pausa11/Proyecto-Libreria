from django.db import models
from apps.usuarios.models import Usuario
from django.core.exceptions import ValidationError

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
        La cantidad debe ser un número positivo.
        """
        cantidad_float = float(cantidad)
        if cantidad_float <= 0:
            raise ValidationError("La cantidad de recarga debe ser un valor positivo")
        
        self.saldo += cantidad_float
        self.save()
        
        # Registrar la transacción
        HistorialSaldo.objects.create(
            usuario=self.usuario,
            tipo_transaccion='RECARGA',
            monto=cantidad_float,
            saldo_resultante=self.saldo
        )
        
        return self.saldo
    
    def descontar_saldo(self, cantidad):
        """
        Descuenta saldo. La cantidad debe ser positiva y no debe superar el saldo disponible.
        """
        cantidad_float = float(cantidad)
        if cantidad_float <= 0:
            raise ValidationError("La cantidad a descontar debe ser un valor positivo")
        
        if self.saldo < cantidad_float:
            raise ValidationError("Saldo insuficiente para realizar esta operación")
        
        self.saldo -= cantidad_float
        self.save()
        
        # Registrar la transacción
        HistorialSaldo.objects.create(
            usuario=self.usuario,
            tipo_transaccion='COMPRA',
            monto=cantidad_float,
            saldo_resultante=self.saldo
        )
        
        return self.saldo
    
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
from django.db import models
from apps.usuarios.models import Usuario

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

    def modificar_saldo(self, cantidad):
        """
        Modifica el saldo sumando la cantidad dada.
        La cantidad puede ser positiva o negativa.
        """
        cantidad_float = float(cantidad)
        self.saldo += cantidad_float
        self.save()
        return self.saldo
    
    def mostrar_saldo(self):
        return self.saldo
    
    def __str__(self):
        return f"Saldo de {self.usuario}: ${self.saldo}"
from django.db import models

class Tarjeta(models.Model):
    numero = models.CharField(max_length=16)
    fecha_expiracion = models.DateField()
    cvv = models.CharField(max_length=3)
    titular = models.CharField(max_length=100)
    
    def mostrar_información(self):
        return f'{self.numero} - {self.titular}'
    
class Saldo(models.Model):
    saldo = models.DecimalField(max_digits=10, decimal_places=2)

    def modificar_saldo(self, cantidad):
        self.saldo = cantidad
    
    def mostrar_saldo(self):
        return self.saldo
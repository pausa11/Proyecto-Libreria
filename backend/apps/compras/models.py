from django.db import models
from apps.libros.models import Libro
from apps.usuarios.models import Usuario
from apps.finanzas.models import Saldo
from datetime import timedelta, timezone

class Carrito(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    libros = models.ManyToManyField(Libro, blank=True, related_name='carritos')
    fecha = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Carrito #{self.id} - {self.fecha.strftime('%Y-%m-%d')}"
    
    def total(self):
        """Calcula el precio total del carrito"""
        return sum(libro.precio for libro in self.libros.all())
    
    def total_libros(self):
        """Cuenta el número de libros en el carrito"""
        return self.libros.count()
    
    def agregar_libro(self, libro):
        """Añade un libro al carrito"""
        self.libros.add(libro)
    
    def quitar_libro(self, libro):
        """Elimina un libro del carrito"""
        self.libros.remove(libro)
    
    def limpiar_carrito(self):
        """Vacía el carrito por completo"""
        self.libros.clear()
    
    def obtener_libros(self):
        """Devuelve una lista de los libros en el carrito"""
        return self.libros.all()
    
    def pagar(self):
        """Método para implementar la funcionalidad de pago"""
        # Esta es una implementación básica que se expandirá más adelante
        total = self.total()
        saldo = Saldo.objects.get(usuario=self.usuario)
        if saldo.mostrar_saldo() < total:
            return {
                "estado": "error",
                "mensaje": "Saldo insuficiente para realizar la compra."
            }
        else:
            saldo.descontar_saldo(total)
            self.limpiar_carrito()
            return {
                "estado": "exito",
                "total": total,
                "mensaje": f"Procesando pago de ${total} para {self.total_libros()} libros"
            }

class Prestamo(models.Model):
    libros = models.ManyToManyField(Libro, blank=True, related_name='prestamos')
    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_expiracion = models.DateTimeField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='prestamos')
    estado_choices = [
        ('Activa', 'Activa'),
        ('Cancelado', 'Cancelado'),
    ]
    estado = models.CharField(max_length=10, choices=estado_choices, default='Activa')

    
    def save(self, *args, **kwargs):
        if not self.pk and not self.fecha_expiracion:  # Si es un nuevo objeto y no tiene fecha de expiración
            self.fecha_expiracion = timezone.now() + timedelta(days=1)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Préstamo #{self.id} - {self.fecha_prestamo.strftime('%Y-%m-%d')}"
    
    def ReservarLibro(self, libroReservado):
        librosrepetidos = 0
        for libro in self.libros.all():
            if libroReservado.titulo == libro.titulo:
                librosrepetidos +=1
            
        if librosrepetidos < 3 and self.libros.count() <= 5:
            self.libros.add(libroReservado)
            return "Libro reservado con éxito."
        else:
            return "No puedes reservar más libros de este tipo o has alcanzado el límite de libros prestados."
        
    

class Historial(models.Model):
    fecha = models.DateTimeField()
    libros = models.ManyToManyField(Libro, blank = True, related_name='historiales')

    def __str__(self):
        return f"Historial #{self.id} - {self.fecha.strftime('%Y-%m-%d')}"
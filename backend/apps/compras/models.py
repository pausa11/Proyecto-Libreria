from django.db import models
from apps.libros.models import Libro
from apps.usuarios.models import Usuario
from apps.finanzas.models import Saldo
from datetime import timedelta, timezone
from django.utils import timezone


class CarritoLibro(models.Model):
    carrito = models.ForeignKey('Carrito', on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('carrito', 'libro')
        
class PedidoLibro(models.Model):
    pedido = models.ForeignKey('Pedidos', on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('pedido', 'libro')

class Carrito(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    libros = models.ManyToManyField(Libro, blank=True, related_name='carritos')
    fecha = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Carrito #{self.id} - {self.fecha.strftime('%Y-%m-%d')}"
    
    def agregar_libro(self, libro, cantidad):
        """Añade un libro al carrito"""
        obj, created = CarritoLibro.objects.get_or_create(carrito=self, libro=libro)
        if not created:
            obj.cantidad += cantidad
        else:
            obj.cantidad = cantidad
        obj.save()
    
    def quitar_libro(self, libro, cantidad):
        """Elimina un libro del carrito"""
        try:
            obj = CarritoLibro.objects.get(carrito=self, libro=libro)
            if obj.cantidad > cantidad and obj.cantidad - cantidad > 0:
                obj.cantidad -= cantidad
                obj.save()
            else:
                obj.delete()
        except CarritoLibro.DoesNotExist:
            pass
        
    def limpiar_carrito(self):
        """Vacía el carrito por completo"""
        self.libros.clear()
        CarritoLibro.objects.filter(carrito=self).delete()
    
    def obtener_libros(self):
        """Devuelve una lista de los libros en el carrito"""
        return CarritoLibro.objects.filter(carrito=self).all()
    
    def pagar(self):
        """Método para implementar la funcionalidad de pago"""
        # Esta es una implementación básica que se expandirá más adelante
        total = CarritoLibro.objects.filter(carrito=self).aggregate(total=models.Sum('libro__precio'))['total'] * CarritoLibro.objects.filter(carrito=self).aggregate(total=models.Sum('cantidad'))['total']
        total_libros = CarritoLibro.objects.filter(carrito=self).aggregate(total=models.Sum('cantidad'))['total']
        if total is None:
            return {
                "estado": "error",
                "mensaje": "El carrito está vacío."
            }
        saldo = Saldo.objects.get(usuario=self.usuario)
        if saldo.mostrar_saldo() < total:
            return {
                "estado": "error",
                "mensaje": "Saldo insuficiente para realizar la compra."
            }
        else:
            for carrito_libro in CarritoLibro.objects.filter(carrito=self):
                if carrito_libro.libro.stock >= carrito_libro.cantidad:
                    carrito_libro.libro.stock -= carrito_libro.cantidad
                    carrito_libro.libro.save()
                else:
                    return {
                        "estado": "error",
                        "mensaje": f"El libro {carrito_libro.libro.titulo} no tiene suficiente stock."
                    }
            pedido = Pedidos.objects.create(usuario=self.usuario, estado='Pendiente', fecha=timezone.now())
            for carrito_libro in CarritoLibro.objects.filter(carrito=self):
                PedidoLibro.objects.create(
                    pedido=pedido,
                    libro=carrito_libro.libro,
                    cantidad=carrito_libro.cantidad
                )
            saldo.descontar_saldo(total)
            self.limpiar_carrito()
            return {
                "estado": "exito",
                "total": total,
                "mensaje": f"Procesando pago de ${total} para {total_libros} libros"
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
    

class Pedidos(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    libros = models.ManyToManyField(Libro, blank=True, related_name='pedidos')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')
    estado_choices = [
        ('Pendiente', 'Pendiente'),
        ('Cancelado', 'Cancelado'),
        ('Completado', 'Completado'),
    ]
    estado = models.CharField(max_length=10, choices=estado_choices, default='Pendiente')
    def save(self, *args, **kwargs):
        if not self.pk and not self.fecha:  
            self.fecha = timezone.now()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Pedido #{self.id} - {self.fecha.strftime('%Y-%m-%d')}" 
    
    def crear_pedido(self, usuario, libros, cantidad):
        """
        Crea un nuevo pedido.
        """
        self.usuario = usuario
        self.libros.set(libros)
        self.save()
        
        for libro in libros:
            PedidoLibro.objects.create(pedido=self, libro=libro, cantidad=cantidad)
        
        return self
    
    def MostrarPedidos(self):
        return PedidoLibro.objects.filter(pedido=self).all()
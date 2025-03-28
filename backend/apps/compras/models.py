from django.db import models
from apps.libros.models import Libro

class Carrito(models.Model):
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
    
    def nombre_libros(self):
        """Devuelve una lista con los nombres de los libros en el carrito"""
        return [libro.titulo for libro in self.libros.all()]
    
    def pagar(self):
        """Método para implementar la funcionalidad de pago"""
        # Esta es una implementación básica que se expandirá más adelante
        total = self.total()
        return {
            "estado": "pendiente",
            "total": total,
            "mensaje": f"Procesando pago de ${total} para {self.total_libros()} libros"
        }
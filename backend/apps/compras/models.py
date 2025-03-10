from django.db import models
'''from apps.libros.models import Libro

# Create your models here.
class Carrito(models.Model):
    libros = models.ManyToManyField(Libro)
    fecha = models.DateTimeField(auto_now_add=True)
    
    def total(self, descuento=False):
        if descuento:
            return sum([libro.precio for libro in self.libros.all()]) * 0.9
        else:
            return sum([libro.precio for libro in self.libros.all()])
    
    def total_libros(self):
        return self.libros.count()
    
    def agregar_libro(self, libro):
        self.libros.add(libro)
    
    def quitar_libro(self, libro):
        self.libros.remove(libro)
    
    def limpiar_carrito(self):
        self.libros.clear()
    
    def pagar(self):
        pass'''
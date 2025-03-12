from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Noticia, Suscripcion
from apps.libros.models import Libro, Categoria

User = get_user_model()

class NoticiaTests(APITestCase):
    def setUp(self):
        # Crear usuario staff
        self.staff_user = User.objects.create_user(
            username='staff',
            email='staff@test.com',
            password='testpass123',
            is_staff=True
        )
        
        # Crear usuario normal
        self.normal_user = User.objects.create_user(
            username='normal',
            email='normal@test.com',
            password='testpass123'
        )

        # Crear categoría
        self.categoria = Categoria.objects.create(
            nombre='Test Category'
        )

        # Crear libro
        self.libro = Libro.objects.create(
            titulo='Test Book',
            autor='Test Author',
            categoria=self.categoria
        )

        # Crear noticia
        self.noticia = Noticia.objects.create(
            titulo='Test Noticia',
            contenido='Test Content',
            autor=self.staff_user,
            estado='publicado'
        )

    def test_crear_noticia(self):
        """Test crear una nueva noticia"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse('noticia-list')
        data = {
            'titulo': 'Nueva Noticia',
            'contenido': 'Contenido de prueba',
            'estado': 'borrador'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Noticia.objects.count(), 2)

    def test_listar_noticias(self):
        """Test listar noticias"""
        url = reverse('noticia-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class SuscripcionTests(APITestCase):
    def setUp(self):
        # Crear usuario
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass123'
        )
        
        # Crear categoría
        self.categoria = Categoria.objects.create(
            nombre='Test Category'
        )

    def test_crear_suscripcion(self):
        """Test crear una nueva suscripción"""
        self.client.force_authenticate(user=self.user)
        url = reverse('suscripcion-list')
        data = {
            'categorias_interes': [self.categoria.id],
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Suscripcion.objects.count(), 1)

    def test_mis_noticias(self):
        """Test obtener noticias según suscripción"""
        self.client.force_authenticate(user=self.user)
        # Crear suscripción
        suscripcion = Suscripcion.objects.create(
            usuario=self.user,
            activo=True
        )
        suscripcion.categorias_interes.add(self.categoria)
        
        url = reverse('suscripcion-mis-noticias')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

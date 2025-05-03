from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import SearchQuery
from .serializers import SearchQuerySerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from apps.libros.models import Libro

class SearchView(APIView):
    permission_classes = [AllowAny]  # Permitir búsqueda sin autenticación
    
    @extend_schema(
        description="Realiza una búsqueda de libros con filtros opcionales",
        parameters=[
            OpenApiParameter(
                name='q',
                type=OpenApiTypes.STR,
                description="Término de búsqueda (título, autor o ISBN). Opcional si se usan otros filtros.",
                required=False
            ),
            OpenApiParameter(
                name='categoria',
                type=OpenApiTypes.STR,
                description="Filtrar por categoría",
                required=False
            ),
            OpenApiParameter(
                name='precio_min',
                type=OpenApiTypes.FLOAT,
                description="Precio mínimo",
                required=False
            ),
            OpenApiParameter(
                name='precio_max',
                type=OpenApiTypes.FLOAT,
                description="Precio máximo",
                required=False
            ),
            OpenApiParameter(
                name='stock_min',
                type=OpenApiTypes.INT,
                description="Stock mínimo disponible",
                required=False
            ),
            OpenApiParameter(
                name='ordenar_por',
                type=OpenApiTypes.STR,
                description="Campo por el cual ordenar los resultados",
                required=False
            ),
            OpenApiParameter(
                name='orden',
                type=OpenApiTypes.STR,
                description="Dirección del ordenamiento (asc o desc)",
                required=False
            )
        ],
        responses={200: SearchQuerySerializer}
    )
    def get(self, request, format=None):
        # Iniciar la consulta base
        libros = Libro.objects.all()

        # Aplicar búsqueda por texto si se proporciona
        query = request.query_params.get('q', None)
        if query:
            libros = libros.filter(
                Q(titulo__icontains=query) |
                Q(autor__icontains=query) |
                Q(isbn__icontains=query) |
                Q(descripcion__icontains=query) |
                Q(editorial__icontains=query)
            )

        # Aplicar filtros adicionales
        categoria = request.query_params.get('categoria', None)
        if categoria:
            libros = libros.filter(categoria__nombre__icontains=categoria)

        precio_min = request.query_params.get('precio_min', None)
        if precio_min:
            libros = libros.filter(precio__gte=float(precio_min))

        precio_max = request.query_params.get('precio_max', None)
        if precio_max:
            libros = libros.filter(precio__lte=float(precio_max))

        stock_min = request.query_params.get('stock_min', None)
        if stock_min:
            libros = libros.filter(stock__gte=int(stock_min))
            
        # Ordenamiento
        ordenar_por = request.query_params.get('ordenar_por', 'titulo')
        orden = request.query_params.get('orden', 'asc')
        
        if orden == 'desc':
            ordenar_por = f'-{ordenar_por}'
        
        libros = libros.order_by(ordenar_por)

        # No requerir criterios de búsqueda - mostrar todos si no hay filtros
        # Remover esta validación para permitir ver todos los libros
        """
        if not any([query, categoria, precio_min, precio_max, stock_min]):
            return Response(
                {"error": "Debe proporcionar al menos un criterio de búsqueda (q, categoria, precio_min, precio_max o stock_min)"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        """

        # Preparar resultados
        results = []
        for libro in libros:
            results.append({
                'id': libro.id,
                'titulo': libro.titulo,
                'autor': libro.autor,
                'isbn': libro.isbn,
                'precio': str(libro.precio),
                'categoria': libro.categoria.nombre if libro.categoria else None,
                'stock': libro.stock,
                'editorial': libro.editorial,
                'año_publicacion': libro.año_publicacion,
                'descripcion': libro.descripcion,
                'imagen_url': libro.portada.url if libro.portada else None
            })

        # Guardar la consulta y resultados (opcional, podrías hacer esto condicional)
        search_query = SearchQuery.objects.create(
            query=query or "Consulta sin texto de búsqueda",
            results=results
        )
        
        serializer = SearchQuerySerializer(search_query)
        return Response(serializer.data, status=status.HTTP_200_OK)

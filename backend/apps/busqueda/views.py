from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SearchQuery
from .serializers import SearchQuerySerializer

class SearchView(APIView):
    def get(self, request, format=None):
        query = request.query_params.get('q', None)
        if query:
            # Perform search logic here
            results = []  # Replace with actual search results
            search_query = SearchQuery.objects.create(query=query, results=results)
            serializer = SearchQuerySerializer(search_query)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)

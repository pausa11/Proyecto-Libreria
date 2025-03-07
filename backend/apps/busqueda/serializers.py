from rest_framework import serializers
from .models import SearchQuery

class SearchQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchQuery
        fields = ['query', 'results', 'created_at']

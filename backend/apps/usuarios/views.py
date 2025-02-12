from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
    CambioContraseñaSerializer
)

Usuario = get_user_model()

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioRegistroSerializer
        return self.serializer_class

    @action(detail=True, methods=['post'])
    def cambiar_contraseña(self, request, pk=None):
        usuario = self.get_object()
        serializer = CambioContraseñaSerializer(data=request.data)
        
        if serializer.is_valid():
            if not usuario.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": "Contraseña incorrecta"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            usuario.set_password(serializer.validated_data['new_password'])
            usuario.save()
            return Response(
                {'message': 'Contraseña actualizada correctamente'},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def perfil(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

# Create your views here.

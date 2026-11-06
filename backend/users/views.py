from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User
from users.serializers import UserSerializer, UserMeSerializer, RegisterUserSerializer

class UserApiViewSet(ModelViewSet):
    """
    CRUD completo de usuarios protegido exclusivamente para administradores.
    """
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('id')


class UserView(APIView):
    """
    Endpoint para consultar los datos personales del usuario autenticado vía JWT.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserMeSerializer(request.user)
        return Response(serializer.data)


class RegisterUserView(CreateAPIView):
    """
    Endpoint público para el registro de nuevos usuarios en CampusTrack.
    Permite llamadas anónimas (AllowAny) y valida datos mediante RegisterUserSerializer.
    """
    permission_classes = [AllowAny]
    serializer_class = RegisterUserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        # Corregido: se utiliza request.data (en lugar del error del manual request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'message': 'Usuario registrado exitosamente en CampusTrack',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'matricula': user.matricula,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)

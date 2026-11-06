from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import User
from users.serializers import UserSerializer, UserMeSerializer

class UserApiViewSet(ModelViewSet):
    """
    CRUD completo de usuarios protegido exclusivamente para administradores.
    """
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('id')

    # Al delegar la creación y actualización al serializer UserSerializer
    # con soporte de set_password() y pop('password', None), evitamos el error
    # de seguridad del manual donde se sobrescribía la contraseña con la del usuario logueado.


class UserView(APIView):
    """
    Endpoint para consultar los datos personales del usuario autenticado vía JWT.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserMeSerializer(request.user)
        return Response(serializer.data)

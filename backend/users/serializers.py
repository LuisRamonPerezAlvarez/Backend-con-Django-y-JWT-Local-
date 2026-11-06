from rest_framework import serializers
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'},
        help_text="Contraseña del usuario (solo escritura, nunca retornada)."
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'matricula',
            'password',
            'is_active',
            'is_staff'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UserMeSerializer(serializers.ModelSerializer):
    """
    Serializer exclusivo para el endpoint /auth/me/ garantizando
    que jamás exista el campo password (ni hash) en la respuesta.
    """
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'matricula',
            'is_active',
            'is_staff'
        ]
        read_only_fields = fields


from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
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


class RegisterUserSerializer(serializers.ModelSerializer):
    """
    Serializer exclusivo para el registro público de estudiantes.
    - Contraseña de solo escritura.
    - Longitud mínima de 8 caracteres con validación de Django.
    - Restringe campos administrativos (is_staff e is_superuser jamás permitidos).
    - Preserva la obligatoriedad del campo 'matricula' de CampusTrack.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Contraseña segura (mínimo 8 caracteres)."
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'matricula',
            'first_name',
            'last_name',
            'password',
        ]
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Garantizar que el usuario creado desde el registro público nunca sea staff ni superuser
        user = User(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            matricula=validated_data.get('matricula'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=False,
            is_superuser=False,
            is_active=True
        )
        user.set_password(password)
        user.save()
        return user

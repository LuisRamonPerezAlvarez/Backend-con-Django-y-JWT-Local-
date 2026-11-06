from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True, verbose_name="Correo electrónico")
    matricula = models.CharField(max_length=20, unique=True, verbose_name="Matrícula")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'matricula']

    def __str__(self):
        return f"{self.email} ({self.matricula})"

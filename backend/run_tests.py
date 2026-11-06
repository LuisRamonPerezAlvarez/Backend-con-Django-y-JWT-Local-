import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import authenticate
from users.models import User

client = APIClient()

print("=" * 60)
print("INICIANDO BATERÍA DE PRUEBAS AUTOMATIZADAS - CAMPUSTRACK")
print("=" * 60)

# PRUEBA 1: Creación de usuario y hash de contraseña
print("\n[PRUEBA 1] Creación de usuario y verificación de hash")
admin_user = User.objects.get(email='admin@campustrack.edu')
client.force_authenticate(user=admin_user)

user_data = {
    "username": "juanperez",
    "email": "juan.perez@campustrack.edu",
    "first_name": "Juan",
    "last_name": "Pérez Gómez",
    "matricula": "2024001",
    "password": "PasswordOriginal123!",
    "is_active": True,
    "is_staff": False
}

response = client.post('/api/v1/users/', user_data, format='json')
assert response.status_code == 201, f"Fallo al crear usuario: {response.data}"
created_user_id = response.data['id']
created_user = User.objects.get(id=created_user_id)

assert created_user.check_password("PasswordOriginal123!"), "La contraseña no fue hasheada correctamente"
assert not created_user.password.startswith("PasswordOriginal123!"), "La contraseña está en texto plano"
print(f"-> PASS: Usuario creado con id {created_user_id}. Password hash: {created_user.password[:25]}...")

# PRUEBA 2: Seguridad del Serializer (no debe retornar password ni su hash)
print("\n[PRUEBA 2] Seguridad del serializer (ausencia de password)")
assert 'password' not in response.data, "VULNERABILIDAD: El campo password fue retornado en la creación"
list_resp = client.get('/api/v1/users/')
user_list = list_resp.data if isinstance(list_resp.data, list) else list_resp.data.get('results', [])
for u in user_list:
    assert 'password' not in u, f"VULNERABILIDAD: Password expuesto en listado: {u}"
print("-> PASS: Ningún endpoint de usuario expone el campo password ni su hash.")

# PRUEBA 3: Inicio de sesión mediante email y contraseña (JWT)
print("\n[PRUEBA 3] Inicio de sesión con SimpleJWT (Email + Password)")
client.logout()
client.force_authenticate(user=None)

login_data = {
    "email": "juan.perez@campustrack.edu",
    "password": "PasswordOriginal123!"
}
login_resp = client.post('/api/v1/auth/token/', login_data, format='json')
assert login_resp.status_code == 200, f"Error al iniciar sesión: {login_resp.data}"
assert 'access' in login_resp.data and 'refresh' in login_resp.data, "Tokens no devueltos"
user_token = login_resp.data['access']
print("-> PASS: Login exitoso. Tokens access y refresh obtenidos.")

# PRUEBA 4: Datos personales (/api/v1/auth/me/)
print("\n[PRUEBA 4] Consulta de datos personales (/api/v1/auth/me/)")
client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
me_resp = client.get('/api/v1/auth/me/')
assert me_resp.status_code == 200, f"Error en /auth/me/: {me_resp.data}"
assert me_resp.data['email'] == "juan.perez@campustrack.edu"
assert me_resp.data['matricula'] == "2024001"
assert 'password' not in me_resp.data, "VULNERABILIDAD: Password presente en /auth/me/"
print(f"-> PASS: Datos de /auth/me/ verificados correctamente: {me_resp.data}")

# PRUEBA 5: Actualización SIN contraseña (conservación obligatoria de contraseña)
print("\n[PRUEBA 5] Actualización SIN contraseña (PATCH)")
client.credentials()
client.force_authenticate(user=admin_user)

patch_data = {
    "first_name": "Juan Carlos",
    "matricula": "2024001-MOD"
}
patch_resp = client.patch(f'/api/v1/users/{created_user_id}/', patch_data, format='json')
assert patch_resp.status_code == 200, f"Error en patch: {patch_resp.data}"
assert patch_resp.data['first_name'] == "Juan Carlos"
assert patch_resp.data['matricula'] == "2024001-MOD"

# Validar login con contraseña original
client.logout()
client.force_authenticate(user=None)
relogin_resp = client.post('/api/v1/auth/token/', {
    "email": "juan.perez@campustrack.edu",
    "password": "PasswordOriginal123!"
}, format='json')
assert relogin_resp.status_code == 200, "FALLO CRÍTICO: La contraseña original cambió tras actualizar otros campos"

# Validar que contraseña errónea falle
bad_login = client.post('/api/v1/auth/token/', {
    "email": "juan.perez@campustrack.edu",
    "password": "WrongPassword!"
}, format='json')
assert bad_login.status_code == 401, "Error: Contraseña inválida fue aceptada"
print("-> PASS: La contraseña original se conservó intacta y autentica con éxito.")

# PRUEBA 6: Actualización CON contraseña
print("\n[PRUEBA 6] Actualización CON contraseña")
client.force_authenticate(user=admin_user)
pwd_patch_resp = client.patch(f'/api/v1/users/{created_user_id}/', {
    "password": "NuevaPassword456!"
}, format='json')
assert pwd_patch_resp.status_code == 200

# Verificar que la contraseña vieja no funciona
client.logout()
client.force_authenticate(user=None)
old_login = client.post('/api/v1/auth/token/', {
    "email": "juan.perez@campustrack.edu",
    "password": "PasswordOriginal123!"
}, format='json')
assert old_login.status_code == 401, "La contraseña vieja sigue funcionando"

# Verificar que la nueva sí funciona
new_login = client.post('/api/v1/auth/token/', {
    "email": "juan.perez@campustrack.edu",
    "password": "NuevaPassword456!"
}, format='json')
assert new_login.status_code == 200, "La contraseña nueva no fue configurada correctamente"
print("-> PASS: Cambio de contraseña verificado exitosamente.")

# PRUEBA 7: Permisos y restricciones
print("\n[PRUEBA 7] Permisos de usuario regular vs Administrador")
# Usuario regular autenticado vía JWT
new_token = new_login.data['access']
client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_token}')

# Regular intentando listar /api/v1/users/ -> debe ser 403 Forbidden
reg_users_resp = client.get('/api/v1/users/')
assert reg_users_resp.status_code == 403, f"Fallo de seguridad: Usuario regular pudo acceder a CRUD: {reg_users_resp.status_code}"

# Regular accediendo a su propio /auth/me/ -> debe ser 200 OK
reg_me_resp = client.get('/api/v1/auth/me/')
assert reg_me_resp.status_code == 200

# Usuario sin autenticar a /auth/me/ -> debe ser 401 Unauthorized
client.credentials()
unauth_resp = client.get('/api/v1/auth/me/')
assert unauth_resp.status_code == 401, "Usuario anónimo pudo ver /auth/me/"
print("-> PASS: Controles de acceso y permisos verificados con éxito (IsAdminUser e IsAuthenticated).")

# PRUEBA 8: Swagger y documentación
print("\n[PRUEBA 8] Verificación de Swagger UI")
swagger_resp = client.get('/swagger/?format=openapi')
assert swagger_resp.status_code == 200, "Swagger OpenAPI schema falló"
assert "CampusTrack API" in swagger_resp.content.decode('utf-8')
print("-> PASS: Swagger OpenAPI schema responde 200 OK con 'CampusTrack API'.")

print("\n" + "=" * 60)
print("TODAS LAS PRUEBAS (1 A 8) PASARON EXITOSAMENTE.")
print("=" * 60)

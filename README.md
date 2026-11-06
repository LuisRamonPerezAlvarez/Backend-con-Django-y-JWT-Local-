# CampusTrack — Backend con Django REST Framework y JWT

Sistema de gestión de perfiles estudiantiles desarrollado con Django REST Framework y autenticación mediante JSON Web Tokens (SimpleJWT).

---

## 1. Tecnologías Utilizadas

- **Python:** 3.13.14
- **Django:** 6.1.3
- **Django REST Framework:** 3.18.3
- **drf-yasg:** 1.21.18 (Swagger y ReDoc)
- **djangorestframework-simplejwt:** 5.5.1
- **django-cors-headers:** 4.9.0
- **Base de Datos:** SQLite (`db.sqlite3`)

---

## 2. Estructura del Proyecto

```text
CampusTrack/
│
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── users/
│   │   ├── migrations/
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── run_tests.py
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 3. Instalación y Puesta en Marcha (Windows PowerShell)

### Paso 1: Clonar el repositorio y acceder a la raíz
```powershell
cd "CampusTrack"
```

### Paso 2: Crear el entorno virtual
```powershell
python -m venv venv
```

### Paso 3: Activar el entorno virtual
```powershell
.\venv\Scripts\Activate.ps1
```

### Paso 4: Instalar las dependencias
```powershell
pip install -r requirements.txt
```

### Paso 5: Aplicar migraciones
```powershell
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Paso 6: Crear el superusuario administrador
```powershell
python manage.py createsuperuser
```
*(Ingresa correo electrónico, username, matrícula, nombre, apellidos y contraseña cuando se solicite).*

Para generar automáticamente el superusuario de pruebas predeterminado:
```powershell
python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings'); django.setup(); from users.models import User; User.objects.create_superuser('admin', 'admin@campustrack.edu', 'AdminPassword123!', matricula='ADMIN001', first_name='Administrador', last_name='General') if not User.objects.filter(email='admin@campustrack.edu').exists() else None"
```

### Paso 7: Ejecutar el servidor de desarrollo
```powershell
python manage.py runserver
```
El servidor estará disponible en `http://127.0.0.1:8000/`.

---

## 4. Documentación de la API

- **Swagger UI:** [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)
- **ReDoc:** [http://127.0.0.1:8000/redoc/](http://127.0.0.1:8000/redoc/)
- **Django Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 5. Endpoints Disponibles

| Método | Endpoint | Permiso requerido | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/users/` | `IsAdminUser` | Listar todos los usuarios |
| `POST` | `/api/v1/users/` | `IsAdminUser` | Crear un nuevo usuario |
| `GET` | `/api/v1/users/{id}/` | `IsAdminUser` | Detalle de un usuario |
| `PUT` | `/api/v1/users/{id}/` | `IsAdminUser` | Actualización completa de un usuario |
| `PATCH` | `/api/v1/users/{id}/` | `IsAdminUser` | Actualización parcial de un usuario |
| `DELETE` | `/api/v1/users/{id}/` | `IsAdminUser` | Eliminar un usuario |
| `GET` | `/api/v1/auth/me/` | `IsAuthenticated` | Consultar perfil del usuario autenticado |
| `POST` | `/api/v1/auth/token/` | `AllowAny` | Obtener tokens JWT (Login con email + password) |
| `POST` | `/api/v1/auth/token/refresh/` | `AllowAny` | Renovar el Access Token con Refresh Token |

---

## 6. Autenticación y Flujo de Trabajo

### 1. Iniciar Sesión (Obtener JWT)
Realizar una petición `POST` a `/api/v1/auth/token/`:
```json
{
  "email": "admin@campustrack.edu",
  "password": "AdminPassword123!"
}
```
**Respuesta:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Consultar Datos Personales (`/api/v1/auth/me/`)
Incluir la cabecera HTTP:
```text
Authorization: Bearer <TU_ACCESS_TOKEN>
```
**Respuesta (Garantía de seguridad: sin password ni hash):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@campustrack.edu",
  "first_name": "Administrador",
  "last_name": "General",
  "matricula": "ADMIN001",
  "is_active": true,
  "is_staff": true
}
```

---

## 7. Correcciones de Seguridad Implementadas

1. **Protección de Contraseñas:** 
   - El campo `password` se configuró explícitamente como `write_only=True` en `UserSerializer`.
   - Se utiliza `UserMeSerializer` en `/api/v1/auth/me/` sin el campo `password`.
   - Ninguna respuesta serializada retorna el hash ni texto plano de la contraseña.
2. **Corrección de Vulnerabilidad en Actualización de Usuarios (Manual pág. 10):**
   - El código original del manual asignaba `request.user.password` al usuario editado cuando no se proporcionaba contraseña, provocando que administradores transfirieran involuntariamente sus hashes de contraseña a otros usuarios.
   - En este proyecto, la actualización (`update` y `partial_update`) solo altera la contraseña si se envía una nueva en el payload (utilizando `set_password()`). Si no se incluye, la contraseña preexistente del usuario permanece 100% inalterada.

---

## 8. Ejecución de la Batería de Pruebas

Para validar el cumplimiento de las 8 pruebas obligatorias:
```powershell
cd backend
..\venv\Scripts\python.exe run_tests.py
```
Todas las pruebas (creación, serializers, login JWT, `/auth/me/`, preservación de contraseñas, cambio de contraseñas, permisos admin/user y Swagger) se ejecutan automáticamente.


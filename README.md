# CampusTrack — Full Stack (Django REST Framework y React)

Sistema integral de gestión de perfiles estudiantiles desarrollado con **Django REST Framework (Backend)** y **React con Vite (Frontend)**, implementando autenticación segura mediante JSON Web Tokens (SimpleJWT), interfaz de usuario responsiva con Semantic UI, gestión global del estado con Context API y validación rigurosa de formularios.

---

## 1. Tecnologías Utilizadas

### Backend
- **Python:** 3.13.14
- **Django:** 6.1.3
- **Django REST Framework:** 3.18.3
- **drf-yasg:** 1.21.18 (Swagger UI y ReDoc)
- **djangorestframework-simplejwt:** 5.5.1
- **django-cors-headers:** 4.9.0
- **Base de Datos:** SQLite (`db.sqlite3`)

### Frontend
- **Node.js & npm:** v22.13.0 / npm 10.9.2
- **Vite:** 8.3.6
- **React:** 18.3.1 (JavaScript)
- **Semantic UI React & CSS:** 2.1.5
- **Sass:** 1.98.0
- **React Router DOM:** v6.30.3
- **Formik & Yup:** Validación de formularios en tiempo real
- **React Toastify:** Notificaciones dinámicas de éxito y error

---

## 2. Estructura General del Proyecto

```text
CampusTrack/
│
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py          # Configuración DRF, SimpleJWT, CORS, drf-yasg
│   │   ├── urls.py              # URLs raíz (admin, api/v1, swagger, redoc)
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── users/
│   │   ├── migrations/
│   │   ├── admin.py             # Panel de Django Admin personalizado
│   │   ├── models.py            # Modelo User con email como USERNAME_FIELD y matricula
│   │   ├── serializers.py       # Serializers (UserSerializer, UserMeSerializer, RegisterUserSerializer)
│   │   ├── views.py             # UserApiViewSet, UserView (/auth/me/), RegisterUserView (/auth/register/)
│   │   └── urls.py              # Rutas de la app users
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── run_tests.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── token.js         # Gestión de localStorage para JWT
│   │   │   └── user.js          # peticiones fetch a /auth/token/, /auth/me/ y /auth/register/
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Proveedor de autenticación global (auth, login, logout)
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx      # Hook consumidor de AuthContext
│   │   │   └── useUser.jsx      # Hook para obtener el perfil del usuario
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx  # Protección de rutas privadas (Dashboard)
│   │   │   ├── ClientLayout.jsx # Barra de navegación y layout público (Home)
│   │   │   ├── CommonLayout.jsx # Layout para Login, Register y 404
│   │   │   └── index.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── client/
│   │   │   │   ├── Home.jsx
│   │   │   │   └── index.jsx
│   │   │   └── common/
│   │   │       ├── Login.jsx
│   │   │       ├── Register.jsx
│   │   │       ├── Error404.jsx
│   │   │       └── index.jsx
│   │   ├── routes/
│   │   │   ├── Navigation.jsx   # Enrutador central con React Router DOM v6
│   │   │   ├── routes.admin.jsx
│   │   │   ├── routes.client.jsx
│   │   │   ├── routes.common.jsx
│   │   │   ├── routes.js
│   │   │   └── index.jsx
│   │   ├── App.jsx              # Configuración de ToastContainer y AuthProvider
│   │   ├── App.scss             # Estilos CampusTrack con Sass
│   │   └── main.jsx
│   ├── .env                     # Variables de entorno de conexión
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 3. Requisitos Previos

- **Python 3.10+** (recomendado Python 3.13)
- **Node.js 18+** y **npm**
- **Windows PowerShell** o terminal compatible

---

## 4. Instalación y Puesta en Marcha

### Paso 1: Clonar el repositorio y acceder a la carpeta
```powershell
git clone https://github.com/LuisRamonPerezAlvarez/Backend-con-Django-y-JWT-Local-.git
cd "Backend-con-Django-y-JWT-Local-"
```

### Paso 2: Configuración del Backend (Django)
```powershell
# Crear y activar entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# Instalar dependencias del backend
pip install -r requirements.txt

# Aplicar migraciones en la base de datos SQLite
cd backend
python manage.py makemigrations
python manage.py migrate

# Crear superusuario administrador (opcional para acceder a /admin y CRUD)
python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings'); django.setup(); from users.models import User; User.objects.create_superuser('admin', 'admin@campustrack.edu', 'AdminPassword123!', matricula='ADMIN001', first_name='Administrador', last_name='General') if not User.objects.filter(email='admin@campustrack.edu').exists() else None"

# Iniciar servidor backend
python manage.py runserver 127.0.0.1:8000
```
*El backend estará disponible en `http://127.0.0.1:8000/`.*

### Paso 3: Configuración del Frontend (React + Vite)
En una **nueva ventana de PowerShell**, navega a la carpeta del proyecto y ejecuta:
```powershell
cd "frontend"

# Instalar dependencias
cmd /c "npm install"

# Iniciar servidor de desarrollo Vite
cmd /c "npm run dev"
```
*El frontend estará disponible en `http://localhost:5173/`.*

---

## 5. Variables de Entorno del Frontend (`frontend/.env`)

El archivo `.env` en la raíz de `frontend/` contiene:
```env
VITE_BASE_API_URL=http://localhost:8000
VITE_LOCAL_STORAGE_ITEM_NAME=TOKEN
```

---

## 6. Endpoints del Backend

| Método | Endpoint | Permiso | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/auth/token/` | `AllowAny` | Inicio de sesión con correo y contraseña. Devuelve tokens `access` y `refresh` |
| `POST` | `/api/v1/auth/token/refresh/` | `AllowAny` | Renovación del access token mediante refresh token |
| `GET` | `/api/v1/auth/me/` | `IsAuthenticated` | Consulta de perfil del usuario autenticado vía JWT (sin passwords) |
| `POST` | `/api/v1/auth/register/` | `AllowAny` | Registro público de estudiantes (requiere matrícula obligatoria) |
| `GET / POST` | `/api/v1/users/` | `IsAdminUser` | CRUD de usuarios (Listar / Crear) |
| `GET / PUT / PATCH / DELETE` | `/api/v1/users/{id}/` | `IsAdminUser` | CRUD de usuarios (Detalle / Actualización / Eliminación) |
| `GET` | `/swagger/` | `AllowAny` | Documentación Swagger UI |
| `GET` | `/redoc/` | `AllowAny` | Documentación ReDoc |

---

## 7. Flujo de Autenticación y Navegación

1. **Registro:** El estudiante accede a `/register`, ingresa sus datos (incluyendo la matrícula obligatoria de CampusTrack) y una contraseña que cumpla con los requisitos mínimos de seguridad. Al crearse, se almacena con hash seguro y se redirige a `/login`.
2. **Inicio de Sesión:** El estudiante introduce su correo institucional y contraseña en `/login`. El backend valida las credenciales y devuelve el token JWT.
3. **Persistencia y Estado Global:** El access token se guarda en `localStorage` y `AuthProvider` consulta inmediatamente `/api/v1/auth/me/` para almacenar los datos del estudiante en memoria.
4. **Dashboard Protegido:** El usuario es redirigido a `/dashboard`, donde se muestra su nombre, correo, matrícula universitaria y estado de cuenta. Si recarga la página (F5), la sesión persiste automáticamente.
5. **Cierre de Sesión:** Al hacer clic en "Cerrar Sesión", el token se remueve de `localStorage`, el contexto se reinicia y se redirige a `/login`. Cualquier intento de ingresar a `/dashboard` sin autenticación es redirigido a `/login` por `AdminLayout`.

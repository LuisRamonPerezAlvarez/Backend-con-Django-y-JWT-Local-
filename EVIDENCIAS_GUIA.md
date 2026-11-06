# Guía de Evidencias y Preparación del Reporte PDF

Este documento detalla las evidencias requeridas para el PDF final de la práctica **CampusTrack**, junto con los pasos específicos para capturarlas de manera real.

---

## 1. Portada y Datos Generales
- **Título de la práctica:** Práctica 4 — Backend CampusTrack: Django REST Framework y JWT.
- **Institución / Carrera:** Universidad Tecnológica / Desarrollo Web Integral.
- **Nombre del Alumno:** Luis R.
- **Repositorio de GitHub:** *(Reemplazar con la URL una vez subido el proyecto, por ejemplo: `https://github.com/tu-usuario/campustrack-backend`)*.

---

## 2. Instrucciones para Capturar las Evidencias Requeridas

Asegúrate de tener el servidor corriendo en una terminal:
```powershell
cd backend
..\venv\Scripts\python.exe manage.py runserver
```

### Evidencia 1: Captura de Swagger UI mostrando todos los endpoints
1. Abre tu navegador web en: `http://127.0.0.1:8000/swagger/`
2. Despliega los bloques `auth` y `users`.
3. Verifica que se visualice:
   - Título: **CampusTrack API v1**.
   - Endpoints de autenticación:
     - `GET /api/v1/auth/me/`
     - `POST /api/v1/auth/token/`
     - `POST /api/v1/auth/token/refresh/`
   - Endpoints CRUD de usuarios:
     - `GET /api/v1/users/`
     - `POST /api/v1/users/`
     - `GET /api/v1/users/{id}/`
     - `PUT /api/v1/users/{id}/`
     - `PATCH /api/v1/users/{id}/`
     - `DELETE /api/v1/users/{id}/`
   - Model `User` al final mostrando el campo `matricula`.
4. Toma una captura de pantalla clara.

---

### Evidencia 2: Obtención del Token JWT (`POST /api/v1/auth/token/`)
Puedes realizar esta captura desde **Swagger UI** o desde **Postman / Thunder Client / cURL**:
1. En Swagger, entra a `POST /api/v1/auth/token/` y pulsa **Try it out**.
2. Envía el cuerpo JSON:
   ```json
   {
     "email": "admin@campustrack.edu",
     "password": "AdminPassword123!"
   }
   ```
3. Pulsa **Execute**.
4. Captura la respuesta `200 OK` mostrando los tokens `access` y `refresh`.

---

### Evidencia 3: Consulta de Datos Personales (`GET /api/v1/auth/me/`)
1. Copia el token `access` obtenido en el paso anterior.
2. En Swagger, pulsa el botón verde superior **Authorize**, ingresa `Bearer <access_token>` y confirma.
3. Despliega `GET /api/v1/auth/me/`, pulsa **Try it out** y luego **Execute**.
4. Captura la respuesta `200 OK` con los datos del usuario:
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
5. Señala en la evidencia que **no existe ningún campo password ni hash**.

---

### Evidencia 4: Prueba de Actualización sin Modificar la Contraseña (Corrección de Seguridad)
Demostración paso a paso:
1. **Crear usuario con contraseña conocida:**
   - Crear estudiante con contraseña `Estudiante2024!`.
2. **Login inicial exitoso:**
   - Iniciar sesión en `/api/v1/auth/token/` con `Estudiante2024!` -> Código `200 OK`.
3. **Actualización parcial (PATCH):**
   - Desde la cuenta admin, enviar un PATCH a `/api/v1/users/{id}/` modificando solo el `first_name` a `"Nombre Actualizado"` sin enviar el campo `password`.
4. **Login posterior con la contraseña original:**
   - Intentar iniciar sesión nuevamente en `/api/v1/auth/token/` usando la contraseña original `Estudiante2024!`.
   - Capturar el resultado `200 OK`, demostrando que la contraseña **no fue alterada**.
5. **Intento con contraseña incorrecta:**
   - Probar con `PasswordInvalida123!` para demostrar que retorna `401 Unauthorized`.

---

## 3. Respaldo de Ejecución de Pruebas Automatizadas
Puedes incluir una captura de la ejecución en consola de `run_tests.py`:
```powershell
..\venv\Scripts\python.exe run_tests.py
```
Salida confirmada:
```text
============================================================
INICIANDO BATERÍA DE PRUEBAS AUTOMATIZADAS - CAMPUSTRACK
============================================================
[PRUEBA 1] Creación de usuario y verificación de hash -> PASS
[PRUEBA 2] Seguridad del serializer (ausencia de password) -> PASS
[PRUEBA 3] Inicio de sesión con SimpleJWT (Email + Password) -> PASS
[PRUEBA 4] Consulta de datos personales (/api/v1/auth/me/) -> PASS
[PRUEBA 5] Actualización SIN contraseña (PATCH) -> PASS
[PRUEBA 6] Actualización CON contraseña -> PASS
[PRUEBA 7] Permisos de usuario regular vs Administrador -> PASS
[PRUEBA 8] Verificación de Swagger UI -> PASS
============================================================
TODAS LAS PRUEBAS (1 A 8) PASARON EXITOSAMENTE.
============================================================
```


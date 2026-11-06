const API_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:8000";

/**
 * Iniciar sesión obteniendo el token JWT de Django SimpleJWT.
 */
export async function loginApi(formData) {
  try {
    const url = `${API_URL}/api/v1/auth/token/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    const response = await fetch(url, params);

    if (response.status === 401) {
      throw new Error("Correo o contraseña incorrectos");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || "Error al iniciar sesión";
      throw new Error(message);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener los datos del perfil del usuario autenticado (/api/v1/auth/me/).
 */
export async function getMeApi(token) {
  try {
    const url = `${API_URL}/api/v1/auth/me/`;
    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);

    if (response.status === 401) {
      throw new Error("Sesión expirada o token no válido");
    }

    if (!response.ok) {
      throw new Error("Error al consultar perfil del usuario");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Registro de un nuevo estudiante en CampusTrack (/api/v1/auth/register/).
 */
export async function registerApi(formData) {
  try {
    const url = `${API_URL}/api/v1/auth/register/`;
    const params = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    const response = await fetch(url, params);
    const result = await response.json();

    if (!response.ok) {
      // Extraer los errores del serializer de Django para mostrarlos en el Toast
      let errorMessage = "No se pudo registrar el usuario";
      if (typeof result === "object") {
        const errorEntries = Object.entries(result);
        if (errorEntries.length > 0) {
          const [field, errors] = errorEntries[0];
          const desc = Array.isArray(errors) ? errors[0] : errors;
          errorMessage = `${field}: ${desc}`;
        }
      }
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    throw error;
  }
}


import React, { useState, useEffect, createContext } from "react";
import { setToken, getToken, removeToken } from "../api/token";
import { useUser } from "../hooks/useUser";

export const AuthContext = createContext({
  auth: undefined, // undefined = cargando, null = no autenticado, { token, me } = autenticado
  login: () => null,
  logout: () => null,
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(undefined);
  const { getMe } = useUser();

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) {
        setAuth(null);
      } else {
        try {
          const me = await getMe(token);
          setAuth({ token, me });
        } catch (error) {
          // Token inválido o expirado
          removeToken();
          setAuth(null);
        }
      }
    })();
  }, []);

  const login = async (token) => {
    try {
      setToken(token);
      const me = await getMe(token);
      setAuth({ token, me });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setAuth(null);
  };

  const valueContext = {
    auth,
    login,
    logout,
  };

  // Evita el parpadeo de pantallas mientras se verifica el token inicial
  if (auth === undefined) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#38bdf8",
        fontSize: "18px",
        fontFamily: "sans-serif"
      }}>
        Cargando CampusTrack...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={valueContext}>
      {children}
    </AuthContext.Provider>
  );
}


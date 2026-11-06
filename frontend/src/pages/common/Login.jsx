import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { loginApi } from "../../api/user";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Si ya tiene sesión activa, redirigir directamente al Dashboard
  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El formato de correo no es válido")
        .required("El correo electrónico es obligatorio"),
      password: Yup.string().required("La contraseña es obligatoria"),
    }),
    onSubmit: async (formValues) => {
      setLoading(true);
      try {
        const response = await loginApi(formValues);
        const { access } = response;
        await login(access);
        toast.success("¡Bienvenido a CampusTrack!");
        navigate("/dashboard");
      } catch (error) {
        toast.error(error.message || "Error al iniciar sesión");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-admin">
      <div className="login-admin__content">
        <div className="login-admin__header">
          <h2>CampusTrack</h2>
          <p>Iniciar Sesión</p>
        </div>

        <form className="ui form login-form-admin" onSubmit={formik.handleSubmit}>
          <div className={`field ${formik.touched.email && formik.errors.email ? "error" : ""}`}>
            <label>Correo Electrónico</label>
            <div className="ui left icon input">
              <input
                name="email"
                type="email"
                placeholder="correo@campustrack.edu"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <i aria-hidden="true" className="mail icon"></i>
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="ui pointing prompt label">{formik.errors.email}</div>
            )}
          </div>

          <div className={`field ${formik.touched.password && formik.errors.password ? "error" : ""}`}>
            <label>Contraseña</label>
            <div className="ui left icon input">
              <input
                name="password"
                type="password"
                placeholder="Tu contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <i aria-hidden="true" className="lock icon"></i>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="ui pointing prompt label">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className={`ui large fluid primary button ${loading ? "loading" : ""}`}
          >
            Ingresar al Sistema
          </button>
        </form>

        <div className="login-admin__footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
          <p>
            <Link to="/">Volver al inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

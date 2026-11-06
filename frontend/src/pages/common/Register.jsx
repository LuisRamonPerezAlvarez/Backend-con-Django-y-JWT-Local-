import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { registerApi } from "../../api/user";
import { useAuth } from "../../hooks/useAuth";

export function Register() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Si ya tiene sesión activa, redirigir al Dashboard
  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      matricula: "",
      email: "",
      password: "",
      password_confirm: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("El username es obligatorio")
        .matches(/^\S*$/, "El username no debe contener espacios"),
      matricula: Yup.string()
        .required("La matrícula es obligatoria para registrarse en CampusTrack"),
      email: Yup.string()
        .email("Correo electrónico no válido")
        .required("El correo electrónico es obligatorio"),
      password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .matches(/\d/, "Debe contener al menos un número")
        .matches(/[@$!%*?&#]/, "Debe contener al menos un carácter especial (@$!%*?&#)"),
      password_confirm: Yup.string()
        .required("La confirmación de contraseña es obligatoria")
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
    }),
    onSubmit: async (formValues) => {
      setLoading(true);
      try {
        const payload = {
          username: formValues.username.trim(),
          email: formValues.email.trim().toLowerCase(),
          matricula: formValues.matricula.trim().toUpperCase(),
          first_name: formValues.first_name.trim(),
          last_name: formValues.last_name.trim(),
          password: formValues.password,
        };

        await registerApi(payload);
        toast.success("¡Registro exitoso! Por favor inicia sesión.");
        navigate("/login");
      } catch (error) {
        toast.error(error.message || "Error al registrar el estudiante");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-admin register-container">
      <div className="login-admin__content register-box">
        <div className="login-admin__header">
          <h2>CampusTrack</h2>
          <p>Registro de Estudiante</p>
        </div>

        <form className="ui form login-form-admin" onSubmit={formik.handleSubmit}>
          <div className="two fields">
            <div className="field">
              <label>Nombre(s)</label>
              <input
                name="first_name"
                placeholder="Nombre"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="field">
              <label>Apellidos</label>
              <input
                name="last_name"
                placeholder="Apellidos"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="two fields">
            <div className={`field ${formik.touched.username && formik.errors.username ? "error" : ""}`}>
              <label>Username</label>
              <div className="ui left icon input">
                <input
                  name="username"
                  placeholder="usuario123"
                  value={formik.values.username}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s+/g, "");
                    formik.setFieldValue("username", val);
                  }}
                  onBlur={formik.handleBlur}
                />
                <i aria-hidden="true" className="user icon"></i>
              </div>
              {formik.touched.username && formik.errors.username && (
                <div className="ui pointing prompt label">{formik.errors.username}</div>
              )}
            </div>

            <div className={`field ${formik.touched.matricula && formik.errors.matricula ? "error" : ""}`}>
              <label>Matrícula</label>
              <div className="ui left icon input">
                <input
                  name="matricula"
                  placeholder="Ej. MAT-2024-001"
                  value={formik.values.matricula}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <i aria-hidden="true" className="id card icon"></i>
              </div>
              {formik.touched.matricula && formik.errors.matricula && (
                <div className="ui pointing prompt label">{formik.errors.matricula}</div>
              )}
            </div>
          </div>

          <div className={`field ${formik.touched.email && formik.errors.email ? "error" : ""}`}>
            <label>Correo Electrónico Institucional</label>
            <div className="ui left icon input">
              <input
                name="email"
                type="email"
                placeholder="estudiante@campustrack.edu"
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
                placeholder="Mínimo 8 caracteres (1 Mayúscula, 1 número, 1 símbolo)"
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

          <div className={`field ${formik.touched.password_confirm && formik.errors.password_confirm ? "error" : ""}`}>
            <label>Confirmar Contraseña</label>
            <div className="ui left icon input">
              <input
                name="password_confirm"
                type="password"
                placeholder="Repite la contraseña"
                value={formik.values.password_confirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <i aria-hidden="true" className="repeat icon"></i>
            </div>
            {formik.touched.password_confirm && formik.errors.password_confirm && (
              <div className="ui pointing prompt label">{formik.errors.password_confirm}</div>
            )}
          </div>

          <button
            type="submit"
            className={`ui large fluid primary button ${loading ? "loading" : ""}`}
          >
            Registrarse
          </button>
        </form>

        <div className="login-admin__footer">
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
          <p>
            <Link to="/">Volver al inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

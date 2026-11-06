import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Importar estilos de Semantic UI y React Toastify
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

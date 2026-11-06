import React from "react";
import { Link } from "react-router-dom";
import { Container, Menu, Button } from "semantic-ui-react";
import { useAuth } from "../hooks/useAuth";

export function ClientLayout({ children }) {
  const { auth } = useAuth();

  return (
    <div className="client-layout">
      <Menu inverted borderless className="client-layout__navbar">
        <Container>
          <Menu.Item as={Link} to="/" header className="client-layout__brand">
            🎓 CampusTrack
          </Menu.Item>
          <Menu.Menu position="right">
            {auth ? (
              <Menu.Item as={Link} to="/dashboard">
                <Button primary size="small">Ir al Dashboard</Button>
              </Menu.Item>
            ) : (
              <>
                <Menu.Item as={Link} to="/login">
                  <Button inverted size="small">Iniciar Sesión</Button>
                </Menu.Item>
                <Menu.Item as={Link} to="/register">
                  <Button primary size="small">Registrarse</Button>
                </Menu.Item>
              </>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
      <main className="client-layout__content">
        {children}
      </main>
    </div>
  );
}


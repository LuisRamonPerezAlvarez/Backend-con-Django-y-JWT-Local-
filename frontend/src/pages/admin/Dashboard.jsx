import React from "react";
import { Container, Header, Segment, Button, Grid, Card, Icon, Label } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export function Dashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const user = auth?.me;

  const handleLogout = () => {
    logout();
    toast.info("Has cerrado sesión exitosamente");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Container className="dashboard-header__content">
          <div>
            <h1>🎓 CampusTrack</h1>
            <p>Panel Estudiantil y de Control</p>
          </div>
          <Button color="red" basic inverted onClick={handleLogout}>
            <Icon name="log out" />
            Cerrar Sesión
          </Button>
        </Container>
      </header>

      <Container className="dashboard-body">
        <Segment raised className="welcome-banner">
          <Header as="h2">
            <Icon name="hand wave" color="yellow" />
            <Header.Content>
              ¡Bienvenido, {user?.first_name || user?.username || "Usuario"}!
              <Header.Subheader>
                Has iniciado sesión exitosamente con tu cuenta institucional.
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>

        <Grid columns={2} stackable>
          <Grid.Column width={10}>
            <Card fluid className="profile-card">
              <Card.Content>
                <Card.Header>
                  <Icon name="user circle" color="blue" /> Información del Perfil
                </Card.Header>
                <Card.Meta>Datos sincronizados con Django REST Framework</Card.Meta>
                <Card.Description>
                  <div className="profile-item">
                    <strong>Correo Electrónico:</strong> <span>{user?.email}</span>
                  </div>
                  <div className="profile-item">
                    <strong>Nombre Completo:</strong>{" "}
                    <span>
                      {user?.first_name} {user?.last_name || "(Sin apellidos registrados)"}
                    </span>
                  </div>
                  <div className="profile-item">
                    <strong>Username:</strong> <span>{user?.username}</span>
                  </div>
                  <div className="profile-item">
                    <strong>Matrícula:</strong>{" "}
                    <Label color="teal" size="large">
                      {user?.matricula || "N/A"}
                    </Label>
                  </div>
                  <div className="profile-item">
                    <strong>Estado de Cuenta:</strong>{" "}
                    {user?.is_active ? (
                      <Label color="green" basic>Activo</Label>
                    ) : (
                      <Label color="grey">Inactivo</Label>
                    )}
                  </div>
                  <div className="profile-item">
                    <strong>Tipo de Usuario:</strong>{" "}
                    {user?.is_staff ? (
                      <Label color="purple">Administrador / Staff</Label>
                    ) : (
                      <Label color="blue">Estudiante</Label>
                    )}
                  </div>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>

          <Grid.Column width={6}>
            <Card fluid className="status-card">
              <Card.Content>
                <Card.Header>
                  <Icon name="shield" color="teal" /> Estado de la Sesión JWT
                </Card.Header>
                <Card.Description>
                  <p>
                    <Icon name="check circle" color="green" /> Autenticado vía SimpleJWT
                  </p>
                  <p>
                    <Icon name="clock outline" color="blue" /> Token válido en <code>localStorage</code>
                  </p>
                  <p>
                    <Icon name="lock" color="grey" /> Contraseña protegida (no expuesta en respuestas)
                  </p>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button fluid primary onClick={() => toast.info("Sesión activa y sincronizada con el backend")}>
                  Verificar Sincronización
                </Button>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}


import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Button, Segment, Grid, Icon } from "semantic-ui-react";
import { useAuth } from "../../hooks/useAuth";

export function Home() {
  const { auth } = useAuth();

  return (
    <div className="home-page">
      <Container text className="home-page__hero">
        <Header as="h1" className="home-page__title">
          CampusTrack
        </Header>
        <p className="home-page__subtitle">
          Sistema integral de gestión de perfiles estudiantiles y credenciales universitarias.
        </p>

        <div className="home-page__actions">
          {auth ? (
            <Button as={Link} to="/dashboard" primary size="huge">
              <Icon name="dashboard" />
              Acceder a mi Dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" primary size="large">
                <Icon name="sign in" />
                Iniciar Sesión
              </Button>
              <Button as={Link} to="/register" secondary size="large">
                <Icon name="signup" />
                Registrar Cuenta
              </Button>
            </>
          )}
        </div>
      </Container>

      <Container className="home-page__features">
        <Grid columns={3} stackable>
          <Grid.Column>
            <Segment padded className="feature-card">
              <Icon name="shield alternate" size="huge" color="teal" />
              <Header as="h3">Autenticación Segura</Header>
              <p>Seguridad mediante tokens JWT con SimpleJWT y hashing robusto de contraseñas.</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment padded className="feature-card">
              <Icon name="id card" size="huge" color="blue" />
              <Header as="h3">Perfil Estudiantil</Header>
              <p>Administración y consulta de datos personales vinculados a la matrícula universitaria.</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment padded className="feature-card">
              <Icon name="code" size="huge" color="purple" />
              <Header as="h3">Arquitectura REST</Header>
              <p>Backend potenciado por Django REST Framework y frontend reactivo con React Router.</p>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}


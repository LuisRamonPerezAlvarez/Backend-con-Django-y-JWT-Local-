import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Button, Icon } from "semantic-ui-react";

export function Error404() {
  return (
    <div className="error-404-page">
      <Container text textAlign="center">
        <Header as="h1" icon className="error-404-title">
          <Icon name="warning sign" color="yellow" />
          Error 404
          <Header.Subheader>
            La página que estás buscando no existe en CampusTrack.
          </Header.Subheader>
        </Header>
        <Button as={Link} to="/" primary size="large">
          <Icon name="home" />
          Volver a la Página Principal
        </Button>
      </Container>
    </div>
  );
}

export default Error404;


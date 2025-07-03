import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Profile } from '../types';

const ProfilesPage: React.FC = () => {
  const [profiles] = useLocalStorage<{ [key: string]: Profile }>('userProfiles', {});

  return (
    <Container fluid>
      <h1 className="h2 mb-4">Gerenciamento de Perfis</h1>
      <p style={{ color: 'var(--text-secondary)' }} className="mb-4">
        Visualize todos os perfis criados no sistema.
      </p>
      <Row>
        {Object.keys(profiles).length > 0 ? (
          Object.entries(profiles).map(([profileId, profile]) => (
            <Col key={profileId} md={6} lg={4} className="mb-4">
              <Card className="custom-card h-100">
                <Card.Header className="custom-card-header">
                  {profile.name}
                </Card.Header>
                <Card.Body>
                  <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                    {profile.items.length} imagem(ns) no perfil.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p style={{ color: 'var(--text-secondary)' }}>Nenhum perfil foi criado ainda. Volte ao Dashboard para criar um.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ProfilesPage;
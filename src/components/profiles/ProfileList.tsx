import React from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import type { Image, Profile } from '../../types';
import ProfileCard from './ProfileCard';

interface ProfileListProps {
  profiles: { [key: string]: Profile };
  onAddProfile: () => void;
  onDeleteProfile: (profileId: string) => void;
  onUpdateProfileName: (profileId: string, newName: string) => void;
  onImageClick: (image: Image) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, onAddProfile, onDeleteProfile, onUpdateProfileName, onImageClick }) => {
  return (
    <Col lg={4}>
      <Card className="custom-card h-100">
        <Card.Header className="custom-card-header d-flex justify-content-between align-items-center">
          <span>Perfis</span>
          <Button variant="success" size="sm" className="btn-custom" onClick={onAddProfile}><FiPlus /> Novo Perfil</Button>
        </Card.Header>
        <Card.Body>
          {Object.keys(profiles).map(profileId => (
            <ProfileCard
              key={profileId}
              profileId={profileId}
              profile={profiles[profileId]}
              onDelete={onDeleteProfile}
              onUpdateName={onUpdateProfileName}
              onImageClick={onImageClick}
            />
          ))}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProfileList;
import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useDroppable } from '@dnd-kit/core';
import type { Image, Profile } from '../../types';
import ImageThumbnail from '../gallery/ImageThumbnail';

interface ProfileCardProps {
  profileId: string;
  profile: Profile;
  onDelete: (profileId: string) => void;
  onUpdateName: (profileId: string, newName: string) => void;
  onImageClick: (image: Image) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profileId, profile, onDelete, onUpdateName, onImageClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOver, setNodeRef } = useDroppable({ id: profileId });

  useEffect(() => { setName(profile.name); }, [profile.name]);
  useEffect(() => { if (isEditing) { inputRef.current?.focus(); inputRef.current?.select(); } }, [isEditing]);

  const handleSave = () => { onUpdateName(profileId, name); setIsEditing(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSave(); else if (e.key === 'Escape') { setName(profile.name); setIsEditing(false); } };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        {isEditing ? (
          <Form.Control ref={inputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} size="sm" />
        ) : (
          <div className="d-flex align-items-center gap-2" style={{ flexGrow: 1 }}>
            <h6 className="profile-name mb-0 text-info">{profile.name}</h6>
            <Button variant="outline-light" size="sm" className="btn-custom border-0 p-1" onClick={() => setIsEditing(true)}><FiEdit2 /></Button>
          </div>
        )}
        <Button variant="outline-danger" size="sm" className="btn-custom border-0 ms-2 flex-shrink-0" onClick={() => onDelete(profileId)}><FiTrash2 /></Button>
      </div>
      <div ref={setNodeRef} className="drop-zone" style={{ backgroundColor: isOver ? 'rgba(59, 130, 246, 0.2)' : undefined }}>
        <div className="d-flex flex-wrap gap-2" style={{ minHeight: '110px' }}>
          {profile.items.map(image => <ImageThumbnail key={image.id} image={image} onImageClick={onImageClick} />)}
          {profile.items.length === 0 && (
            <span className="text-center w-100 align-self-center" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {isOver ? 'Solte a imagem aqui!' : 'Perfil vazio'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
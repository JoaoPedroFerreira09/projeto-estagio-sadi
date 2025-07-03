import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Image } from '../../types';

interface ImageThumbnailProps {
  image: Image;
  onImageClick: (image: Image) => void;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ image, onImageClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: image.id });
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform), cursor: 'grab', width: '100px', height: '100px',
    transition: 'opacity 0.2s', opacity: isDragging ? 0.5 : 1, touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={() => onImageClick(image)}>
      <img src={image.url} alt="face thumbnail" className="rounded" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
    </div>
  );
};

export default ImageThumbnail;
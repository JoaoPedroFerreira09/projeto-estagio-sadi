import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Card, Col } from 'react-bootstrap';
import { FiCpu, FiUploadCloud } from 'react-icons/fi';
import type { Image } from '../../types';
import ImageThumbnail from './ImageThumbnail';

interface ImageGalleryProps {
  images: Image[];
  isProcessing: boolean;
  onProcessClick: () => void;
  onFilesSelected: (files: File[]) => void;
  onImageClick: (image: Image) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isProcessing, onProcessClick, onFilesSelected, onImageClick }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => { onFilesSelected(acceptedFiles); }, [onFilesSelected]);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Col lg={8} className="mb-4 mb-lg-0">
      <Card className="custom-card h-100">
        <Card.Header className="custom-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>Galeria Principal</span>
          <div>
            <Button variant="outline-light" className="btn-custom me-2" onClick={open}><FiUploadCloud /> Upload</Button>
            <Button variant="primary" className="btn-custom" onClick={onProcessClick} disabled={isProcessing}><FiCpu /> {isProcessing ? "Processando..." : "Processar"}</Button>
          </div>
        </Card.Header>
        <Card.Body {...getRootProps()} className={`dropzone-area ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {isDragActive && <div className="dropzone-overlay"><p>Solte os arquivos aqui...</p></div>}
          <div className="image-grid">
            {images.map(image => <ImageThumbnail key={image.id} image={image} onImageClick={onImageClick} />)}
          </div>
          {images.length === 0 && !isDragActive && (
            <div className="d-flex align-items-center justify-content-center h-100 ">
              <p className=" text-center text-info">Arraste e solte as imagens aqui, ou clique em "Upload"</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ImageGallery;
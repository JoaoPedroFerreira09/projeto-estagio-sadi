import React, { useState } from 'react';
import { Container, Row, Col, Pagination, Modal } from 'react-bootstrap';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import ImageGallery from '../components/gallery/ImageGallery';
import ProfileList from '../components/profiles/ProfileList';
import ImageThumbnail from '../components/gallery/ImageThumbnail';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { processImagesAPI } from '../services/api';
import type { Image, Profile } from '../types';

const ITEMS_PER_PAGE = 16;

const DashboardPage: React.FC = () => {
  const [profiles, setProfiles] = useLocalStorage<{ [key: string]: Profile }>('userProfiles', {
    'aluno-1': { name: 'João Pedro', items: [] },
  });
  const [images, setImages] = useLocalStorage<Image[]>('galleryImages', []);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sensors = useSensors(useSensor(PointerSensor));


  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<Image | null>(null);

  const handleOpenModal = (image: Image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  const addProfile = () => {
    const profileId = `perfil-${Date.now()}`;
    const newProfileName = `Novo Perfil`;
    setProfiles(prev => ({ ...prev, [profileId]: { name: newProfileName, items: [] } }));
    toast.info(`Perfil "${newProfileName}" criado. Clique no ícone para editar.`);
  };

  const deleteProfile = (profileId: string) => {
    const profileToDelete = profiles[profileId];
    if (profileToDelete && profileToDelete.items.length > 0) {
      setImages(current => [...current, ...profileToDelete.items]);
    }
    const { [profileId]: _, ...remainingProfiles } = profiles;
    setProfiles(remainingProfiles);
    toast.error(`Perfil "${profileToDelete.name}" removido.`);
  };

  const updateProfileName = (profileId: string, newName: string) => {
    if (newName.trim() === '') {
      toast.error('O nome do perfil não pode ser vazio.');
      return;
    }
    setProfiles(prev => {
      const updatedProfiles = { ...prev };
      updatedProfiles[profileId].name = newName;
      return updatedProfiles;
    });
    toast.success('Nome do perfil atualizado!');
  };

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const paginatedImages = images.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const handlePageChange = (pageNumber: number) => { setCurrentPage(pageNumber); };
  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) { paginationItems.push(<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>{number}</Pagination.Item>); }
  
  const findContainerId = (id: string) => {
    if (images.some(image => image.id === id)) return 'gallery';
    for (const profileId in profiles) {
      if (profiles[profileId].items.some(item => item.id === id)) return profileId;
    }
    return null;
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
  
    if (!over) return;
  
    const sourceContainerId = findContainerId(active.id as string);
    const destinationId = over.id as string;
  
    // Verifica se o destino é um perfil válido
    const isDroppingOnProfile = !!profiles[destinationId];
  
    if (sourceContainerId === 'gallery' && isDroppingOnProfile) {
      const imageToMove = images.find(img => img.id === active.id);
      if (!imageToMove) return;

      // Adiciona a imagem ao perfil
      const updatedProfile = {
        ...profiles[destinationId],
        items: [...profiles[destinationId].items, imageToMove],
      };
      
      setProfiles(prev => ({
        ...prev,
        [destinationId]: updatedProfile,
      }));
      
      // Remove a imagem da galeria
      setImages(prev => prev.filter(img => img.id !== active.id));
      toast.success(`Imagem adicionada ao perfil "${updatedProfile.name}"!`);
    }
  };
  
  const onFilesSelected = (files: File[]) => {
    if (files) {
      const newImages: Image[] = files.map(file => ({ id: uuidv4(), url: URL.createObjectURL(file) }));
      setImages(current => [...current, ...newImages]);
      toast.success(`${files.length} imagem(ns) carregada(s).`);
    }
  };

  const handleProcessImages = async () => {
    if (images.length === 0 && Object.values(profiles).every(p => p.items.length === 0)) {
      toast.error("Faça o upload de alguma imagem antes de processar.");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await processImagesAPI();
      if (response.status === 200) toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getActiveImage = (): Image | null => {
    const allImages = [...images, ...Object.values(profiles).flatMap(p => p.items)];
    return allImages.find(img => img.id === activeId) || null;
  };

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Container fluid>
        <h1 className="h2 mb-4">Dashboard</h1>
        <Row>
          <ImageGallery
            images={paginatedImages}
            isProcessing={isProcessing}
            onProcessClick={handleProcessImages}
            onFilesSelected={onFilesSelected}
            onImageClick={handleOpenModal}
          />
          <ProfileList
            profiles={profiles}
            onAddProfile={addProfile}
            onDeleteProfile={deleteProfile}
            onUpdateProfileName={updateProfileName}
            onImageClick={handleOpenModal}
          />
        </Row>
        {totalPages > 1 && (
          <Row className="mt-4"><Col className="d-flex justify-content-center"><Pagination>{paginationItems}</Pagination></Col></Row>
        )}
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{modalImage ? 'Visualizar Imagem' : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-center">
          {modalImage && <img src={modalImage.url} alt="Imagem ampliada" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />}
        </Modal.Body>
      </Modal>

      <DragOverlay>
        {activeId ? <ImageThumbnail image={getActiveImage()!} onImageClick={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardPage;
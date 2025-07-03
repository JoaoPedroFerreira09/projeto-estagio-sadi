// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Pagination, Modal } from 'react-bootstrap';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
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
  const [profiles, setProfiles] = useLocalStorage<{ [key: string]: Profile }>('userProfiles', { 'aluno-1': { name: 'João Pedro', items: [] } });
  const [images, setImages] = useLocalStorage<Image[]>('galleryImages', []);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<Image | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  }));

  // Abre o modal de visualização com a imagem
  const handleOpenModal = (image: Image) => {
    setModalImage(image);
    setShowModal(true);
  };

  // Fecha o modal de visualização
  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  // Recebe os arquivos do upload e os adiciona à galeria.
  const onFilesSelected = (files: File[]) => {
    if (files) {
      const newImages: Image[] = files.map(file => ({ id: uuidv4(), url: URL.createObjectURL(file) }));
      setImages(current => [...current, ...newImages]);
      toast.success(`${files.length} imagem(ns) carregada(s).`);
    }
  };

  // Cria um novo perfil de usuário 
  const addProfile = () => {
    const profileId = `perfil-${Date.now()}`;
    const newProfileName = `Novo Perfil`;
    setProfiles(prev => ({ ...prev, [profileId]: { name: newProfileName, items: [] } }));
    toast.info(`Perfil "${newProfileName}" criado. Clique no ícone para editar.`);
  };

  // Deleta um perfil e devolve suas imagens para a galeria
  const deleteProfile = (profileId: string) => {
    const profileToDelete = profiles[profileId];
    if (profileToDelete?.items.length > 0) {
      setImages(current => [...current, ...profileToDelete.items]);
    }
    const { [profileId]: _, ...remainingProfiles } = profiles;
    setProfiles(remainingProfiles);
    toast.error(`Perfil "${profileToDelete.name}" removido.`);
  };

  // Atualiza o nome de um perfil 
  const updateProfileName = (profileId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('O nome do perfil não pode ser vazio.');
      return;
    }
    setProfiles(prev => ({
      ...prev,
      [profileId]: { ...prev[profileId], name: newName }
    }));
    toast.success('Nome do perfil atualizado!');
  };

  // chamada de API para processar as imagens
  const handleProcessImages = async () => {
    if (images.length === 0 && Object.values(profiles).every(p => p.items.length === 0)) {
      toast.error("Faça o upload de alguma imagem antes de processar.");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await processImagesAPI();
      if (response.status === 200) {
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Define qual imagem está sendo arrastada 
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };


  // logica para mover uma imagem par um pperfil.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const draggedImageId = active.id as string;
    const targetProfileId = over.id as string;
    const imageToMove = images.find(img => img.id === draggedImageId);

    if (imageToMove && profiles[targetProfileId]) {
      setProfiles(prev => ({
        ...prev,
        [targetProfileId]: {
          ...prev[targetProfileId],
          items: [...prev[targetProfileId].items, imageToMove]
        }
      }));
      setImages(prev => prev.filter(img => img.id !== draggedImageId));
      toast.success(`Imagem adicionada ao perfil "${profiles[targetProfileId].name}"!`);
    }
  };

  // Encontra os dados da imagem que está sendo arrastada para exibição na sobreposição
  const getActiveImage = (): Image | null => (
    [...images, ...Object.values(profiles).flatMap(p => p.items)].find(img => img.id === activeId) || null
  );

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const paginatedImages = images.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  // Altera a página atual da galeria de imagens.
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Container fluid>
        <h1 className="h2 mb-4">Dashboard</h1>
        <Row className="align-items-stretch">
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
        <Modal.Header closeButton closeVariant="white"><Modal.Title>{modalImage ? 'Visualizar Imagem' : ''}</Modal.Title></Modal.Header>
        <Modal.Body className="bg-dark text-center">
          {modalImage && <img src={modalImage.url} alt="Imagem ampliada" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />}
        </Modal.Body>
      </Modal>
      <DragOverlay>
        {activeId ? <ImageThumbnail image={getActiveImage()!} onImageClick={() => { }} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardPage;
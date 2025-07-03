import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ProfilesPage from './pages/ProfilesPage';

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-center" richColors theme="dark" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profiles" element={<ProfilesPage />} />
          <Route path="settings" element={<div>Página de Configurações</div>} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
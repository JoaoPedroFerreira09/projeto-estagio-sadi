import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-5">
      <h1 className="fw-bolder" style={{ fontSize: '2.5rem' }}>Organizador de Faces</h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Uma interface moderna para organizar e agrupar imagens.
      </p>
    </header>
  );
};

export default Header;
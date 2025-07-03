import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Organizador</h3>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <FiGrid className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profiles" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <FiUsers className="nav-icon" />
            <span>Perfis</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
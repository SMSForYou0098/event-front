import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FileText, Grid, Settings2, SlidersHorizontal, Users } from 'lucide-react';

const sidebarLinks = [
  { to: '', label: 'Dashboard', icon: <Grid size={18} /> },
  { to: 'posts', label: 'Posts', icon: <FileText size={18} /> },
  { to: 'categories', label: 'Categories', icon: <SlidersHorizontal size={18} /> },
  { to: 'users', label: 'Users', icon: <Users size={18} /> },
  { to: 'settings', label: 'Settings', icon: <Settings2 size={18} /> },
];

const Sidebar = () => {
  return (
    <aside
      style={{
        width: 240,
        background: '#f8f9fa',
        height: '100vh',
        padding: '24px 16px',
        borderRight: '1px solid #dee2e6',
      }}
      className="d-flex flex-column"
    >
      <h5 className="mb-4 text-primary fw-bold">Blog Admin</h5>
      <Nav className="flex-column gap-2">
        {sidebarLinks.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === ''} className={navLinkClass}>
            {icon} {label}
          </NavLink>
        ))}
      </Nav>
    </aside>
  );
};

// Custom class function to handle active styling
const navLinkClass = ({ isActive }) =>
  `nav-link d-flex align-items-center gap-2 ${isActive ? 'fw-semibold text-primary' : 'text-dark'}`;

export default Sidebar;
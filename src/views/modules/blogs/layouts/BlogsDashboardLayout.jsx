import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CustomNavbar from '../components/CustomNavbar';
import { ToastContainer } from 'react-toastify';

const BlogsDashboardLayout = () => (
  <div>
    <CustomNavbar />
    <div style={{ display: 'flex' }}>
      <ToastContainer />
      <Sidebar />
      <main style={{ flex: 1, padding: 32, background: '#fff', minHeight: '100vh' }}>
        <Outlet /> {/* <-- This renders nested route elements */}
      </main>
    </div>
  </div>
);

export default BlogsDashboardLayout;

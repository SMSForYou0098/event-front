import React from 'react';
import CustomNavbar from '../components/CustomNavbar';

const BlogsLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#fff' }}>
    {/* <CustomNavbar /> */}
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      {children}
    </main>
  </div>
);

export default BlogsLayout;
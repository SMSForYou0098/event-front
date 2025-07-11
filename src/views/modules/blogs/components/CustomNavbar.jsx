import React from 'react';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import { useMyContext } from '../../../../Context/MyContextProvider';

const CustomNavbar = () => {
  const { systemSetting, isMobile } = useMyContext();

  const logoSrc = isMobile ? systemSetting?.mo_logo : systemSetting?.auth_logo;

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
          {logoSrc && (
            <Image
              src={logoSrc}
              alt="Logo"
              height={40}
              style={{ objectFit: 'contain' }}
            />
          )}
          <span className="fw-semibold fs-4">Blogs</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="/" className="fw-medium">Home</Nav.Link>
            <Nav.Link href="/about" className="fw-medium">About</Nav.Link>
            <Nav.Link href="/contact" className="fw-medium">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

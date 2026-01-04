import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const DynamicNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  // Effect to handle scroll state for subtle animations
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`nav-wrapper fixed-top ${scrolled ? 'nav-scrolled' : ''}`}>
      <Navbar expand="lg" className="dynamic-island mt-3">
        <Container fluid className="px-4">
          <Navbar.Brand href="#home" className="text-white fw-bold">
            FLUX<span className="text-primary-gradient">WEALTH</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-lg-4 text-center">
              <Nav.Link href="#home" className="nav-item-custom">Home</Nav.Link>
              <Nav.Link href="#features" className="nav-item-custom">Features</Nav.Link>
              <Nav.Link href="#plans" className="nav-item-custom">Plans</Nav.Link>
              <Nav.Link href="#team" className="nav-item-custom">Team</Nav.Link>
              <Nav.Link href="#faq" className="nav-item-custom">FAQ</Nav.Link>
            </Nav>
            <div className="d-grid d-lg-block mt-3 mt-lg-0">
              <Button className="btn-gradient rounded-pill px-4" href='/signup'>Sign Up</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default DynamicNavbar;
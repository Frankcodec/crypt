import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DynamicNavbar from './Nav';

const Hero: React.FC = () => {
  const stats = [
    { val: "0.060", label: "Market Cap" },
    { val: "1.05M", label: "Total Supply" },
    { val: "7.08M", label: "Holders" },
    { val: "1.02B", label: "Total Volume" }
  ];

  return (
    <section id='home' className="hero-bg" style={{ 
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingTop: '100px',
      paddingBottom: '20px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: 'clamp(30px, 5vh, 60px)'
      }}>
        <Container fluid >
          <DynamicNavbar />
          <Row className="align-items-center g-0 gy-5 gy-lg-0">
            <Col lg={5} className="d-flex flex-column justify-content-center ps-lg-5 px-lg-0 ">
              <h5 className="text-gradient fw-bold mb-3" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', letterSpacing: '2px' }}>
                CRYPTO TRADING PLATFORM
              </h5>
              <h1 className="display-2 fw-bold mb-4" style={{ 
                lineHeight: '1.2', 
                fontSize: 'clamp(1.8rem, 6vw, 3.5rem)'
              }}>
                Next Generation Crypto Trading
              </h1>
              <p className="text-secondary mb-5" style={{ 
                lineHeight: '1.6' 
              }}>
                A decentralized platform for the future of finance. Trade securely, efficiently, and with confidence.
              </p>
              <div className="d-flex gap-2 mb-5">
                <Button href="/login" className="btn-gradient px-6 py-2" style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: '600',
                  border: 'none',
                  letterSpacing: '0.5px'
                }}>
                  Login
                </Button>
                
              </div>
            </Col>
            <Col lg={7} className="d-flex justify-content-end pe-0" style={{ height: '100%' }}>
              <img 
                src="/platform1.png" 
                alt="Mockup" 
                className="img-fluid" 
                style={{ 
                  maxHeight: '750px', 
                  objectFit: 'contain', 
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  width: '100%'
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* <Container>
        <Row className="g-4">
          {stats.map((s, i) => (
            <Col md={3} sm={6} xs={12} key={i}>
              <div className="stat-card text-center p-5" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}>
                <h3 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>{s.val}</h3>
                <span className="text-secondary" style={{ fontSize: '0.95rem' }}>{s.label}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Container> */}
    </section>
  );
};

export default Hero;
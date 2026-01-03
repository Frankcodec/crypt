import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const TeamSection: React.FC = () => {
  const members = [
    { name: "John Doe", role: "CEO & Founder" },
    { name: "Jane Smith", role: "Blockchain Dev" },
    { name: "Mike Ross", role: "UI/UX Designer" },
    { name: "Sarah Connor", role: "Marketing" }
  ];

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold">Executive Team</h2>
        </div>
        <Row className="mb-5 text-center">
          {members.map((m, i) => (
            <Col md={3} key={i} className="mb-4">
              <div className="team-card">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt={m.name} className="rounded-circle border-glow mb-3" width="120" />
                <h5>{m.name}</h5>
                <p className="text-secondary">{m.role}</p>
              </div>
            </Col>
          ))}
        </Row>

        <div className="newsletter-box p-5 text-center rounded-4 mt-5">
          <h3>Don't Miss Out on Updates</h3>
          <p className="text-secondary">Join 50,000+ traders receiving our weekly insights.</p>
          <div className="d-flex justify-content-center mt-4">
            <Form.Control type="email" placeholder="Enter your email" className="bg-dark text-white border-secondary w-50 me-2" />
            <Button className="btn-gradient">Subscribe</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TeamSection;
import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';

const Faq: React.FC = () => {
  const questions = [
    {
      q: "What are the objectives of this Token?",
      a: "To provide a decentralized and secure means of value transfer while enabling innovative financial solutions."
    },
    {
      q: "What is the best features and services we deliver?",
      a: "Our platform provides real-time analytics, military-grade security protocols, and seamless cross-chain integration for all decentralized finance needs."
    },
    {
      q: "Why this ICO important to me?",
      a: "Participating in this ICO grants early access to governance rights and reduced platform fees, positioning you at the forefront of the ecosystem's growth."
    },
    {
      q: "How may I take part in and purchase this Token?",
      a: "You can purchase tokens directly through our secure dashboard by connecting your Web3 wallet and swapping supported stablecoins or native assets."
    }
  ];

  return (
    <section id='faq' className="faq-section py-5">
      <Container>
        <div className="text-center mb-5">
          <h6 className="text-purple-pink fw-bold">Token FAQ</h6>
          <h2 className="display-5 fw-bold mb-3">Frequently Questions</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
            Questions asked the most about our token and platform.
          </p>
        </div>

        <Row className="align-items-center mt-5">
          {/* Left Side: Isometric Illustration */}
          <Col lg={6} className="mb-5 mb-lg-0 text-center">
            <div className="faq-illustration-wrapper p-5">
              {/* Replace with your actual SVG or PNG asset */}
              <img 
                src="/illu.png" 
                alt="Support Illustration" 
                className="img img-fluid"
              />
            </div>
          </Col>

          {/* Right Side: Minimalist Accordion */}
          <Col lg={6}>
            <Accordion defaultActiveKey="0" flush className="faq-accordion-minimal">
              {questions.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={index} className="bg-transparent border-bottom border-secondary py-2">
                  <Accordion.Header className="bg-transparent shadow-none">
                    <span className="text-white fs-5 fw-semibold">{item.q}</span>
                  </Accordion.Header>
                  <Accordion.Body className="text-secondary opacity-75">
                    {item.a}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Faq;
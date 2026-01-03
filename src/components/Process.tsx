import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Process: React.FC = () => {
  const steps = [
    { id: "01", title: "Join Project", desc: "Sign up and verify your wallet to begin." },
    { id: "02", title: "Buy Token", desc: "Exchange ETH or USDT for our native tokens." },
    { id: "03", title: "Submit Token", desc: "Stake your tokens to the liquidity pool." },
    { id: "04", title: "Get Reward", desc: "Earn passive income and governance rights." }
  ];

  return (
    <section className="py-5 bg-dark-custom overflow-hidden">
      <Container>
        <div className="text-center mb-5">
          <h5 className="text-purple-pink fw-bold">PROCESS</h5>
          <h2 className="display-5 fw-bold text-white">Our Contribution Cycle</h2>
        </div>

        <Row className="g-4 process-container">
          {steps.map((step, index) => (
            <Col lg={3} md={6} key={step.id} className="text-center position-relative mb-5">
              {/* Connector line for desktop (hidden on last item) */}
              {index < steps.length - 1 && <div className="process-line d-none d-lg-block"></div>}
              
              <div className="process-circle mx-auto mb-4">
                <span className="fs-3 fw-bold">{step.id}</span>
                <div className="circle-glow"></div>
              </div>
              
              <h4 className="text-white mb-3">{step.title}</h4>
              <p className="text-secondary opacity-75 px-3">{step.desc}</p>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Process;
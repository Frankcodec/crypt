import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const FeaturesGrid: React.FC = () => {
  const mainFeatures = [
    { icon: <Icon.ShieldLock size={30} />, title: "Secure Storage", desc: "Military grade encryption for all your assets." },
    { icon: <Icon.LightningCharge size={30} />, title: "Fast Trading", desc: "Execute orders in milliseconds with low latency." },
    { icon: <Icon.Globe size={30} />, title: "Global Access", desc: "Available in over 150 countries worldwide." },
    { icon: <Icon.Cpu size={30} />, title: "AI Insights", desc: "Predictive analytics for smarter market moves." },
    { icon: <Icon.Wallet2 size={30} />, title: "Multi-Wallet", desc: "Support for Metamask, Trust, and Hardware wallets." },
    { icon: <Icon.Headset size={30} />, title: "24/7 Support", desc: "Our experts are always here to help you." }
  ];

  return (
    <section id='features' className="py-5 bg-dark-custom">
      <Container>
        {/* Why Choose Us Grid */}
        <div className="text-center mb-5">
          <h5 className="text-gradient">BENEFITS</h5>
          <h2 className="display-5 fw-bold">Why Choose Our Platform</h2>
        </div>
        
        <Row className="g-4 mb-5">
          {mainFeatures.map((f, i) => (
            <Col lg={4} md={6} key={i}>
              <div className="feature-card h-100 p-4">
                <div className="icon-wrapper mb-3">{f.icon}</div>
                <h4>{f.title}</h4>
                <p className="text-secondary">{f.desc}</p>
              </div>
            </Col>
          ))}
        </Row>

        
      </Container>
    </section>
  );
};

export default FeaturesGrid;
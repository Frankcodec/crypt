import { Container, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';


const Footer = () => (
  <footer className="py-5 border-top border-secondary mt-5">
    <Container>
      <Row>
        <Col md={4}>
          <h3 className="text-gradient">FLUX WEALTH</h3>
          <p className="text-secondary">Revolutionizing the way you trade assets on the blockchain.</p>
        </Col>
        <Col md={2}>
          <h6>Quick Links</h6>
          <ul className="list-unstyled text-secondary">
            <li>About Us</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
        </Col>
        <Col md={6} className="text-md-end">
          <h6>Follow Us</h6>
          <div className="d-flex justify-content-md-end gap-3 h4">
            <Icon.Twitter /> <Icon.Discord /> <Icon.Telegram />
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
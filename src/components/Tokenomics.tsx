import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);

const Tokenomics = () => {
  const data = {
    labels: ['Public Sale', 'Reserve', 'Team', 'Marketing'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: ['#7b2ff7', '#2196f3', '#00d2ff', '#9b4dff'],
      borderWidth: 0,
    }],
  };

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-5">Token Distribution</h2>
        <Row className="align-items-center">
          <Col md={6}>
            <div style={{ maxWidth: '400px', margin: 'auto' }}>
              <Pie data={data} />
            </div>
          </Col>
          <Col md={6}>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex justify-content-between border-bottom pb-2">
                <span>Public Sale</span> <span className="fw-bold">40%</span>
              </li>
              <li className="mb-3 d-flex justify-content-between border-bottom pb-2">
                <span>Reserve Fund</span> <span className="fw-bold">25%</span>
              </li>
              {/* Add more items as per image */}
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Tokenomics;
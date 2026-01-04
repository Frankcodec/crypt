import React from 'react';

const TradingPlatformSection: React.FC = () => {
  return (
    <section className="trading-section py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-accent fw-semibold mb-2">Try our Platform</p>
          <h2 className="text-white fw-bold">Our Trading Platform</h2>
          <p className="text-muted mx-auto mt-3" style={{ maxWidth: 620 }}>
            Experience a seamless trading journey with our intuitive and
            feature-rich platform designed for traders of all levels.
          </p>
        </div>

        {/* Content */}
        <div className="row align-items-center g-5">
          {/* Left card */}
          <div className="col-lg-5">
            <div className="feature-card p-4 p-lg-5">
              <h3 className="text-white fw-bold mb-3">Powerful platform.</h3>

              <p className="text-muted mb-4">
                We are dedicated to providing professional service with the
                highest degree of honesty and integrity, and strive to add
                value to our tax and consulting services.
              </p>

              <ul className="list-unstyled mb-4">
                {[
                  'Competent Professionals',
                  'Affordable Prices',
                  'High Successful Recovery',
                  'Creative Layout',
                ].map((item) => (
                  <li key={item} className="d-flex align-items-center mb-3">
                    <span className="check-icon me-3">✓</span>
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="btn btn-gradient px-4 py-2">
                Read More
              </button>
            </div>
          </div>

          {/* Right image */}
          <div className="col-lg-7 text-center">
            <img
              src='/platform.png'
              alt="Trading dashboard"
              className="img-fluid trading-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingPlatformSection;

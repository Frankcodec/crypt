import React from 'react';

const Decentralized: React.FC = () => {
  return (
    <section className="trading-section py-5">
      <div className="container">
        

        {/* Content */}
        <div className="row align-items-center g-5">
          

          {/* Right image */}
          <div className="col-lg-7 text-center">
            <img
              src='/image.png'
              alt="Trading dashboard"
              className="img-fluid trading-image"
            />
          </div>


          {/* Left card */}
          <div className="col-lg-5">
            <div className="">
              <h5 className='fw-bold pb-4' style={{color: 'blueviolet'}}>crypto platform</h5>
              <h3 className="text-white fw-bold mb-3">Connect blockchain to the real world</h3>

              <p className=" mb-4">
                We are dedicated to providing professional service with the
                highest degree of honesty and integrity, and strive to add
                value to our tax and consulting services.
              </p> <br />

              <p className=" mb-4">
                We are dedicated to providing professional service with the
                highest degree of honesty and integrity, and strive to add
                value to our tax and consulting services.
              </p>

              

              <button className="btn btn-gradient px-4 py-2">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Decentralized;

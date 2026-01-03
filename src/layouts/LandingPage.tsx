import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Hero from '../components/Hero';
import FeaturesGrid from '../components/FeaturesGrid';
// import Process from '../components/Process';
// import Tokenomics from '../components/Tokenomics';
// import Roadmap from '../components/Roadmap';
import TeamSection from '../components/TeamSection';
import Faq from '../components/Faq';
import Footer from '../components/Footer';
import TradingPlatformSection from '../components/TradingPlatformSection';
import Decentralized from '../components/Decentralized';
import Decentralized2 from '../components/Decentralized2';
import PricingSection from '../components/PricingSection';
import ContactUs from '../components/ContactUs';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-dark-custom text-white">
      <Hero />
      <Decentralized />
      <FeaturesGrid />
      <TradingPlatformSection />
      <PricingSection />
      <Decentralized2 />
      
      <TeamSection />
      <Faq />
      <ContactUs />
      {/* Footer Simple */}
      <Footer />
    </div>
  );
};

export default LandingPage;
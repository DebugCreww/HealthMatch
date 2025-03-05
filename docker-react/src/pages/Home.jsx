import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
// Verifica che questi percorsi siano corretti
import HeroSection from '../components/home/HeroSection';
import SpecialtiesSection from '../components/home/SpecialtiesSection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import FeaturedDoctorsSection from '../components/home/FeaturedDoctorsSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import MobileAppSection from '../components/home/MobileAppSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <SpecialtiesSection />
        <WhyChooseUsSection />
        <FeaturedDoctorsSection />
        <HowItWorksSection />
        <MobileAppSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
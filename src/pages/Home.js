import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import { initScrollAnimations } from '../utils/animations';

const Home = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    // Initialize scroll animations
    const observer = initScrollAnimations();

    // Custom observer for section visibility
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('.section-animation');
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      
      <div 
        id="about" 
        className={`section-animation ${visibleSections.has('about') ? 'visible' : ''}`}
      >
        <AboutSection />
      </div>
      
      <div 
        id="services" 
        className={`section-animation ${visibleSections.has('services') ? 'visible' : ''}`}
      >
        <ServicesSection />
      </div>
    </div>
  );
};

export default Home;
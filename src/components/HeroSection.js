import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-center justify-center text-center overflow-hidden mt-16" style={{ height: '65vh', minHeight: '500px' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero.png)' }}
      ></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 mx-auto mt-20">
        <div className="flex flex-row gap-4 justify-center items-center animate-pulse-slow">
          <button
            onClick={() => scrollToSection('services')}
            className="bg-beige text-white px-5 py-2 rounded-lg font-medium text-sm transition-all duration-500 hover:bg-opacity-90 hover:scale-105 hover:shadow-xl whitespace-nowrap"
          >
            {t('ourServices')}
          </button>
          
          <button
            onClick={() => scrollToSection('about')}
            className="bg-white text-beige px-5 py-2 rounded-lg font-medium text-sm transition-all duration-500 hover:bg-opacity-90 hover:scale-105 hover:shadow-xl border-2 border-beige whitespace-nowrap"
          >
            {t('aboutUs')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
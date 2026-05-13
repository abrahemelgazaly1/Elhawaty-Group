import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t, i18n } = useTranslation();
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const texts = i18n.language === 'ar' 
      ? ['الحوتي جروب', 'متجرك الشامل', 'الحوتي جروب']
      : ['ELHAWTY GROUP', 'ELHAWTY GROUP', 'ELHAWTY GROUP'];

    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, i18n.language]);

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <img 
              src="/logo.jpg" 
              alt="ELHAWTY GROUP" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg object-cover"
            />
          </div>
          
          <h2 className="text-4xl font-bold text-beige mb-6 text-center">
            {t('aboutUs')}
          </h2>
          
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-beige min-h-[50px] flex items-center justify-center">
              <span>
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </h3>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
            {t('aboutDescription')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-beige mb-2">10+</div>
              <p className="text-gray-600">{t('yearsExperience')}</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-beige mb-2">10K+</div>
              <p className="text-gray-600">{t('happyClients')}</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-beige mb-2">24/7</div>
              <p className="text-gray-600">{t('customerService')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

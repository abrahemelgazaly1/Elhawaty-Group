import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TestimonialsSlider = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      nameAr: 'أحمد محمد',
      nameEn: 'Ahmed Mohamed',
      messageAr: 'خدمة ممتازة وسريعة، تعامل راقي جداً والأسعار مناسبة. أنصح الجميع بالتعامل مع الحوتي جروب',
      messageEn: 'Excellent and fast service, very professional dealing and reasonable prices. I highly recommend ELHAWTY GROUP to everyone',
      rating: 5
    },
    {
      id: 2,
      nameAr: 'فاطمة علي',
      nameEn: 'Fatma Ali',
      messageAr: 'اشتريت موبايل من عندهم والجودة ممتازة، والضمان كمان موجود. شكراً للحوتي جروب',
      messageEn: 'I bought a phone from them and the quality is excellent, warranty is also available. Thanks to ELHAWTY GROUP',
      rating: 5
    },
    {
      id: 3,
      nameAr: 'محمود حسن',
      nameEn: 'Mahmoud Hassan',
      messageAr: 'أفضل مكان للتحويلات البنكية والإلكترونية، سريعين جداً ومضمونين 100%',
      messageEn: 'The best place for banking and electronic transfers, very fast and 100% guaranteed',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  console.log('Current Language:', i18n.language);
  console.log('Is Arabic:', isArabic);
  console.log('Current Slide:', currentSlide);
  console.log('Testimonial:', testimonials[currentSlide]);

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-beige mb-12 text-center">
          {t('customerReviews')}
          <span className="text-sm text-gray-500 block mt-2">
            (Language: {i18n.language} - {isArabic ? 'Arabic' : 'English'})
          </span>
        </h2>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Slider Container */}
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(${isArabic ? currentSlide * 100 : -currentSlide * 100}%)`,
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0"
                  style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                >
                  <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg min-h-[350px] flex flex-col justify-center mx-4">
                    {/* Stars */}
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, index) => (
                        <span key={index} className="text-yellow-400 text-2xl">⭐</span>
                      ))}
                    </div>
                    
                    {/* Message */}
                    <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center mb-6 px-4">
                      "{isArabic ? testimonial.messageAr : testimonial.messageEn}"
                    </p>
                    
                    {/* Name */}
                    <p className="text-beige font-bold text-xl text-center">
                      {isArabic ? testimonial.nameAr : testimonial.nameEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:-ml-12 w-12 h-12 bg-beige text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg hover:scale-110"
            aria-label="Previous"
          >
            <FiChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:-mr-12 w-12 h-12 bg-beige text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg hover:scale-110"
            aria-label="Next"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-beige w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSlider;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ComplaintForm from './ComplaintForm';
import TestimonialsSlider from './TestimonialsSlider';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white mb-16">
      <div className="container mx-auto px-4">
        {/* Complaint Form */}
        <ComplaintForm />
        
        {/* Testimonials Slider */}
        <TestimonialsSlider />
        
        {/* Map Section */}
        <div className="py-12">
          <div className="bg-gray-50 rounded-3xl p-4 shadow-xl overflow-hidden max-w-6xl mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d213.824542423103!2d31.16364130319193!3d30.965104807144765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sar!2seg!4v1778579994385!5m2!1sar!2seg"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '20px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع ELHAWTY GROUP"
            ></iframe>
          </div>
        </div>

        {/* Contact Info - Below Map */}
        <div className="py-8 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/201010600865" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">واتساب</p>
                  <p className="text-beige font-semibold text-base" dir="ltr">01010600865</p>
                </div>
              </a>
              
              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-white text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">العنوان</p>
                  <p className="text-beige font-semibold text-sm leading-relaxed">
                    مصر - الغربية - المحلة الكبرى<br/>
                    الشون بجوار بنزينة التعاون
                  </p>
                </div>
              </div>
              
              {/* Working Hours */}
              <div className="flex items-start gap-4 p-4 rounded-2xl">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-white text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">مواعيد العمل</p>
                  <p className="text-beige font-semibold text-base">24/7</p>
                  <p className="text-xs text-gray-500 mt-1">طوال أيام الأسبوع</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 py-6">
          <p className="text-center text-beige text-sm">
            © 2024 ELHAWTY GROUP. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
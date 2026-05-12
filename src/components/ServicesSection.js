import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const categories = [
    {
      key: 'newPhones',
      image: '/newphones.png',
      path: '/category/new-phones',
      delay: '0s'
    },
    {
      key: 'usedPhones',
      image: '/usedphone.png',
      path: '/category/used-phones',
      delay: '0.1s'
    },
    {
      key: 'accessories',
      image: '/accsoris.png',
      path: '/category/accessories',
      delay: '0.2s'
    },
    {
      key: 'laptops',
      image: '/laptop.png',
      path: '/category/laptops',
      delay: '0.3s'
    },
    {
      key: 'moneyMachine',
      image: '/moneymachine.png',
      path: '/category/money-machine',
      delay: '0.4s'
    },
    {
      key: 'transferMachine',
      image: '/machinetransform.png',
      path: '/category/transfer-machine',
      delay: '0.5s'
    },
    {
      key: 'bankingTransactions',
      image: '/bankinktransform.png',
      path: '/banking-transactions',
      delay: '0.6s'
    },
    {
      key: 'electronicTransfer',
      image: '/eletronictransform.png',
      path: '/electronic-transfer',
      delay: '0.7s'
    },
    {
      key: 'smallPhones',
      image: '/smallphones.png',
      path: '/category/small-phones',
      delay: '0.8s'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-beige bg-opacity-10 rounded-full -translate-x-36 -translate-y-36 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-dark-beige bg-opacity-10 rounded-full translate-x-48 translate-y-48 animate-pulse-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
            {t('ourServices')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-beige to-dark-beige mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات المتميزة لتلبية جميع احتياجاتك التقنية والمالية
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.key}
              className="group cursor-pointer"
              onClick={() => navigate(category.path)}
              style={{ animationDelay: category.delay }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-32 md:h-40 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={t(category.key)}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 md:p-4 text-center">
                  <h3 className="text-sm md:text-lg font-bold text-gray-800 group-hover:text-beige transition-colors duration-300">
                    {t(category.key)}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="inline-flex items-center space-x-4 rtl:space-x-reverse bg-white rounded-2xl shadow-xl p-6 border border-beige border-opacity-20">
            <div className="w-12 h-12 bg-gradient-to-br from-beige to-dark-beige rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">24/7</span>
            </div>
            <div className="text-right rtl:text-left">
              <h4 className="font-bold text-text-dark text-lg">خدمة العملاء</h4>
              <p className="text-gray-600">نحن هنا لخدمتك على مدار الساعة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
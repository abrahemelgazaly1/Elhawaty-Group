import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { key: 'newPhones', path: '/category/new-phones', icon: '📱' },
    { key: 'usedPhones', path: '/category/used-phones', icon: '📲' },
    { key: 'accessories', path: '/category/accessories', icon: '🎧' },
    { key: 'laptops', path: '/category/laptops', icon: '💻' },
    { key: 'moneyMachine', path: '/category/money-machine', icon: '💰' },
    { key: 'transferMachine', path: '/category/transfer-machine', icon: '💳' },
    { key: 'bankingTransactions', path: '/banking-transactions', icon: '🏦' },
    { key: 'electronicTransfer', path: '/electronic-transfer', icon: '📧' },
    { key: 'smallPhones', path: '/category/small-phones', icon: '☎️' }
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'navbar-scrolled' : 'bg-white shadow-lg'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Icon - Left */}
            <div className={`flex items-center space-x-2 rtl:space-x-reverse transition-colors duration-300 ${
              isScrolled ? 'text-white' : 'text-beige'
            }`}>
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg transition-all duration-300">
                <img 
                  src="/logo.jpg" 
                  alt="ELHAWTY GROUP" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Brand Name - Center */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 transition-colors duration-300 ${
              isScrolled ? 'text-white' : 'text-beige'
            }`}>
              <h1 className="text-base font-bold whitespace-nowrap">ELHAWTY GROUP</h1>
            </div>

            {/* Menu Button - Right */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-white hover:bg-white hover:bg-opacity-20' 
                  : 'text-beige hover:bg-beige hover:bg-opacity-10'
              }`}
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-60 transition-all duration-300 ${
        isSidebarOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        
        {/* Sidebar Content */}
        <div className={`absolute top-0 right-0 rtl:left-0 rtl:right-auto h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0 rtl:-translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-beige">{t('services')}</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-beige transition-colors duration-300"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* Categories Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => (
                <a
                  key={category.key}
                  href={category.path}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-beige hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {t(category.key)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
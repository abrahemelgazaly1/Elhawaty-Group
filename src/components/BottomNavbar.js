import { useTranslation } from 'react-i18next';
import { FiShoppingCart, FiList, FiGlobe, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BottomNavbar = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // Update wishlist count
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };

    updateWishlistCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateWishlistCount);
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    
    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-beige to-dark-beige shadow-2xl z-50 border-t-4 border-white border-opacity-20">
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => navigate('/cart')}
          className="flex flex-col items-center space-y-1 text-white hover:text-gray-200 transition-all duration-300 hover:scale-110 transform group"
        >
          <FiShoppingCart size={16} className="group-hover:animate-bounce" />
          <span className="text-xs font-medium">{i18n.language === 'ar' ? 'السلة' : 'Cart'}</span>
        </button>

        <button
          onClick={() => navigate('/wishlist')}
          className="flex flex-col items-center space-y-1 text-white hover:text-gray-200 transition-all duration-300 hover:scale-110 transform group"
        >
          <div className="relative">
            <FiHeart size={16} className="group-hover:animate-bounce" />
            {wishlistCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{wishlistCount}</span>
              </div>
            )}
          </div>
          <span className="text-xs font-medium">{i18n.language === 'ar' ? 'المفضلة' : 'Wishlist'}</span>
        </button>
        
        <button
          onClick={() => navigate('/requests')}
          className="flex flex-col items-center space-y-1 text-white hover:text-gray-200 transition-all duration-300 hover:scale-110 transform group"
        >
          <FiList size={16} className="group-hover:animate-bounce" />
          <span className="text-xs font-medium">{i18n.language === 'ar' ? 'طلباتي' : 'Orders'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex flex-col items-center space-y-1 text-white hover:text-gray-200 transition-all duration-300 hover:scale-110 transform group"
        >
          <FiGlobe size={16} className="group-hover:animate-bounce" />
          <span className="text-xs font-medium">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavbar;
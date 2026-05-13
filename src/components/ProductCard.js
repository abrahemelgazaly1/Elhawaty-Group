import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import QuickOrderModal from './QuickOrderModal';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  const handleQuickOrder = (e) => {
    e.stopPropagation();
    setShowQuickOrder(true);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productId = product._id || product.product_id || product.id;
    const existingItem = wishlist.find(item => (item._id || item.product_id || item.id) === productId);
    
    if (!existingItem) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      Swal.fire({
        icon: 'success',
        title: t('addedToWishlist'),
        text: t('productAddedToWishlist'),
        confirmButtonColor: '#C8A97E',
        timer: 2000
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: t('alreadyInWishlist'),
        text: t('productAlreadyInWishlist'),
        confirmButtonColor: '#C8A97E'
      });
    }
  };

  // Clean product name - remove "مستعمل" or "جديد" from name
  const cleanName = product.name.replace(/\s*(مستعمل|جديد)\s*/g, '').trim();

  // Get first image from product images array
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : null;

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-gray-100 transition-all duration-300 hover:border-beige hover:shadow-xl group"
        onClick={() => navigate(`/product/${product._id || product.product_id || product.id}`)}
        style={{ minHeight: '300px' }}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden" style={{ height: '180px', backgroundColor: '#f5f5f5' }}>
          {productImage ? (
            <img 
              src={productImage} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full ${productImage ? 'hidden' : 'flex'} items-center justify-center`} style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
            <div className="text-center p-4">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #C8A97E 0%, #A67C52 100%)' }}>
                <span className="text-white text-4xl">📱</span>
              </div>
              <p className="text-sm font-bold px-2 line-clamp-2" style={{ color: '#C8A97E' }}>{cleanName}</p>
            </div>
          </div>
          
          {/* Hover Actions - Top Right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleQuickOrder}
              className="p-2.5 rounded-full hover:scale-110 shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#C8A97E', color: 'white' }}
              title={t('quickOrder')}
            >
              <FiShoppingCart size={18} />
            </button>
            <button
              onClick={handleAddToWishlist}
              className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
              title={t('addToWishlist')}
            >
              <FiHeart size={18} />
            </button>
          </div>

          {/* Type Badge */}
          {product.subcategory && (
            <div className="absolute top-3 left-3 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #C8A97E 0%, #A67C52 100%)' }}>
              {product.subcategory}
            </div>
          )}

          {/* Sold Out Badge */}
          {product.sold_out && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">{t('soldOut')}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-bold mb-2 text-sm line-clamp-2" style={{ color: '#1F1F1F', minHeight: '2.5rem' }}>
            {cleanName}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold" style={{ color: '#C8A97E' }}>
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 font-medium">{t('egp')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Order Modal */}
      {showQuickOrder && (
        <QuickOrderModal 
          product={product} 
          onClose={() => setShowQuickOrder(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;
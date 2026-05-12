import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

const QuickOrderModal = ({ product, onClose }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [showBattery, setShowBattery] = useState(false);

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    onClose();
    
    Swal.fire({
      icon: 'success',
      title: 'تم الإضافة!',
      text: 'تم إضافة المنتج إلى السلة بنجاح',
      confirmButtonColor: '#C8A97E',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const isUsed = product.category === 'used-phones';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <FiX size={24} className="text-gray-600" />
        </button>

        <div className="p-6">
          {/* Product Image */}
          <div className="mb-6">
            {productImage ? (
              <img 
                src={productImage} 
                alt={product.name}
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>

          {/* Product Type */}
          {product.subcategory && (
            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#C8A97E', color: 'white' }}>
              {product.subcategory}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold" style={{ color: '#C8A97E' }}>
              {product.price.toLocaleString()}
            </span>
            <span className="text-lg text-gray-500 font-medium">جنيه</span>
          </div>

          {/* Description Accordion */}
          <div className="mb-4">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="w-full text-right p-4 bg-gray-50 rounded-xl font-semibold text-gray-800 hover:bg-gray-100 transition-colors flex justify-between items-center"
            >
              <span>الوصف</span>
              <span className={`transform transition-transform ${showDescription ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showDescription && (
              <div className="p-4 bg-white border-2 border-gray-100 rounded-b-xl mt-1">
                <p className="text-gray-700 leading-relaxed">{product.description || 'لا يوجد وصف متاح'}</p>
              </div>
            )}
          </div>

          {/* Battery Info (for used phones only) */}
          {isUsed && (
            <div className="mb-6">
              <button
                onClick={() => setShowBattery(!showBattery)}
                className="w-full text-right p-4 bg-gray-50 rounded-xl font-semibold text-gray-800 hover:bg-gray-100 transition-colors flex justify-between items-center"
              >
                <span>Battery</span>
                <span className={`transform transition-transform ${showBattery ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {showBattery && (
                <div className="p-4 bg-white border-2 border-gray-100 rounded-b-xl mt-1">
                  <p className="text-gray-700 leading-relaxed">{product.battery || 'معلومات البطارية غير متوفرة'}</p>
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #C8A97E 0%, #A67C52 100%)' }}
          >
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickOrderModal;

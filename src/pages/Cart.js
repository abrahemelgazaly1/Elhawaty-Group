import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTruck } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage
    const loadCart = () => {
      const savedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(savedItems);
      setIsInitialized(true);
    };
    
    loadCart();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', loadCart);
    window.addEventListener('storage', loadCart);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  useEffect(() => {
    // Save cart items to localStorage whenever cartItems changes (but not on initial load)
    if (isInitialized) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems, isInitialized]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم إزالة المنتج من السلة',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C8A97E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems(items => items.filter(item => item.id !== id));
        window.dispatchEvent(new Event('cartUpdated'));
        
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف!',
          text: 'تم إزالة المنتج من السلة',
          confirmButtonColor: '#C8A97E',
          timer: 2000
        });
      }
    });
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return cartItems.length > 0 ? 120 : 0;
  };

  const getTotalPrice = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'السلة فارغة!',
        text: 'يرجى إضافة منتجات للسلة أولاً',
        confirmButtonColor: '#C8A97E'
      });
      return;
    }
    
    navigate('/checkout', { state: { cartItems } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="w-32 h-32 bg-gradient-to-br from-beige to-dark-beige rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FiShoppingBag className="text-white text-5xl" />
          </div>
          <h2 className="text-3xl font-bold text-text-dark mb-4">السلة فارغة</h2>
          <p className="text-gray-500 mb-8 text-lg">لم تقم بإضافة أي منتجات بعد</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            ابدأ التسوق الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-8 animate-fade-in-down">
          <div className="w-12 h-12 bg-gradient-to-br from-beige to-dark-beige rounded-xl flex items-center justify-center shadow-lg">
            <FiShoppingBag className="text-white text-xl" />
          </div>
          <h1 className="text-4xl font-bold text-text-dark">سلة التسوق</h1>
          <div className="bg-beige text-white px-3 py-1 rounded-full text-sm font-bold">
            {cartItems.length} منتج
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, index) => {
              const itemImage = item.images && item.images.length > 0 
                ? item.images[0] 
                : null;
              
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-3 md:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    {/* Product Image */}
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full ${itemImage ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg`}>
                        <span className="text-2xl md:text-3xl">📱</span>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      {/* Product Name & Type */}
                      <div className="mb-2">
                        <h3 className="font-bold text-gray-800 text-xs md:text-sm mb-1 line-clamp-2">{item.name}</h3>
                        
                        {item.subcategory && (
                          <span className="inline-block px-2 py-0.5 bg-beige bg-opacity-20 text-beige text-xs rounded-full font-semibold">
                            {item.subcategory}
                          </span>
                        )}
                      </div>
                      
                      {/* Price & Quantity - Mobile Layout */}
                      <div className="flex flex-col space-y-2">
                        {/* Price */}
                        <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
                          <span className="text-sm md:text-base font-bold text-beige">
                            {item.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">جنيه</span>
                        </div>
                        
                        {/* Quantity Controls & Delete */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 md:w-8 md:h-8 bg-beige text-white rounded-md flex items-center justify-center hover:bg-dark-beige transition-all active:scale-95"
                            >
                              <FiMinus size={12} />
                            </button>
                            
                            <span className="font-bold text-sm md:text-base w-6 md:w-8 text-center text-gray-800">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 md:w-8 md:h-8 bg-beige text-white rounded-md flex items-center justify-center hover:bg-dark-beige transition-all active:scale-95"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                          >
                            <FiTrash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="pt-1 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">المجموع:</span>
                            <span className="text-sm md:text-base font-bold text-beige">
                              {(item.price * item.quantity).toLocaleString()} جنيه
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 border border-beige border-opacity-20 animate-slide-in-right">
              <h2 className="text-2xl font-bold text-text-dark mb-6 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-br from-beige to-dark-beige rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span>ملخص الطلب</span>
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-text-dark">{(item.price * item.quantity).toLocaleString()} EGP</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-semibold text-text-dark">{getSubtotal().toLocaleString()} EGP</span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FiTruck className="text-beige" />
                    <span className="text-gray-600">رسوم التوصيل:</span>
                  </div>
                  <span className="font-semibold text-text-dark">{getDeliveryFee().toLocaleString()} EGP</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span className="text-text-dark">الإجمالي:</span>
                    <span className="text-beige">{getTotalPrice().toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full mt-8 bg-gradient-to-r from-beige to-dark-beige text-white py-4 px-6 rounded-xl font-bold text-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform pulse-beige"
              >
                PROCEED TO CHECKOUT
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
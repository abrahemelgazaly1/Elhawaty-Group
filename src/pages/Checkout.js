import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiTruck } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone1: '',
    phone2: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get cart items from localStorage
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
    
    if (items.length === 0) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return 120; // Fixed delivery fee
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone1) {
      Swal.fire({
        icon: 'warning',
        title: 'بيانات ناقصة',
        text: 'يرجى ملء جميع البيانات المطلوبة',
        confirmButtonColor: '#C8A97E'
      });
      return;
    }

    setLoading(true);

    try {
      const orderPromises = cartItems.map(item => {
        const orderData = {
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          product_image: item.images && item.images.length > 0 ? item.images[0] : '',
          quantity: item.quantity,
          customer_name: formData.name,
          customer_address: formData.address,
          customer_phone1: formData.phone1,
          customer_phone2: formData.phone2 || ''
        };
        
        return fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
      });

      await Promise.all(orderPromises);

      let whatsappMessage = `طلب شراء جديد:\n\n`;
      whatsappMessage += `بيانات العميل:\n`;
      whatsappMessage += `الاسم: ${formData.name}\n`;
      whatsappMessage += `العنوان: ${formData.address}\n`;
      whatsappMessage += `الهاتف 1: ${formData.phone1}\n`;
      if (formData.phone2) {
        whatsappMessage += `الهاتف 2: ${formData.phone2}\n`;
      }
      whatsappMessage += `\n`;

      whatsappMessage += `تفاصيل الطلب:\n`;
      cartItems.forEach((item, index) => {
        whatsappMessage += `${index + 1}. ${item.name}\n`;
        whatsappMessage += `   الكمية: ${item.quantity}\n`;
        whatsappMessage += `   السعر: ${item.price.toLocaleString()} EGP\n`;
        whatsappMessage += `   المجموع: ${(item.price * item.quantity).toLocaleString()} EGP\n\n`;
      });
      
      whatsappMessage += `المجموع الفرعي: ${getSubtotal().toLocaleString()} EGP\n`;
      whatsappMessage += `رسوم التوصيل: ${getDeliveryFee().toLocaleString()} EGP\n`;
      whatsappMessage += `الإجمالي النهائي: ${getTotal().toLocaleString()} EGP`;
      
      const whatsappUrl = `https://wa.me/201010600865?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      localStorage.removeItem('cartItems');
      
      Swal.fire({
        icon: 'success',
        title: 'تم إرسال الطلب!',
        text: 'تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.',
        confirmButtonColor: '#C8A97E'
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.',
        confirmButtonColor: '#C8A97E'
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl text-gray-300 mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">السلة فارغة</h2>
          <p className="text-gray-500 mb-6">لا توجد منتجات للشراء</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8 animate-fade-in-down">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 rtl:space-x-reverse text-beige hover:text-dark-beige transition-colors duration-300 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">العودة للسلة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Takes 1 column */}
          <div className="lg:col-span-1 animate-fade-in-left">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-beige border-opacity-20 sticky top-24">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-beige to-dark-beige rounded-xl flex items-center justify-center">
                  <FiShoppingBag className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-text-dark">ملخص الطلب</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
                {cartItems.map((item, index) => {
                  const itemImage = item.images && item.images.length > 0 
                    ? item.images[0] 
                    : '/placeholder-product.jpg';
                  
                  return (
                    <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjQzhBOTdFIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIxNiIgZmlsbD0iI0M4QTk3RSIgZmlsbC1vcGFjaXR5PSIwLjQiLz4KPHRleHQgeD0iMzIiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjQzhBOTdFIiBmb250LXNpemU9IjgiIGZvbnQtZmFtaWx5PSJDYWlybyI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-dark text-sm mb-1 line-clamp-2">{item.name}</h3>
                        
                        {/* Product Type Badge */}
                        {item.subcategory && (
                          <span className="inline-block mb-1 px-2 py-0.5 bg-beige bg-opacity-20 text-beige text-xs rounded-full font-semibold">
                            {item.subcategory}
                          </span>
                        )}
                        
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-600">الكمية: {item.quantity}</span>
                          <span className="font-bold text-beige">{(item.price * item.quantity).toLocaleString()} EGP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-semibold text-text-dark">{getSubtotal().toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-base">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FiTruck className="text-beige" />
                    <span className="text-gray-600">رسوم التوصيل:</span>
                  </div>
                  <span className="font-semibold text-text-dark">{getDeliveryFee().toLocaleString()} EGP</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-text-dark">الإجمالي:</span>
                    <span className="text-beige">{getTotal().toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form - Takes 2 columns */}
          <div className="lg:col-span-2 animate-fade-in-right">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-beige border-opacity-20">
              <h2 className="text-2xl font-bold text-text-dark mb-6">بيانات التوصيل</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-text-dark font-semibold mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* Address */}
                <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-text-dark font-semibold mb-2">
                    العنوان *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="input-field resize-none"
                    placeholder="أدخل عنوانك بالتفصيل"
                  />
                </div>

                {/* Phone 1 */}
                <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-text-dark font-semibold mb-2">
                    رقم الهاتف الأول *
                  </label>
                  <input
                    type="tel"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                {/* Phone 2 */}
                <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-text-dark font-semibold mb-2">
                    رقم الهاتف الثاني (اختياري)
                  </label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                {/* Submit Button */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-xl transition-all duration-300 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-beige to-dark-beige text-white hover:shadow-2xl hover:scale-105 transform'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                        <div className="loading-spinner w-6 h-6"></div>
                        <span>جاري الإرسال...</span>
                      </div>
                    ) : (
                      'تأكيد الطلب - BUY NOW'
                    )}
                  </button>
                </div>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    معاملة آمنة - سيتم التواصل معك لتأكيد الطلب
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
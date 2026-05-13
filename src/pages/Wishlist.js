import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const items = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(items);
  };

  const removeFromWishlist = (productId) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم إزالة المنتج من المفضلة',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C8A97E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedWishlist = wishlist.filter(item => (item._id || item.product_id || item.id) !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
        window.dispatchEvent(new Event('wishlistUpdated'));
        
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف!',
          text: 'تم إزالة المنتج من المفضلة',
          confirmButtonColor: '#C8A97E',
          timer: 2000
        });
      }
    });
  };

  const addToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const productId = product._id || product.product_id || product.id;
    const existingItemIndex = cartItems.findIndex(item => (item._id || item.product_id || item.id) === productId);
    
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    Swal.fire({
      icon: 'success',
      title: 'تم الإضافة!',
      text: 'تم إضافة المنتج إلى السلة بنجاح',
      confirmButtonColor: '#C8A97E',
      timer: 2000
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FiHeart className="text-red-500 text-6xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">المفضلة فارغة</h2>
          <p className="text-gray-500 text-lg mb-8">لم تقم بإضافة أي منتجات للمفضلة بعد</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiHeart className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">المفضلة</h1>
                <p className="text-gray-500">{wishlist.length} منتج</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          {wishlist.map((product, index) => {
            const productImage = product.images && product.images.length > 0 
              ? product.images[0] 
              : null;

            return (
              <div 
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 transition-all duration-300 hover:border-red-400 hover:shadow-xl animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Product Image */}
                <div 
                  className="relative overflow-hidden cursor-pointer" 
                  style={{ height: '180px', backgroundColor: '#f5f5f5' }}
                  onClick={() => navigate(`/product/${product._id || product.product_id || product.id}`)}
                >
                  {productImage ? (
                    <img 
                      src={productImage} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full ${productImage ? 'hidden' : 'flex'} items-center justify-center`} style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #C8A97E 0%, #A67C52 100%)' }}>
                        <span className="text-white text-3xl">📱</span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product._id || product.product_id || product.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
                    title="إزالة من المفضلة"
                  >
                    <FiTrash2 size={14} />
                  </button>

                  {/* Subcategory Badge */}
                  {product.subcategory && (
                    <div className="absolute top-2 left-2 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #C8A97E 0%, #A67C52 100%)' }}>
                      {product.subcategory}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 
                    className="font-bold mb-2 text-sm line-clamp-2 cursor-pointer hover:text-beige transition-colors"
                    style={{ color: '#1F1F1F', minHeight: '2.5rem' }}
                    onClick={() => navigate(`/product/${product._id || product.product_id || product.id}`)}
                  >
                    {product.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl font-bold" style={{ color: '#C8A97E' }}>
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">جنيه</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 px-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #C8A97E 0%, #A67C52 100%)' }}
                  >
                    <FiShoppingCart size={16} />
                    <span className="text-sm">أضف للسلة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

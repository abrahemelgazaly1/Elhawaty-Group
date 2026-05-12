import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiHeart, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Swal from 'sweetalert2';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [showBattery, setShowBattery] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        
        // Fetch related products from same category
        const relatedResponse = await axios.get('/api/products', {
          params: { category: response.data.category }
        });
        const related = relatedResponse.data
          .filter(p => p.id !== parseInt(productId))
          .slice(0, 5);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    Swal.fire({
      icon: 'success',
      title: 'تم الإضافة!',
      text: 'تم إضافة المنتج إلى السلة بنجاح',
      confirmButtonColor: '#C8A97E',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      navigate('/cart');
    });
  };

  const handleBuyNow = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/checkout');
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const existingItem = wishlist.find(item => item.id === product.id);
    
    if (!existingItem) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة!',
        text: 'تم إضافة المنتج إلى المفضلة ❤️',
        confirmButtonColor: '#C8A97E',
        timer: 2000
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'موجود بالفعل',
        text: 'المنتج موجود بالفعل في المفضلة',
        confirmButtonColor: '#C8A97E'
      });
    }
  };

  if (loading || !product) {
    return (
      <div className="pt-20 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige mx-auto mb-4"></div>
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['/placeholder-product.jpg'];

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNURDIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-beige' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNURDIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-beige mb-4">
              {product.name}
            </h1>
            
            <p className="text-4xl font-bold text-green-600 mb-4">
              {product.price.toLocaleString()} جنيه
            </p>
            
            <p className="text-gray-600 mb-6">
              الفئة: {product.category} {product.subcategory && `- ${product.subcategory}`}
            </p>

            {/* Description Accordion */}
            <div className="mb-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full text-right p-3 bg-gray-100 rounded-lg font-semibold text-beige hover:bg-gray-200 transition-colors duration-200"
              >
                الوصف
              </button>
              {showDescription && (
                <div className="p-3 bg-white border border-gray-200 rounded-b-lg">
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}
            </div>

            {/* Battery Info (for used phones only) */}
            {product.category === 'used-phones' && (
              <div className="mb-4">
                <button
                  onClick={() => setShowBattery(!showBattery)}
                  className="w-full text-right p-3 bg-gray-100 rounded-lg font-semibold text-beige hover:bg-gray-200 transition-colors duration-200"
                >
                  Battery
                </button>
                {showBattery && (
                  <div className="p-3 bg-white border border-gray-200 rounded-b-lg">
                    <p className="text-gray-700">{product.battery || 'معلومات البطارية غير متوفرة'}</p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-beige font-semibold mb-2">
                {t('count')}
              </label>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-beige text-white rounded-lg flex items-center justify-center hover:bg-opacity-90"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-beige text-white rounded-lg flex items-center justify-center hover:bg-opacity-90"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #C8A97E 0%, #A67C52 100%)' }}
              >
                <FiShoppingCart />
                <span>أضف إلى السلة</span>
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-[7] border-2 py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  style={{ borderColor: '#C8A97E', color: '#C8A97E', backgroundColor: 'white' }}
                >
                  اشتري الآن
                </button>
                
                <button
                  onClick={handleAddToWishlist}
                  className="flex-[3] border-2 py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  style={{ borderColor: '#C8A97E', color: '#C8A97E', backgroundColor: 'white' }}
                >
                  <FiHeart />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#C8A97E' }}>
            منتجات أخرى
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
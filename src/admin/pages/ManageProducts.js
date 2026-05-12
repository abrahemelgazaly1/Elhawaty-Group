import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'جميع المنتجات' },
    { value: 'new-phones', label: 'New Phones' },
    { value: 'used-phones', label: 'Used Phones' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'money-machine', label: 'Money Machine' },
    { value: 'transfer-machine', label: 'Transfer Machine' },
    { value: 'small-phones', label: 'Small Phones' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'خطأ في جلب المنتجات',
        confirmButtonColor: '#1F2937'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId, productName) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف المنتج "${productName}" نهائياً`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'تم الحذف!',
        text: 'تم حذف المنتج بنجاح',
        confirmButtonColor: '#1F2937',
        timer: 2000
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response?.data?.message || 'خطأ في حذف المنتج',
        confirmButtonColor: '#1F2937'
      });
    }
  };

  const handleToggleSoldOut = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(`/api/products/${productId}/sold-out`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث!',
        text: response.data.message,
        confirmButtonColor: '#1F2937',
        timer: 2000
      });
      fetchProducts();
    } catch (error) {
      console.error('Error toggling sold out:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response?.data?.message || 'خطأ في تحديث حالة المنتج',
        confirmButtonColor: '#1F2937'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">إدارة المنتجات</h1>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-field"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد منتجات</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 rtl:md:space-x-reverse">
                {/* Product Image */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={product.images[0] ? `http://localhost:5000${product.images[0]}` : '/placeholder-image.jpg'}
                    alt={product.name}
                    className="w-24 h-24 md:w-20 md:h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNURDIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-green-600 font-bold mb-2">
                    {product.price.toLocaleString()} جنيه
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                    <span>الفئة: {product.category}</span>
                    {product.subcategory && <span>• {product.subcategory}</span>}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.sold_out 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {product.sold_out ? 'نفد المخزون' : 'متوفر'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                  {/* Edit Button */}
                  <button
                    onClick={() => navigate(`/admin/dashboard/edit-product/${product.id}`)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    title="تعديل"
                  >
                    <FiEdit size={16} />
                  </button>

                  {/* Sold Out Toggle */}
                  <button
                    onClick={() => handleToggleSoldOut(product.id, product.sold_out)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      product.sold_out
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                    title={product.sold_out ? 'إعادة تفعيل' : 'نفد المخزون'}
                  >
                    {product.sold_out ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    title="حذف"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Mobile (Below Product) */}
              <div className="flex md:hidden items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-200">
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/admin/dashboard/edit-product/${product.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <FiEdit size={16} />
                  <span className="text-sm">تعديل</span>
                </button>

                {/* Sold Out Toggle */}
                <button
                  onClick={() => handleToggleSoldOut(product.id, product.sold_out)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    product.sold_out
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {product.sold_out ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  <span className="text-sm">{product.sold_out ? 'تفعيل' : 'إخفاء'}</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <FiTrash2 size={16} />
                  <span className="text-sm">حذف</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Products Count */}
      <div className="mt-8 text-center text-gray-600">
        إجمالي المنتجات: {filteredProducts.length}
      </div>
    </div>
  );
};

export default ManageProducts;
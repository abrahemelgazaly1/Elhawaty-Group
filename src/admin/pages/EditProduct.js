import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiX, FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subcategory: '',
    battery: ''
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const categories = {
    'new-phones': ['android', 'iphone'],
    'used-phones': ['android', 'iphone'],
    'accessories': ['electricity', 'covers', 'watches-airpods'],
    'laptops': ['new', 'used'],
    'money-machine': ['new'],
    'transfer-machine': ['fawry', 'aman', 'ahly-tamkeen'],
    'small-phones': ['new', 'used']
  };

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      const product = response.data;
      
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description || '',
        category: product.category,
        subcategory: product.subcategory || '',
        battery: product.battery || ''
      });
      setImages(product.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'خطأ في جلب بيانات المنتج',
        confirmButtonColor: '#1F2937'
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        subcategory: ''
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    if (images.length + files.length > 4) {
      Swal.fire({
        icon: 'warning',
        title: 'تحذير',
        text: 'يمكن رفع 4 صور كحد أقصى',
        confirmButtonColor: '#1F2937'
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setImages(prev => [...prev, ...response.data.images]);
      Swal.fire({
        icon: 'success',
        title: 'تم الرفع!',
        text: 'تم رفع الصور بنجاح',
        confirmButtonColor: '#1F2937',
        timer: 2000
      });
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response?.data?.message || 'خطأ في رفع الصور',
        confirmButtonColor: '#1F2937'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      Swal.fire({
        icon: 'warning',
        title: 'بيانات ناقصة',
        text: 'الاسم والسعر والفئة مطلوبة',
        confirmButtonColor: '#1F2937'
      });
      return;
    }

    if (images.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'صور مطلوبة',
        text: 'يجب وجود صورة واحدة على الأقل',
        confirmButtonColor: '#1F2937'
      });
      return;
    }

    setUpdating(true);

    try {
      const token = localStorage.getItem('adminToken');
      const productData = {
        ...formData,
        images
      };

      await axios.put(`/api/products/${id}`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث!',
        text: 'تم تحديث المنتج بنجاح',
        confirmButtonColor: '#1F2937'
      }).then(() => {
        navigate('/admin/dashboard/manage-products');
      });
    } catch (error) {
      console.error('Update product error:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response?.data?.message || 'خطأ في تحديث المنتج',
        confirmButtonColor: '#1F2937'
      });
    } finally {
      setUpdating(false);
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin/dashboard/manage-products')}
            className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <FiArrowLeft />
            <span>العودة إلى إدارة المنتجات</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">تعديل المنتج</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                اسم المنتج *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="أدخل اسم المنتج"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                السعر *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="أدخل السعر بالجنيه"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="input-field resize-none"
                placeholder="أدخل وصف المنتج"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                الفئة *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="select-field"
              >
                <option value="">اختر الفئة</option>
                <option value="new-phones">New Phones</option>
                <option value="used-phones">Used Phones</option>
                <option value="accessories">Accessories</option>
                <option value="laptops">Laptops</option>
                <option value="money-machine">Money Machine</option>
                <option value="transfer-machine">Transfer Machine</option>
                <option value="small-phones">Small Phones</option>
              </select>
            </div>

            {/* Subcategory */}
            {formData.category && categories[formData.category] && (
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  الفئة الفرعية *
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  required
                  className="select-field"
                >
                  <option value="">اختر الفئة الفرعية</option>
                  {categories[formData.category].map(sub => (
                    <option key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Battery (for used phones only) */}
            {formData.category === 'used-phones' && (
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  معلومات البطارية
                </label>
                <textarea
                  name="battery"
                  value={formData.battery}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="أدخل معلومات البطارية"
                />
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                صور المنتج * (حتى 4 صور)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                  disabled={uploading || images.length >= 4}
                />
                <label
                  htmlFor="imageUpload"
                  className={`cursor-pointer flex flex-col items-center ${
                    uploading || images.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiUpload className="text-4xl text-gray-400 mb-2" />
                  <span className="text-gray-600">
                    {uploading ? 'جاري الرفع...' : 'اضغط لرفع الصور'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    ({images.length}/4 صور)
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={14} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          رئيسية
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={updating || uploading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                updating || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              {updating ? 'جاري التحديث...' : 'تحديث المنتج'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
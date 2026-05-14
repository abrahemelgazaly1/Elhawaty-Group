import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiCheck, FiX, FiTruck, FiPackage, FiTrash2 } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('خطأ في جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId) {
      setMessage('خطأ: معرف الطلب غير موجود');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`/api/orders/${orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage('تم تحديث حالة الطلب بنجاح');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage(error.response?.data?.message || 'خطأ في تحديث حالة الطلب');
    }
  };

  const deleteOrder = async (orderId, customerName) => {
    if (!window.confirm(`هل أنت متأكد من حذف طلب العميل "${customerName}"؟`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage('تم حذف الطلب بنجاح');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      setMessage(error.response?.data?.message || 'خطأ في حذف الطلب');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد المراجعة';
      case 'confirmed':
        return 'مؤكد';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock />;
      case 'confirmed':
        return <FiCheck />;
      case 'shipped':
        return <FiTruck />;
      case 'delivered':
        return <FiPackage />;
      case 'cancelled':
        return <FiX />;
      default:
        return <FiClock />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">الطلبات</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('بنجاح') 
            ? 'bg-green-100 text-green-700 border border-green-400'
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">لا توجد طلبات</h2>
          <p className="text-gray-500">لم يتم استلام أي طلبات بعد</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id || order.id} className="bg-white rounded-lg shadow-lg p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    طلب رقم #{order._id || order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                
                <div className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{getStatusText(order.status)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Info */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">معلومات المنتج</h4>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                    <img
                      src={order.product_image || '/placeholder-image.jpg'}
                      alt={order.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNURDIi8+Cjx0ZXh0IHg9IjMyIiB5PSIzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5JbWFnZTwvdGV4dD4KPC9zdmc+Cg==';
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{order.product_name}</p>
                      <p className="text-green-600 font-bold">{order.product_price.toLocaleString()} جنيه</p>
                      <p className="text-sm text-gray-600">الكمية: {order.quantity}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">بيانات العميل</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">الاسم:</span> {order.customer_name}</p>
                    <p><span className="font-medium">العنوان:</span> {order.customer_address}</p>
                    <p><span className="font-medium">الهاتف 1:</span> {order.customer_phone1}</p>
                    {order.customer_phone2 && (
                      <p><span className="font-medium">الهاتف 2:</span> {order.customer_phone2}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span>سعر المنتج:</span>
                  <span>{(order.product_price * order.quantity).toLocaleString()} جنيه</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>رسوم التوصيل:</span>
                  <span>{order.delivery_fee.toLocaleString()} جنيه</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                  <span>الإجمالي:</span>
                  <span className="text-green-600">{order.total_price.toLocaleString()} جنيه</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                {/* Status Change Buttons */}
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order._id || order.id, 'confirmed')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      تأكيد الطلب
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id || order.id, 'cancelled')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      إلغاء الطلب
                    </button>
                  </>
                )}
                
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => updateOrderStatus(order._id || order.id, 'shipped')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                  >
                    تم الشحن
                  </button>
                )}
                
                {order.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(order._id || order.id, 'delivered')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    تم التسليم
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteOrder(order._id || order.id, order.customer_name)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <FiTrash2 size={16} />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Count */}
      <div className="mt-8 text-center text-gray-600">
        إجمالي الطلبات: {orders.length}
      </div>
    </div>
  );
};

export default Orders;
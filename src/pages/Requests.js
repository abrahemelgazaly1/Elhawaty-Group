import React, { useState } from 'react';
import { FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi';

const Requests = () => {
  const [requests] = useState([
    {
      id: 1,
      type: 'banking',
      title: 'طلب إيداع بنكي',
      amount: 5000,
      status: 'pending',
      date: '2024-01-15',
      details: {
        name: 'أحمد محمد',
        phone: '01234567890',
        bankType: 'البنك الأهلي المصري',
        serviceType: 'deposit'
      }
    },
    {
      id: 2,
      type: 'transfer',
      title: 'تحويل إلكتروني',
      amount: 2000,
      status: 'completed',
      date: '2024-01-14',
      details: {
        name: 'فاطمة أحمد',
        phone: '01987654321',
        accountType: 'instaPay',
        transferTo: 'vodafoneCash'
      }
    },
    {
      id: 3,
      type: 'order',
      title: 'طلب شراء iPhone 15',
      amount: 45000,
      status: 'rejected',
      date: '2024-01-13',
      details: {
        productName: 'iPhone 15 Pro',
        quantity: 1
      }
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد المراجعة';
      case 'completed':
        return 'مكتمل';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'غير محدد';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock />;
      case 'completed':
        return <FiCheck />;
      case 'rejected':
        return <FiX />;
      default:
        return <FiClock />;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'banking':
        return 'تحويل بنكي';
      case 'transfer':
        return 'تحويل إلكتروني';
      case 'order':
        return 'طلب شراء';
      default:
        return 'طلب';
    }
  };

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-beige mb-8">طلباتي</h1>
        
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">لا توجد طلبات</h2>
            <p className="text-gray-500">لم تقم بإرسال أي طلبات بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-beige text-lg mb-1">
                      {request.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getTypeText(request.type)} • {request.date}
                    </p>
                  </div>
                  
                  <div className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span>{getStatusText(request.status)}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-green-600">
                    {request.amount.toLocaleString()} جنيه
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>الاسم: {request.details.name}</p>
                    <p>الهاتف: {request.details.phone}</p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center space-x-1 rtl:space-x-reverse text-beige hover:text-opacity-80 font-medium"
                  >
                    <FiEye />
                    <span>عرض التفاصيل</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-beige">تفاصيل الطلب</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الطلب
                    </label>
                    <p className="text-beige font-semibold">#{selectedRequest.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع الطلب
                    </label>
                    <p>{getTypeText(selectedRequest.type)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحالة
                    </label>
                    <div className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)}
                      <span>{getStatusText(selectedRequest.status)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المبلغ
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedRequest.amount.toLocaleString()} جنيه
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التاريخ
                    </label>
                    <p>{selectedRequest.date}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التفاصيل
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      {Object.entries(selectedRequest.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3 rtl:space-x-reverse">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    إغلاق
                  </button>
                  
                  {selectedRequest.status === 'pending' && (
                    <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
                      إلغاء الطلب
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
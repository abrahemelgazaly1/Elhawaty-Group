import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiCheck, FiX, FiDollarSign, FiCreditCard, FiTrash2, FiEye } from 'react-icons/fi';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requestTypes = [
    { value: 'all', label: 'جميع الطلبات' },
    { value: 'banking', label: 'التحويلات البنكية' },
    { value: 'electronic', label: 'التحويلات الإلكترونية' }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, selectedType]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMessage('خطأ في جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(request => request.type === selectedType);
    }
    
    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    if (!requestId) {
      setMessage('خطأ: معرف الطلب غير موجود');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`/api/requests/${requestId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage('تم تحديث حالة الطلب بنجاح');
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      setMessage(error.response?.data?.message || 'خطأ في تحديث حالة الطلب');
    }
  };

  const deleteRequest = async (requestId, customerName) => {
    if (!window.confirm(`هل أنت متأكد من حذف طلب العميل "${customerName}"؟`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/requests/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage('تم حذف الطلب بنجاح');
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      setMessage(error.response?.data?.message || 'خطأ في حذف الطلب');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-blue-600 bg-blue-100';
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
      case 'approved':
        return 'موافق عليه';
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
      case 'approved':
      case 'completed':
        return <FiCheck />;
      case 'rejected':
        return <FiX />;
      default:
        return <FiClock />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'banking':
        return <FiDollarSign />;
      case 'electronic':
        return <FiCreditCard />;
      default:
        return <FiDollarSign />;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'banking':
        return 'تحويل بنكي';
      case 'electronic':
        return 'تحويل إلكتروني';
      default:
        return 'طلب';
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">طلبات التحويلات</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('بنجاح') 
            ? 'bg-green-100 text-green-700 border border-green-400'
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="select-field max-w-xs"
        >
          {requestTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">💳</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">لا توجد طلبات</h2>
          <p className="text-gray-500">لم يتم استلام أي طلبات تحويل بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <div key={request._id || request.id} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              {/* Request Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-3 md:space-y-0">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(request.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getTypeText(request.type)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      طلب رقم #{request._id || request.id}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)} w-fit`}>
                  {getStatusIcon(request.status)}
                  <span>{getStatusText(request.status)}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">بيانات العميل</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">الاسم:</span> {request.name}</p>
                  <p><span className="font-medium">الهاتف:</span> {request.phone1}</p>
                  {request.phone2 && (
                    <p><span className="font-medium">هاتف إضافي:</span> {request.phone2}</p>
                  )}
                  <p><span className="font-medium">العنوان:</span> {request.address}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">تفاصيل الطلب</h4>
                {request.amount && (
                  <p className="text-xl md:text-2xl font-bold text-green-600 mb-2">
                    {request.amount.toLocaleString()} جنيه
                  </p>
                )}
                
                {request.type === 'banking' && (
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">نوع الخدمة:</span> {request.service_type === 'deposit' ? 'إيداع' : 'سحب'}</p>
                    <p><span className="font-medium">البنك:</span> {request.bank_type}</p>
                  </div>
                )}

                {request.type === 'electronic' && (
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">من:</span> {request.account_type}</p>
                    <p><span className="font-medium">الحساب المرسل:</span> {request.sender_account}</p>
                    {request.transfer_to && (
                      <>
                        <p><span className="font-medium">إلى:</span> {request.transfer_to}</p>
                        <p><span className="font-medium">الحساب المستقبل:</span> {request.recipient_account}</p>
                        <p><span className="font-medium">اسم المستقبل:</span> {request.recipient_name}</p>
                      </>
                    )}
                    {request.machine_type && (
                      <>
                        <p><span className="font-medium">نوع الماكينة:</span> {request.machine_type}</p>
                        <p><span className="font-medium">رقم التاجر:</span> {request.merchant_number}</p>
                      </>
                    )}
                    {request.screenshot && (
                      <div className="mt-3">
                        <p className="font-medium mb-2">📸 صورة السكرين شوت:</p>
                        <img
                          src={request.screenshot}
                          alt="Screenshot"
                          className="max-w-full h-auto rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(request.screenshot, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse text-sm"
                >
                  <FiEye size={16} />
                  <span>عرض</span>
                </button>

                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateRequestStatus(request._id || request.id, 'approved')}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                    >
                      موافقة
                    </button>
                    <button
                      onClick={() => updateRequestStatus(request._id || request.id, 'rejected')}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                    >
                      رفض
                    </button>
                  </>
                )}

                {request.status === 'approved' && (
                  <button
                    onClick={() => updateRequestStatus(request._id || request.id, 'completed')}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                  >
                    مكتمل
                  </button>
                )}

                <button
                  onClick={() => deleteRequest(request._id || request.id, request.name)}
                  className="px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse text-sm"
                >
                  <FiTrash2 size={16} />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">تفاصيل الطلب #{selectedRequest._id || selectedRequest.id}</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع الطلب</label>
                    <p className="text-gray-800">{getTypeText(selectedRequest.type)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <div className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)}
                      <span>{getStatusText(selectedRequest.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                    <p className="text-gray-800">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    <p className="text-gray-800">{selectedRequest.phone1}</p>
                  </div>
                </div>

                {selectedRequest.phone2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم هاتف إضافي</label>
                    <p className="text-gray-800">{selectedRequest.phone2}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <p className="text-gray-800">{selectedRequest.address}</p>
                </div>

                {selectedRequest.amount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ</label>
                    <p className="text-2xl font-bold text-green-600">{selectedRequest.amount.toLocaleString()} جنيه</p>
                  </div>
                )}

                {/* Banking specific fields */}
                {selectedRequest.type === 'banking' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخدمة</label>
                        <p className="text-gray-800">{selectedRequest.service_type === 'deposit' ? 'إيداع' : 'سحب'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نوع البنك</label>
                        <p className="text-gray-800">{selectedRequest.bank_type}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Electronic specific fields */}
                {selectedRequest.type === 'electronic' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحساب</label>
                        <p className="text-gray-800">{selectedRequest.account_type}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الحساب المرسل</label>
                        <p className="text-gray-800">{selectedRequest.sender_account}</p>
                      </div>
                    </div>

                    {selectedRequest.transfer_to && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">التحويل إلى</label>
                          <p className="text-gray-800">{selectedRequest.transfer_to}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">الحساب المستقبل</label>
                          <p className="text-gray-800">{selectedRequest.recipient_account}</p>
                        </div>
                      </div>
                    )}

                    {selectedRequest.recipient_name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستقبل</label>
                        <p className="text-gray-800">{selectedRequest.recipient_name}</p>
                      </div>
                    )}

                    {selectedRequest.machine_type && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">نوع الماكينة</label>
                          <p className="text-gray-800">{selectedRequest.machine_type}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">رقم التاجر</label>
                          <p className="text-gray-800">{selectedRequest.merchant_number}</p>
                        </div>
                      </div>
                    )}

                    {selectedRequest.screenshot && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">صورة السكرين شوت</label>
                        <img
                          src={selectedRequest.screenshot}
                          alt="Screenshot"
                          className="max-w-full h-auto rounded-lg border"
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الإنشاء</label>
                  <p className="text-gray-800">{formatDate(selectedRequest.created_at)}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requests Count */}
      <div className="mt-8 text-center text-gray-600">
        إجمالي الطلبات: {filteredRequests.length}
      </div>
    </div>
  );
};

export default Requests;
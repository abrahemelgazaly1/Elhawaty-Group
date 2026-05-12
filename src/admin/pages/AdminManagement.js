import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiKey, FiMail, FiUser } from 'react-icons/fi';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'admin'
  });
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/auth/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('خطأ في جلب المسؤولين');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/auth/admins', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('تم إضافة المسؤول بنجاح');
      setShowAddModal(false);
      setFormData({ email: '', password: '', name: '', role: 'admin' });
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.message || 'خطأ في إضافة المسؤول');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/auth/admins/${selectedAdmin.id}/password`, 
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setSuccess('تم تحديث كلمة المرور بنجاح');
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedAdmin(null);
    } catch (error) {
      setError(error.response?.data?.message || 'خطأ في تحديث كلمة المرور');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المسؤول؟')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/auth/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('تم حذف المسؤول بنجاح');
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.message || 'خطأ في حذف المسؤول');
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المسؤولين</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> إضافة مسؤول جديد
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الدور
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                تاريخ الإنشاء
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {admin.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {admin.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(admin.created_at).toLocaleDateString('ar-EG')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setShowPasswordModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 ml-3"
                    title="تغيير كلمة المرور"
                  >
                    <FiKey className="inline" />
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="text-red-600 hover:text-red-900"
                    title="حذف"
                  >
                    <FiTrash2 className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">إضافة مسؤول جديد</h2>
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <FiUser className="inline ml-2" />
                  الاسم
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="اسم المسؤول"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <FiMail className="inline ml-2" />
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <FiKey className="inline ml-2" />
                  كلمة المرور *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ email: '', password: '', name: '', role: 'admin' });
                  }}
                  className="btn-secondary flex-1"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              تغيير كلمة المرور - {selectedAdmin.email}
            </h2>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  <FiKey className="inline ml-2" />
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  تحديث
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setSelectedAdmin(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;

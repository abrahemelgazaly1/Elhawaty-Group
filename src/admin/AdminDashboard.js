import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import AddProduct from './pages/AddProduct';
import ManageProducts from './pages/ManageProducts';
import Orders from './pages/Orders';
import Requests from './pages/Requests';
import EditProduct from './pages/EditProduct';
import AdminManagement from './pages/AdminManagement';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar onLogout={handleLogout} />
      
      <main className="pt-28 lg:pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard/add-product" replace />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/admins" element={<AdminManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
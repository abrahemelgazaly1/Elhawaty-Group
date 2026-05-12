import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiLogOut, FiPlus, FiSettings, FiShoppingBag, FiFileText, FiUsers } from 'react-icons/fi';

const AdminNavbar = ({ onLogout }) => {
  const navItems = [
    {
      path: '/admin/dashboard/add-product',
      label: 'Add Product',
      icon: FiPlus
    },
    {
      path: '/admin/dashboard/manage-products',
      label: 'Manage Products',
      icon: FiSettings
    },
    {
      path: '/admin/dashboard/orders',
      label: 'Orders',
      icon: FiShoppingBag
    },
    {
      path: '/admin/dashboard/requests',
      label: 'Requests',
      icon: FiFileText
    },
    {
      path: '/admin/dashboard/admins',
      label: 'Admins',
      icon: FiUsers
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-800">
              ELHAWTY Admin
            </h1>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`
                  }
                >
                  <IconComponent size={18} />
                  <span className="text-sm xl:text-base">{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm md:text-base"
          >
            <FiLogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`
                  }
                >
                  <IconComponent size={14} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
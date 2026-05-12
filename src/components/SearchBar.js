import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-8 animate-fade-in-up">
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <FiSearch className="h-6 w-6 text-beige" />
      </div>
      <input
        type="text"
        placeholder="ابحث عن المنتجات..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pr-12 pl-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-beige focus:ring-opacity-30 focus:border-beige transition-all duration-300 bg-white shadow-lg text-text-dark placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
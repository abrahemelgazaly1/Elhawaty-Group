import React from 'react';
import { useTranslation } from 'react-i18next';

const FilterTabs = ({ filters, activeFilter, onFilterChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {filters.map((filter, index) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
            activeFilter === filter
              ? 'bg-gradient-to-r from-beige to-dark-beige text-white shadow-xl'
              : 'bg-white text-beige border-2 border-beige hover:bg-beige hover:text-white shadow-lg'
          }`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            '--delay': `${index * 0.1}s`
          }}
        >
          {t(filter)}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
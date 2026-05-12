import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import { initScrollAnimations } from '../utils/animations';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products', {
          params: { category: categoryName }
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Initialize scroll animations after products are loaded
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const observer = initScrollAnimations();
      return () => observer.disconnect();
    }
  }, [filteredProducts]);

  useEffect(() => {
    let filtered = products;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.subcategory?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, activeFilter, searchTerm]);

  const getFilters = () => {
    switch (categoryName) {
      case 'new-phones':
      case 'used-phones':
        return ['all', 'android', 'iphone'];
      case 'small-phones':
        return ['all', 'new', 'used'];
      case 'accessories':
        return ['all', 'electricity', 'covers', 'watchesAirpods'];
      case 'laptops':
        return ['all', 'new', 'used'];
      case 'money-machine':
        return ['all', 'new'];
      case 'transfer-machine':
        return ['all', 'fawry', 'aman', 'ahlyTamkeen'];
      default:
        return ['all'];
    }
  };

  const getCategoryTitle = () => {
    const categoryMap = {
      'new-phones': 'newPhones',
      'used-phones': 'usedPhones',
      'accessories': 'accessories',
      'laptops': 'laptops',
      'money-machine': 'moneyMachine',
      'transfer-machine': 'transferMachine',
      'small-phones': 'smallPhones'
    };
    return t(categoryMap[categoryName] || 'services');
  };

  if (loading) {
    return (
      <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-12 animate-fade-in-down">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gradient mb-4">
              {getCategoryTitle()}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-beige to-dark-beige mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600">
              {t('discoverCollection')} {getCategoryTitle()}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <FilterTabs
              filters={getFilters()}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-32 h-32 bg-gradient-to-br from-beige to-dark-beige rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl opacity-50">
              <span className="text-white text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-text-dark mb-4">{t('noProducts')}</h3>
            <p className="text-gray-500 text-lg">{t('tryDifferentSearch')}</p>
          </div>
        )}

        {/* Products Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-16 text-center animate-fade-in-up">
            <div className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-white rounded-2xl shadow-lg p-4 border border-beige border-opacity-20">
              <div className="w-8 h-8 bg-gradient-to-br from-beige to-dark-beige rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{filteredProducts.length}</span>
              </div>
              <span className="text-text-dark font-semibold">
                {filteredProducts.length === 1 ? t('oneProduct') : `${filteredProducts.length} ${t('products')}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
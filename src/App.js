import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import BankingTransactions from './pages/BankingTransactions';
import ElectronicTransfer from './pages/ElectronicTransfer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Requests from './pages/Requests';
import Wishlist from './pages/Wishlist';
import Footer from './components/Footer';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <ScrollToTop />
      <div className="App font-cairo">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/product/:productId" element={<ProductDetails />} />
                  <Route path="/banking-transactions" element={<BankingTransactions />} />
                  <Route path="/electronic-transfer" element={<ElectronicTransfer />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Routes>
              </main>
              <Footer />
              <BottomNavbar />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
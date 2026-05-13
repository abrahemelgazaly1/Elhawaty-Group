import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

const BankingTransactions = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    address: '',
    serviceType: 'deposit',
    bankType: '',
    amount: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // إرسال البيانات إلى قاعدة البيانات
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'banking',
          name: formData.name,
          phone1: formData.phone1,
          phone2: formData.phone2,
          address: formData.address,
          service_type: formData.serviceType,
          bank_type: formData.bankType,
          amount: formData.amount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في إرسال الطلب');
      }

      // إرسال البيانات إلى الواتساب
      const whatsappMessage = `
🏦 طلب ${formData.serviceType === 'deposit' ? 'إيداع' : 'سحب'} بنكي جديد

👤 الاسم: ${formData.name}
📱 رقم الهاتف: ${formData.phone1}
📱 رقم إضافي: ${formData.phone2 || 'غير محدد'}
📍 العنوان: ${formData.address}
🔄 نوع الخدمة: ${formData.serviceType === 'deposit' ? 'إيداع' : 'سحب'}
🏦 نوع البنك: ${formData.bankType}
💰 المبلغ: ${formData.amount} جنيه
      `.trim();

      const whatsappUrl = `https://wa.me/201010600865?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        phone1: '',
        phone2: '',
        address: '',
        serviceType: 'deposit',
        bankType: '',
        amount: ''
      });
      
      Swal.fire({
        icon: 'success',
        title: 'تم إرسال الطلب بنجاح!',
        text: 'سيتم التواصل معك قريباً ✅',
        confirmButtonColor: '#C8A97E',
        timer: 3000
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      Swal.fire({
        icon: 'error',
        title: 'حدث خطأ!',
        text: error.message || 'حدث خطأ في إرسال الطلب. حاول مرة أخرى.',
        confirmButtonColor: '#C8A97E'
      });
    }
  };

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-beige mb-6 text-center">
              {t('bankingTransactions')}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Phone 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-beige font-semibold mb-2">
                    {t('name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-beige font-semibold mb-2">
                    {t('phone1')} *
                  </label>
                  <input
                    type="tel"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>

              {/* Phone 2 and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-beige font-semibold mb-2">
                    {t('phone2')} (اختياري)
                  </label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-beige font-semibold mb-2">
                    {t('address')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="أدخل عنوانك بالتفصيل"
                  />
                </div>
              </div>

              {/* Service Type and Bank Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-beige font-semibold mb-2">
                    {t('serviceType')} *
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="select-field"
                  >
                    <option value="deposit">{t('deposit')}</option>
                    <option value="withdraw">{t('withdraw')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-beige font-semibold mb-2">
                    {t('bankType')} *
                  </label>
                  <input
                    type="text"
                    name="bankType"
                    value={formData.bankType}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="مثال: البنك الأهلي المصري"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-beige font-semibold mb-2">
                  {t('amount')} *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="input-field"
                  placeholder="أدخل المبلغ بالجنيه"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary text-lg py-4"
              >
                {t('sendRequest')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingTransactions;
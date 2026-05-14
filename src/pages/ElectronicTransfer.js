import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiCopy } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ElectronicTransfer = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('transfer');
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    address: '',
    accountType: 'instaPay',
    senderAccount: '',
    amount: '',
    transferTo: 'vodafoneCash',
    recipientAccount: '',
    recipientName: '',
    machineType: 'fawry',
    merchantNumber: ''
  });
  const [screenshot, setScreenshot] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'تحذير',
          text: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت',
          confirmButtonColor: '#C8A97E'
        });
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshot(reader.result);
      };
      reader.onerror = () => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'فشل قراءة الصورة',
          confirmButtonColor: '#C8A97E'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'تم النسخ!',
      text: 'تم نسخ الرقم بنجاح',
      confirmButtonColor: '#C8A97E',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // إرسال البيانات إلى قاعدة البيانات
      const requestData = {
        type: 'electronic',
        name: formData.name,
        phone1: formData.phone1,
        phone2: formData.phone2,
        address: formData.address,
        account_type: formData.accountType,
        sender_account: formData.senderAccount,
        amount: formData.amount,
        transfer_to: activeTab === 'transfer' ? formData.transferTo : '',
        recipient_account: activeTab === 'transfer' ? formData.recipientAccount : '',
        recipient_name: activeTab === 'transfer' ? formData.recipientName : '',
        machine_type: activeTab === 'machine' ? formData.machineType : '',
        merchant_number: activeTab === 'machine' ? formData.merchantNumber : '',
        screenshot: screenshot || '' // Base64 image
      };

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في إرسال الطلب');
      }

      // إنشاء رسالة الواتساب
      let whatsappMessage = `
${activeTab === 'transfer' ? '💳 طلب تحويل إلكتروني جديد' : '🏪 طلب شحن ماكينة جديد'}

👤 الاسم: ${formData.name}
📱 رقم الهاتف: ${formData.phone1}
📱 رقم إضافي: ${formData.phone2 || 'غير محدد'}
📍 العنوان: ${formData.address}
      `;

      if (activeTab === 'transfer') {
        whatsappMessage += `
💼 نوع الحساب المرسل منه: ${formData.accountType === 'instaPay' ? 'إنستا باي' : 'فودافون كاش'}
📤 الحساب المرسل منه: ${formData.senderAccount}
💰 المبلغ: ${formData.amount} جنيه
📥 التحويل إلى: ${formData.transferTo === 'vodafoneCash' ? 'فودافون كاش' : 'إنستا باي'}
🎯 الحساب المستقبل: ${formData.recipientAccount}
👤 اسم صاحب الحساب: ${formData.recipientName}
        `;
      } else {
        whatsappMessage += `
🏪 نوع الماكينة: ${formData.machineType === 'fawry' ? 'فوري' : formData.machineType === 'aman' ? 'أمان' : 'الأهلي تمكين'}
🔢 رقم التاجر/كود الماكينة: ${formData.merchantNumber}
💰 المبلغ: ${formData.amount} جنيه
        `;
      }

      if (screenshot) {
        whatsappMessage += `\n📸 تم إرفاق صورة السكرين شوت`;
      }

      const whatsappUrl = `https://wa.me/201010600865?text=${encodeURIComponent(whatsappMessage.trim())}`;
      window.open(whatsappUrl, '_blank');
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        phone1: '',
        phone2: '',
        address: '',
        accountType: 'instaPay',
        senderAccount: '',
        amount: '',
        transferTo: 'vodafoneCash',
        recipientAccount: '',
        recipientName: '',
        machineType: 'fawry',
        merchantNumber: ''
      });
      setScreenshot(null);
      
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

  const getAccountNumber = () => {
    if (formData.accountType === 'instaPay') {
      return 'ahmad.elhawty@instapay'; // يوزر إنستا باي
    } else {
      return '01010600865'; // رقم فودافون كاش
    }
  };

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-beige mb-6 text-center">
              {t('electronicTransfer')}
            </h1>
            
            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('transfer')}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'transfer'
                    ? 'bg-beige text-white'
                    : 'text-beige hover:bg-beige hover:bg-opacity-20'
                }`}
              >
                التحويل الإلكتروني
              </button>
              <button
                onClick={() => setActiveTab('machine')}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'machine'
                    ? 'bg-beige text-white'
                    : 'text-beige hover:bg-beige hover:bg-opacity-20'
                }`}
              >
                شحن الماكينة
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
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
                    placeholder="أدخل اسمك"
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
                    placeholder="العنوان"
                  />
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-beige font-semibold mb-2">
                  {t('accountType')} *
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="select-field"
                >
                  <option value="instaPay">{t('instaPay')}</option>
                  <option value="vodafoneCash">{t('vodafoneCash')}</option>
                </select>
              </div>

              {/* Transfer Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-beige mb-4 text-lg">
                  {formData.accountType === 'instaPay' ? 'بيانات إنستا باي' : 'بيانات فودافون كاش'}
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.accountType === 'instaPay' ? 'يوزر إنستا باي للتحويل عليه:' : 'رقم فودافون كاش للتحويل عليه:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={getAccountNumber()}
                      readOnly
                      className="input-field bg-gray-100 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getAccountNumber())}
                      className="p-3 bg-beige text-white rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      <FiCopy className="text-xl" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-beige font-semibold mb-2">
                      {t('senderAccount')} *
                    </label>
                    <input
                      type="text"
                      name="senderAccount"
                      value={formData.senderAccount}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder={formData.accountType === 'instaPay' ? 'يوزر إنستا باي' : 'رقم فودافون كاش'}
                    />
                  </div>
                  
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
                      placeholder="المبلغ"
                    />
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div className="mt-6">
                  <label className="block text-beige font-semibold mb-2">
                    {t('uploadScreenshot')} *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-beige transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="screenshot"
                      required
                    />
                    <label
                      htmlFor="screenshot"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FiUpload className="text-5xl text-gray-400 mb-3" />
                      <span className="text-gray-600 font-medium">
                        {screenshot ? 'تم رفع الصورة ✓' : 'اضغط لرفع صورة السكرين شوت'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Transfer To Section */}
              {activeTab === 'transfer' && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-beige mb-4 text-lg">
                    بيانات المستلم
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-beige font-semibold mb-2">
                      {t('transferTo')} *
                    </label>
                    <select
                      name="transferTo"
                      value={formData.transferTo}
                      onChange={handleInputChange}
                      className="select-field"
                    >
                      <option value="vodafoneCash">{t('vodafoneCash')}</option>
                      <option value="instaPay">{t('instaPay')}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-beige font-semibold mb-2">
                        {formData.transferTo === 'instaPay' ? 'يوزر إنستا باي' : 'رقم فودافون كاش'} *
                      </label>
                      <input
                        type="text"
                        name="recipientAccount"
                        value={formData.recipientAccount}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder={formData.transferTo === 'instaPay' ? 'يوزر إنستا باي' : 'رقم فودافون كاش'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-beige font-semibold mb-2">
                        {t('walletOwnerName')} *
                      </label>
                      <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="اسم صاحب المحفظة"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Machine Section */}
              {activeTab === 'machine' && (
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-beige mb-4 text-lg">
                    بيانات الماكينة
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-beige font-semibold mb-2">
                        {t('machineType')} *
                      </label>
                      <select
                        name="machineType"
                        value={formData.machineType}
                        onChange={handleInputChange}
                        className="select-field"
                      >
                        <option value="fawry">{t('fawry')}</option>
                        <option value="aman">{t('aman')}</option>
                        <option value="ahlyTamkeen">{t('ahlyTamkeen')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-beige font-semibold mb-2">
                        {t('merchantNumber')} *
                      </label>
                      <input
                        type="text"
                        name="merchantNumber"
                        value={formData.merchantNumber}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="رقم التاجر أو كود الماكينة أو MID | TERMINAL ID"
                      />
                    </div>
                  </div>
                </div>
              )}

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

export default ElectronicTransfer;
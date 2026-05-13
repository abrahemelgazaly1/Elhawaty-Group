import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

const ComplaintForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
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
      const whatsappMessage = `
📝 ${t('newComplaint')}

👤 ${t('name')}: ${formData.name}
📱 ${t('phone')}: ${formData.phone}
💬 ${t('message')}:
${formData.message}
      `.trim();

      const whatsappUrl = `https://wa.me/201010600865?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      setFormData({
        name: '',
        phone: '',
        message: ''
      });
      
      Swal.fire({
        icon: 'success',
        title: t('sentSuccessfully'),
        text: t('thankYouForMessage'),
        confirmButtonColor: '#C8A97E',
        timer: 3000
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: t('errorSendingMessage'),
        confirmButtonColor: '#C8A97E'
      });
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-beige mb-4 text-center">
            {t('sendComplaint')}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {t('complaintDescription')}
          </p>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="space-y-5">
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
                  placeholder={t('enterYourName')}
                />
              </div>

              <div>
                <label className="block text-beige font-semibold mb-2">
                  {t('phone')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-beige font-semibold mb-2">
                  {t('yourMessage')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="input-field resize-none"
                  placeholder={t('writeYourMessage')}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-lg py-4"
              >
                {t('sendNow')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;

const express = require('express');
const Request = require('../models/Request');
const { verifyToken } = require('./auth');
const router = express.Router();

// Get all requests (Admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = {};
    if (type) {
      query.type = type;
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'خطأ في جلب الطلبات' });
  }
});

// Get single request (Admin only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ message: 'خطأ في جلب الطلب' });
  }
});

// Create banking transaction request
router.post('/banking', async (req, res) => {
  try {
    const {
      name,
      phone1,
      phone2,
      address,
      service_type,
      bank_type,
      amount
    } = req.body;

    if (!name || !phone1 || !address || !service_type || !bank_type || !amount) {
      return res.status(400).json({ message: 'جميع البيانات المطلوبة يجب ملؤها' });
    }

    const request = new Request({
      type: 'banking',
      name,
      phone1,
      phone2: phone2 || '',
      address,
      service_type,
      bank_type,
      amount: parseFloat(amount)
    });

    await request.save();

    res.json({
      message: 'تم إنشاء طلب التحويل البنكي بنجاح',
      requestId: request._id
    });
  } catch (error) {
    console.error('Error creating banking request:', error);
    res.status(500).json({ message: 'خطأ في إنشاء طلب التحويل البنكي' });
  }
});

// Create electronic transfer request
router.post('/electronic', async (req, res) => {
  try {
    const {
      name,
      phone1,
      phone2,
      address,
      account_type,
      sender_account,
      amount,
      transfer_to,
      recipient_account,
      recipient_name,
      machine_type,
      merchant_number,
      screenshot
    } = req.body;

    if (!name || !phone1 || !address || !account_type || !sender_account || !amount) {
      return res.status(400).json({ message: 'جميع البيانات المطلوبة يجب ملؤها' });
    }

    const request = new Request({
      type: 'electronic',
      name,
      phone1,
      phone2: phone2 || '',
      address,
      account_type,
      sender_account,
      amount: parseFloat(amount),
      transfer_to: transfer_to || '',
      recipient_account: recipient_account || '',
      recipient_name: recipient_name || '',
      machine_type: machine_type || '',
      merchant_number: merchant_number || '',
      screenshot: screenshot || ''
    });

    await request.save();

    res.json({
      message: 'تم إنشاء طلب التحويل الإلكتروني بنجاح',
      requestId: request._id
    });
  } catch (error) {
    console.error('Error creating electronic request:', error);
    res.status(500).json({ message: 'خطأ في إنشاء طلب التحويل الإلكتروني' });
  }
});

// Update request status (Admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'completed', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'حالة الطلب غير صالحة' });
    }

    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json({ message: 'تم تحديث حالة الطلب بنجاح' });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'خطأ في تحديث حالة الطلب' });
  }
});

// Delete request (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'خطأ في حذف الطلب' });
  }
});

module.exports = router;

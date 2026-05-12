const express = require('express');
const Order = require('../models/Order');
const { verifyToken } = require('./auth');
const router = express.Router();

// Get all orders (Admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'خطأ في جلب الطلبات' });
  }
});

// Get single order (Admin only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'خطأ في جلب الطلب' });
  }
});

// Create new order (from frontend)
router.post('/', async (req, res) => {
  try {
    const {
      product_id,
      product_name,
      product_price,
      product_image,
      quantity,
      customer_name,
      customer_address,
      customer_phone1,
      customer_phone2
    } = req.body;

    if (!product_name || !product_price || !quantity || !customer_name || !customer_address || !customer_phone1) {
      return res.status(400).json({ message: 'جميع البيانات المطلوبة يجب ملؤها' });
    }

    const delivery_fee = 120;
    const total_price = (parseFloat(product_price) * parseInt(quantity)) + delivery_fee;

    const order = new Order({
      product_id: product_id || null,
      product_name,
      product_price: parseFloat(product_price),
      product_image: product_image || '',
      quantity: parseInt(quantity),
      customer_name,
      customer_address,
      customer_phone1,
      customer_phone2: customer_phone2 || '',
      delivery_fee,
      total_price
    });

    await order.save();

    res.json({
      message: 'تم إنشاء الطلب بنجاح',
      orderId: order._id,
      total_price
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'خطأ في إنشاء الطلب' });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'حالة الطلب غير صالحة' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json({ message: 'تم تحديث حالة الطلب بنجاح' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'خطأ في تحديث حالة الطلب' });
  }
});

// Delete order (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'خطأ في حذف الطلب' });
  }
});

module.exports = router;

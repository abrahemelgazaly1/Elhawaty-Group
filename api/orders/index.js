const mongoose = require('mongoose');
const Order = require('../../server/models/Order');

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = db;
  return db;
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // GET all orders (Admin only)
    if (req.method === 'GET') {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json(orders);
    }
    // POST new order
    else if (req.method === 'POST') {
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
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

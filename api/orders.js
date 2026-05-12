const { connectDB, getDB } = require('./_db');
const jwt = require('jsonwebtoken');

const verifyToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'elhawty-secret-key-2024');
  } catch {
    return null;
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();
    const db = getDB();
    const { id } = req.query;

    // GET all orders (Admin only)
    if (req.method === 'GET') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'خطأ في جلب الطلبات' });
        res.json(rows);
      });
    }
    // POST new order (from frontend)
    else if (req.method === 'POST') {
      const { product_id, product_name, product_price, product_image, quantity, customer_name, customer_address, customer_phone1, customer_phone2 } = req.body;

      if (!product_name || !product_price || !quantity || !customer_name || !customer_address || !customer_phone1) {
        return res.status(400).json({ message: 'جميع البيانات المطلوبة يجب ملؤها' });
      }

      const delivery_fee = 120;
      const total_price = (parseFloat(product_price) * parseInt(quantity)) + delivery_fee;

      db.run(
        'INSERT INTO orders (product_id, product_name, product_price, product_image, quantity, customer_name, customer_address, customer_phone1, customer_phone2, delivery_fee, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product_id || null, product_name, parseFloat(product_price), product_image || '', parseInt(quantity), customer_name, customer_address, customer_phone1, customer_phone2 || '', delivery_fee, total_price],
        function(err) {
          if (err) return res.status(500).json({ message: 'خطأ في إنشاء الطلب' });
          res.json({ message: 'تم إنشاء الطلب بنجاح', orderId: this.lastID, total_price });
        }
      );
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

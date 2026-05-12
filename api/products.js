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

    // GET all products
    if (req.method === 'GET') {
      const { category, search } = req.query;
      let query = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }
      if (search) {
        query += ' AND name LIKE ?';
        params.push(`%${search}%`);
      }
      query += ' ORDER BY created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'خطأ في جلب المنتجات' });
        const products = rows.map(p => ({ ...p, images: p.images ? JSON.parse(p.images) : [] }));
        res.json(products);
      });
    }
    // POST new product (Admin only)
    else if (req.method === 'POST') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      const { name, price, description, category, subcategory, battery, images } = req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ message: 'الاسم والسعر والفئة مطلوبة' });
      }

      db.run(
        'INSERT INTO products (name, price, description, category, subcategory, battery, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, parseFloat(price), description || '', category, subcategory || '', battery || '', JSON.stringify(images || [])],
        function(err) {
          if (err) return res.status(500).json({ message: 'خطأ في إضافة المنتج' });
          res.json({ message: 'تم إضافة المنتج بنجاح', productId: this.lastID });
        }
      );
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

const { connectDB, getDB } = require('../_db');
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

    // GET single product by ID
    if (req.method === 'GET') {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'خطأ في جلب المنتج' });
        if (!row) return res.status(404).json({ message: 'المنتج غير موجود' });
        res.json({ ...row, images: row.images ? JSON.parse(row.images) : [] });
      });
    }
    // PUT update product (Admin only)
    else if (req.method === 'PUT') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      const { name, price, description, category, subcategory, battery, images } = req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ message: 'الاسم والسعر والفئة مطلوبة' });
      }

      db.run(
        'UPDATE products SET name=?, price=?, description=?, category=?, subcategory=?, battery=?, images=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
        [name, parseFloat(price), description || '', category, subcategory || '', battery || '', JSON.stringify(images || []), id],
        function(err) {
          if (err) return res.status(500).json({ message: 'خطأ في تحديث المنتج' });
          if (this.changes === 0) return res.status(404).json({ message: 'المنتج غير موجود' });
          res.json({ message: 'تم تحديث المنتج بنجاح' });
        }
      );
    }
    // DELETE product (Admin only)
    else if (req.method === 'DELETE') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ message: 'خطأ في حذف المنتج' });
        if (this.changes === 0) return res.status(404).json({ message: 'المنتج غير موجود' });
        res.json({ message: 'تم حذف المنتج بنجاح' });
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Product [id] error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

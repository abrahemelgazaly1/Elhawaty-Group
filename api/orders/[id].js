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

    // GET single order by ID (Admin only)
    if (req.method === 'GET') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'خطأ في جلب الطلب' });
        if (!row) return res.status(404).json({ message: 'الطلب غير موجود' });
        res.json(row);
      });
    }
    // PATCH update order status
    else if (req.method === 'PATCH') {
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'حالة الطلب غير صالحة' });
      }

      db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id], function(err) {
        if (err) return res.status(500).json({ message: 'خطأ في تحديث حالة الطلب' });
        if (this.changes === 0) return res.status(404).json({ message: 'الطلب غير موجود' });
        res.json({ message: 'تم تحديث حالة الطلب بنجاح', status });
      });
    }
    // DELETE order
    else if (req.method === 'DELETE') {
      db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ message: 'خطأ في حذف الطلب' });
        if (this.changes === 0) return res.status(404).json({ message: 'الطلب غير موجود' });
        res.json({ message: 'تم حذف الطلب بنجاح' });
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};
(500).json({ message: 'خطأ في جلب الطلب' });
        if (!row) return res.status(404).json({ message: 'الطلب غير موجود' });
        res.json(row);
      });
    }
    // PATCH update order status (Admin only)
    else if (req.method === 'PATCH') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'حالة الطلب غير صالحة' });
      }

      db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id], function(err) {
        if (err) return res.status(500).json({ message: 'خطأ في تحديث حالة الطلب' });
        if (this.changes === 0) return res.status(404).json({ message: 'الطلب غير موجود' });
        res.json({ message: 'تم تحديث حالة الطلب بنجاح' });
      });
    }
    // DELETE order (Admin only)
    else if (req.method === 'DELETE') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ message: 'خطأ في حذف الطلب' });
        if (this.changes === 0) return res.status(404).json({ message: 'الطلب غير موجود' });
        res.json({ message: 'تم حذف الطلب بنجاح' });
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Order [id] error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

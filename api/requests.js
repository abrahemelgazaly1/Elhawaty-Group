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
    const { id, type: requestType } = req.query;

    // GET all requests (Admin only)
    if (req.method === 'GET') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      let query = 'SELECT * FROM requests WHERE 1=1';
      const params = [];
      if (requestType) {
        query += ' AND type = ?';
        params.push(requestType);
      }
      query += ' ORDER BY created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'خطأ في جلب الطلبات' });
        res.json(rows);
      });
    }
    // POST new request
    else if (req.method === 'POST') {
      const { type, name, phone1, phone2, address, service_type, bank_type, amount, account_type, sender_account, transfer_to, recipient_account, recipient_name, machine_type, merchant_number, screenshot } = req.body;

      if (!type || !name || !phone1 || !address) {
        return res.status(400).json({ message: 'البيانات الأساسية مطلوبة' });
      }

      if (type === 'banking') {
        db.run(
          'INSERT INTO requests (type, name, phone1, phone2, address, service_type, bank_type, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [type, name, phone1, phone2 || '', address, service_type, bank_type, parseFloat(amount)],
          function(err) {
            if (err) return res.status(500).json({ message: 'خطأ في إنشاء الطلب' });
            res.json({ message: 'تم إنشاء الطلب بنجاح', requestId: this.lastID });
          }
        );
      } else if (type === 'electronic') {
        db.run(
          'INSERT INTO requests (type, name, phone1, phone2, address, account_type, sender_account, amount, transfer_to, recipient_account, recipient_name, machine_type, merchant_number, screenshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [type, name, phone1, phone2 || '', address, account_type, sender_account, parseFloat(amount), transfer_to || '', recipient_account || '', recipient_name || '', machine_type || '', merchant_number || '', screenshot || ''],
          function(err) {
            if (err) return res.status(500).json({ message: 'خطأ في إنشاء الطلب' });
            res.json({ message: 'تم إنشاء الطلب بنجاح', requestId: this.lastID });
          }
        );
      } else {
        res.status(400).json({ message: 'نوع الطلب غير صالح' });
      }
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Requests error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

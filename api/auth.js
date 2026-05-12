const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB, getDB } = require('./_db');

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
    const { action } = req.query;

    // Login
    if (req.method === 'POST' && !action) {
      const { email, password } = req.body;

      db.get('SELECT * FROM admins WHERE email = ?', [email], async (err, admin) => {
        if (err || !admin) {
          return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        const token = jwt.sign(
          { id: admin.id, email: admin.email, role: admin.role },
          process.env.JWT_SECRET || 'elhawty-secret-key-2024',
          { expiresIn: '24h' }
        );

        res.json({
          message: 'تم تسجيل الدخول بنجاح',
          token,
          user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
        });
      });
    }
    // Verify token
    else if (req.method === 'GET' && action === 'verify') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'لا يوجد رمز مميز' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elhawty-secret-key-2024');
        res.json({ message: 'الرمز المميز صالح', user: decoded });
      } catch (error) {
        res.status(401).json({ message: 'رمز مميز غير صالح' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

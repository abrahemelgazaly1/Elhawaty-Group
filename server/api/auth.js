const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'elhawty-secret-key-2024',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: { 
        id: admin._id,
        email: admin.email, 
        name: admin.name,
        role: admin.role 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'لا يوجد رمز مميز، الوصول مرفوض' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elhawty-secret-key-2024');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'رمز مميز غير صالح' });
  }
};

// Verify token endpoint
router.get('/verify', verifyToken, (req, res) => {
  res.json({ message: 'الرمز المميز صالح', user: req.user });
});

// Get all admins (Admin only)
router.get('/admins', verifyToken, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'خطأ في جلب المسؤولين' });
  }
});

// Add new admin (Admin only)
router.post('/admins', verifyToken, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبة' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || 'Admin',
      role: role || 'admin'
    });

    await admin.save();

    res.json({
      message: 'تم إنشاء المسؤول بنجاح',
      adminId: admin._id
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Update admin password (Admin only)
router.put('/admins/:id/password', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'كلمة المرور مطلوبة' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: 'المسؤول غير موجود' });
    }

    res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Delete admin (Admin only)
router.delete('/admins/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the last admin
    const adminCount = await Admin.countDocuments();

    if (adminCount <= 1) {
      return res.status(400).json({ message: 'لا يمكن حذف آخر مسؤول' });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: 'المسؤول غير موجود' });
    }

    res.json({ message: 'تم حذف المسؤول بنجاح' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'خطأ في حذف المسؤول' });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken;

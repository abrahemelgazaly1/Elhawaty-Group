const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@elhawty.com' });

    if (existingAdmin) {
      console.log('ℹ️  Default admin already exists');
      process.exit(0);
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123456', 10);

    const admin = new Admin({
      email: 'admin@elhawty.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Default admin created successfully');
    console.log('📧 Email: admin@elhawty.com');
    console.log('🔑 Password: admin123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();

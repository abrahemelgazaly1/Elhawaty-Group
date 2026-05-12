const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables from server/.env
const dotenv = require('dotenv');
const envPath = path.join(__dirname, '../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email:', process.env.ADMIN_EMAIL);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Create admin
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', process.env.ADMIN_EMAIL);
    console.log('🔑 Password:', process.env.ADMIN_PASSWORD);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

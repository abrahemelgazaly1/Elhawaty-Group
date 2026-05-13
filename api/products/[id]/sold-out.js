const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  battery: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  sold_out: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

let Product;
try {
  Product = mongoose.model('Product');
} catch {
  Product = mongoose.model('Product', productSchema);
}

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
  res.setHeader('Access-Control-Allow-Methods', 'PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'غير مصرح' });
    }

    await connectDB();
    const { id } = req.query;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    product.sold_out = !product.sold_out;
    await product.save();

    res.json({
      message: product.sold_out ? 'تم تحديث المنتج إلى نفد المخزون' : 'تم تفعيل المنتج',
      sold_out: product.sold_out
    });
  } catch (error) {
    console.error('Sold out toggle error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

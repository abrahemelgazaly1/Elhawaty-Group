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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();
    const { id } = req.query;

    // GET single product by ID
    if (req.method === 'GET') {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'المنتج غير موجود' });
      }
      res.json(product);
    }
    // PUT update product (Admin only)
    else if (req.method === 'PUT') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      const { name, price, description, category, subcategory, battery, images } = req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ message: 'الاسم والسعر والفئة مطلوبة' });
      }

      const product = await Product.findByIdAndUpdate(
        id,
        {
          name,
          price: parseFloat(price),
          description: description || '',
          category,
          subcategory: subcategory || '',
          battery: battery || '',
          images: images || []
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'المنتج غير موجود' });
      }

      res.json({ message: 'تم تحديث المنتج بنجاح', product });
    }
    // DELETE product (Admin only)
    else if (req.method === 'DELETE') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ message: 'المنتج غير موجود' });
      }

      res.json({ message: 'تم حذف المنتج بنجاح' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Product [id] error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

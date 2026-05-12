const mongoose = require('mongoose');
const Product = require('../../server/models/Product');

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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // GET all products
    if (req.method === 'GET') {
      const { category, search } = req.query;
      
      let query = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      res.json(products);
    }
    // POST new product (Admin only)
    else if (req.method === 'POST') {
      const {
        name,
        price,
        description,
        category,
        subcategory,
        battery,
        images
      } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({ message: 'الاسم والسعر والفئة مطلوبة' });
      }

      const product = new Product({
        name,
        price: parseFloat(price),
        description: description || '',
        category,
        subcategory: subcategory || '',
        battery: battery || '',
        images: images || []
      });

      await product.save();

      res.json({
        message: 'تم إضافة المنتج بنجاح',
        productId: product._id
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

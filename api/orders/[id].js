const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Order Schema
const orderSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  product_name: {
    type: String,
    required: true
  },
  product_price: {
    type: Number,
    required: true
  },
  product_image: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  customer_name: {
    type: String,
    required: true
  },
  customer_address: {
    type: String,
    required: true
  },
  customer_phone1: {
    type: String,
    required: true
  },
  customer_phone2: {
    type: String,
    default: ''
  },
  delivery_fee: {
    type: Number,
    default: 120
  },
  total_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

let Order;
try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', orderSchema);
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

    // GET single order by ID (Admin only)
    if (req.method === 'GET') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'الطلب غير موجود' });
      }
      res.json(order);
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

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'الطلب غير موجود' });
      }

      res.json({ message: 'تم تحديث حالة الطلب بنجاح', order });
    }
    // DELETE order (Admin only)
    else if (req.method === 'DELETE') {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ message: 'غير مصرح' });

      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return res.status(404).json({ message: 'الطلب غير موجود' });
      }

      res.json({ message: 'تم حذف الطلب بنجاح' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Order [id] error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

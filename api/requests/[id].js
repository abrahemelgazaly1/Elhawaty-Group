const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Request Schema
const requestSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['banking', 'electronic']
  },
  name: {
    type: String,
    required: true
  },
  phone1: {
    type: String,
    required: true
  },
  phone2: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: Number
  },
  service_type: {
    type: String
  },
  bank_type: {
    type: String
  },
  account_type: {
    type: String
  },
  sender_account: {
    type: String
  },
  transfer_to: {
    type: String
  },
  recipient_account: {
    type: String
  },
  recipient_name: {
    type: String
  },
  machine_type: {
    type: String
  },
  merchant_number: {
    type: String
  },
  screenshot: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

let Request;
try {
  Request = mongoose.model('Request');
} catch {
  Request = mongoose.model('Request', requestSchema);
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
    const user = verifyToken(req);
    
    if (!user) return res.status(401).json({ message: 'غير مصرح' });

    // GET single request
    if (req.method === 'GET') {
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ message: 'الطلب غير موجود' });
      }
      res.json(request);
    }
    // PATCH update request status
    else if (req.method === 'PATCH') {
      const { status } = req.body;
      const validStatuses = ['pending', 'approved', 'completed', 'rejected'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'حالة الطلب غير صالحة' });
      }

      const request = await Request.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!request) {
        return res.status(404).json({ message: 'الطلب غير موجود' });
      }

      res.json({ message: 'تم تحديث حالة الطلب بنجاح', request });
    }
    // DELETE request
    else if (req.method === 'DELETE') {
      const request = await Request.findByIdAndDelete(id);
      if (!request) {
        return res.status(404).json({ message: 'الطلب غير موجود' });
      }

      res.json({ message: 'تم حذف الطلب بنجاح' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request [id] error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

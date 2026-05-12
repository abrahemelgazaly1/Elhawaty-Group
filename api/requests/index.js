const mongoose = require('mongoose');
const Request = require('../../server/models/Request');

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

    // GET all requests (Admin only)
    if (req.method === 'GET') {
      const { type } = req.query;
      
      let query = {};
      if (type) {
        query.type = type;
      }

      const requests = await Request.find(query).sort({ createdAt: -1 });
      res.json(requests);
    }
    // POST new request
    else if (req.method === 'POST') {
      const { type } = req.body;

      if (!type || !['banking', 'electronic'].includes(type)) {
        return res.status(400).json({ message: 'نوع الطلب غير صالح' });
      }

      const request = new Request(req.body);
      await request.save();

      res.json({
        message: 'تم إنشاء الطلب بنجاح',
        requestId: request._id
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Requests error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

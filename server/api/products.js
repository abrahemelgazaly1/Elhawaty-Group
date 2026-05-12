const express = require('express');
const Product = require('../models/Product');
const { verifyToken } = require('./auth');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'خطأ في جلب المنتجات' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'خطأ في جلب المنتج' });
  }
});

// Add new product (Admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'خطأ في إضافة المنتج' });
  }
});

// Update product (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
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

    res.json({ message: 'تم تحديث المنتج بنجاح' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'خطأ في تحديث المنتج' });
  }
});

// Toggle sold out status (Admin only)
router.patch('/:id/sold-out', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    product.sold_out = !product.sold_out;
    await product.save();

    res.json({
      message: product.sold_out ? 'تم تعيين المنتج كمنتهي الصلاحية' : 'تم إعادة تفعيل المنتج',
      sold_out: product.sold_out
    });
  } catch (error) {
    console.error('Error updating sold out status:', error);
    res.status(500).json({ message: 'خطأ في تحديث حالة المنتج' });
  }
});

// Delete product (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'خطأ في حذف المنتج' });
  }
});

module.exports = router;
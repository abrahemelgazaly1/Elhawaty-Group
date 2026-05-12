const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// Upload images as Base64 (for products)
router.post('/images', verifyToken, (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'لم يتم رفع أي صور' });
    }

    // Validate Base64 images
    const validImages = images.filter(img => {
      return img && typeof img === 'string' && img.startsWith('data:image/');
    });

    if (validImages.length === 0) {
      return res.status(400).json({ message: 'الصور غير صالحة' });
    }

    res.json({
      message: 'تم رفع الصور بنجاح',
      images: validImages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'خطأ في رفع الصور' });
  }
});

// Upload single screenshot as Base64
router.post('/screenshot', (req, res) => {
  try {
    const { screenshot } = req.body;

    if (!screenshot || typeof screenshot !== 'string' || !screenshot.startsWith('data:image/')) {
      return res.status(400).json({ message: 'الصورة غير صالحة' });
    }

    res.json({
      message: 'تم رفع الصورة بنجاح',
      image: screenshot
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'خطأ في رفع الصورة' });
  }
});

module.exports = router;

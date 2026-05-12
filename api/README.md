# ELHAWTY API - Vercel Serverless Functions

هذا الفولدر يحتوي على Serverless Functions للـ Backend على Vercel.

## الملفات:

### Core Files:
- `_db.js` - Database connection و initialization

### Auth:
- `auth.js` - Login و authentication

### Products:
- `products.js` - Get all products, Add new product
- `products/[id].js` - Get/Update/Delete single product, Toggle sold out

### Orders:
- `orders.js` - Get all orders (Admin), Create new order
- `orders/[id].js` - Get/Update/Delete single order

### Requests:
- `requests.js` - Get all requests (Admin), Create new request
- `requests/[id].js` - Get/Update/Delete single request

## Environment Variables المطلوبة على Vercel:

```
JWT_SECRET=your-secret-key-here
```

## الـ Endpoints:

### Auth:
- `POST /api/auth` - Login
- `GET /api/auth?action=verify` - Verify token

### Products:
- `GET /api/products` - Get all products
- `GET /api/products?category=phones` - Filter by category
- `GET /api/products?search=iphone` - Search products
- `POST /api/products` - Add product (Admin)
- `GET /api/products/1` - Get single product
- `PUT /api/products/1` - Update product (Admin)
- `PATCH /api/products/1` - Toggle sold out (Admin)
- `DELETE /api/products/1` - Delete product (Admin)

### Orders:
- `GET /api/orders` - Get all orders (Admin)
- `POST /api/orders` - Create order
- `GET /api/orders/1` - Get single order (Admin)
- `PATCH /api/orders/1` - Update order status (Admin)
- `DELETE /api/orders/1` - Delete order (Admin)

### Requests:
- `GET /api/requests` - Get all requests (Admin)
- `GET /api/requests?type=banking` - Filter by type
- `POST /api/requests` - Create request (type: banking or electronic)
- `GET /api/requests/1` - Get single request (Admin)
- `PATCH /api/requests/1` - Update request status (Admin)
- `DELETE /api/requests/1` - Delete request (Admin)

## ملاحظات:

- الـ Database هو SQLite في `/tmp` على Vercel (temporary)
- لو عايز database دائم، استخدم MongoDB أو PostgreSQL
- الـ Admin الافتراضي: admin@elhawty.com / admin123456
- كل الـ routes بتدعم CORS
- الـ Admin endpoints محتاجة Authorization header: `Bearer <token>`

## Structure:

```
api/
├── _db.js                 # Database setup
├── auth.js                # Login & verify
├── products.js            # List & create products
├── products/
│   └── [id].js           # Single product operations
├── orders.js              # List & create orders
├── orders/
│   └── [id].js           # Single order operations
├── requests.js            # List & create requests
└── requests/
    └── [id].js           # Single request operations
```

## Deploy:

1. Push to GitHub
2. Connect to Vercel
3. Add Environment Variable: `JWT_SECRET`
4. Deploy!

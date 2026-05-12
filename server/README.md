# ELHAWTY GROUP Server

Backend server for ELHAWTY GROUP e-commerce platform using MongoDB.

## Features

- MongoDB database for all data storage
- Base64 image storage (no file uploads)
- JWT authentication
- RESTful API endpoints
- Admin management system

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. Create default admin:
```bash
node scripts/createDefaultAdmin.js
```

4. Start server:
```bash
npm start
```

## Default Admin Credentials

- Email: admin@elhawty.com
- Password: admin123456

**⚠️ Change these credentials after first login!**

## API Endpoints

### Authentication
- POST `/api/auth/login` - Admin login
- GET `/api/auth/verify` - Verify token

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Orders
- GET `/api/orders` - Get all orders (Admin)
- GET `/api/orders/:id` - Get single order (Admin)
- POST `/api/orders` - Create order
- PATCH `/api/orders/:id/status` - Update order status (Admin)
- DELETE `/api/orders/:id` - Delete order (Admin)

### Requests
- GET `/api/requests` - Get all requests (Admin)
- GET `/api/requests/:id` - Get single request (Admin)
- POST `/api/requests/banking` - Create banking request
- POST `/api/requests/electronic` - Create electronic request
- PATCH `/api/requests/:id/status` - Update request status (Admin)
- DELETE `/api/requests/:id` - Delete request (Admin)

## Image Storage

Images are stored as Base64 strings in MongoDB. No file system uploads required.

## Deployment

This server is designed to work with Vercel serverless functions. The API routes in `/api` folder are configured for Vercel deployment.

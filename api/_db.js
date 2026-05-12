const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

let db = null;

const connectDB = async () => {
  if (db) return db;

  const dbPath = path.join('/tmp', 'elhawty.db');
  db = new sqlite3.Database(dbPath);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        subcategory TEXT,
        battery TEXT,
        images TEXT,
        sold_out INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Orders table
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        product_name TEXT NOT NULL,
        product_price REAL NOT NULL,
        product_image TEXT,
        quantity INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        customer_phone1 TEXT NOT NULL,
        customer_phone2 TEXT,
        delivery_fee REAL DEFAULT 120,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Requests table
      db.run(`CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        phone1 TEXT NOT NULL,
        phone2 TEXT,
        address TEXT NOT NULL,
        amount REAL,
        service_type TEXT,
        bank_type TEXT,
        account_type TEXT,
        sender_account TEXT,
        transfer_to TEXT,
        recipient_account TEXT,
        recipient_name TEXT,
        machine_type TEXT,
        merchant_number TEXT,
        screenshot TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Admins table
      db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create default admin
        db.get('SELECT * FROM admins WHERE email = ?', ['admin@elhawty.com'], (err, row) => {
          if (!row) {
            bcrypt.hash('admin123456', 10, (err, hash) => {
              if (!err) {
                db.run('INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)',
                  ['admin@elhawty.com', hash, 'Admin', 'admin']);
              }
            });
          }
        });

        resolve(db);
      });
    });
  });
};

const getDB = () => db;

module.exports = { connectDB, getDB };

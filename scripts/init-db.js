const fs = require('fs');
const path = require('path');

// Create the data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Define the path to our database file
const dbPath = path.join(dataDir, 'database.json');

// Check if database already exists
if (fs.existsSync(dbPath)) {
  console.log('Database already exists. Skipping initialization.');
  process.exit(0);
}

// Sample data for initialization - keeping only delivery partners as they are required
const sampleData = {
  customers: [],
  orders: [],
  deliveryPartners: [
    {
      id: 'dp1',
      name: 'Express Delivery',
      charges: 80,
    },
    {
      id: 'dp2',
      name: 'Speedy Shipping',
      charges: 100,
    },
    {
      id: 'dp3',
      name: 'Fast Freight',
      charges: 120,
    },
  ],
  invoices: [],
  payments: [],
};

// Write the sample data to the database file
fs.writeFileSync(dbPath, JSON.stringify(sampleData, null, 2));

console.log('Database initialized with sample data.');
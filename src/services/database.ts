import fs from 'fs';
import path from 'path';
import type { Customer, Order, OrderItem, DeliveryPartner, Invoice, Payment } from '@/types';

// Define the data structure for our database
export interface Database {
  customers: Customer[];
  orders: Order[];
  deliveryPartners: DeliveryPartner[];
  invoices: Invoice[];
  payments: Payment[];
}

// Get the path to our database file
const dbPath = path.join(process.cwd(), 'data', 'database.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the database with default data if it doesn't exist
const initializeDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    const defaultData: Database = {
      customers: [],
      orders: [],
      deliveryPartners: [
        { id: 'dp1', name: 'Express Delivery', charges: 80 },
        { id: 'dp2', name: 'Speedy Shipping', charges: 100 },
        { id: 'dp3', name: 'Fast Freight', charges: 120 },
      ],
      invoices: [],
      payments: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
};

// Read the database
const readDatabase = (): Database => {
  initializeDatabase();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write to the database
const writeDatabase = (data: Database) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Customer operations
export async function getCustomers() {
  try {
    const db = readDatabase();
    return db.customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    const db = readDatabase();
    const customer = db.customers.find(c => c.id === id);
    return customer || null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
  try {
    const db = readDatabase();
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      ...customer,
      createdAt: new Date(),
    };
    db.customers.push(newCustomer);
    writeDatabase(db);
    return newCustomer;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  try {
    const db = readDatabase();
    const customerIndex = db.customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return null;
    }
    
    db.customers[customerIndex] = { ...db.customers[customerIndex], ...updates };
    writeDatabase(db);
    return db.customers[customerIndex];
  } catch (error) {
    console.error('Error updating customer:', error);
    return null;
  }
}

// Order operations
export async function getOrders() {
  try {
    const db = readDatabase();
    // Populate customer and delivery partner data
    const ordersWithDetails = db.orders.map(order => {
      const customer = db.customers.find(c => c.id === order.customerId) || order.customer;
      const deliveryPartner = db.deliveryPartners.find(dp => dp.id === order.deliveryPartnerId) || order.deliveryPartner;
      
      return {
        ...order,
        customer,
        deliveryPartner,
      };
    });
    
    return ordersWithDetails;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const db = readDatabase();
    const order = db.orders.find(o => o.id === id);
    
    if (!order) {
      return null;
    }
    
    // Populate customer and delivery partner data
    const customer = db.customers.find(c => c.id === order.customerId) || order.customer;
    const deliveryPartner = db.deliveryPartners.find(dp => dp.id === order.deliveryPartnerId) || order.deliveryPartner;
    
    return {
      ...order,
      customer,
      deliveryPartner,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function createOrder(order: Partial<Order> & Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const db = readDatabase();
    
    // Ensure customer is saved if it's new
    if (order.customer && !db.customers.find(c => c.id === order.customerId)) {
      db.customers.push(order.customer);
    }
    
    const newOrder: Order = {
      id: order.id || `ord_${Date.now()}`, // Use provided ID or generate one
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.orders.push(newOrder);
    writeDatabase(db);
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  try {
    const db = readDatabase();
    const orderIndex = db.orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return null;
    }
    
    db.orders[orderIndex] = { 
      ...db.orders[orderIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    writeDatabase(db);
    return db.orders[orderIndex];
  } catch (error) {
    console.error('Error updating order:', error);
    return null;
  }
}

// Delete order
export async function deleteOrder(id: string) {
  try {
    const db = readDatabase();
    const orderIndex = db.orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return false;
    }
    
    db.orders.splice(orderIndex, 1);
    writeDatabase(db);
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

// Invoice operations
export async function getInvoices() {
  try {
    const db = readDatabase();
    // Populate order data
    const invoicesWithDetails = db.invoices.map(invoice => {
      const order = db.orders.find(o => o.id === invoice.orderId) || invoice.order;
      
      return {
        ...invoice,
        order,
      };
    });
    
    return invoicesWithDetails;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(id: string) {
  try {
    const db = readDatabase();
    const invoice = db.invoices.find(i => i.id === id);
    
    if (!invoice) {
      return null;
    }
    
    // Populate order data
    const order = db.orders.find(o => o.id === invoice.orderId) || invoice.order;
    
    return {
      ...invoice,
      order,
    };
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>) {
  try {
    const db = readDatabase();
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      ...invoice,
      status: invoice.status || 'pending',
      createdAt: new Date(),
    };
    db.invoices.push(newInvoice);
    writeDatabase(db);
    return newInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    return null;
  }
}

export async function updateInvoiceStatus(id: string, status: 'pending' | 'processing' | 'completed') {
  try {
    const db = readDatabase();
    const invoiceIndex = db.invoices.findIndex(i => i.id === id);
    
    if (invoiceIndex === -1) {
      return null;
    }
    
    db.invoices[invoiceIndex] = { ...db.invoices[invoiceIndex], status };
    writeDatabase(db);
    return db.invoices[invoiceIndex];
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return null;
  }
}

// Delete invoice
export async function deleteInvoice(id: string) {
  try {
    const db = readDatabase();
    const invoiceIndex = db.invoices.findIndex(i => i.id === id);
    
    if (invoiceIndex === -1) {
      return false;
    }
    
    db.invoices.splice(invoiceIndex, 1);
    writeDatabase(db);
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
}

// Delivery partner operations
export async function getDeliveryPartners() {
  try {
    const db = readDatabase();
    return db.deliveryPartners;
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return [];
  }
}

// Payment operations
export async function createPayment(payment: Omit<Payment, 'id'>) {
  try {
    const db = readDatabase();
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      ...payment,
    };
    db.payments.push(newPayment);
    writeDatabase(db);
    return newPayment;
  } catch (error) {
    console.error('Error creating payment:', error);
    return null;
  }
}

export async function getPaymentsByOrderId(orderId: string) {
  try {
    const db = readDatabase();
    return db.payments.filter(p => p.orderId === orderId);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
}

// Analytics operations
export async function getAnalyticsData() {
  try {
    const db = readDatabase();
    
    // Calculate revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);
    
    const todayRevenue = db.orders
      .filter(order => new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const weekRevenue = db.orders
      .filter(order => new Date(order.createdAt) >= oneWeekAgo)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const monthRevenue = db.orders
      .filter(order => new Date(order.createdAt) >= oneMonthAgo)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Service fee collection
    const serviceFeeCollection = db.orders.reduce(
      (sum, order) => sum + order.serviceFee, 
      0
    );
    
    // City-wise orders
    const cityWiseOrders: { [key: string]: number } = {};
    db.orders.forEach(order => {
      const customer = db.customers.find(c => c.id === order.customerId);
      if (customer) {
        cityWiseOrders[customer.city] = (cityWiseOrders[customer.city] || 0) + 1;
      }
    });
    
    const cityWiseOrdersArray = Object.entries(cityWiseOrders)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Top customers
    const customerOrderCounts: { [key: string]: { count: number; total: number } } = {};
    db.orders.forEach(order => {
      customerOrderCounts[order.customerId] = {
        count: (customerOrderCounts[order.customerId]?.count || 0) + 1,
        total: (customerOrderCounts[order.customerId]?.total || 0) + order.totalAmount,
      };
    });
    
    const topCustomers = Object.entries(customerOrderCounts)
      .map(([customerId, stats]) => {
        const customer = db.customers.find(c => c.id === customerId);
        return customer ? { customer, orderCount: stats.count, totalSpent: stats.total } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b as any).totalSpent - (a as any).totalSpent)
      .slice(0, 5) as { customer: Customer; orderCount: number; totalSpent: number }[];
    
    // Pending invoices
    const pendingInvoices = db.invoices.filter(invoice => !invoice.isSent).length;
    
    // Payment breakdown
    const paymentMethods: { [key: string]: number } = { UPI: 0, Cash: 0, Online: 0 };
    db.payments.forEach(payment => {
      paymentMethods[payment.method] = (paymentMethods[payment.method] || 0) + 1;
    });
    
    const totalPayments = Object.values(paymentMethods).reduce((sum, count) => sum + count, 0);
    const paymentBreakdown = {
      UPI: totalPayments > 0 ? Math.round((paymentMethods.UPI / totalPayments) * 100) : 0,
      Cash: totalPayments > 0 ? Math.round((paymentMethods.Cash / totalPayments) * 100) : 0,
      Online: totalPayments > 0 ? Math.round((paymentMethods.Online / totalPayments) * 100) : 0,
    };
    
    return {
      revenue: {
        today: todayRevenue,
        week: weekRevenue,
        month: monthRevenue,
      },
      serviceFeeCollection,
      cityWiseOrders: cityWiseOrdersArray,
      topCustomers,
      pendingInvoices,
      paymentBreakdown,
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return empty data instead of mock data
    return {
      revenue: {
        today: 0,
        week: 0,
        month: 0,
      },
      serviceFeeCollection: 0,
      cityWiseOrders: [],
      topCustomers: [],
      pendingInvoices: 0,
      paymentBreakdown: {
        UPI: 0,
        Cash: 0,
        Online: 0,
      },
    };
  }
}
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  charges: number;
}

export type OrderStatus = 'received' | 'processing' | 'invoiced' | 'delivered';

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  deliveryPartnerId: string;
  deliveryPartner: DeliveryPartner;
  serviceFee: number;
  gst: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Online' | 'Cash';
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  orderId: string;
  order: Order;
  invoiceNumber: string;
  issuedDate: Date;
  dueDate: Date;
  pdfUrl: string;
  isSent: boolean;
  sentAt?: Date;
  status: 'pending' | 'processing' | 'completed';
  createdAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'UPI' | 'Online' | 'Cash';
  transactionId?: string;
  paidAt: Date;
}

export interface AnalyticsData {
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  serviceFeeCollection: number;
  cityWiseOrders: {
    city: string;
    count: number;
  }[];
  topCustomers: {
    customer: Customer;
    orderCount: number;
    totalSpent: number;
  }[];
  pendingInvoices: number;
  paymentBreakdown: {
    UPI: number;
    Cash: number;
    Online: number;
  };
}
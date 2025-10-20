// Utility functions for API calls

// Customers API
export async function getCustomers() {
  try {
    const response = await fetch('/api/customers');
    const data = await response.json();
    return data.customers || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function createCustomer(customerData: any) {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    const data = await response.json();
    return data.customer || null;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

// Delivery Partners API
export async function getDeliveryPartners() {
  try {
    const response = await fetch('/api/delivery-partners');
    const data = await response.json();
    return data.deliveryPartners || [];
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return [];
  }
}

// Orders API
export async function getOrders() {
  try {
    const response = await fetch('/api/orders');
    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    const response = await fetch(`/api/orders?id=${orderId}`);
    const data = await response.json();
    return data.order || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function createOrder(orderData: any) {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    return data.order || null;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function updateOrder(orderId: string, updates: any) {
  try {
    const response = await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: orderId, ...updates }),
    });
    const data = await response.json();
    return data.order || null;
  } catch (error) {
    console.error('Error updating order:', error);
    return null;
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const response = await fetch('/api/orders', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: orderId }),
    });
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

// Invoices API
export async function getInvoices() {
  try {
    const response = await fetch('/api/invoices');
    const data = await response.json();
    return data.invoices || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(invoiceId: string) {
  try {
    const response = await fetch(`/api/invoices?id=${invoiceId}`);
    const data = await response.json();
    return data.invoice || null;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export async function createInvoice(invoiceData: any) {
  try {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });
    const data = await response.json();
    return data.invoice || null;
  } catch (error) {
    console.error('Error creating invoice:', error);
    return null;
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    const response = await fetch('/api/invoices', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: invoiceId }),
    });
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
}

// Analytics API
export async function getAnalyticsData() {
  try {
    const response = await fetch('/api/analytics');
    const data = await response.json();
    return data.analytics || {};
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
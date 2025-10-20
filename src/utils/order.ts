// Utility functions for order operations
import { getOrders } from '@/services/database';

/**
 * Generate order number in format ORD-QBX-YYYYMMDD-NN
 * @returns Order number string
 */
export async function generateSequentialOrderNumber(): Promise<string> {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    
    // Get all orders
    const orders = await getOrders();
    
    // Filter orders for today
    const todayOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    });
    
    // Get the next sequence number
    const nextSequence = todayOrders.length + 1;
    
    return `ORD-QBX-${dateStr}-${nextSequence.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error generating order number:', error);
    // Fallback to basic format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    return `ORD-QBX-${dateStr}-01`;
  }
}
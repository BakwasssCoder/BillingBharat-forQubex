// Utility functions for invoice operations
import { getInvoices } from '@/services/database';

/**
 * Generate invoice number in format INV-QBX-YYYYMMDD-NN
 * @returns Invoice number string
 */
export function generateInvoiceNumber(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Return format without sequence number for first invoice of the day
  return `INV-QBX-${dateStr}`;
}

/**
 * Generate invoice number with proper sequence based on existing invoices
 * @returns Promise<string> Invoice number string
 */
export async function generateSequentialInvoiceNumber(): Promise<string> {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    
    // Get all invoices
    const invoices = await getInvoices();
    
    // Filter invoices for today
    const todayInvoices = invoices.filter(invoice => {
      if (!invoice.issuedDate) return false;
      const invoiceDate = new Date(invoice.issuedDate);
      return invoiceDate.toDateString() === today.toDateString();
    });
    
    // If no invoices today, return without sequence number
    if (todayInvoices.length === 0) {
      return `INV-QBX-${dateStr}`;
    }
    
    // Get the next sequence number without leading zeros
    const nextSequence = todayInvoices.length + 1;
    
    return `INV-QBX-${dateStr}${nextSequence}`;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    // Fallback to basic format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    return `INV-QBX-${dateStr}`;
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createInvoice, getOrderById } from '@/services/database';
import { generateSequentialInvoiceNumber } from '@/utils/invoice';
import type { Invoice } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }
    
    // Get the order
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Generate invoice number
    const invoiceNumber = await generateSequentialInvoiceNumber();
    
    // Calculate due date (7 days from today)
    const issuedDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    // Create the invoice
    const invoiceData = {
      orderId,
      order,
      invoiceNumber,
      issuedDate: issuedDate.toISOString(),
      dueDate: dueDate.toISOString(),
      pdfUrl: `/api/invoices/${orderId}/download`,
      isSent: false,
    };
    
    const invoice = await createInvoice(invoiceData);
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      invoice,
      message: 'Invoice generated successfully'
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
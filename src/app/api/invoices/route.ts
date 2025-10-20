import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, getInvoiceById, createInvoice, deleteInvoice, getOrderById } from '@/services/database';
import { generateSequentialInvoiceNumber } from '@/utils/invoice';
import type { OrderStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');
    
    if (invoiceId) {
      // Get specific invoice
      const invoice = await getInvoiceById(invoiceId);
      if (!invoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        invoice
      });
    } else {
      // Get all invoices
      const invoices = await getInvoices();
      return NextResponse.json({
        success: true,
        invoices
      });
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    // Get the order from the database
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
    const invoiceData: any = {
      orderId,
      order,
      invoiceNumber,
      issuedDate: issuedDate,
      dueDate: dueDate,
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing invoice ID' },
        { status: 400 }
      );
    }
    
    const success = await deleteInvoice(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Invoice not found or failed to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
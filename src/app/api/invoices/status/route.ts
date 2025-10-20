import { NextRequest, NextResponse } from 'next/server';
import { updateInvoiceStatus } from '@/services/database';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing invoice ID or status' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    const invoice = await updateInvoiceStatus(id, status as any);
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found or failed to update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      invoice,
      message: 'Invoice status updated successfully'
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
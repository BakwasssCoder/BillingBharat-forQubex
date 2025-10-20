import { NextRequest, NextResponse } from 'next/server';
import { sendInvoicePDF } from '@/utils/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      phoneNumber, 
      pdfUrl, 
      customerName, 
      totalAmount,
      accessToken,
      phoneNumberId
    } = body;

    // Validate input
    if (!phoneNumber || !pdfUrl || !customerName || !totalAmount || !accessToken || !phoneNumberId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Send the invoice via WhatsApp
    const success = await sendInvoicePDF(
      phoneNumber,
      pdfUrl,
      customerName,
      totalAmount,
      accessToken,
      phoneNumberId
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Invoice sent successfully via WhatsApp',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send invoice via WhatsApp' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    );
  }
}
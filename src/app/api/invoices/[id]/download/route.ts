import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/services/database';
import { InvoiceTemplate } from '@/components/invoice/invoice-template';
import { renderToStaticMarkup } from 'react-dom/server';
import { PDFDocument } from 'pdf-lib';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    
    // Get the invoice
    const invoice = await getInvoiceById(invoiceId);
    
    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }
    
    // In a real implementation, you would generate a proper PDF
    // For now, we'll return a simple PDF with the invoice data
    
    // Create a simple PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    
    // Add some basic content
    page.drawText(`Invoice: ${invoice.invoiceNumber}`, { x: 50, y: 350 });
    page.drawText(`Order ID: ${invoice.orderId}`, { x: 50, y: 330 });
    page.drawText(`Total Amount: ₹${invoice.order.totalAmount}`, { x: 50, y: 310 });
    page.drawText(`Issued Date: ${new Date(invoice.issuedDate).toLocaleDateString()}`, { x: 50, y: 290 });
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Return the PDF
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=\"${invoice.invoiceNumber}.pdf\"`
      }
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/services/database';
import { PDFDocument } from 'pdf-lib';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    
    // Get the invoice
    const invoice = await getInvoiceById(invoiceId);
    
    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }
    
    // Create a simple PDF with invoice details
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    
    // Add invoice header
    page.drawText('Qubex: BuyNDeliver™', { x: 50, y: 750, size: 20 });
    page.drawText('An initiative by QuickBuy Boy', { x: 50, y: 730, size: 12 });
    page.drawText('Invoice', { x: 450, y: 750, size: 16 });
    page.drawText(`#${invoice.invoiceNumber}`, { x: 450, y: 730, size: 12 });
    
    // Add date and order info
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: 700, size: 12 });
    page.drawText(`Order ID: ${invoice.orderId}`, { x: 50, y: 680, size: 12 });
    
    // Add customer info
    page.drawText('Bill To:', { x: 50, y: 650, size: 12 });
    page.drawText(invoice.order.customer.name, { x: 50, y: 630, size: 12 });
    page.drawText(invoice.order.customer.address, { x: 50, y: 610, size: 12 });
    page.drawText(invoice.order.customer.city, { x: 50, y: 590, size: 12 });
    page.drawText(`Phone: ${invoice.order.customer.phone}`, { x: 50, y: 570, size: 12 });
    
    // Add delivery partner info
    page.drawText('Delivery Partner:', { x: 300, y: 650, size: 12 });
    page.drawText(invoice.order.deliveryPartner.name, { x: 300, y: 630, size: 12 });
    
    // Add items header
    page.drawText('Item', { x: 50, y: 530, size: 12 });
    page.drawText('Qty', { x: 300, y: 530, size: 12 });
    page.drawText('Price', { x: 400, y: 530, size: 12 });
    page.drawText('Subtotal', { x: 500, y: 530, size: 12 });
    
    // Add items
    let yPos = 510;
    invoice.order.items.forEach((item: any) => {
      page.drawText(item.name, { x: 50, y: yPos, size: 10 });
      page.drawText(item.quantity.toString(), { x: 300, y: yPos, size: 10 });
      page.drawText(`₹${item.price.toFixed(2)}`, { x: 400, y: yPos, size: 10 });
      page.drawText(`₹${(item.quantity * item.price).toFixed(2)}`, { x: 500, y: yPos, size: 10 });
      yPos -= 20;
    });
    
    // Add delivery charge
    page.drawText(invoice.order.deliveryPartner.name, { x: 50, y: yPos, size: 10 });
    page.drawText('-', { x: 300, y: yPos, size: 10 });
    page.drawText(`₹${invoice.order.deliveryPartner.charges.toFixed(2)}`, { x: 400, y: yPos, size: 10 });
    page.drawText(`₹${invoice.order.deliveryPartner.charges.toFixed(2)}`, { x: 500, y: yPos, size: 10 });
    yPos -= 20;
    
    // Add service fee
    page.drawText('Service Fee', { x: 50, y: yPos, size: 10 });
    page.drawText('-', { x: 300, y: yPos, size: 10 });
    page.drawText(`₹${invoice.order.serviceFee.toFixed(2)}`, { x: 400, y: yPos, size: 10 });
    page.drawText(`₹${invoice.order.serviceFee.toFixed(2)}`, { x: 500, y: yPos, size: 10 });
    yPos -= 30;
    
    // Add total
    const itemsSubtotal = invoice.order.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    const total = itemsSubtotal + invoice.order.deliveryPartner.charges + invoice.order.serviceFee;
    
    page.drawText('Subtotal:', { x: 400, y: yPos, size: 12 });
    page.drawText(`₹${itemsSubtotal.toFixed(2)}`, { x: 500, y: yPos, size: 12 });
    yPos -= 20;
    
    page.drawText('Delivery:', { x: 400, y: yPos, size: 12 });
    page.drawText(`₹${invoice.order.deliveryPartner.charges.toFixed(2)}`, { x: 500, y: yPos, size: 12 });
    yPos -= 20;
    
    page.drawText('Service Fee:', { x: 400, y: yPos, size: 12 });
    page.drawText(`₹${invoice.order.serviceFee.toFixed(2)}`, { x: 500, y: yPos, size: 12 });
    yPos -= 30;
    
    page.drawText('Total:', { x: 400, y: yPos, size: 14 });
    page.drawText(`₹${total.toFixed(2)}`, { x: 500, y: yPos, size: 14 });
    
    // Add disclaimer
    yPos -= 60;
    page.drawText('Qubex:BuyNdeliver operates under registration as a service intermediary.', { x: 50, y: yPos, size: 8 });
    yPos -= 15;
    page.drawText('We procure products from authorized sellers on behalf of customers.', { x: 50, y: yPos, size: 8 });
    yPos -= 15;
    page.drawText('Qubex does not manufacture, stock, or resell any items.', { x: 50, y: yPos, size: 8 });
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Return the PDF
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { formatCurrency } from './format';
import type { Order, Customer, DeliveryPartner, OrderItem } from '@/types';

export async function generateInvoicePDF(order: Order): Promise<Uint8Array> {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  
  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Add a blank page to the document
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  
  // Get the page's width and height
  const { width, height } = page.getSize();
  
  // Define margins
  const margin = 50;
  const contentWidth = width - 2 * margin;
  
  // Add header
  page.drawText('Qubex: BuyNDeliver™', {
    x: margin,
    y: height - margin,
    size: 20,
    font: helveticaBoldFont,
    color: rgb(0.3, 0.3, 0.9),
  });
  
  page.drawText('An initiative by QuickBuy Boy', {
    x: margin,
    y: height - margin - 25,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Add invoice details
  const invoiceY = height - margin - 60;
  page.drawText(`Invoice #: INV-QBX-${Date.now()}`, {
    x: margin,
    y: invoiceY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: width - margin - 150,
    y: invoiceY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Add customer details
  const customerY = invoiceY - 40;
  page.drawText('Bill To:', {
    x: margin,
    y: customerY,
    size: 12,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(order.customer.name, {
    x: margin,
    y: customerY - 20,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(order.customer.address, {
    x: margin,
    y: customerY - 35,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`${order.customer.city}`, {
    x: margin,
    y: customerY - 50,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Phone: ${order.customer.phone}`, {
    x: margin,
    y: customerY - 65,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Add items table header
  const tableY = customerY - 100;
  const rowHeight = 20;
  const columnWidths = [contentWidth * 0.4, contentWidth * 0.15, contentWidth * 0.2, contentWidth * 0.25];
  
  // Draw table header
  page.drawText('Item', {
    x: margin,
    y: tableY,
    size: 12,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Qty', {
    x: margin + columnWidths[0],
    y: tableY,
    size: 12,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Price', {
    x: margin + columnWidths[0] + columnWidths[1],
    y: tableY,
    size: 12,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Subtotal', {
    x: margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
    y: tableY,
    size: 12,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  // Draw table rows
  let currentY = tableY - rowHeight;
  let subtotal = 0;
  
  // Add order items
  order.items.forEach((item: OrderItem) => {
    const itemSubtotal = item.quantity * item.price;
    subtotal += itemSubtotal;
    
    page.drawText(item.name, {
      x: margin,
      y: currentY,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(item.quantity.toString(), {
      x: margin + columnWidths[0],
      y: currentY,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(formatCurrency(item.price), {
      x: margin + columnWidths[0] + columnWidths[1],
      y: currentY,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(formatCurrency(itemSubtotal), {
      x: margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
      y: currentY,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    currentY -= rowHeight;
  });
  
  // Add delivery partner row
  const deliverySubtotal = order.deliveryPartner.charges;
  subtotal += deliverySubtotal;
  
  page.drawText(order.deliveryPartner.name, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('-', {
    x: margin + columnWidths[0],
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(formatCurrency(order.deliveryPartner.charges), {
    x: margin + columnWidths[0] + columnWidths[1],
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(formatCurrency(deliverySubtotal), {
    x: margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  currentY -= rowHeight;
  
  // Add service fee row
  const serviceFeeSubtotal = order.serviceFee;
  subtotal += serviceFeeSubtotal;
  
  page.drawText('Service Fee', {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('-', {
    x: margin + columnWidths[0],
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(formatCurrency(order.serviceFee), {
    x: margin + columnWidths[0] + columnWidths[1],
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(formatCurrency(serviceFeeSubtotal), {
    x: margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
    y: currentY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  currentY -= rowHeight * 2;
  
  // Add total
  page.drawText('Total:', {
    x: margin + columnWidths[0] + columnWidths[1],
    y: currentY,
    size: 14,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(formatCurrency(subtotal), {
    x: margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
    y: currentY,
    size: 14,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  // Add footer
  const footerY = 100;
  page.drawText('GST & intermediary registration in process.', {
    x: margin,
    y: footerY,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('For support, contact +91 95158 50682 / +91 62028 15368', {
    x: margin,
    y: footerY - 15,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('www.qubexdeliver.com | Anything. Anywhere. Anytime.', {
    x: margin,
    y: footerY - 30,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  
  return pdfBytes;
}
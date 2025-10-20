# Qubex: BuyNDeliver™ Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Features](#features)
6. [API Reference](#api-reference)
7. [Database Schema](#database-schema)
8. [Printing System](#printing-system)
9. [WhatsApp Integration](#whatsapp-integration)
10. [Security](#security)
11. [Troubleshooting](#troubleshooting)

## Overview

Qubex: BuyNDeliver™ is a modern billing and invoicing dashboard designed for QuickBuy Boy's delivery service. The system provides a comprehensive solution for managing orders, generating invoices, tracking analytics, and integrating with various printing and communication systems.

## System Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: Local JSON-based storage
- **Authentication**: JWT-based authentication (future implementation)
- **Storage**: Local file system

### Printing
- **Browser Print**: Native browser printing
- **Web Bluetooth**: Direct Bluetooth printer communication
- **Local Agent**: Electron-based print service

### Communication
- **WhatsApp**: WhatsApp Cloud API integration

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd billing-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Configuration](#configuration))

4. Run the development server:
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Printer Configuration
PRINTER_AGENT_URL=http://localhost:4321

# Application Settings
NEXT_PUBLIC_APP_NAME=Qubex: BuyNDeliver™
NEXT_PUBLIC_SUPPORT_PHONE=+91 95158 50682
NEXT_PUBLIC_SUPPORT_EMAIL=support@qubexdeliver.com
```

## Features

### Order Management
- Create, view, edit, and delete orders
- Track order status (Received, Processing, Invoiced, Delivered)
- Associate orders with customers and delivery partners

### Invoice Generation
- Automatic invoice creation from orders
- PDF generation with professional templates
- Multiple download and printing options
- WhatsApp sharing capability

### Analytics Dashboard
- Revenue tracking (daily, weekly, monthly)
- Service fee collection monitoring
- City-wise order distribution
- Customer analytics
- Payment method breakdown

### Settings Management
- Configure service fees
- Set special pricing for regions
- Manage printer connections
- Configure WhatsApp integration
- Toggle GST compliance

## API Reference

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order

### Invoices
- `POST /api/invoices` - Generate invoice for order
- `GET /api/invoices?orderId=:id` - Get invoice by order ID

### Printing
- `POST /api/print` - Send document to printer

### WhatsApp
- `POST /api/whatsapp` - Send invoice via WhatsApp

## Database Schema

The application uses a local JSON-based database stored in the `data/database.json` file. The schema includes:

### Customers
- id: Unique identifier
- name: Customer name
- phone: Phone number
- address: Delivery address
- city: City
- createdAt: Creation timestamp

### Orders
- id: Unique identifier
- customerId: Reference to customer
- deliveryPartnerId: Reference to delivery partner
- serviceFee: Service fee amount
- gst: GST amount
- totalAmount: Total order amount
- status: Order status (received, processing, invoiced, delivered)
- paymentMethod: Payment method (UPI, Online, Cash)
- createdAt: Creation timestamp
- updatedAt: Last update timestamp

### Order Items
- id: Unique identifier
- orderId: Reference to order
- name: Item name
- quantity: Quantity
- price: Price per unit

### Delivery Partners
- id: Unique identifier
- name: Partner name
- charges: Delivery charges

### Invoices
- id: Unique identifier
- orderId: Reference to order
- invoiceNumber: Invoice number
- issuedDate: Issue date
- dueDate: Due date
- pdfUrl: URL to PDF file
- isSent: Whether invoice has been sent
- sentAt: Timestamp when sent
- createdAt: Creation timestamp

### Payments
- id: Unique identifier
- orderId: Reference to order
- amount: Payment amount
- method: Payment method
- transactionId: Transaction identifier
- paidAt: Payment timestamp

## Printing System

### Browser Printing
Uses the native `window.print()` functionality for basic printing needs.

### Web Bluetooth Printing
Direct communication with Bluetooth printers using the Web Bluetooth API.

### Local Print Agent
Electron-based service that runs locally to handle printing for USB, COM, and network printers.

#### Installation
1. Install Electron globally:
   ```bash
   npm install -g electron
   ```

2. Run the print agent:
   ```bash
   cd print-agent
   npm start
   ```

## WhatsApp Integration

### Setup
1. Create a WhatsApp Business account
2. Register for WhatsApp Cloud API
3. Obtain access token and phone number ID
4. Configure in settings

### Usage
Invoices can be automatically sent to customers via WhatsApp with a predefined message template.

## Security

### Authentication
- JWT-based authentication (future implementation)
- Role-based access control (Admin, Manager, Accountant) (future implementation)

### Data Protection
- All sensitive data stored in environment variables
- PDFs stored in local file system
- Audit logging for all critical actions

### Best Practices
- Regular security updates
- Strong password policies (when implemented)
- Two-factor authentication (where supported) (future implementation)

## Troubleshooting

### Common Issues

#### Print Agent Not Responding
1. Ensure the print agent is running
2. Check that port 4321 is not blocked
3. Verify printer connections

#### WhatsApp Messages Not Sending
1. Check API credentials
2. Verify phone number format
3. Ensure the WhatsApp Business account is properly configured

#### PDF Generation Issues
1. Check that pdf-lib is properly installed
2. Verify order data integrity
3. Ensure sufficient memory for PDF generation

### Support
For additional support, contact:
- Email: support@qubexdeliver.com
- Phone: +91 95158 50682 / +91 62028 15368
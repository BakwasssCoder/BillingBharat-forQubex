# Database Schema

## Overview

This application uses a local JSON-based database stored in `data/database.json`. The database contains the following collections:

## Customers Collection
```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "createdAt": "ISODate"
}
```

## Delivery Partners Collection
```json
{
  "id": "string",
  "name": "string",
  "charges": "number"
}
```

## Orders Collection
```json
{
  "id": "string",
  "customerId": "string",
  "customer": "CustomerObject",
  "items": [
    {
      "id": "string",
      "name": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "deliveryPartnerId": "string",
  "deliveryPartner": "DeliveryPartnerObject",
  "serviceFee": "number",
  "gst": "number",
  "totalAmount": "number",
  "status": "string", // 'received', 'processing', 'invoiced', 'delivered'
  "paymentMethod": "string", // 'UPI', 'Online', 'Cash'
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

## Order Items Collection
(Order items are embedded within the Orders collection)

## Invoices Collection
```json
{
  "id": "string",
  "orderId": "string",
  "order": "OrderObject",
  "invoiceNumber": "string",
  "issuedDate": "ISODate",
  "dueDate": "ISODate",
  "pdfUrl": "string",
  "isSent": "boolean",
  "sentAt": "ISODate",
  "createdAt": "ISODate"
}
```

## Payments Collection
```json
{
  "id": "string",
  "orderId": "string",
  "amount": "number",
  "method": "string", // 'UPI', 'Online', 'Cash'
  "transactionId": "string",
  "paidAt": "ISODate"
}
```

## Sample Data Structure

The database file (`data/database.json`) has the following structure:

```json
{
  "customers": [...],
  "orders": [...],
  "deliveryPartners": [...],
  "invoices": [...],
  "payments": [...]
}
```

## Data Initialization

The database is initialized with sample data when the application is first run using the `npm run init-db` command. This creates the `data/database.json` file with sample customers, orders, delivery partners, invoices, and payments.
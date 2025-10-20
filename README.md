# Qubex: BuyNDeliver™ Billing & Invoicing Dashboard

A modern, visually stunning Billing Dashboard for Qubex: BuyNDeliver™ — An Initiative by QuickBuy Boy.

## 🚀 Features

### 🧾 Order Management
- Add / view / edit orders manually
- Auto-fetch customer details (name, phone, address, city)
- Real-time order status: Received → Processing → Invoiced → Delivered

### 💰 Billing & Invoicing
- Automatic invoice generation with:
  - Order ID, Customer Details
  - Items list with quantity, price, subtotal
  - Delivery Partner Name & Charges
  - Qubex Service Fee (₹200 default / ₹51 promo)
  - GST (In Process – mentioned clearly)
  - Total Payable
  - Payment Method (UPI/Online/Cash)
- Invoice actions:
  - ✅ Generate Invoice
  - 📥 Download PDF
  - 🖨 Print (Bluetooth / COM / Browser)
  - 💬 Send via WhatsApp

### 📊 Analytics Dashboard
- Revenue Summary (Today, Week, Month)
- Service Fee Collection Tracker
- City-wise Orders Chart
- Top Customers
- Pending Invoices Count
- Payment Breakdown (UPI/Cash/Other)

### 🧮 Smart Filters & Search
- Filter by city, date range, status, or phone number
- Quick search bar with suggestions
- "Today's Orders" & "Recent Invoices" section

### ⚙️ Settings Page
- Edit Default Service Fee
- Add City-Based Offers (₹51 in Delhi, etc.)
- Toggle GST inclusion
- Manage Printers (Add/Remove paired printer by MAC/COM)
- Change WhatsApp API token, Supabase keys, etc.

### 💬 WhatsApp Integration
- Send invoice PDFs automatically to customers
- Predefined message template

### 🖨 Printing Options
- Browser Print (window.print())
- Web Bluetooth (ESC/POS printer compatible)
- Local Print Agent (supports paired printers via USB, Bluetooth, COM)

## 🛠 Tech Stack

### Frontend
- React (TypeScript)
- Next.js 15 with App Router
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Framer Motion for animations

### Backend
- Next.js API Routes
- Local JSON-based database
- pdf-lib for PDF generation

### Database
- Local JSON file storage

### Storage
- Local file system

### Authentication
- JWT-based authentication (future implementation)

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── dashboard/       # Dashboard page
│   ├── orders/          # Orders management
│   ├── invoices/        # Invoice management
│   ├── analytics/       # Analytics dashboard
│   ├── settings/        # Settings page
│   └── api/             # API routes
├── components/          # Reusable UI components
├── config/              # Configuration files
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── services/            # Business logic services
├── types/               # TypeScript types
├── utils/               # Utility functions
└── styles/              # Global styles
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd billing-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
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

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit `http://localhost:3000` to see the application.

## 📤 Deployment

### Frontend
Deploy to Vercel:
1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Set environment variables in Vercel dashboard

### Backend
Deploy to Render:
1. Create a new web service on Render
2. Point it to your repository
3. Set environment variables

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop: 1920×1080
- Tablet: 1280×800
- Mobile: Read-only dashboard

## 🔐 Security

- JWT-based authentication (future implementation)
- Role-based Access: Admin, Manager, Accountant (future implementation)
- Signed URLs for invoice PDFs (future implementation)
- Audit log of all actions
- All secrets in environment variables

## 🎨 UI/UX Design

- Modern, startup-professional, fast, and futuristic
- Glassmorphism & gradients inspired by Diwali warmth 🌅
- Colors: Indigo → Violet gradient base with neon orange highlights
- Dark/Light mode toggle
- Smooth transitions with Framer Motion
- Tooltips for all icons

## 📄 Legal Note

All invoices include the mandatory footer:
> "Qubex: BuyNDeliver™ operates as a service intermediary under registration. GST compliance and intermediary licenses are currently in process. Future invoices will reflect applicable taxes post-registration."

## 🧪 Testing

Run the development server and test all features:
```bash
npm run dev
```

## 📦 Additional Features

- AI Assistant inside dashboard (future implementation)
- QR Code generator for invoices (future implementation)
- Email integration (future implementation)
- Customer loyalty dashboard (future implementation)
- Partner payout module (future implementation)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is proprietary and confidential to Qubex: BuyNDeliver™.

## 📞 Support

For support, contact:
- +91 95158 50682
- +91 62028 15368
- support@qubexdeliver.com

## 🌐 Website

[www.qubexdeliver.com](http://www.qubexdeliver.com)

> Anything. Anywhere. Anytime.
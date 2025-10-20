"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  MessageCircle,
  Eye,
  FileText,
  Trash2
} from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInvoices, deleteInvoice, createInvoice } from "@/utils/api";
import { generateSequentialInvoiceNumber } from "@/utils/invoice";

interface Invoice {
  id: string;
  orderId: string;
  customer: {
    name: string;
    phone: string;
    city: string;
  };
  totalAmount: number;
  status: string;
  issuedDate: string;
  dueDate: string;
  invoiceNumber: string;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const fetchedInvoices = await getInvoices();
      // Transform the data to match our interface
      const transformedInvoices = fetchedInvoices.map((invoice: any) => ({
        id: invoice.id,
        orderId: invoice.orderId,
        invoiceNumber: invoice.invoiceNumber || "INV-UNKNOWN",
        customer: {
          name: invoice.order?.customer?.name || 'Unknown Customer',
          phone: invoice.order?.customer?.phone || '',
          city: invoice.order?.customer?.city || '',
        },
        totalAmount: invoice.order?.totalAmount || 0,
        status: invoice.isSent ? 'sent' : 'pending',
        issuedDate: new Date(invoice.issuedDate).toISOString(),
        dueDate: new Date(invoice.dueDate).toISOString(),
      }));
      setInvoices(transformedInvoices);
      setFilteredInvoices(transformedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    // Apply filters
    const filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleGenerateInvoice = async () => {
    // Show a prompt to enter an order ID
    const orderId = prompt("Enter Order ID to generate invoice:");
    if (orderId) {
      try {
        const invoice = await createInvoice({ orderId });
        if (invoice) {
          alert(`Invoice generated successfully: ${invoice.invoiceNumber}`);
          // Refresh the invoices list
          fetchInvoices();
          
          // Ask user if they want to download the invoice
          if (confirm('Do you want to download the invoice?')) {
            handleDownloadInvoice(invoice.id);
          }
        } else {
          alert("Failed to generate invoice. Please try again.");
        }
      } catch (error) {
        console.error("Error generating invoice:", error);
        alert("An error occurred while generating the invoice.");
      }
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    // Navigate to the invoice details page
    window.location.href = `/invoices/${invoiceId}`;
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      // Generate the invoice PDF
      const response = await fetch(`/api/invoices/${invoiceId}/download`);
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('An error occurred while downloading the invoice');
    }
  };

  const handlePrintInvoice = async (invoiceId: string) => {
    try {
      // Generate the invoice PDF
      const response = await fetch(`/api/invoices/${invoiceId}/download`);
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        // Create a print window
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      } else {
        alert('Failed to print invoice');
      }
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('An error occurred while printing the invoice');
    }
  };

  const handleSendWhatsApp = async (invoiceId: string) => {
    try {
      // Get invoice details
      const response = await fetch(`/api/invoices?id=${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        const invoice = data.invoice;
        
        // Create a WhatsApp message with the invoice link
        const message = `Dear customer, please find your invoice ${invoice.invoiceNumber} attached. Total amount: ₹${invoice.order.totalAmount}. Link: ${window.location.origin}/api/invoices/${invoiceId}/download`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        alert('Failed to fetch invoice details');
      }
    } catch (error) {
      console.error('Error sending invoice via WhatsApp:', error);
      alert('An error occurred while sending the invoice via WhatsApp');
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const success = await deleteInvoice(invoiceId);
        if (success) {
          alert("Invoice deleted successfully!");
          // Refresh the invoices list
          fetchInvoices();
        } else {
          alert("Failed to delete invoice. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("An error occurred while deleting the invoice.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and send invoices to customers
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          onClick={handleGenerateInvoice}
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search invoices..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Invoice #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                      No invoices found. Generate an invoice to get started.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{invoice.orderId}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">{invoice.customer.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.customer.phone}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.customer.city}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.totalAmount)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">
                        {new Date(invoice.issuedDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(invoice.id)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleSendWhatsApp(invoice.id)}>
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteInvoice(invoice.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
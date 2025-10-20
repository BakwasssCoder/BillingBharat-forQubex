"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Printer, 
  Download, 
  MessageCircle,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { getInvoiceById } from "@/utils/api";
import { InvoiceTemplate } from "@/components/invoice/invoice-template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Invoice {
  id: string;
  orderId: string;
  order: any;
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  isSent: boolean;
  status: string;
}

export default function InvoiceViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const invoiceData = await getInvoiceById(params.id);
        setInvoice(invoiceData);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice?.invoiceNumber}.pdf`;
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

  const handlePrint = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
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

  const handleSendWhatsApp = () => {
    if (!invoice) return;
    
    const message = `Dear customer, please find your invoice ${invoice.invoiceNumber} attached. Total amount: ₹${invoice.order.totalAmount}.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch('/api/invoices/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: params.id,
          status: newStatus
        }),
      });
      
      if (response.ok) {
        // Refresh the invoice data
        const invoiceData = await getInvoiceById(params.id);
        setInvoice(invoiceData);
      } else {
        alert('Failed to update invoice status');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('An error occurred while updating the invoice status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/invoices')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Details</h1>
            <p className="text-gray-500 dark:text-gray-400">
              View and manage invoice {invoice.invoiceNumber}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleSendWhatsApp}>
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Status and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
              <p className="text-lg font-medium capitalize">{invoice.status || 'pending'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={invoice.status === 'pending' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={invoice.status === 'processing' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleStatusChange('processing')}
              >
                Processing
              </Button>
              <Button 
                variant={invoice.status === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview */}
      <Card>
        <CardContent className="p-0">
          <InvoiceTemplate order={invoice.order} invoiceNumber={invoice.invoiceNumber} />
        </CardContent>
      </Card>
    </div>
  );
}
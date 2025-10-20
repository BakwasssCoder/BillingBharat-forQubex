"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Printer,
  MessageCircle
} from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrders, deleteOrder } from "@/utils/api";
import { OrderForm } from "@/components/orders/order-form";
import { OrderDetails } from "@/components/orders/order-details";
import { EditOrderForm } from "@/components/orders/edit-order-form";

interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    city: string;
  };
  items: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "received", label: "Received" },
  { value: "processing", label: "Processing" },
  { value: "invoiced", label: "Invoiced" },
  { value: "delivered", label: "Delivered" },
];

const cityOptions = [
  { value: "all", label: "All Cities" },
  { value: "Delhi", label: "Delhi" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Chennai", label: "Chennai" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders();
      // Transform the data to match our interface
      const transformedOrders = fetchedOrders.map((order: any) => ({
        id: order.id,
        customer: {
          name: order.customer?.name || '',
          phone: order.customer?.phone || '',
          city: order.customer?.city || '',
        },
        items: order.items?.length || 0,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: new Date(order.createdAt).toISOString(),
      }));
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters
    const filtered = orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesCity = cityFilter === "all" || order.customer.city === cityFilter;
      
      return matchesSearch && matchesStatus && matchesCity;
    });
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, cityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "invoiced":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const success = await deleteOrder(orderId);
        if (success) {
          alert("Order deleted successfully!");
          // Refresh the orders list
          fetchOrders();
        } else {
          alert("Failed to delete order. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("An error occurred while deleting the order.");
      }
    }
  };

  const handleViewOrder = (orderId: string) => {
    setViewingOrderId(orderId);
  };

  const handleEditOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setEditingOrder(data.order);
      } else {
        alert('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('An error occurred while fetching order details');
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    // In a real implementation, you would generate and download the invoice
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Invoice generated for order ${orderId}: ${data.invoice.invoiceNumber}`);
        // In a real implementation, you would trigger a download of the PDF
      } else {
        alert('Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('An error occurred while generating the invoice');
    }
  };

  const handlePrintInvoice = async (orderId: string) => {
    // In a real implementation, you would print the invoice
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Invoice generated for order ${orderId}: ${data.invoice.invoiceNumber}. In a real implementation, this would be printed.`);
        // In a real implementation, you would open a print dialog
      } else {
        alert('Failed to generate invoice for printing');
      }
    } catch (error) {
      console.error('Error generating invoice for printing:', error);
      alert('An error occurred while generating the invoice for printing');
    }
  };

  const handleSendWhatsApp = async (orderId: string) => {
    // In a real implementation, you would send the invoice via WhatsApp
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Create a WhatsApp message with the invoice link
        const message = `Dear customer, please find your invoice ${data.invoice.invoiceNumber} attached. Total amount: ₹${data.invoice.order.totalAmount}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        alert('Failed to generate invoice for WhatsApp');
      }
    } catch (error) {
      console.error('Error generating invoice for WhatsApp:', error);
      alert('An error occurred while generating the invoice for WhatsApp');
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage all customer orders
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "Add New Order"}
        </Button>
      </div>

      {/* Order Form */}
      {showForm && !viewingOrderId && !editingOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <OrderForm onOrderCreated={() => {
            setShowForm(false);
            fetchOrders();
          }} />
        </motion.div>
      )}

      {/* Order Details */}
      {viewingOrderId && !editingOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <OrderDetails orderId={viewingOrderId} onBack={() => setViewingOrderId(null)} />
        </motion.div>
      )}

      {/* Edit Order Form */}
      {editingOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EditOrderForm 
            order={editingOrder} 
            onOrderUpdated={() => {
              setEditingOrder(null);
              fetchOrders();
            }}
            onCancel={() => setEditingOrder(null)}
          />
        </motion.div>
      )}

      {/* Filters */}
      {!viewingOrderId && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search orders..."
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
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    {cityOptions.map(option => (
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
      )}

      {/* Orders Table */}
      {!viewingOrderId && (
        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                        No orders found. {showForm ? "" : "Click 'Add New Order' to create your first order."}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">{order.customer.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer.phone}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer.city}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-900 dark:text-white">{order.items}</td>
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-900 dark:text-white">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditOrder(order.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(order.id)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleSendWhatsApp(order.id)}>
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteOrder(order.id)}>
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
      )}
    </div>
  );
}
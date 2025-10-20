"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  IndianRupee,
  Package,
  Truck,
  User,
  MapPin,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeliveryPartners, updateOrder } from "@/utils/api";
import type { Order, DeliveryPartner, OrderItem } from "@/types";
import { formatCurrency } from "@/utils/format";

interface EditOrderFormProps {
  order: Order;
  onOrderUpdated?: () => void;
  onCancel: () => void;
}

export function EditOrderForm({ order, onOrderUpdated, onCancel }: EditOrderFormProps) {
  const router = useRouter();
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Customer fields
  const [customerName, setCustomerName] = useState(order.customer?.name || "");
  const [customerPhone, setCustomerPhone] = useState(order.customer?.phone || "");
  const [customerAddress, setCustomerAddress] = useState(order.customer?.address || "");
  const [customerCity, setCustomerCity] = useState(order.customer?.city || "");
  
  // Order fields
  const [items, setItems] = useState<OrderItem[]>(order.items || [
    { id: "item_1", name: "", quantity: 1, price: 0 }
  ]);
  const [deliveryPartnerId, setDeliveryPartnerId] = useState(order.deliveryPartnerId || "");
  const [serviceFee, setServiceFee] = useState(order.serviceFee || 200);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Online" | "Cash">(order.paymentMethod || "UPI");
  const [submitting, setSubmitting] = useState(false);
  
  // Load delivery partners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deliveryPartnersData = await getDeliveryPartners();
        setDeliveryPartners(deliveryPartnersData);
        if (!deliveryPartnerId && deliveryPartnersData.length > 0) {
          setDeliveryPartnerId(deliveryPartnersData[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Add new item
  const addItem = () => {
    setItems([
      ...items,
      { id: `item_${Date.now()}`, name: "", quantity: 1, price: 0 }
    ]);
  };
  
  // Update item
  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };
  
  // Calculate totals
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };
  
  const calculateDeliveryCharge = () => {
    const partner = deliveryPartners.find(dp => dp.id === deliveryPartnerId);
    return partner ? partner.charges : 0;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryCharge() + serviceFee;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Update order
      const orderData = {
        customer: {
          ...order.customer,
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
          city: customerCity
        },
        items,
        deliveryPartnerId,
        serviceFee,
        paymentMethod,
        totalAmount: calculateTotal()
      };
      
      const updatedOrder = await updateOrder(order.id, orderData);
      
      if (updatedOrder) {
        alert("Order updated successfully!");
        // Call callback if provided
        if (onOrderUpdated) {
          onOrderUpdated();
        }
        // Redirect to orders page
        onCancel();
      } else {
        alert("Failed to update order. Please try again.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred while updating the order.");
    } finally {
      setSubmitting(false);
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Edit Order
          </CardTitle>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Customer Name
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhone" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerAddress" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Address
              </Label>
              <Input
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerCity">City</Label>
              <Input
                id="customerCity"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                placeholder="Enter city"
                required
              />
            </div>
          </div>
          
          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-5 space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                
                <div className="md:col-span-3 space-y-2">
                  <Label>Price (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-10"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryPartner" className="flex items-center">
                      <Truck className="mr-2 h-4 w-4" />
                      Delivery Partner
                    </Label>
                    <select
                      id="deliveryPartner"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={deliveryPartnerId}
                      onChange={(e) => setDeliveryPartnerId(e.target.value)}
                      required
                    >
                      {deliveryPartners.map(partner => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name} (₹{partner.charges})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                      id="paymentMethod"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as "UPI" | "Online" | "Cash")}
                      required
                    >
                      <option value="UPI">UPI</option>
                      <option value="Online">Online</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span>{formatCurrency(calculateDeliveryCharge())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee:</span>
                      <span>{formatCurrency(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
              {submitting ? "Updating Order..." : "Update Order"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
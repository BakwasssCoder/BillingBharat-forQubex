"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  IndianRupee, 
  Truck, 
  User, 
  MapPin, 
  Phone,
  Calendar,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import type { Order } from "@/types";

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderById(orderId);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Order not found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Order Details
          </CardTitle>
          <Button variant="outline" onClick={onBack}>
            Back to Orders
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-32">Order ID:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium w-32">Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium w-32">Order Time:</span>
                <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-32">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-32">Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium w-24">Name:</span>
                <span>{order.customer?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium w-24">Phone:</span>
                <span>{order.customer?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium w-24">Address:</span>
                <span>{order.customer?.address || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">City:</span>
                <span>{order.customer?.city || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Delivery Partner */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Truck className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium w-32">Partner:</span>
                <span>{order.deliveryPartner?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <IndianRupee className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium w-32">Delivery Charge:</span>
                <span>{formatCurrency(order.deliveryPartner?.charges || 0)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <Card className="mt-6 bg-gray-50 dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(
                  order.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0
                )}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{formatCurrency(order.deliveryPartner?.charges || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span>{formatCurrency(order.serviceFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
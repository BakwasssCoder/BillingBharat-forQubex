"use client";

import { formatCurrency } from "@/utils/format";
import type { Order } from "@/types";

interface InvoiceTemplateProps {
  order: Order;
  invoiceNumber: string;
}

export function InvoiceTemplate({ order, invoiceNumber }: InvoiceTemplateProps) {
  // Calculate totals
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  
  const deliveryCharge = order.deliveryPartner.charges;
  const serviceFee = order.serviceFee;
  const total = itemsSubtotal + deliveryCharge + serviceFee;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Qubex: BuyNDeliver™
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              An initiative by QuickBuy Boy
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invoice
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              #{invoiceNumber}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {order.id}
            </p>
          </div>
        </div>
      </div>

      {/* Customer and Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Bill To
          </h3>
          <p className="font-medium text-gray-900 dark:text-white mt-1">
            {order.customer.name}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {order.customer.address}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {order.customer.city}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Phone: {order.customer.phone}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Delivery Partner
          </h3>
          <p className="font-medium text-gray-900 dark:text-white mt-1">
            {order.deliveryPartner.name}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Item
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Qty
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Price
              </th>
              <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 text-gray-900 dark:text-white">
                  {item.name}
                </td>
                <td className="py-3 text-right text-gray-900 dark:text-white">
                  {item.quantity}
                </td>
                <td className="py-3 text-right text-gray-900 dark:text-white">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
            
            {/* Delivery Partner */}
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 text-gray-900 dark:text-white">
                {order.deliveryPartner.name}
              </td>
              <td className="py-3 text-right text-gray-900 dark:text-white">
                -
              </td>
              <td className="py-3 text-right text-gray-900 dark:text-white">
                {formatCurrency(order.deliveryPartner.charges)}
              </td>
              <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.deliveryPartner.charges)}
              </td>
            </tr>
            
            {/* Service Fee */}
            <tr>
              <td className="py-3 text-gray-900 dark:text-white">
                Service Fee
              </td>
              <td className="py-3 text-right text-gray-900 dark:text-white">
                -
              </td>
              <td className="py-3 text-right text-gray-900 dark:text-white">
                {formatCurrency(order.serviceFee)}
              </td>
              <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.serviceFee)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(itemsSubtotal)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300">Delivery</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(deliveryCharge)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300">Service Fee</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(serviceFee)}
              </span>
            </div>
            <div className="flex justify-between py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic mb-2">
          Qubex:BuyNdeliver operates under registration as a service intermediary. We procure products from authorized sellers on behalf of customers. Qubex does not manufacture, stock, or resell any items. All purchases are verified and billed directly from the source seller. Official registration documents (GST, LLP, etc.) are in process.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          GST & intermediary registration in process.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1">
          For support, contact +91 95158 50682 / +91 62028 15368
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1">
          www.qubexdeliver.com | Anything. Anywhere. Anytime.
        </p>
      </div>
    </div>
  );
}
import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, createCustomer } from '@/services/database';
import { getDeliveryPartners, getCustomers } from '@/services/database';
import { generateSequentialOrderNumber } from '@/utils/order';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    
    if (orderId) {
      // Get specific order
      const order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        order
      });
    } else {
      // Get all orders
      const orders = await getOrders();
      return NextResponse.json({
        success: true,
        orders
      });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      customerName, 
      customerPhone, 
      customerAddress, 
      customerCity,
      items,
      deliveryPartnerName,
      deliveryPartnerCharges,
      serviceFee,
      paymentMethod
    } = body;
    
    if (!customerName || !customerPhone || !customerAddress || !customerCity || 
        !items || !deliveryPartnerName || deliveryPartnerCharges === undefined || serviceFee === undefined || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get customers
    const customers = await getCustomers();
    
    // Create delivery partner object from provided data
    const deliveryPartner = {
      id: `dp_${Date.now()}`,
      name: deliveryPartnerName,
      charges: deliveryPartnerCharges
    };
    
    // Check if customer already exists
    let customer: any = customers.find(c => c.phone === customerPhone);
    
    // If customer doesn't exist, create a new one
    if (!customer) {
      customer = {
        id: `cust_${Date.now()}`,
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        createdAt: new Date()
      };
      // Save the new customer to the database
      const createdCustomer = await createCustomer({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity
      });
      
      if (!createdCustomer) {
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 }
        );
      }
    }
    
    // Calculate total amount
    const itemsSubtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    const totalAmount = itemsSubtotal + deliveryPartner.charges + serviceFee;
    
    // Generate unique order number
    const orderNumber = await generateSequentialOrderNumber();
    
    // Create the order
    const order = await createOrder({
      id: orderNumber, // Use the generated order number as ID
      customerId: customer.id,
      customer,
      items,
      deliveryPartnerId: deliveryPartner.id,
      deliveryPartner,
      serviceFee,
      gst: 0, // GST is in process
      totalAmount,
      status: 'received',
      paymentMethod,
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }
    
    const order = await updateOrder(id, updates);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or failed to update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }
    
    const success = await deleteOrder(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Order not found or failed to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
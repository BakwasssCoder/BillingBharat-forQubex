import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, createCustomer, getCustomerById } from '@/services/database';

export async function GET() {
  try {
    const customers = await getCustomers();
    return NextResponse.json({
      success: true,
      customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, address, city } = body;
    
    if (!name || !phone || !address || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const customer = await createCustomer({
      name,
      phone,
      address,
      city
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
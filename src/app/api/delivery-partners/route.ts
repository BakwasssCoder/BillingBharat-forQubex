import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryPartners } from '@/services/database';

export async function GET() {
  try {
    const deliveryPartners = await getDeliveryPartners();
    return NextResponse.json({
      success: true,
      deliveryPartners
    });
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
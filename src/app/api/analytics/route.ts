import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData as getAnalyticsFromDB } from '@/services/database';

export async function GET(request: NextRequest) {
  try {
    const analytics = await getAnalyticsFromDB();
    
    return NextResponse.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
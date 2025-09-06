import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const stats = await dbHelpers.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database-api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity, type, reason, reference } = await request.json();

    if (!quantity || !type) {
      return NextResponse.json(
        { error: 'Quantity and type are required' },
        { status: 400 }
      );
    }

    if (!['in', 'out', 'adjustment'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: in, out, adjustment' },
        { status: 400 }
      );
    }

    const updatedProduct = await dbHelpers.updateProductStock(
      params.id,
      parseInt(quantity),
      type,
      reason,
      reference
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update stock' },
      { status: 500 }
    );
  }
}

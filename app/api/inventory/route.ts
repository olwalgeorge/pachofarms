import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (productId) where.productId = productId;
    if (type) where.type = type;

    const logs = await prisma.inventoryLog.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            unit: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching inventory logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, type, reason, reference } = await request.json();

    if (!productId || !quantity || !type) {
      return NextResponse.json(
        { error: 'ProductId, quantity, and type are required' },
        { status: 400 }
      );
    }

    if (!['in', 'out', 'adjustment', 'waste', 'harvest'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: in, out, adjustment, waste, harvest' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    switch (type) {
      case 'in':
      case 'harvest':
        newStock = previousStock + parseInt(quantity);
        break;
      case 'out':
      case 'waste':
        newStock = previousStock - parseInt(quantity);
        break;
      case 'adjustment':
        newStock = parseInt(quantity);
        break;
    }

    // Update product stock and create inventory log in transaction
    const [updatedProduct, inventoryLog] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { 
          stock: newStock,
          status: newStock <= 0 ? 'out_of_stock' : 'active'
        }
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          type,
          quantity: ['out', 'waste'].includes(type) ? -parseInt(quantity) : parseInt(quantity),
          reason,
          reference,
          previousStock,
          newStock,
          performedBy: 'admin' // In real app, get from auth context
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              unit: true
            }
          }
        }
      })
    ]);

    return NextResponse.json(inventoryLog, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory log:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory log' },
      { status: 500 }
    );
  }
}

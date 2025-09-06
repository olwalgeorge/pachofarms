import { NextRequest, NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/database-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        inventoryLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        fieldProducts: {
          include: {
            field: true
          }
        },
        orderItems: {
          include: {
            order: {
              include: {
                customer: true
              }
            }
          },
          take: 10,
          orderBy: { order: { orderDate: 'desc' } }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        variety: data.variety,
        origin: data.origin,
        price: data.price ? parseFloat(data.price) : undefined,
        unit: data.unit,
        minStock: data.minStock ? parseInt(data.minStock) : undefined,
        maxStock: data.maxStock ? parseInt(data.maxStock) : undefined,
        status: data.status,
        image: data.image,
        tags: data.tags ? JSON.stringify(data.tags) : undefined,
        nutritionInfo: data.nutritionInfo ? JSON.stringify(data.nutritionInfo) : undefined,
        growingInfo: data.growingInfo ? JSON.stringify(data.growingInfo) : undefined,
        harvestDate: data.harvestDate ? new Date(data.harvestDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

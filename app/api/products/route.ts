import { NextRequest, NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const products = await dbHelpers.getProducts({
      category,
      status,
      search,
      limit,
      offset
    });

    const total = await prisma.product.count({
      where: {
        ...(category && { category }),
        ...(status && { status }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { variety: { contains: search } }
          ]
        })
      }
    });

    return NextResponse.json({
      products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.category || !data.price || !data.unit) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price, unit' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        variety: data.variety,
        origin: data.origin,
        price: parseFloat(data.price),
        unit: data.unit,
        stock: parseInt(data.stock || '0'),
        minStock: parseInt(data.minStock || '5'),
        maxStock: parseInt(data.maxStock || '100'),
        status: data.status || 'active',
        image: data.image,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        nutritionInfo: data.nutritionInfo ? JSON.stringify(data.nutritionInfo) : null,
        growingInfo: data.growingInfo ? JSON.stringify(data.growingInfo) : null,
        harvestDate: data.harvestDate ? new Date(data.harvestDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
      }
    });

    // Create initial inventory log if stock > 0
    if (product.stock > 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          type: 'in',
          quantity: product.stock,
          reason: 'Initial stock',
          previousStock: 0,
          newStock: product.stock
        }
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { sql, dbHelpers } from '@/lib/database-api';

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

    const total = await dbHelpers.getProductCount({
      category,
      status,
      search
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

    const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await sql`
      INSERT INTO products (
        id, name, description, category, variety, origin, price, unit, 
        stock, min_stock, max_stock, status, image, tags, nutrition_info, 
        growing_info, harvest_date, expiry_date, created_at, updated_at
      )
      VALUES (
        ${productId},
        ${data.name},
        ${data.description || null},
        ${data.category},
        ${data.variety || null},
        ${data.origin || null},
        ${parseFloat(data.price)},
        ${data.unit},
        ${parseInt(data.stock || '0')},
        ${parseInt(data.minStock || '5')},
        ${parseInt(data.maxStock || '100')},
        ${data.status || 'active'},
        ${data.image || null},
        ${data.tags ? JSON.stringify(data.tags) : null},
        ${data.nutritionInfo ? JSON.stringify(data.nutritionInfo) : null},
        ${data.growingInfo ? JSON.stringify(data.growingInfo) : null},
        ${data.harvestDate ? new Date(data.harvestDate) : null},
        ${data.expiryDate ? new Date(data.expiryDate) : null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    const product = result[0];

    // Create initial inventory log if stock > 0
    if (product.stock > 0) {
      await sql`
        INSERT INTO inventory_logs (
          id, product_id, type, quantity, reason, previous_stock, new_stock, created_at, updated_at
        )
        VALUES (
          uuid_generate_v4()::text,
          ${product.id},
          'in',
          ${product.stock},
          'Initial stock',
          0,
          ${product.stock},
          NOW(),
          NOW()
        )
      `;
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

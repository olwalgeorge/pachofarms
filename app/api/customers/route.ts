import { NextRequest, NextResponse } from 'next/server';
import { sql, dbHelpers } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const customers = await dbHelpers.getCustomers({
      type,
      status,
      search
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await sql`
      INSERT INTO customers (
        id, name, email, phone, address, city, state, zip_code, 
        customer_type, status, lead_score, notes, created_at, updated_at
      )
      VALUES (
        ${customerId},
        ${data.name},
        ${data.email},
        ${data.phone || null},
        ${data.address || null},
        ${data.city || null},
        ${data.state || null},
        ${data.zipCode || null},
        ${data.customerType || 'individual'},
        ${data.status || 'active'},
        ${parseInt(data.leadScore || '0')},
        ${data.notes || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    const customer = result[0];

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

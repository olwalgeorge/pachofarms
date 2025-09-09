import { NextRequest, NextResponse } from 'next/server';
import { sql, dbHelpers } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeOperations = searchParams.get('includeOperations') === 'true';

    const fields = await dbHelpers.getFields(includeOperations);

    return NextResponse.json(fields);
  } catch (error) {
    console.error('Error fetching fields:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fields' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.size) {
      return NextResponse.json(
        { error: 'Name and size are required' },
        { status: 400 }
      );
    }

    const fieldId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await sql`
      INSERT INTO fields (
        id, name, size, location, soil_type, soil_ph, status, crop, 
        planting_date, expected_harvest, progress, temperature, humidity, 
        notes, created_at, updated_at
      )
      VALUES (
        ${fieldId},
        ${data.name},
        ${data.size || null},
        ${data.location || null},
        ${data.soilType || null},
        ${data.soilPh ? parseFloat(data.soilPh) : null},
        ${data.status || 'active'},
        ${data.crop || null},
        ${data.plantingDate ? new Date(data.plantingDate) : null},
        ${data.expectedHarvest ? new Date(data.expectedHarvest) : null},
        ${parseInt(data.progress || '0')},
        ${data.temperature || null},
        ${data.humidity || null},
        ${data.notes || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    const field = result[0];

    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error('Error creating field:', error);
    return NextResponse.json(
      { error: 'Failed to create field' },
      { status: 500 }
    );
  }
}

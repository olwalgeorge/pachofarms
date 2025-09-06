import { NextRequest, NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/database-api';

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

    const field = await prisma.field.create({
      data: {
        name: data.name,
        size: data.size,
        location: data.location,
        soilType: data.soilType,
        soilPh: data.soilPh ? parseFloat(data.soilPh) : null,
        status: data.status || 'active',
        crop: data.crop,
        plantingDate: data.plantingDate ? new Date(data.plantingDate) : null,
        expectedHarvest: data.expectedHarvest ? new Date(data.expectedHarvest) : null,
        progress: parseInt(data.progress || '0'),
        temperature: data.temperature,
        humidity: data.humidity,
        notes: data.notes
      }
    });

    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error('Error creating field:', error);
    return NextResponse.json(
      { error: 'Failed to create field' },
      { status: 500 }
    );
  }
}

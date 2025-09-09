import { NextRequest, NextResponse } from 'next/server';
import { carePrograms } from '@/lib/neon-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: any = {};
    if (fieldId) where.fieldId = fieldId;
    if (status) where.status = status;
    if (type) where.type = type;

    const programs = await carePrograms.findMany({
      where,
      include: {
        field: true
      },
      orderBy: { nextApplication: 'asc' }
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching care programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch care programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.type || !data.fieldId || !data.nextApplication) {
      return NextResponse.json(
        { error: 'Name, type, fieldId, and nextApplication are required' },
        { status: 400 }
      );
    }

    const program = await carePrograms.create({
      name: data.name,
      type: data.type,
      fieldId: data.fieldId,
      product: data.product,
      dosage: data.dosage,
      frequency: data.frequency,
      status: data.status || 'active',
      nextApplication: new Date(data.nextApplication),
      notes: data.notes
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating care program:', error);
    return NextResponse.json(
      { error: 'Failed to create care program' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Care program ID is required' },
        { status: 400 }
      );
    }

    const program = await carePrograms.update(id, {
      ...updateData,
      nextApplication: updateData.nextApplication ? new Date(updateData.nextApplication) : undefined
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating care program:', error);
    return NextResponse.json(
      { error: 'Failed to update care program' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Care program ID is required' },
        { status: 400 }
      );
    }

    await carePrograms.delete(id);

    return NextResponse.json({ message: 'Care program deleted successfully' });
  } catch (error) {
    console.error('Error deleting care program:', error);
    return NextResponse.json(
      { error: 'Failed to delete care program' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const field = await prisma.field.findUnique({
      where: { id: params.id },
      include: {
        fieldProducts: {
          include: {
            product: true
          }
        },
        operations: {
          orderBy: { dueDate: 'asc' }
        },
        carePrograms: {
          orderBy: { nextApplication: 'asc' }
        }
      }
    });

    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(field);
  } catch (error) {
    console.error('Error fetching field:', error);
    return NextResponse.json(
      { error: 'Failed to fetch field' },
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

    const field = await prisma.field.update({
      where: { id: params.id },
      data: {
        name: data.name,
        size: data.size,
        location: data.location,
        soilType: data.soilType,
        soilPh: data.soilPh ? parseFloat(data.soilPh) : undefined,
        status: data.status,
        crop: data.crop,
        plantingDate: data.plantingDate ? new Date(data.plantingDate) : undefined,
        expectedHarvest: data.expectedHarvest ? new Date(data.expectedHarvest) : undefined,
        progress: data.progress ? parseInt(data.progress) : undefined,
        temperature: data.temperature,
        humidity: data.humidity,
        notes: data.notes
      }
    });

    return NextResponse.json(field);
  } catch (error) {
    console.error('Error updating field:', error);
    return NextResponse.json(
      { error: 'Failed to update field' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.field.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error('Error deleting field:', error);
    return NextResponse.json(
      { error: 'Failed to delete field' },
      { status: 500 }
    );
  }
}

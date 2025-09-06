import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const equipment = await prisma.equipment.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.create({
      data: {
        name: data.name,
        type: data.type,
        model: data.model,
        serialNumber: data.serialNumber,
        status: data.status || 'operational',
        condition: data.condition || 'good',
        location: data.location,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : null,
        warranty: data.warranty,
        notes: data.notes
      }
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    );
  }
}

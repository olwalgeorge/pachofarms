import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (fieldId) where.fieldId = fieldId;
    if (status) where.status = status;
    if (type) where.type = type;

    const operations = await prisma.fieldOperation.findMany({
      where,
      include: {
        field: true
      },
      orderBy: { dueDate: 'asc' },
      take: limit
    });

    return NextResponse.json(operations);
  } catch (error) {
    console.error('Error fetching operations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.title || !data.fieldId || !data.type || !data.dueDate) {
      return NextResponse.json(
        { error: 'Title, fieldId, type, and dueDate are required' },
        { status: 400 }
      );
    }

    const operation = await prisma.fieldOperation.create({
      data: {
        title: data.title,
        description: data.description,
        fieldId: data.fieldId,
        type: data.type,
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        assignedTo: data.assignedTo,
        estimatedHours: parseInt(data.estimatedHours || '1'),
        actualHours: data.actualHours ? parseFloat(data.actualHours) : null,
        progress: parseInt(data.progress || '0'),
        dueDate: new Date(data.dueDate),
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
        tags: data.tags ? JSON.stringify(data.tags) : null
      },
      include: {
        field: true
      }
    });

    return NextResponse.json(operation, { status: 201 });
  } catch (error) {
    console.error('Error creating operation:', error);
    return NextResponse.json(
      { error: 'Failed to create operation' },
      { status: 500 }
    );
  }
}

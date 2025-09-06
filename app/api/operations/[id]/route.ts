import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const operation = await prisma.fieldOperation.findUnique({
      where: { id: params.id },
      include: {
        field: true
      }
    });

    if (!operation) {
      return NextResponse.json(
        { error: 'Operation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(operation);
  } catch (error) {
    console.error('Error fetching operation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operation' },
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

    const operation = await prisma.fieldOperation.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        estimatedHours: data.estimatedHours ? parseInt(data.estimatedHours) : undefined,
        actualHours: data.actualHours ? parseFloat(data.actualHours) : undefined,
        progress: data.progress ? parseInt(data.progress) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        tags: data.tags ? JSON.stringify(data.tags) : undefined
      },
      include: {
        field: true
      }
    });

    return NextResponse.json(operation);
  } catch (error) {
    console.error('Error updating operation:', error);
    return NextResponse.json(
      { error: 'Failed to update operation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fieldOperation.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Operation deleted successfully' });
  } catch (error) {
    console.error('Error deleting operation:', error);
    return NextResponse.json(
      { error: 'Failed to delete operation' },
      { status: 500 }
    );
  }
}

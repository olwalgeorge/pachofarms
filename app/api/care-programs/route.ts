import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = sql`
      SELECT 
        cp.id,
        cp.name,
        cp.type,
        cp.field_id,
        cp.product,
        cp.dosage,
        cp.frequency,
        cp.status,
        cp.next_application,
        cp.notes,
        cp.created_at,
        cp.updated_at,
        f.name as field_name,
        f.location as field_location
      FROM care_programs cp
      LEFT JOIN fields f ON cp.field_id = f.id
      WHERE 1=1
    `;

    const conditions = [];
    if (fieldId) {
      query = sql`${query} AND cp.field_id = ${fieldId}`;
    }
    if (status) {
      query = sql`${query} AND cp.status = ${status}`;
    }
    if (type) {
      query = sql`${query} AND cp.type = ${type}`;
    }

    query = sql`${query} ORDER BY cp.next_application ASC`;

    const programs = await query;

    // Transform the data to include field object for compatibility
    const transformedPrograms = programs.map(program => ({
      ...program,
      field: {
        id: program.field_id,
        name: program.field_name,
        location: program.field_location
      }
    }));

    return NextResponse.json(transformedPrograms);
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

    const result = await sql`
      INSERT INTO care_programs (
        id, name, type, field_id, product, dosage, frequency, status, next_application, notes
      )
      VALUES (
        uuid_generate_v4()::text,
        ${data.name},
        ${data.type},
        ${data.fieldId},
        ${data.product || ''},
        ${data.dosage || ''},
        ${data.frequency || ''},
        ${data.status || 'active'},
        ${new Date(data.nextApplication).toISOString()},
        ${data.notes || ''}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
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

    const result = await sql`
      UPDATE care_programs
      SET 
        name = ${updateData.name || sql`name`},
        type = ${updateData.type || sql`type`},
        field_id = ${updateData.fieldId || sql`field_id`},
        product = ${updateData.product || sql`product`},
        dosage = ${updateData.dosage || sql`dosage`},
        frequency = ${updateData.frequency || sql`frequency`},
        status = ${updateData.status || sql`status`},
        next_application = ${updateData.nextApplication ? new Date(updateData.nextApplication).toISOString() : sql`next_application`},
        notes = ${updateData.notes || sql`notes`},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Care program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
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

    const result = await sql`
      DELETE FROM care_programs 
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Care program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Care program deleted successfully' });
  } catch (error) {
    console.error('Error deleting care program:', error);
    return NextResponse.json(
      { error: 'Failed to delete care program' },
      { status: 500 }
    );
  }
}

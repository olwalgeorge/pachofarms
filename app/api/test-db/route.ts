import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database-api';

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT 1 as test`;
    
    // Get database info
    const dbInfo = await sql`
      SELECT 
        current_database() as database_name,
        current_user as user_name,
        version() as postgresql_version
    `;

    // Count existing tables
    const tableCount = await sql`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful!',
      database_info: dbInfo[0],
      table_count: tableCount[0],
      test_query: result[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

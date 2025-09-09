import { neon } from '@neondatabase/serverless';

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon SQL client
export const sql = neon(databaseUrl);

// Database helper functions for care programs
export const carePrograms = {
  async findMany(options: {
    where?: any;
    include?: any;
    orderBy?: any;
  } = {}) {
    const { where = {} } = options;
    
    // For simple cases, return all records
    if (!where.fieldId && !where.status && !where.type) {
      const result = await sql`
        SELECT 
          cp.*,
          f.id as field_id,
          f.name as field_name,
          f.size as field_size,
          f.location as field_location
        FROM care_programs cp
        LEFT JOIN fields f ON cp.field_id = f.id
        ORDER BY cp.created_at DESC
      `;
      
      return result.map((row: any) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        fieldId: row.field_id,
        product: row.product,
        dosage: row.dosage,
        frequency: row.frequency,
        status: row.status,
        nextApplication: row.next_application,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        field: row.field_name ? {
          id: row.field_id,
          name: row.field_name,
          size: row.field_size,
          location: row.field_location
        } : null
      }));
    }
    
    // Handle filtered queries
    if (where.fieldId) {
      const result = await sql`
        SELECT 
          cp.*,
          f.id as field_id,
          f.name as field_name,
          f.size as field_size,
          f.location as field_location
        FROM care_programs cp
        LEFT JOIN fields f ON cp.field_id = f.id
        WHERE cp.field_id = ${where.fieldId}
        ORDER BY cp.created_at DESC
      `;
      
      return result.map((row: any) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        fieldId: row.field_id,
        product: row.product,
        dosage: row.dosage,
        frequency: row.frequency,
        status: row.status,
        nextApplication: row.next_application,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        field: row.field_name ? {
          id: row.field_id,
          name: row.field_name,
          size: row.field_size,
          location: row.field_location
        } : null
      }));
    }
    
    return [];
  },

  async create(data: {
    name: string;
    type: string;
    fieldId: string;
    product?: string;
    dosage?: string;
    frequency?: string;
    status?: string;
    nextApplication: Date;
    notes?: string;
  }) {
    const result = await sql`
      INSERT INTO care_programs (
        name, type, field_id, product, dosage, frequency, status, next_application, notes, created_at, updated_at
      ) VALUES (
        ${data.name}, 
        ${data.type}, 
        ${data.fieldId}, 
        ${data.product || null}, 
        ${data.dosage || null}, 
        ${data.frequency || null}, 
        ${data.status || 'active'}, 
        ${data.nextApplication.toISOString()}, 
        ${data.notes || null}, 
        NOW(), 
        NOW()
      )
      RETURNING *
    `;
    
    // Get the created program with field details
    if (result.length > 0) {
      const programs = await this.findMany({ where: { fieldId: data.fieldId } });
      return programs.find(p => p.id === result[0].id) || result[0];
    }
    
    return result[0];
  },

  async update(id: string, data: any) {
    // For simplicity, let's build a simple update query
    const result = await sql`
      UPDATE care_programs 
      SET 
        name = COALESCE(${data.name}, name),
        type = COALESCE(${data.type}, type),
        field_id = COALESCE(${data.fieldId}, field_id),
        product = COALESCE(${data.product}, product),
        dosage = COALESCE(${data.dosage}, dosage),
        frequency = COALESCE(${data.frequency}, frequency),
        status = COALESCE(${data.status}, status),
        next_application = COALESCE(${data.nextApplication instanceof Date ? data.nextApplication.toISOString() : data.nextApplication}, next_application),
        notes = COALESCE(${data.notes}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0];
  },

  async delete(id: string) {
    const result = await sql`
      DELETE FROM care_programs 
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0];
  }
};

// Database helper functions for fields
export const fields = {
  async findMany() {
    const result = await sql`SELECT * FROM fields ORDER BY name`;
    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      size: row.size,
      location: row.location,
      soilType: row.soilType || row.soil_type,
      soilPh: row.soilPh || row.soil_ph,
      status: row.status,
      crop: row.crop,
      plantingDate: row.plantingDate || row.planting_date,
      expectedHarvest: row.expectedHarvest || row.expected_harvest,
      progress: row.progress,
      temperature: row.temperature,
      humidity: row.humidity,
      notes: row.notes,
      createdAt: row.createdAt || row.created_at,
      updatedAt: row.updatedAt || row.updated_at
    }));
  }
};

// Database helper functions for field operations
export const fieldOperations = {
  async findMany(options: {
    where?: any;
    include?: any;
    orderBy?: any;
    take?: number;
  } = {}) {
    const { where = {}, take } = options;
    
    let baseQuery = sql`
      SELECT 
        fo.*,
        f.id as field_id,
        f.name as field_name
      FROM field_operations fo
      LEFT JOIN fields f ON fo.fieldId = f.id
    `;
    
    // Handle different query types
    if (!where.fieldId && !where.status && !take) {
      const result = await sql`
        SELECT 
          fo.*,
          f.id as field_id,
          f.name as field_name
        FROM field_operations fo
        LEFT JOIN fields f ON fo.fieldId = f.id
        ORDER BY fo.dueDate ASC
      `;
      
      return result.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        fieldId: row.fieldId,
        type: row.type,
        status: row.status,
        priority: row.priority,
        assignedTo: row.assignedTo,
        estimatedHours: row.estimatedHours,
        actualHours: row.actualHours,
        progress: row.progress,
        dueDate: row.dueDate,
        completedAt: row.completedAt,
        tags: row.tags,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        field: row.field_name ? {
          id: row.field_id,
          name: row.field_name
        } : null
      }));
    }
    
    if (where.fieldId) {
      const result = await sql`
        SELECT 
          fo.*,
          f.id as field_id,
          f.name as field_name
        FROM field_operations fo
        LEFT JOIN fields f ON fo.fieldId = f.id
        WHERE fo.fieldId = ${where.fieldId}
        ORDER BY fo.dueDate ASC
      `;
      
      return result.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        fieldId: row.fieldId,
        type: row.type,
        status: row.status,
        priority: row.priority,
        assignedTo: row.assignedTo,
        estimatedHours: row.estimatedHours,
        actualHours: row.actualHours,
        progress: row.progress,
        dueDate: row.dueDate,
        completedAt: row.completedAt,
        tags: row.tags,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        field: row.field_name ? {
          id: row.field_id,
          name: row.field_name
        } : null
      }));
    }
    
    return [];
  }
};

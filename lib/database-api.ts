import { neon } from '@neondatabase/serverless';

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon SQL client
export const sql = neon(databaseUrl);

// Helper functions for common database operations
export const dbHelpers = {
  // Products
  async getProducts(filters: {
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const { limit = 50, offset = 0 } = filters;
    
    return await sql`
      SELECT p.*, 
             COUNT(il.id) as inventory_log_count
      FROM products p
      LEFT JOIN inventory_logs il ON p.id = il.product_id
      WHERE 1=1
      GROUP BY p.id 
      ORDER BY p.created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
  },

  // Fields
  async getFields(includeOperations = false) {
    if (includeOperations) {
      return await sql`
        SELECT f.*,
               COALESCE(
                 json_agg(
                   json_build_object(
                     'id', fo.id,
                     'title', fo.title,
                     'type', fo.type,
                     'status', fo.status,
                     'due_date', fo.due_date
                   )
                 ) FILTER (WHERE fo.id IS NOT NULL AND fo.status IN ('pending', 'in_progress')), 
                 '[]'
               ) as operations,
               COALESCE(
                 json_agg(
                   DISTINCT json_build_object(
                     'id', cp.id,
                     'name', cp.name,
                     'type', cp.type,
                     'status', cp.status,
                     'next_application', cp.next_application
                   )
                 ) FILTER (WHERE cp.id IS NOT NULL AND cp.status = 'active'), 
                 '[]'
               ) as care_programs
        FROM fields f
        LEFT JOIN field_operations fo ON f.id = fo.field_id
        LEFT JOIN care_programs cp ON f.id = cp.field_id AND cp.status = 'active'
        GROUP BY f.id
        ORDER BY f.created_at DESC
      `;
    } else {
      return await sql`
        SELECT f.*,
               COALESCE(
                 json_agg(
                   DISTINCT json_build_object(
                     'id', cp.id,
                     'name', cp.name,
                     'type', cp.type,
                     'status', cp.status,
                     'next_application', cp.next_application
                   )
                 ) FILTER (WHERE cp.id IS NOT NULL AND cp.status = 'active'), 
                 '[]'
               ) as care_programs
        FROM fields f
        LEFT JOIN care_programs cp ON f.id = cp.field_id AND cp.status = 'active'
        GROUP BY f.id
        ORDER BY f.created_at DESC
      `;
    }
  },

  // Customers
  async getCustomers(filters: {
    type?: string;
    status?: string;
    search?: string;
  } = {}) {
    return await sql`
      SELECT c.*,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', o.id,
                   'total', o.total,
                   'status', o.status,
                   'order_date', o.order_date
                 )
                 ORDER BY o.order_date DESC
               ) FILTER (WHERE o.id IS NOT NULL), 
               '[]'
             ) as recent_orders
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id 
      ORDER BY c.created_at DESC
    `;
  },

  // Orders
  async getOrders(filters: {
    status?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}) {
    return await sql`
      SELECT o.*,
             c.name as customer_name,
             c.email as customer_email,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'quantity', oi.quantity,
                   'price', oi.price,
                   'product_name', p.name,
                   'product_id', p.id
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), 
               '[]'
             ) as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, c.name, c.email 
      ORDER BY o.order_date DESC
    `;
  },

  // Dashboard Stats
  async getDashboardStats() {
    const result = await sql`
      SELECT 
        (SELECT COUNT(*) FROM products WHERE status = 'active') as active_products,
        (SELECT COUNT(*) FROM fields WHERE status = 'active') as active_fields,
        (SELECT COUNT(*) FROM customers WHERE status = 'active') as active_customers,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM field_operations WHERE status IN ('pending', 'in_progress')) as active_operations,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'completed' AND order_date >= CURRENT_DATE - INTERVAL '30 days') as monthly_revenue,
        (SELECT COUNT(*) FROM products WHERE stock < min_stock) as low_stock_products
    `;
    
    return result[0];
  },

  // Recent activity for dashboard
  async getRecentActivity() {
    return await sql`
      (SELECT 'order' as type, id, 'New order placed' as description, created_at as timestamp FROM orders ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'field_operation' as type, id, title as description, created_at as timestamp FROM field_operations ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'care_program' as type, id, name as description, created_at as timestamp FROM care_programs ORDER BY created_at DESC LIMIT 5)
      ORDER BY timestamp DESC
      LIMIT 10
    `;
  },

  // Generate order number
  generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = Date.now().toString().slice(-6);
    return `ORD-${year}${month}${day}-${time}`;
  },

  // Update product stock
  async updateProductStock(productId: string, quantity: number, type: 'in' | 'out' | 'adjustment', reason?: string, reference?: string) {
    const adjustmentAmount = type === 'out' ? -quantity : quantity;
    
    // Update product stock
    await sql`
      UPDATE products 
      SET stock = stock + ${adjustmentAmount}, 
          updated_at = NOW() 
      WHERE id = ${productId}
    `;

    // Log inventory change
    await sql`
      INSERT INTO inventory_logs (id, product_id, type, quantity, reason, reference, created_at, updated_at)
      VALUES (uuid_generate_v4()::text, ${productId}, ${type}, ${quantity}, ${reason || ''}, ${reference || ''}, NOW(), NOW())
    `;
  },

  // Get product count
  async getProductCount(filters: { category?: string; status?: string; search?: string } = {}) {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM products p
      WHERE 1=1
    `;
    return parseInt(result[0].count);
  }
};

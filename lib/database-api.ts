import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
    const { category, status, search, limit = 50, offset = 0 } = filters;
    
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { variety: { contains: search } }
      ];
    }

    return await prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        inventoryLogs: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        fieldProducts: {
          include: {
            field: true
          }
        }
      }
    });
  },

  // Fields
  async getFields(includeOperations = false) {
    return await prisma.field.findMany({
      include: {
        fieldProducts: {
          include: {
            product: true
          }
        },
        operations: includeOperations ? {
          where: {
            status: { in: ['pending', 'in_progress'] }
          },
          orderBy: { dueDate: 'asc' }
        } : false,
        carePrograms: {
          where: {
            status: 'active'
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Customers
  async getCustomers(filters: {
    type?: string;
    status?: string;
    search?: string;
  } = {}) {
    const { type, status, search } = filters;
    
    const where: any = {};
    if (type) where.customerType = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    return await prisma.customer.findMany({
      where,
      include: {
        orders: {
          take: 5,
          orderBy: { orderDate: 'desc' },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Orders
  async getOrders(filters: {
    status?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}) {
    const { status, customerId, dateFrom, dateTo } = filters;
    
    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (dateFrom || dateTo) {
      where.orderDate = {};
      if (dateFrom) where.orderDate.gte = dateFrom;
      if (dateTo) where.orderDate.lte = dateTo;
    }

    return await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { orderDate: 'desc' }
    });
  },

  // Dashboard Stats
  async getDashboardStats() {
    const [
      productCount,
      lowStockProducts,
      fieldCount,
      activeOperations,
      customerCount,
      pendingOrders,
      recentOrders,
      monthlyRevenue
    ] = await Promise.all([
      prisma.product.count({ where: { status: 'active' } }),
      prisma.product.count({ 
        where: { 
          status: 'active',
          stock: { lte: 10 } // Use a fixed number for low stock threshold
        }
      }),
      prisma.field.count({ where: { status: 'active' } }),
      prisma.fieldOperation.count({ 
        where: { status: { in: ['pending', 'in_progress'] } }
      }),
      prisma.customer.count({ where: { status: 'active' } }),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { orderDate: 'desc' },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          orderDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          },
          status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        },
        _sum: {
          total: true
        }
      })
    ]);

    return {
      productCount,
      lowStockProducts,
      fieldCount,
      activeOperations,
      customerCount,
      pendingOrders,
      recentOrders,
      monthlyRevenue: monthlyRevenue._sum.total || 0
    };
  },

  // Generate order number
  generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PF${year}${month}${day}${random}`;
  },

  // Update product stock
  async updateProductStock(productId: string, quantity: number, type: 'in' | 'out' | 'adjustment', reason?: string, reference?: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    const previousStock = product.stock;
    let newStock = previousStock;

    switch (type) {
      case 'in':
        newStock = previousStock + quantity;
        break;
      case 'out':
        newStock = previousStock - quantity;
        break;
      case 'adjustment':
        newStock = quantity;
        break;
    }

    // Update product stock and create inventory log
    const [updatedProduct] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { 
          stock: newStock,
          status: newStock <= 0 ? 'out_of_stock' : 'active'
        }
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          type,
          quantity: type === 'out' ? -quantity : quantity,
          reason,
          reference,
          previousStock,
          newStock
        }
      })
    ]);

    return updatedProduct;
  }
};

export default prisma;

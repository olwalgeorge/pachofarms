import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const report = searchParams.get('report');
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    switch (report) {
      case 'sales':
        return await getSalesReport(startDate, endDate);
      case 'products':
        return await getProductReport();
      case 'customers':
        return await getCustomerReport();
      case 'inventory':
        return await getInventoryReport();
      case 'operations':
        return await getOperationsReport();
      default:
        return NextResponse.json(
          { error: 'Invalid report type. Available: sales, products, customers, inventory, operations' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function getSalesReport(startDate: Date, endDate: Date) {
  const [
    totalRevenue,
    orderCount,
    topProducts,
    salesByDay,
    ordersByStatus
  ] = await Promise.all([
    // Total revenue
    prisma.order.aggregate({
      where: {
        orderDate: { gte: startDate, lte: endDate },
        status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      },
      _sum: { total: true }
    }),
    
    // Order count
    prisma.order.count({
      where: {
        orderDate: { gte: startDate, lte: endDate }
      }
    }),
    
    // Top selling products
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          orderDate: { gte: startDate, lte: endDate },
          status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10
    }),
    
    // Sales by day (simplified)
    prisma.order.groupBy({
      by: ['orderDate'],
      where: {
        orderDate: { gte: startDate, lte: endDate },
        status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      },
      _sum: { total: true },
      _count: true
    }),
    
    // Orders by status
    prisma.order.groupBy({
      by: ['status'],
      where: {
        orderDate: { gte: startDate, lte: endDate }
      },
      _count: true
    })
  ]);

  // Get product details for top products
  const productIds = topProducts.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, category: true }
  });

  const topProductsWithDetails = topProducts.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  }));

  return NextResponse.json({
    summary: {
      totalRevenue: totalRevenue._sum.total || 0,
      orderCount,
      averageOrderValue: orderCount > 0 ? (totalRevenue._sum.total || 0) / orderCount : 0
    },
    topProducts: topProductsWithDetails,
    salesByDay: salesByDay.map(day => ({
      date: day.orderDate,
      revenue: day._sum.total || 0,
      orders: day._count
    })),
    ordersByStatus
  });
}

async function getProductReport() {
  const [
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    productsByCategory,
    mostValuableProducts
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'active' } }),
    prisma.product.count({ where: { stock: { lte: 10 }, status: 'active' } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.groupBy({
      by: ['category'],
      _count: true,
      _sum: { stock: true }
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        stock: true,
        price: true
      },
      orderBy: [
        { price: 'desc' },
        { stock: 'desc' }
      ],
      take: 10
    })
  ]);

  return NextResponse.json({
    summary: {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts
    },
    productsByCategory,
    mostValuableProducts: mostValuableProducts.map(p => ({
      ...p,
      totalValue: p.stock * p.price
    }))
  });
}

async function getCustomerReport() {
  const [
    totalCustomers,
    activeCustomers,
    customersByType,
    topCustomers
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { status: 'active' } }),
    prisma.customer.groupBy({
      by: ['customerType'],
      _count: true
    }),
    prisma.customer.findMany({
      include: {
        orders: {
          where: {
            status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] }
          },
          select: {
            total: true
          }
        }
      },
      take: 10
    })
  ]);

  const topCustomersWithRevenue = topCustomers
    .map(customer => ({
      ...customer,
      totalRevenue: customer.orders.reduce((sum, order) => sum + order.total, 0),
      orderCount: customer.orders.length
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  return NextResponse.json({
    summary: {
      totalCustomers,
      activeCustomers
    },
    customersByType,
    topCustomers: topCustomersWithRevenue
  });
}

async function getInventoryReport() {
  const [
    totalInventoryValue,
    inventoryByCategory,
    recentMovements,
    wastageReport
  ] = await Promise.all([
    prisma.product.aggregate({
      where: { status: 'active' },
      _sum: { stock: true }
    }),
    prisma.product.groupBy({
      by: ['category'],
      where: { status: 'active' },
      _sum: { stock: true },
      _count: true
    }),
    prisma.inventoryLog.findMany({
      include: {
        product: {
          select: { name: true, category: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    }),
    prisma.inventoryLog.groupBy({
      by: ['type'],
      where: {
        type: 'waste',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _sum: { quantity: true }
    })
  ]);

  return NextResponse.json({
    summary: {
      totalItems: totalInventoryValue._sum.stock || 0
    },
    inventoryByCategory,
    recentMovements,
    wastageReport
  });
}

async function getOperationsReport() {
  const [
    totalOperations,
    operationsByStatus,
    operationsByType,
    overdueOperations,
    completionRate
  ] = await Promise.all([
    prisma.fieldOperation.count(),
    prisma.fieldOperation.groupBy({
      by: ['status'],
      _count: true
    }),
    prisma.fieldOperation.groupBy({
      by: ['type'],
      _count: true
    }),
    prisma.fieldOperation.count({
      where: {
        status: { in: ['pending', 'in_progress'] },
        dueDate: { lt: new Date() }
      }
    }),
    prisma.fieldOperation.count({
      where: { status: 'completed' }
    })
  ]);

  const completionPercentage = totalOperations > 0 ? (completionRate / totalOperations) * 100 : 0;

  return NextResponse.json({
    summary: {
      totalOperations,
      overdueOperations,
      completionPercentage: Math.round(completionPercentage)
    },
    operationsByStatus,
    operationsByType
  });
}

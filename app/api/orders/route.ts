import { NextRequest, NextResponse } from 'next/server';
import { prisma, dbHelpers } from '@/lib/database-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const customerId = searchParams.get('customerId') || undefined;
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;

    const orders = await dbHelpers.getOrders({
      status,
      customerId,
      dateFrom,
      dateTo
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.customerId || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Customer ID and items array are required' },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      subtotal += product.price * item.quantity;
    }

    const tax = parseFloat(data.tax || '0');
    const shipping = parseFloat(data.shipping || '0');
    const total = subtotal + tax + shipping;

    // Create order with items in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: dbHelpers.generateOrderNumber(),
          customerId: data.customerId,
          status: data.status || 'pending',
          total,
          subtotal,
          tax,
          shipping,
          paymentStatus: data.paymentStatus || 'pending',
          paymentMethod: data.paymentMethod,
          shippingAddress: data.shippingAddress,
          orderDate: data.orderDate ? new Date(data.orderDate) : new Date(),
          notes: data.notes
        }
      });

      // Create order items
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });
        const itemTotal = product!.price * item.quantity;

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product!.price,
            total: itemTotal
          }
        });

        // Update product stock if order is confirmed
        if (newOrder.status === 'confirmed') {
          await dbHelpers.updateProductStock(
            item.productId,
            item.quantity,
            'out',
            'Order fulfillment',
            newOrder.orderNumber
          );
        }
      }

      return newOrder;
    });

    // Fetch complete order with relations
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

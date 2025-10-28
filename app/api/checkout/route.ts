import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const tenantSlug = request.headers.get('x-tenant');

    if (!tenantSlug) {
      return NextResponse.json(
        { error: 'Tenant slug is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      fullName,
      phone,
      fulfillment,
      cardName,
      cardNumber,
      expiry,
      cvv,
      address,
      total,
    } = body;

    if (!fullName || !phone || !fulfillment || !cardName || !cardNumber || !expiry || !cvv || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (fulfillment === 'delivery' && !address) {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully',
      order: {
        id: orderId,
        tenant: tenantSlug,
        customer: {
          name: fullName,
          phone,
        },
        fulfillment: {
          type: fulfillment,
          address: fulfillment === 'delivery' ? address : null,
        },
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

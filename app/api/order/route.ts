import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      orderNumber, 
      customerName, 
      email, 
      clerkUserId, 
      products, 
      totalPrice, 
      address,
      paymentMethod = "cod"
    } = body;

    // Validate required fields
    if (!orderNumber || !customerName || !email || !products || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in Sanity
    const order = await backendClient.create({
      _type: "order",
      orderNumber,
      customerName,
      email,
      clerkUserId: clerkUserId || "unknown",
      stripeCustomerId: email, // For COD, use email as customer ID
      stripePaymentIntentId: paymentMethod === "cod" ? "cod-payment" : "stripe-payment",
      currency: "usd",
      amountDiscount: 0,
      paymentMethod,
      products: products.map((item: any) => ({
        _key: crypto.randomUUID(),
        product: {
          _type: "reference",
          _ref: item.product._id,
        },
        quantity: item.quantity,
      })),
      totalPrice,
      status: paymentMethod === "cod" ? "pending" : "paid",
      orderDate: new Date().toISOString(),
      address: address ? {
        name: address.name,
        address: address.address,
        city: address.city,
        state: address.state,
        zip: address.zip,
        phone: address.phone,
        email: address.email,
      } : null,
    });

    return NextResponse.json({ 
      success: true, 
      order 
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Failed to create order. Please check your Sanity configuration.'
      },
      { status: 500 }
    );
  }
} 
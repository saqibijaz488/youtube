import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Validate that the user can only create orders for themselves
    if (clerkUserId && clerkUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to create order for another user' },
        { status: 403 }
      );
    }

    // Create order in Sanity
    const order = await backendClient.create({
      _type: "order",
      orderNumber,
      customerName,
      email,
      clerkUserId: userId,
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

    // Update stock levels for products
    for (const item of products) {
      try {
        const product = await backendClient.getDocument(item.product._id);
        if (product && typeof product.stock === 'number') {
          const newStock = Math.max(product.stock - item.quantity, 0);
          await backendClient.patch(item.product._id).set({ stock: newStock }).commit();
        }
      } catch (error) {
        console.error(`Failed to update stock for product ${item.product._id}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      order 
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Failed to create order. Please try again.'
      },
      { status: 500 }
    );
  }
} 
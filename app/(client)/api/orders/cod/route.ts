import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderData = await req.json();
    
    // Create order in Sanity for COD
    const sanityProducts = orderData.products.map((item: any) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.product._id,
      },
      quantity: item.quantity,
    }));

    const order = await backendClient.create({
      _type: "order",
      orderNumber: orderData.orderNumber,
      stripeCheckoutSessionId: `cod_${orderData.orderNumber}`,
      stripePaymentIntentId: `cod_payment_${orderData.orderNumber}`,
      customerName: orderData.customerName,
      stripeCustomerId: orderData.customerEmail,
      clerkUserId: orderData.clerkUserId,
      email: orderData.customerEmail,
      currency: "EUR",
      amountDiscount: 0,
      products: sanityProducts,
      totalPrice: orderData.totalPrice,
      status: "pending", // COD orders start as pending
      orderDate: new Date().toISOString(),
      paymentMethod: "cod",
      address: orderData.address ? {
        state: orderData.address.state,
        zip: orderData.address.zip,
        city: orderData.address.city,
        address: orderData.address.address,
        name: orderData.address.name,
      } : null,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating COD order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
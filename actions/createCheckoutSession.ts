"use server";

import stripe from "@/lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // ✅ Base URL check
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("❌ NEXT_PUBLIC_BASE_URL is missing in .env.local");
    }
    // ✅ Add http:// if someone forgot it in .env
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `http://${baseUrl}`;
    }

    // ✅ Find existing customer or create new
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId || "",
        // ✅ only store minimal address to avoid 500 char limit
        address_city: metadata.address?.city || "",
        address_state: metadata.address?.state || "",
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: { enabled: true },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/cart`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "EUR", // ✅ Changed to Euro
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unknown Product",
            description: item.product.description,
            metadata: { id: item.product._id },
            images:
              item.product.images && item.product.images.length > 0
                ? [urlFor(item.product.images[0]).url()]
                : undefined,
          },
        },
        quantity: item.quantity,
      })),
    };

    // ✅ Customer handling
    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    // ✅ Stripe session create
    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("❌ Error creating Checkout Session", error);
    throw error;
  }
}

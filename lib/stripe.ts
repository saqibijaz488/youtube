// lib/stripe.ts
import Stripe from "stripe";

// ✅ Environment variable check
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY is not defined");
}

// ✅ Stripe initialize WITHOUT forcing apiVersion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;

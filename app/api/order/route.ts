import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

// POST: Place an order
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let email = null;
    // Try to decode as NextAuth JWT first
    try {
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || JWT_SECRET });
      if (nextAuthToken && nextAuthToken.email) {
        email = nextAuthToken.email;
      }
    } catch {}
    // Fallback to custom JWT
    if (!email) {
      const jwt = await import("jsonwebtoken");
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "object" && decoded !== null && "email" in decoded) {
          email = (decoded as { email?: string }).email;
        }
      } catch {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
    }
    if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const {
      address,
      paymentMode,
      cardDetails,
      upiId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!user.cart || !Array.isArray(user.cart.items) || user.cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    let paymentStatus = "pending";
    if (paymentMode === "cod") {
      paymentStatus = "success";
    } else if (paymentMode === "card" || paymentMode === "upi") {
      // Validate Razorpay payment
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return NextResponse.json({ message: "Payment not verified" }, { status: 400 });
      }
      // Verify signature
      const crypto = await import("crypto");
      const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");
      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
      }
      paymentStatus = "success";
    }

    // Create order
    const order = {
      userEmail: email,
      items: user.cart.items,
      total: user.cart.total,
      address,
      paymentMode,
      paymentStatus,
      cardDetails: paymentMode === "card" ? cardDetails : undefined,
      upiId: paymentMode === "upi" ? upiId : undefined,
      createdAt: new Date(),
      status: "placed",
    };
  const result = await db.collection("orders").insertOne(order);
  // Clear cart
  await db.collection("users").updateOne({ email }, { $set: { cart: { items: [], total: 0, itemCount: 0 } } });
  return NextResponse.json({ message: "Order placed", orderId: result.insertedId, paymentStatus });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

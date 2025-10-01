import { NextRequest, NextResponse } from "next/server";

const Razorpay: any = require("razorpay");

const razorpayKeyId = process.env.RAZORPAY_KEY_ID!;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET!;

const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });

export async function POST(req: NextRequest) {
  try {
    const { amount, currency } = await req.json();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), 
      currency,
      payment_capture: 1,
    });
    return NextResponse.json({ orderId: order.id, amount: order.amount, key: razorpayKeyId });
  } catch (err) {
    return NextResponse.json({ message: "Failed to create payment order" }, { status: 500 });
  }
}

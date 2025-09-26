
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
    return NextResponse.json({ token, user: { email, cart: user.cart, wishlist: user.wishlist, orders: user.orders } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

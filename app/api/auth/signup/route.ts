
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

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = { email, password: hash, cart: [], wishlist: [], orders: [] };
    await users.insertOne(user);

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
    return NextResponse.json({ token, user: { email } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

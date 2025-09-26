import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

// GET: Fetch user's orders
export async function GET(req: NextRequest) {
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

    const client = await clientPromise;
    const db = client.db();
    const orders = await db.collection("orders").find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

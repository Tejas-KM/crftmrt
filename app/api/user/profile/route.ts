import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

// GET: Fetch user addresses and profile info
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let email = null;
    try {
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || JWT_SECRET });
      if (nextAuthToken && nextAuthToken.email) {
        email = nextAuthToken.email;
      }
    } catch {}
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
    const user = await db.collection("users").findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({
      email: user.email,
      phone: user.phone || "",
      addresses: user.addresses || [],
      name: user.name || "",
    });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Update user profile (email, phone, addresses)
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    let email = null;
    try {
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || JWT_SECRET });
      if (nextAuthToken && nextAuthToken.email) {
        email = nextAuthToken.email;
      }
    } catch {}
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
    const { newEmail, phone, addresses, name } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const update: any = {};
    if (typeof newEmail === "string" && newEmail) update.email = newEmail;
    if (typeof phone === "string") update.phone = phone;
    if (Array.isArray(addresses)) update.addresses = addresses;
    if (typeof name === "string") update.name = name;
    if (Object.keys(update).length === 0) return NextResponse.json({ message: "No changes" }, { status: 400 });
    await db.collection("users").updateOne({ email }, { $set: update });
    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

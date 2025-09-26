import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

// GET: Fetch user profile, cart, wishlist
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
    let user = await db.collection("users").findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    // Ensure cart and wishlist are always present and in correct format
    let cart = user.cart;
    if (!cart || typeof cart !== "object" || !Array.isArray(cart.items)) {
      cart = { items: [], total: 0, itemCount: 0 };
      await db.collection("users").updateOne({ email }, { $set: { cart } });
    }
    let wishlist = user.wishlist;
    // Always expect wishlist as { items: [...] }
    if (!wishlist || typeof wishlist !== "object" || !Array.isArray(wishlist.items)) {
      wishlist = { items: [] };
      await db.collection("users").updateOne({ email }, { $set: { wishlist } });
    }
    return NextResponse.json({ email: user.email, cart, wishlist });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Update cart or wishlist
export async function PATCH(req: NextRequest) {
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
    const { cart, wishlist } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const update: any = {};
    if (cart !== undefined) {
      // Always save full cart state
      update.cart = cart;
    }
    if (wishlist !== undefined) {
      // Always save full wishlist object { items: [...] }
      if (typeof wishlist === "object" && Array.isArray(wishlist.items)) {
        update.wishlist = wishlist;
      } else if (Array.isArray(wishlist)) {
        update.wishlist = { items: wishlist };
      } else {
        update.wishlist = { items: [] };
      }
    }
    await db.collection("users").updateOne({ email }, { $set: update });
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

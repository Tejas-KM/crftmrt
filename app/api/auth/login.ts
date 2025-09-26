//This file has been removed as its logic has been moved to route.ts for correct Next.js API routing.
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ token, user: { email, cart: user.cart, wishlist: user.wishlist, orders: user.orders } });
}

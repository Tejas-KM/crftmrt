import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-2 bg-background text-foreground">
      <Card className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <span className="mb-2 inline-flex items-center justify-center" style={{ width: 64, height: 64 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" fill="#22c55e" />
            <path d="M20 34l8 8 16-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="text-2xl font-bold text-center">Order Placed Successfully!</h1>
        <p className="text-center text-muted-foreground">Thank you for shopping with CraftMart. Your order has been placed and will be processed soon.</p>
        <Link href="/products">
          <button className="mt-4 px-6 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">Continue Shopping</button>
        </Link>
      </Card>
    </div>
  );
}

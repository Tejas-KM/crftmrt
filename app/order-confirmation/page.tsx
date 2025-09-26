import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-2 bg-background text-foreground">
      <Card className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="text-green-500 mb-2"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.293-6.707 6-6a1 1 0 0 0-1.414-1.414l-5.293 5.293-2.293-2.293A1 1 0 0 0 6.293 12.707l3 3a1 1 0 0 0 1.414 0Z"/></svg>
        <h1 className="text-2xl font-bold text-center">Order Placed Successfully!</h1>
        <p className="text-center text-muted-foreground">Thank you for shopping with CraftMart. Your order has been placed and will be processed soon.</p>
        <Link href="/products">
          <button className="mt-4 px-6 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">Continue Shopping</button>
        </Link>
      </Card>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const paymentModes = [
  { label: "Credit/Debit Card", value: "card" },
  { label: "UPI", value: "upi" },
  { label: "Cash on Delivery", value: "cod" },
];

export default function CheckoutPage() {
  const { state: cart, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
  });
  const [paymentMode, setPaymentMode] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          address,
          paymentMode,
          cardDetails: paymentMode === "card" ? cardDetails : undefined,
          upiId: paymentMode === "upi" ? upiId : undefined,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.paymentStatus === "success") {
        clearCart();
        router.push("/order-confirmation");
      } else {
        alert(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-12 px-2 ${theme === "dark" ? "bg-zinc-900 text-zinc-100" : "bg-[#f7f8fa] text-zinc-900"}`}>
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
        {/* Left: Forms */}
        <div className="flex-1 flex flex-col gap-10">
          <Card className="p-10 rounded-2xl shadow-xl bg-white/90 border border-zinc-200">
            {step === 1 && (
              <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
                <h2 className="text-2xl font-bold mb-8 border-b pb-3">Delivery Address</h2>
                <div className="grid gap-5 mt-6">
                  <Input className="text-base" name="name" placeholder="Full Name" value={address.name} onChange={handleAddressChange} required />
                  <Input className="text-base" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleAddressChange} required />
                  <Input className="text-base" name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleAddressChange} required />
                  <Input className="text-base" name="addressLine" placeholder="Address" value={address.addressLine} onChange={handleAddressChange} required />
                  <div className="flex gap-5">
                    <Input className="flex-1 text-base" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} required />
                    <Input className="flex-1 text-base" name="state" placeholder="State" value={address.state} onChange={handleAddressChange} required />
                  </div>
                </div>
                <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition" type="submit">Continue to Payment</Button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
                <h2 className="text-2xl font-bold mb-8 border-b pb-3">Payment Mode</h2>
                <div className="flex flex-col gap-5 mt-6">
                  {paymentModes.map(mode => (
                    <label key={mode.value} className="flex items-center gap-3 cursor-pointer text-lg font-medium">
                      <input
                        type="radio"
                        name="paymentMode"
                        value={mode.value}
                        checked={paymentMode === mode.value}
                        onChange={() => setPaymentMode(mode.value)}
                        required
                        className="accent-primary w-5 h-5"
                      />
                      {mode.label}
                    </label>
                  ))}
                </div>
                <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition" type="submit" disabled={!paymentMode}>Continue</Button>
              </form>
            )}
            {step === 3 && paymentMode === "card" && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-8 border-b pb-3">Card Details</h2>
                <div className="grid gap-5 mt-6">
                  <Input className="text-base" name="number" placeholder="Card Number" value={cardDetails.number} onChange={handleCardChange} required />
                  <Input className="text-base" name="name" placeholder="Name on Card" value={cardDetails.name} onChange={handleCardChange} required />
                  <div className="flex gap-5">
                    <Input className="flex-1 text-base" name="expiry" placeholder="Expiry (MM/YY)" value={cardDetails.expiry} onChange={handleCardChange} required />
                    <Input className="flex-1 text-base" name="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handleCardChange} required />
                  </div>
                </div>
                <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition" type="submit" disabled={loading}>{loading ? "Placing Order..." : "Place Order"}</Button>
              </form>
            )}
            {step === 3 && paymentMode === "upi" && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-8 border-b pb-3">UPI Payment</h2>
                <div className="grid gap-5 mt-6">
                  <Input className="text-base" name="upiId" placeholder="Enter UPI ID" value={upiId} onChange={e => setUpiId(e.target.value)} required />
                </div>
                <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition" type="submit" disabled={loading}>{loading ? "Placing Order..." : "Place Order"}</Button>
              </form>
            )}
            {step === 3 && paymentMode === "cod" && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-8 border-b pb-3">Cash on Delivery</h2>
                <div className="grid gap-5 mt-6" />
                <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition" type="submit" disabled={loading}>{loading ? "Placing Order..." : "Place Order"}</Button>
              </form>
            )}
          </Card>
        </div>
        {/* Right: Order Summary */}
        <div className="w-full md:w-[420px] flex-shrink-0">
          <Card className="p-10 rounded-2xl shadow-xl bg-white/90 border border-zinc-200">
            <h2 className="text-2xl font-bold mb-8 border-b pb-3">Order Summary</h2>
            <div className="flex flex-col gap-4 mt-6">
              {cart.items.map((item: any) => (
                <div key={item._id} className="flex justify-between text-lg">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8 font-extrabold text-2xl">
              <span>Total</span>
              <span>₹{cart.total}</span>
            </div>
          </Card>
        </div>
      </div>
      {/* Removed custom .input class to use shared Input component styling */}
// Import Input component at the top
    </div>
  );
}

// Add some basic input styling for both themes
// You can move this to a CSS/SCSS file or Tailwind config
// .input { @apply border rounded px-3 py-2 bg-inherit text-inherit outline-none focus:ring-2 focus:ring-primary; }

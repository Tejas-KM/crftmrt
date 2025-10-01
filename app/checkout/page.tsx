// TypeScript: declare Razorpay on window
declare global {
  interface Window {
    Razorpay?: any;
  }
}

"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";

const paymentModes = [
  { label: "Credit/Debit Card", value: "card" },
  { label: "UPI", value: "upi" },
  { label: "Cash on Delivery", value: "cod" },
];

// Razorpay script loader
function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { state: cart, clearCart } = useCart();
  const { token, sessionToken } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

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
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Razorpay payment handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (paymentMode === "cod") {
      try {
        const authToken = token || sessionToken;
        const res = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({ address, paymentMode }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok && data.paymentStatus === "success") {
          clearCart();
          router.push("/order-confirmation");
        } else {
          alert(data.message || "Order failed. Please try again.");
        }
      } catch (err) {
        setLoading(false);
        alert("Something went wrong. Please try again.");
      }
      return;
    }

    // Ensure Razorpay script loaded
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setLoading(false);
      alert("Unable to load payment gateway. Please try again later.");
      return;
    }

    // Create Razorpay order on backend
    let orderRes: Response;
    try {
      const authToken = token || sessionToken;
      orderRes = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          amount: cart.total,
          currency: "INR",
          address,
          paymentMode,
        }),
      });
    } catch (err) {
      setLoading(false);
      alert("Failed to initiate payment. Please try again.");
      return;
    }

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.orderId) {
      setLoading(false);
      alert(orderData.message || "Failed to initiate payment.");
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: "INR",
      name: "CraftMart",
      description: "Order Payment",
      order_id: orderData.orderId,
      handler: async function (response: any) {
        try {
          const authToken = token || sessionToken;
          const verifyRes = await fetch("/api/order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify({
              address,
              paymentMode,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          setLoading(false);
          if (verifyRes.ok && verifyData.paymentStatus === "success") {
            clearCart();
            router.push("/order-confirmation");
          } else {
            alert(verifyData.message || "Order failed. Please try again.");
          }
        } catch {
          setLoading(false);
          alert("Order placement failed. Please contact support.");
        }
      },
      prefill: {
        name: address.name,
        email: "",
        contact: address.phone,
      },
      theme: { color: "#6366f1" },
      method: paymentMode === "upi" ? { upi: true } : { card: true },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <>
      <Header compact />
      <div className={`min-h-screen flex flex-col items-center py-12 px-2 ${theme === "dark" ? "bg-zinc-900 text-zinc-100" : "bg-[#f7f8fa] text-zinc-900"}`}>
        <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">Checkout</h1>

        {/* Stepper */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-6 items-center">
            <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
              <span className="rounded-full border-2 border-primary w-8 h-8 flex items-center justify-center font-bold">1</span>
              <span className="mt-2 text-sm font-medium">Address</span>
            </div>
            <div className="w-12 h-1 bg-primary/30 rounded" />
            <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
              <span className="rounded-full border-2 border-primary w-8 h-8 flex items-center justify-center font-bold">2</span>
              <span className="mt-2 text-sm font-medium">Payment</span>
            </div>
            <div className="w-12 h-1 bg-primary/30 rounded" />
            <div className={`flex flex-col items-center ${step === 3 ? "text-primary" : "text-gray-400"}`}>
              <span className="rounded-full border-2 border-primary w-8 h-8 flex items-center justify-center font-bold">3</span>
              <span className="mt-2 text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
          {/* Left: Forms */}
          <div className="flex-1 flex flex-col gap-10">
            <Card className="p-10 rounded-2xl shadow-xl bg-white/90 border border-zinc-200">
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <h2 className="text-2xl font-bold mb-8 border-b pb-3 flex items-center gap-2">
                    <span>Delivery Address</span>
                    <span className="ml-2 text-primary text-lg">📦</span>
                  </h2>
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
                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                  <h2 className="text-2xl font-bold mb-8 border-b pb-3 flex items-center gap-2">
                    <span>Payment Mode</span>
                    <span className="ml-2 text-primary text-lg">💳</span>
                  </h2>
                  <div className="flex flex-col gap-5 mt-6">
                    {paymentModes.map((mode) => (
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
                        <span className="flex items-center gap-2">
                          {mode.value === "card" && <span>💳</span>}
                          {mode.value === "upi" && <span>📱</span>}
                          {mode.value === "cod" && <span>🚚</span>}
                          {mode.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition" type="submit" disabled={!paymentMode}>Continue</Button>
                </form>
              )}

              {step === 3 && (paymentMode === "card" || paymentMode === "upi") && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold mb-8 border-b pb-3 flex items-center gap-2">
                    <span>{paymentMode === "card" ? "Card Payment" : "UPI Payment"}</span>
                    <span className="ml-2 text-primary text-lg">{paymentMode === "card" ? "💳" : "📱"}</span>
                  </h2>
                  <div className="grid gap-5 mt-6">
                    <div className="text-base text-gray-600">You will be redirected to Razorpay to securely complete your payment.</div>
                  </div>
                  <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition text-white" type="submit" disabled={loading}>{loading ? "Redirecting..." : "Pay & Place Order"}</Button>
                </form>
              )}

              {step === 3 && paymentMode === "cod" && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold mb-8 border-b pb-3 flex items-center gap-2">
                    <span>Cash on Delivery</span>
                    <span className="ml-2 text-primary text-lg">🚚</span>
                  </h2>
                  <div className="grid gap-5 mt-6" />
                  <Button className="mt-10 w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary/90 transition text-white" type="submit" disabled={loading}>{loading ? "Placing Order..." : "Place Order"}</Button>
                </form>
              )}
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full md:w-[420px] flex-shrink-0">
            <Card className="p-10 rounded-2xl shadow-xl bg-white/90 border border-zinc-200">
              <h2 className="text-2xl font-bold mb-8 border-b pb-3 flex items-center gap-2">
                <span>Order Summary</span>
                <span className="ml-2 text-primary text-lg">🧾</span>
              </h2>
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
              <div className="mt-6 text-sm text-gray-500">All payments are securely processed via Razorpay.</div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

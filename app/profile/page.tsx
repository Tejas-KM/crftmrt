"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Header } from "@/components/Header";

export default function ProfilePage() {
  const { user, token, sessionToken } = useAuth();
  const { state: cart } = useCart();
  const { state: wishlist } = useWishlist();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profile, setProfile] = useState({ email: user?.email || "", phone: "", name: "", addresses: [] as any[] });
  const [profileEdit, setProfileEdit] = useState(false);
  const [addressEditIdx, setAddressEditIdx] = useState<number | null>(null);
  const [addressDraft, setAddressDraft] = useState<any>({ name: "", phone: "", pincode: "", addressLine: "", city: "", state: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const authToken = token || sessionToken;
    if (!authToken) return;
    setOrdersLoading(true);
    fetch("/api/order/history", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));

    fetch("/api/user/profile", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          email: data.email || user?.email || "",
          phone: data.phone || "",
          name: data.name || "",
          addresses: Array.isArray(data.addresses) ? data.addresses : [],
        });
      })
      .catch(() => {});
  }, [token, sessionToken, user?.email]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">You are not logged in</h2>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header compact />
      <div className="max-w-7xl mx-auto py-12 px-2 md:px-6">
        <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Cart Card */}
          <Card className="p-8 rounded-2xl shadow-xl flex flex-col items-center w-full bg-white/90 border border-zinc-200">
            <h2 className="text-xl font-bold mb-4">My Cart</h2>
            <div className="mb-2 text-base text-gray-500">
              Total Items: <span className="font-bold">{cart.itemCount}</span>
            </div>
            <div className="mb-2 text-base text-gray-500">
              Total: <span className="font-bold">₹{cart.total}</span>
            </div>
            {cart.items.length === 0 ? (
              <div className="text-gray-500">Your cart is empty.</div>
            ) : (
              <ul className="divide-y max-h-40 overflow-y-auto">
                {cart.items.map((item: any) => (
                  <li key={item.id} className="py-2 flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/cart" className="text-blue-600 hover:underline text-base block mt-2">
              Go to Cart
            </Link>
          </Card>

          {/* Address Book */}
          <Card className="p-8 rounded-2xl shadow-xl w-full bg-white/90 border border-zinc-200">
            <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
              My Addresses
              <button
                className="text-blue-600 text-base font-medium"
                onClick={() => {
                  setAddressEditIdx(profile.addresses.length);
                  setAddressDraft({ name: "", phone: "", pincode: "", addressLine: "", city: "", state: "" });
                }}
              >
                + Add
              </button>
            </h2>
            {profile.addresses.length === 0 && <div className="text-gray-500">No addresses saved.</div>}
            <ul className="divide-y max-h-48 overflow-y-auto">
              {profile.addresses.map((addr, idx) => (
                <li key={idx} className="py-2">
                  {addressEditIdx === idx ? (
                    <form
                      className="flex flex-col gap-2"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const newAddresses = [...profile.addresses];
                        newAddresses[idx] = addressDraft;
                        setSaving(true);
                        await fetch("/api/user/profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ addresses: newAddresses }),
                        });
                        setProfile((p) => ({ ...p, addresses: newAddresses }));
                        setSaving(false);
                        setAddressEditIdx(null);
                      }}
                    >
                      <Input className="text-base" value={addressDraft.name} onChange={(e) => setAddressDraft((a: any) => ({ ...a, name: e.target.value }))} placeholder="Name" required />
                      <Input className="text-base" value={addressDraft.phone} onChange={(e) => setAddressDraft((a: any) => ({ ...a, phone: e.target.value }))} placeholder="Phone" required />
                      <Input className="text-base" value={addressDraft.pincode} onChange={(e) => setAddressDraft((a: any) => ({ ...a, pincode: e.target.value }))} placeholder="Pincode" required />
                      <Input className="text-base" value={addressDraft.addressLine} onChange={(e) => setAddressDraft((a: any) => ({ ...a, addressLine: e.target.value }))} placeholder="Address" required />
                      <Input className="text-base" value={addressDraft.city} onChange={(e) => setAddressDraft((a: any) => ({ ...a, city: e.target.value }))} placeholder="City" required />
                      <Input className="text-base" value={addressDraft.state} onChange={(e) => setAddressDraft((a: any) => ({ ...a, state: e.target.value }))} placeholder="State" required />
                      <div className="flex gap-3 mt-2">
                        <Button className="w-1/2" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                        <Button className="w-1/2 bg-zinc-200 text-zinc-800 hover:bg-zinc-300" type="button" onClick={() => setAddressEditIdx(null)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold">
                        {addr.name} <span className="text-xs text-gray-500">({addr.phone})</span>
                      </div>
                      <div className="text-sm">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</div>
                      <div className="flex gap-2 mt-1">
                        <button className="text-blue-600 text-xs font-medium" onClick={() => { setAddressEditIdx(idx); setAddressDraft(addr); }}>
                          Edit
                        </button>
                        <button className="text-red-600 text-xs font-medium" onClick={async () => {
                          const newAddresses = profile.addresses.filter((_, i) => i !== idx);
                          setSaving(true);
                          await fetch("/api/user/profile", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ addresses: newAddresses }),
                          });
                          setProfile((p) => ({ ...p, addresses: newAddresses }));
                          setSaving(false);
                        }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}

              {/* Add new address form */}
              {addressEditIdx === profile.addresses.length && (
                <li className="py-2">
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const newAddresses = [...profile.addresses, addressDraft];
                      setSaving(true);
                      await fetch("/api/user/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ addresses: newAddresses }),
                      });
                      setProfile((p) => ({ ...p, addresses: newAddresses }));
                      setSaving(false);
                      setAddressEditIdx(null);
                    }}
                  >
                    <Input name="name" className="text-base" value={addressDraft.name} onChange={(e) => setAddressDraft((a: any) => ({ ...a, name: e.target.value }))} placeholder="Name" required />
                    <Input name="phone" className="text-base" value={addressDraft.phone} onChange={(e) => setAddressDraft((a: any) => ({ ...a, phone: e.target.value }))} placeholder="Phone" required />
                    <Input name="pincode" className="text-base" value={addressDraft.pincode} onChange={(e) => setAddressDraft((a: any) => ({ ...a, pincode: e.target.value }))} placeholder="Pincode" required />
                    <Input name="addressLine" className="text-base" value={addressDraft.addressLine} onChange={(e) => setAddressDraft((a: any) => ({ ...a, addressLine: e.target.value }))} placeholder="Address" required />
                    <Input name="city" className="text-base" value={addressDraft.city} onChange={(e) => setAddressDraft((a: any) => ({ ...a, city: e.target.value }))} placeholder="City" required />
                    <Input className="text-base" value={addressDraft.state} onChange={(e) => setAddressDraft((a: any) => ({ ...a, state: e.target.value }))} placeholder="State" required />
                    <div className="flex gap-3 mt-2">
                      <Button className="w-1/2" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                      <Button className="w-1/2 bg-zinc-200 text-zinc-800 hover:bg-zinc-300" type="button" onClick={() => setAddressEditIdx(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </li>
              )}
            </ul>
          </Card>

          {/* Wishlist Card */}
          <Card className="p-8 rounded-2xl shadow-xl bg-white/90 border border-zinc-200">
            <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
            <div className="mb-2 text-base text-gray-500">Total Items: <span className="font-bold">{wishlist.items.length}</span></div>
            {wishlist.items.length === 0 ? (
              <div className="text-gray-500">Your wishlist is empty.</div>
            ) : (
              <ul className="divide-y max-h-40 overflow-y-auto">
                {wishlist.items.map((item: any) => (
                  <li key={item.id} className="py-2 flex justify-between items-center">
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/wishlist" className="text-blue-600 hover:underline text-base block mt-2">Go to Wishlist</Link>
          </Card>
        </div>

        {/* Orders Section */}
        <Card className="p-10 rounded-2xl shadow-xl bg-white/90 border border-zinc-200 mb-8">
          <h2 className="text-2xl font-bold mb-6">My Orders</h2>
          {ordersLoading ? (
            <div className="text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500">No orders found.</div>
          ) : (
            <ul className="divide-y max-h-96 overflow-y-auto">
              {orders.map((order: any) => (
                <li key={order._id} className="py-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <div className="font-semibold text-lg">Order #{order._id?.toString().slice(-6)}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                      <div className="text-sm mt-1">Status: <span className="font-medium">{order.status}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">₹{order.total}</div>
                      <div className="text-xs text-gray-500">{order.paymentMode?.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-base">
                    {order.items?.map((item: any) => (
                      <div key={item.id || item._id} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}



"use client";

import Image from "next/image";
import { useState } from "react";
import type { CartItem, Product } from "@/types";

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Accessories (Ashtrays & Trays)",
    price: 0,
    image: "/p1.png",
  },
  { id: 2, name: "Grinder", price: 2000, image: "/p4.png" },
  { id: 3, name: "Bong", price: 2000, image: "/p2.png" },
  { id: 4, name: "Cookies — 2pc", price: 350, image: "/p1.png" },
  { id: 5, name: "Kashata", price: 150, image: "/p1.png" },
  { id: 6, name: "Mabuyu", price: 150, image: "/p3.png" },
  {
    id: 7,
    name: "Pre-roll (Foreign)",
    price: 150,
    image: "/p1.png",
  },
  {
    id: 8,
    name: "Pre-roll (Skunk)",
    price: 100,
    image: "/p1.png",
  },
];

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qty, setQty] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (product: Product) => {
    const amount = qty[product.id] ?? 0;
    if (amount <= 0) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + amount } : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: amount,
        },
      ];
    });

    setQty((q) => ({ ...q, [product.id]: 0 }));
  };

  const updateCartItem = (id: number, newQty: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: newQty } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const sendOrder = async () => {
    if (cart.length === 0 || !name || !phone) {
      alert("Please fill in your details and add items to the cart.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, total: cartTotal, name, phone, notes }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Order sent successfully!");
        setCart([]);
        setName("");
        setPhone("");
        setNotes("");
        setCartOpen(false);
      } else {
        alert("Failed to send order. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#02020a] to-[#060615] text-[#e8e8f0]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <span className="font-extrabold tracking-wide">Galactic Greens</span>
          <nav className="hidden md:flex gap-6 text-sm text-gray-400">
            <a href="#products" className="hover:text-cyan-300">
              Products
            </a>
            <a href="#gallery" className="hover:text-cyan-300">
              Gallery
            </a>
            <a href="#about" className="hover:text-cyan-300">
              About
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="hover:text-cyan-300"
            >
              Order ({cartCount})
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(200,120,255,0.15),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Galactic Greens
          </h1>
          <p className="text-gray-400 mb-6">Elevate Your Universe.</p>
          <a
            href="#products"
            className="inline-block rounded-lg px-5 py-2 font-semibold
              bg-linear-to-r from-cyan-300 to-purple-400 text-black shadow-lg"
          >
            Shop the Cosmos
          </a>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-sm tracking-widest text-cyan-300">
            PRODUCT CATEGORIES
          </h2>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-white/5 bg-white/3 p-3
                  transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(120,80,200,0.15)]"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={400}
                  height={300}
                  className="mb-3 h-36 w-full rounded-lg object-cover"
                />
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-400">
                  {p.price === 0 ? "Custom" : `KSh ${p.price.toLocaleString()}`}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={qty[p.id] ?? 0}
                    onChange={(e) =>
                      setQty((q) => ({ ...q, [p.id]: Number(e.target.value) }))
                    }
                    className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => addToCart(p)}
                    className="rounded-lg border border-cyan-300/30 px-3 py-1 text-sm text-cyan-300 hover:bg-cyan-300/10"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CART MODAL */}
      {cartOpen && (
        <CartModal
          cart={cart}
          total={cartTotal}
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          notes={notes}
          setNotes={setNotes}
          onClose={() => setCartOpen(false)}
          updateCartItem={updateCartItem}
          sendOrder={sendOrder}
          isSubmitting={isSubmitting}
        />
      )}

      {/* ABOUT */}
      <section id="about" className="py-16">
        <div className="mx-auto max-w-prose px-4">
          <h2 className="mb-4 text-sm tracking-widest text-cyan-300">
            About Galactic Greens
          </h2>
          <p className="text-gray-400">
            Born where stardust meets chill vibes — Galactic Greens crafts
            curated cannabis experiences and premium accessories. From
            glow-ready ashtrays to hand-rolled pre-rolls, every product is
            designed to help you elevate your universe.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Galactic Greens — All rights reserved.
      </footer>
    </div>
  );
}

function CartModal({
  cart,
  total,
  name,
  setName,
  phone,
  setPhone,
  notes,
  setNotes,
  onClose,
  updateCartItem,
  sendOrder,
  isSubmitting,
}: {
  cart: CartItem[];
  total: number;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  onClose: () => void;
  updateCartItem: (id: number, qty: number) => void;
  sendOrder: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/5 bg-[#0d0d1a] p-6">
        <h3 className="mb-4 text-lg font-semibold">Your Cart & Order</h3>

        <div className="mb-4 max-h-60 space-y-2 overflow-auto">
          {cart.length === 0 && (
            <p className="text-sm text-gray-400">Cart is empty.</p>
          )}
          {cart.map((i) => (
            <div
              key={i.id}
              className="flex justify-between text-sm items-center gap-2"
            >
              <span>{i.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={i.qty}
                  onChange={(e) => updateCartItem(i.id, Number(e.target.value))}
                  className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm"
                />
                <span>KSh {(i.qty * i.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mb-4 font-semibold">
          Total: KSh {total.toLocaleString()}
        </p>

        <form className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone / WhatsApp"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            placeholder="Delivery instructions (optional)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="button"
            className="w-full rounded-lg bg-linear-to-r from-cyan-300 to-purple-400 py-2 font-semibold text-black"
            onClick={sendOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Order"}
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-red-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

/* ---------------- TYPES ---------------- */

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

/* ---------------- DATA ---------------- */

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Accessories (Ashtrays & Trays)",
    price: 0,
    image: "/assets/accessory1.jpg",
  },
  { id: 2, name: "Grinder", price: 2000, image: "/assets/grinder.jpg" },
  { id: 3, name: "Bong", price: 2000, image: "/assets/bong.jpg" },
  { id: 4, name: "Cookies — 2pc", price: 350, image: "/assets/cookies.jpg" },
  { id: 5, name: "Kashata", price: 150, image: "/assets/kashata.jpg" },
  { id: 6, name: "Mabuyu", price: 150, image: "/assets/mabuyu.jpg" },
  {
    id: 7,
    name: "Pre-roll (Foreign)",
    price: 150,
    image: "/assets/preroll1.jpg",
  },
  {
    id: 8,
    name: "Pre-roll (Skunk)",
    price: 100,
    image: "/assets/preroll2.jpg",
  },
];

/* ---------------- PAGE ---------------- */

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qty, setQty] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

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

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

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
              Order
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
                  transition hover:-translate-y-1
                  hover:shadow-[0_20px_50px_rgba(120,80,200,0.15)]"
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
                    className="rounded-lg border border-cyan-300/30 px-3 py-1 text-sm
                      text-cyan-300 hover:bg-cyan-300/10"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-sm tracking-widest text-cyan-300">
            GALLERY
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Image
                key={i}
                src={`/assets/gallery${i}.jpg`}
                alt={`Gallery image ${i}`}
                width={400}
                height={300}
                className="h-36 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16">
        <div className="mx-auto max-w-prose px-4">
          <h2 className="mb-4 text-sm tracking-widest text-cyan-300">ABOUT</h2>
          <p className="text-gray-400">
            Born where stardust meets chill vibes — Galactic Greens crafts
            curated cannabis experiences and premium accessories designed to
            elevate your universe.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Galactic Greens
      </footer>

      {/* CART MODAL */}
      {cartOpen && (
        <CartModal
          cart={cart}
          total={total}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------------- CART MODAL ---------------- */

function CartModal({
  cart,
  total,
  onClose,
}: {
  cart: CartItem[];
  total: number;
  onClose: () => void;
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
            <div key={i.id} className="flex justify-between text-sm">
              <span>
                {i.name} × {i.qty}
              </span>
              <span>KSh {(i.qty * i.price).toLocaleString()}</span>
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
          />
          <input
            type="text"
            placeholder="Phone / WhatsApp"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          />
          <textarea
            placeholder="Delivery instructions (optional)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-linear-to-r from-cyan-300 to-purple-400 py-2
              font-semibold text-black"
          >
            Send Order
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

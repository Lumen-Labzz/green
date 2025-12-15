"use client";

import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem {
  id: number;
  product: string;
  price: number;
  qty: number;
  total: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Purple Haze",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?auto=format&fit=crop&w=400&q=80",
    description: "Premium indica strain",
  },
  {
    id: 2,
    name: "Green Dream",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=400&q=80",
    description: "Smooth hybrid blend",
  },
  {
    id: 3,
    name: "Rolling Papers",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1585155770960-24c5954d83e6?auto=format&fit=crop&w=400&q=80",
    description: "Premium quality papers",
  },
  {
    id: 4,
    name: "Glass Pipe",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1582718970103-4b1a6c2f6d5e?auto=format&fit=crop&w=400&q=80",
    description: "Handcrafted glass",
  },
  {
    id: 5,
    name: "Grinder",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1587467512961-120760940315?auto=format&fit=crop&w=400&q=80",
    description: "4-piece metal grinder",
  },
  {
    id: 6,
    name: "Lighter Pack",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1583878432578-1e265f9f1187?auto=format&fit=crop&w=400&q=80",
    description: "Pack of 5 lighters",
  },
];

export default function GalacticGreens() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.price }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          product: product.name,
          price: product.price,
          qty: 1,
          total: product.price,
        },
      ];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === id);
      if (existing && existing.qty > 1) {
        return prevCart.map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1, total: (item.qty - 1) * item.price }
            : item,
        );
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          total: cartTotal,
          notes: orderNotes,
          phone: orderPhone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCart(false);
        setShowPayment(true);
        setCart([]);
        setOrderNotes("");
        setOrderPhone("");
      } else {
        alert("Failed to send order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body { 
          font-family: 'Inter', sans-serif; 
          font-size: 1.125rem;
          line-height: 1.6;
        }
        h1, h2, h3 { 
          font-family: 'Rajdhani', sans-serif; 
          letter-spacing: 0.5px;
        }
        .glass { 
          backdrop-filter: blur(12px); 
          background: rgba(255,255,255,0.08); 
        }
        .neon { 
          text-shadow: 0 0 8px #00ff66, 0 0 12px #ff0033; 
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full glass border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl font-bold neon"
          >
            Galactic Greens
          </button>

          <div className="hidden md:flex space-x-8 font-semibold">
            <a href="#shop" className="hover:text-green-400 transition">
              Shop
            </a>
            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="hover:text-green-400 transition"
            >
              Cart
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-green-400 focus:outline-none text-2xl"
          >
            ☰
          </button>
        </div>

        {showMobileMenu && (
          <div className="md:hidden px-6 pb-4 space-y-2 font-semibold">
            <a href="#shop" className="block hover:text-green-400 transition">
              Shop
            </a>
            <button
              type="button"
              onClick={() => {
                setShowCart(true);
                setShowMobileMenu(false);
              }}
              className="block hover:text-green-400 transition w-full text-left"
            >
              Cart
            </button>
          </div>
        )}
      </nav>

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-6 z-50">
          <div className="glass p-6 rounded-2xl w-full max-w-md border border-white/10">
            <h2 className="text-3xl font-bold mb-4 neon">Your Cart</h2>

            <div className="space-y-4 text-gray-300 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center py-8">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{item.product}</p>
                      <p className="text-sm">
                        KES {item.price.toLocaleString()} × {item.qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">
                        KES {item.total.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded text-sm"
                      >
                        −
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between text-xl mt-4 font-bold">
              <span>Total:</span>
              <span>KES {cartTotal.toLocaleString()}</span>
            </div>

            <label htmlFor="orderNotes" className="block text-sm mt-4 mb-1">
              Delivery Address / Notes
            </label>
            <textarea
              id="orderNotes"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={3}
              className="w-full bg-black/40 border border-white/20 p-2 rounded text-gray-200"
            />

            <label htmlFor="orderPhone" className="block text-sm mt-4 mb-1">
              Phone Number
            </label>
            <input
              id="orderPhone"
              type="text"
              value={orderPhone}
              onChange={(e) => setOrderPhone(e.target.value)}
              placeholder="e.g. +2547..."
              className="w-full bg-black/40 border border-white/20 p-2 rounded text-gray-200"
            />

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isSubmitting || cart.length === 0}
              className="mt-6 w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-500 text-black py-2 rounded-xl font-bold"
            >
              {isSubmitting ? "Processing..." : "Proceed to Checkout"}
            </button>
            <button
              type="button"
              onClick={() => setShowCart(false)}
              className="mt-3 w-full bg-red-500 hover:bg-red-400 text-black py-2 rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT OVERLAY */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="glass relative p-8 rounded-2xl w-full max-w-md border border-white/10 text-center">
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 text-red-400 text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-6 neon">
              Complete Your Payment
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              Please send your payment via M‑Pesa to:
            </p>
            <p className="text-2xl font-bold text-green-400 mb-6">
              0727 630 389
            </p>
            <p className="text-sm text-gray-400">
              Your order will be processed once payment is confirmed.
            </p>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section
        className="h-screen flex flex-col justify-center items-center text-center px-6 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1536766820879-059fec98ec0a?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 max-w-3xl mt-20">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 neon">
            Galactic Greens
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Premium Weed • Tools • Accessories
          </p>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16 neon">
          Shop The Collection
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass p-6 rounded-2xl border border-white/10 hover:border-green-400/50 transition"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-400">
                  KES {product.price.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-bold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING CART BUTTON */}
      <button
        type="button"
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-full font-bold shadow-xl"
      >
        Cart ({cartCount})
      </button>

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-300 border-t border-white/10">
        <p className="text-xl md:text-2xl font-bold">Galactic Greens © 2025</p>
        <p className="mt-4 text-lg md:text-xl">
          Contact us:
          <a
            href="mailto:hamsfirst1@gmail.com"
            className="text-green-400 hover:text-green-300 ml-2"
          >
            hamsfirst1@gmail.com
          </a>
        </p>
        <p className="mt-4 text-lg md:text-xl">
          Website crafted by <span className="font-semibold">Lumen Labz</span> —
          Reach out for a free website at
          <a
            href="mailto:lumenlabzz@gmail.com"
            className="text-green-400 hover:text-green-300 ml-2"
          >
            lumenlabzz@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}

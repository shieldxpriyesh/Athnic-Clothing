"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart, updateCartItem, removeCartItem, applyCoupon } from "@/lib/api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    gst: 0,
    discount: 0,
    total: 0,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data.items || []);
      setSummary({
        subtotal: parseFloat(data.subtotal || 0),
        shipping: parseFloat(data.shipping_cost || 0),
        gst: parseFloat(data.gst_amount || 0),
        discount: parseFloat(data.discount_amount || 0),
        total: parseFloat(data.total || 0),
      });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (key, newQty) => {
    if (newQty <= 0) {
      handleRemove(key);
      return;
    }
    try {
      await updateCartItem(key, newQty);
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (key) => {
    try {
      await removeCartItem(key);
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      await applyCoupon(promoCode);
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCart();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Header */}
      <div className="px-6 md:px-12 py-12 border-b-[3px] border-athnic-gray">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
            Your Bag
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase">
            Cart
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {loading ? (
          <div className="text-center py-20 font-mono text-athnic-acid">LOADING THE VIBE...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-3xl uppercase mb-4">Your cart is empty</p>
            <p className="font-mono text-sm text-athnic-light-gray mb-8">
              Time to fill it up. You know the drill.
            </p>
            <Link href="/shop" className="btn-primary">
              SHOP NOW
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* ── Cart Items ───────────────────────── */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.key} className="flex gap-4 border-2 border-athnic-gray p-4 group hover:border-athnic-mid-gray transition-colors">
                  {/* Image */}
                  <div className="w-24 h-32 bg-athnic-dark flex items-center justify-center shrink-0">
                    <span className="font-display text-xs text-athnic-mid-gray">IMG</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product_slug}`} className="font-display text-sm md:text-base tracking-wider uppercase hover:text-athnic-acid transition-colors">
                      {item.product_name}
                    </Link>
                    <div className="flex gap-4 mt-1">
                      <span className="font-mono text-[10px] text-athnic-light-gray">
                        Size: {item.size}
                      </span>
                      <span className="font-mono text-[10px] text-athnic-light-gray">
                        Color: {item.color}
                      </span>
                    </div>
                    <p className="font-display text-lg text-athnic-acid mt-2">
                      ₹{item.price}
                    </p>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-athnic-gray">
                        <button
                          onClick={() => handleUpdateQty(item.key, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center font-mono text-sm hover:bg-athnic-gray transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center font-mono text-xs border-x border-athnic-gray">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.key, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center font-mono text-sm hover:bg-athnic-gray transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.key)}
                        className="font-mono text-[10px] text-athnic-light-gray hover:text-athnic-red tracking-wider uppercase transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ────────────────────── */}
            <div className="md:col-span-1">
              <div className="border-2 border-athnic-gray p-6 sticky top-24">
                <h3 className="font-display text-lg tracking-[0.1em] uppercase mb-6">
                  Order Summary
                </h3>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-athnic-gray border border-athnic-gray text-athnic-off-white font-mono text-xs focus:border-athnic-acid focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-athnic-gray text-athnic-acid font-display text-xs tracking-wider hover:bg-athnic-mid-gray transition-colors"
                  >
                    APPLY
                  </button>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-athnic-light-gray">Subtotal</span>
                    <span>₹{summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-athnic-light-gray">Shipping</span>
                    <span className={summary.shipping === 0 ? "text-athnic-acid" : ""}>
                      {summary.shipping === 0 ? "FREE" : `₹${summary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-athnic-light-gray">GST (18%)</span>
                    <span>₹{summary.gst.toFixed(2)}</span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-athnic-acid">
                      <span>Discount</span>
                      <span>-₹{summary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-athnic-gray pt-3 flex justify-between">
                    <span className="font-display text-base uppercase">Total</span>
                    <span className="font-display text-xl text-athnic-acid">₹{summary.total.toFixed(2)}</span>
                  </div>
                </div>

                {summary.subtotal < 999 && summary.subtotal > 0 && (
                  <p className="font-mono text-[10px] text-athnic-acid mt-3">
                    Add ₹{(999 - summary.subtotal).toFixed(0)} more for free shipping!
                  </p>
                )}

                <Link href="/checkout" className="btn-primary w-full justify-center mt-6 py-4">
                  CHECKOUT
                </Link>

                <Link href="/shop" className="block text-center font-mono text-[10px] text-athnic-light-gray mt-3 hover:text-athnic-acid tracking-wider uppercase">
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

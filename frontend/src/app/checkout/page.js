"use client";
import { useState, useEffect } from "react";
import { getCart, createOrder, verifyPayment, getAddresses, createAddress } from "@/lib/api";

const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CT", name: "Chhattisgarh" },
  { code: "DN", name: "Dadra and Nagar Haveli" },
  { code: "DD", name: "Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LA", name: "Ladakh" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OR", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "PY", name: "Puducherry" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TG", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cart, addr] = await Promise.all([getCart(), getAddresses()]);
      setCartData(cart);
      setAddresses(addr);
      if (addr.length > 0) {
        const def = addr.find(a => a.is_default) || addr[0];
        setSelectedAddressId(def.id);
        setFormData({ ...def });
      }
    } catch (err) {
      console.error("Failed to fetch checkout data:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinueToPayment = async () => {
    setLoading(true);
    try {
      let addrId = selectedAddressId;
      if (!addrId) {
        const newAddr = await createAddress({ ...formData, is_default: true });
        addrId = newAddr.id;
      }
      
      const orderRes = await createOrder(addrId);
      setOrderId(orderRes.order_id);
      setCartData(orderRes.order);
      setStep(2);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert("Payment gateway not loaded. Please refresh.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: cartData.total * 100, // in paise
      currency: "INR",
      name: "ATHNIC CLOTHING",
      description: `Order #${orderId}`,
      order_id: cartData.razorpay_order_id,
      handler: async function (response) {
        try {
          setLoading(true);
          await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          window.dispatchEvent(new Event("cartUpdated"));
          setStep(3);
        } catch (err) {
          alert("Payment verification failed: " + err.message);
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#D4FF00" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Header */}
      <div className="px-6 md:px-12 py-12 border-b-[3px] border-athnic-gray">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
            Final Step
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase">
            Checkout
          </h1>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          {["Address", "Payment", "Done"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center border-2 font-display text-sm ${
                step > i + 1 ? "bg-athnic-acid border-athnic-acid text-athnic-black" :
                step === i + 1 ? "border-athnic-acid text-athnic-acid" :
                "border-athnic-gray text-athnic-light-gray"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`font-mono text-[10px] tracking-wider uppercase hidden sm:block ${
                step === i + 1 ? "text-athnic-acid" : "text-athnic-light-gray"
              }`}>
                {label}
              </span>
              {i < 2 && <div className="w-8 md:w-16 h-px bg-athnic-gray" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* ── Address Form ───────────────────────── */}
          <div className="md:col-span-3">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl tracking-[0.1em] uppercase mb-4">
                  Shipping Address
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Address Line 1</label>
                    <input name="line1" value={formData.line1} onChange={handleChange}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Address Line 2 (Optional)</label>
                    <input name="line2" value={formData.line2} onChange={handleChange}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">City</label>
                    <input name="city" value={formData.city} onChange={handleChange}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Pincode</label>
                    <input name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">State</label>
                    <select name="state" value={formData.state} onChange={handleChange}
                      className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleContinueToPayment} 
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 mt-6 disabled:opacity-50"
                >
                  {loading ? "SAVING ADDRESS..." : "CONTINUE TO PAYMENT"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 border-2 border-athnic-acid flex items-center justify-center">
                  <svg className="w-10 h-10 text-athnic-acid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl uppercase mb-3">Razorpay Payment</h3>
                <p className="font-mono text-sm text-athnic-light-gray mb-8 max-w-sm mx-auto">
                  You&apos;ll be redirected to Razorpay&apos;s secure payment gateway to complete your order.
                </p>
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="btn-primary px-12 py-4 disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : `PAY ₹${parseFloat(cartData?.total || 0).toFixed(2)}`}
                </button>
                <button onClick={() => setStep(1)} className="block mx-auto mt-4 font-mono text-[10px] text-athnic-light-gray hover:text-athnic-acid tracking-wider uppercase">
                  ← Back to Address
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-athnic-acid flex items-center justify-center">
                  <svg className="w-10 h-10 text-athnic-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-3xl uppercase mb-3">
                  Order <span className="text-athnic-acid">Confirmed</span>
                </h3>
                <p className="font-mono text-sm text-athnic-light-gray mb-2">
                  Order #{orderId}
                </p>
                <p className="font-mono text-xs text-athnic-light-gray max-w-sm mx-auto">
                  Welcome to the tribe. Your order is being prepared with love and care. You&apos;ll receive tracking updates via email.
                </p>
                <div className="flex gap-4 justify-center mt-8">
                  <a href="/account" className="btn-primary px-8">
                    VIEW ORDER
                  </a>
                  <a href="/shop" className="btn-secondary px-8">
                    KEEP SHOPPING
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ──────────────── */}
          <div className="md:col-span-2">
            <div className="border-2 border-athnic-gray p-6 sticky top-24">
              <h3 className="font-display text-sm tracking-[0.15em] uppercase mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {(cartData?.items || []).map((item) => (
                  <div key={item.key} className="flex justify-between font-mono text-xs">
                    <span className="text-athnic-light-gray">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>₹{parseFloat(item.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-athnic-gray pt-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-athnic-light-gray">Subtotal</span>
                  <span>₹{parseFloat(cartData?.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-athnic-light-gray">Shipping</span>
                  <span className={cartData?.shipping_cost == 0 ? "text-athnic-acid" : ""}>
                    {cartData?.shipping_cost == 0 ? "FREE" : `₹${parseFloat(cartData?.shipping_cost || 0).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-athnic-light-gray">GST (18%)</span>
                  <span>₹{parseFloat(cartData?.gst_amount || 0).toFixed(2)}</span>
                </div>
                {parseFloat(cartData?.discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-athnic-acid">
                    <span className="text-athnic-light-gray">Discount</span>
                    <span>-₹{parseFloat(cartData?.discount_amount || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="border-t-2 border-athnic-gray mt-4 pt-4 flex justify-between">
                <span className="font-display text-base uppercase">Total</span>
                <span className="font-display text-xl text-athnic-acid">₹{parseFloat(cartData?.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

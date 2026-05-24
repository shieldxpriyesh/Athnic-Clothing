"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { login, register, getProfile, getOrders, getAddresses, createAddress } from "@/lib/api";

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

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Forms
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    first_name: "", last_name: "", username: "", email: "", password: "", password2: ""
  });
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", is_default: false
  });

  useEffect(() => {
    // Check if token exists in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        setIsLoggedIn(true);
        fetchUserData();
      }
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [profData, ordersData, addrData] = await Promise.all([
        getProfile(),
        getOrders(),
        getAddresses()
      ]);
      setProfile(profData);
      setOrders(ordersData.results || ordersData);
      setAddresses(addrData);
    } catch (err) {
      console.error("Failed to fetch user dashboard data:", err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(loginForm.username, loginForm.password);
      localStorage.setItem("access_token", res.tokens.access);
      localStorage.setItem("refresh_token", res.tokens.refresh);
      setIsLoggedIn(true);
      await fetchUserData();
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.password2) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await register(registerForm);
      localStorage.setItem("access_token", res.tokens.access);
      localStorage.setItem("refresh_token", res.tokens.refresh);
      setIsLoggedIn(true);
      await fetchUserData();
    } catch (err) {
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setProfile(null);
    setOrders([]);
    setAddresses([]);
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAddress(addressForm);
      setShowAddAddress(false);
      // Reset form
      setAddressForm({
        name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", is_default: false
      });
      // Refresh addresses
      const addrData = await getAddresses();
      setAddresses(addrData);
    } catch (err) {
      alert("Failed to add address: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Login/Register form
  if (!isLoggedIn) {
    return (
      <div className="pt-20 md:pt-24 pb-20">
        <div className="px-6 md:px-12 py-12 border-b-[3px] border-athnic-gray">
          <div className="max-w-7xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
              {isLogin ? "Welcome Back" : "Join the Tribe"}
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase">
              {isLogin ? "Login" : "Register"}
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 py-12">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">
                  Email or Username
                </label>
                <input 
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Password</label>
                <input 
                  required
                  type="password" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 disabled:opacity-50">
                {loading ? "AUTHENTICATING..." : "LOGIN"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">First Name</label>
                  <input 
                    required
                    value={registerForm.first_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, first_name: e.target.value })}
                    className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Last Name</label>
                  <input 
                    required
                    value={registerForm.last_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, last_name: e.target.value })}
                    className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Email</label>
                <input 
                  required
                  type="email" 
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Username</label>
                <input 
                  required
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Password</label>
                <input 
                  required
                  type="password" 
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Confirm Password</label>
                <input 
                  required
                  type="password" 
                  value={registerForm.password2}
                  onChange={(e) => setRegisterForm({ ...registerForm, password2: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 disabled:opacity-50">
                {loading ? "CREATING..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-mono text-xs text-athnic-light-gray hover:text-athnic-acid transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Account Dashboard
  const TABS = [
    { id: "orders", label: "Orders" },
    { id: "addresses", label: "Addresses" },
    { id: "wishlist", label: "Wishlist" },
  ];

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="px-6 md:px-12 py-12 border-b-[3px] border-athnic-gray">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
              Your Account
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase">
              Yo, {profile?.first_name || "Tribe Member"}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary text-xs py-2 px-4 border-athnic-red text-athnic-red hover:bg-athnic-red hover:text-white"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Tabs */}
        <div className="flex gap-1 border-b-2 border-athnic-gray mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-display text-xs tracking-[0.15em] uppercase px-6 py-3 border-b-2 -mb-[2px] transition-colors ${
                activeTab === tab.id
                  ? "border-athnic-acid text-athnic-acid"
                  : "border-transparent text-athnic-light-gray hover:text-athnic-off-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-12 font-mono text-athnic-acid">GETTING DATA...</div>}

        {/* Orders Tab */}
        {!loading && activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-athnic-gray">
                <p className="font-mono text-sm text-athnic-light-gray mb-4">You haven&apos;t placed any orders yet.</p>
                <Link href="/shop" className="btn-primary inline-flex">SHOP THE DROP</Link>
              </div>
            ) : (
              orders.map((order) => {
                const dateStr = new Date(order.created_at).toLocaleDateString("en-IN", {
                  year: "numeric", month: "short", day: "numeric"
                });
                let statusColor = "#8BC34A"; 
                if (order.status === "pending") statusColor = "#FFC107"; 
                if (order.status === "cancelled") statusColor = "#F44336"; 
                if (order.status === "shipped") statusColor = "#2196F3"; 

                return (
                  <div key={order.id} className="border-2 border-athnic-gray p-6 hover:border-athnic-mid-gray transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-display text-sm tracking-wider uppercase">Order #{order.id}</p>
                        <p className="font-mono text-[10px] text-athnic-light-gray mt-1">{dateStr}</p>
                      </div>
                      <span
                        className="font-display text-[10px] tracking-widest uppercase px-4 py-1 rounded-full animate-pulse"
                        style={{ backgroundColor: statusColor + "20", color: statusColor }}
                      >
                        {order.status_display}
                      </span>
                      <span className="font-display text-lg text-athnic-acid">₹{parseFloat(order.total).toFixed(2)}</span>
                      <Link href={`/checkout?order_id=${order.id}`} className="font-mono text-[10px] text-athnic-light-gray hover:text-athnic-acid tracking-wider uppercase underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {!loading && activeTab === "addresses" && (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className={`border-2 p-6 transition-colors group hover:border-athnic-mid-gray ${addr.is_default ? "border-athnic-acid" : "border-athnic-gray"}`}>
                <div className="flex items-start justify-between mb-3">
                  {addr.is_default ? (
                    <span className="font-display text-[10px] tracking-widest text-athnic-acid uppercase bg-athnic-acid/10 px-3 py-1">
                      Default
                    </span>
                  ) : (
                    <span className="font-display text-[10px] tracking-widest text-athnic-light-gray uppercase bg-athnic-gray/10 px-3 py-1">
                      Secondary
                    </span>
                  )}
                </div>
                <p className="font-display text-sm uppercase">{addr.name}</p>
                <p className="font-mono text-xs text-athnic-light-gray mt-2 leading-relaxed">
                  {addr.line1}<br />
                  {addr.line2 && <>{addr.line2}<br /></>}
                  {addr.city}, {addr.state_display} - {addr.pincode}<br />
                  Phone: {addr.phone}
                </p>
              </div>
            ))}
            
            <button 
              onClick={() => setShowAddAddress(true)}
              className="border-2 border-dashed border-athnic-gray p-6 flex flex-col items-center justify-center gap-3 hover:border-athnic-acid transition-colors min-h-[150px]"
            >
              <span className="font-display text-3xl text-athnic-light-gray">+</span>
              <span className="font-mono text-[10px] text-athnic-light-gray tracking-wider uppercase">
                Add New Address
              </span>
            </button>
          </div>
        )}

        {/* Wishlist Tab */}
        {!loading && activeTab === "wishlist" && (
          <div className="text-center py-16">
            <p className="font-display text-2xl uppercase mb-3">Your wishlist is empty</p>
            <p className="font-mono text-sm text-athnic-light-gray mb-6">
              Save your favorite pieces for later.
            </p>
            <Link href="/shop" className="btn-primary">
              BROWSE COLLECTION
            </Link>
          </div>
        )}
      </div>

      {/* ── Add Address Modal ───────────────────────── */}
      {showAddAddress && (
        <div className="fixed inset-0 z-50 bg-athnic-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-athnic-dark border-2 border-athnic-gray max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-extrabold uppercase">Add Address</h3>
              <button
                onClick={() => setShowAddAddress(false)}
                className="text-athnic-light-gray hover:text-athnic-off-white text-2xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Full Name</label>
                <input 
                  required
                  value={addressForm.name} 
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Phone</label>
                <input 
                  required
                  value={addressForm.phone} 
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Address Line 1</label>
                <input 
                  required
                  value={addressForm.line1} 
                  onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Address Line 2 (Optional)</label>
                <input 
                  value={addressForm.line2} 
                  onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">City</label>
                  <input 
                    required
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">Pincode</label>
                  <input 
                    required
                    maxLength={6}
                    value={addressForm.pincode} 
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-wider text-athnic-light-gray uppercase block mb-2">State</label>
                <select 
                  required
                  value={addressForm.state} 
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full px-4 py-3 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="is_default"
                  checked={addressForm.is_default} 
                  onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  className="accent-[#D4FF00]" 
                />
                <label htmlFor="is_default" className="font-mono text-xs text-athnic-light-gray cursor-pointer uppercase select-none">Set as Default Address</label>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full justify-center py-4 mt-4 disabled:opacity-50"
              >
                {loading ? "ADDING..." : "ADD ADDRESS"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

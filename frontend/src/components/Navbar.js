"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart } from "@/lib/api";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const data = await getCart();
        const count = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (err) {
        console.error("Failed to fetch cart count:", err);
      }
    };
    fetchCartCount();
    
    // Listen for cart updates (custom event)
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-athnic-black/90 backdrop-blur-md border-b border-athnic-gray">
      <div className="flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-display text-2xl md:text-3xl font-extrabold tracking-wider text-athnic-off-white">
            ATHNIC
          </span>
          <span className="ml-1 w-2 h-2 bg-athnic-acid rounded-full inline-block" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/shop", label: "SHOP" },
            { href: "/about", label: "ABOUT" },
            { href: "/contact", label: "CONTACT" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm tracking-[0.2em] text-athnic-light-gray hover:text-athnic-acid transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="interactive p-2 text-athnic-light-gray hover:text-athnic-acid transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Account */}
          <Link href="/account" className="interactive p-2 text-athnic-light-gray hover:text-athnic-acid transition-colors hidden md:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="interactive relative p-2 text-athnic-light-gray hover:text-athnic-acid transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-athnic-acid text-athnic-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="interactive md:hidden p-2 text-athnic-light-gray"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64" : "max-h-0"}`}>
        <nav className="flex flex-col border-t border-athnic-gray">
          {[
            { href: "/shop", label: "SHOP" },
            { href: "/about", label: "ABOUT" },
            { href: "/contact", label: "CONTACT" },
            { href: "/account", label: "ACCOUNT" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-lg tracking-[0.15em] px-6 py-4 border-b border-athnic-gray text-athnic-off-white hover:text-athnic-acid hover:bg-athnic-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

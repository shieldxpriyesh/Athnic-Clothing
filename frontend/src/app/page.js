"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts, subscribeNewsletter } from "@/lib/api";

const TICKER_TEXT = "ATHNIC CLOTHING · DROP THE ORDINARY · JOIN THE TRIBE · MADE FOR THE STREETS · WEAR YOUR WORLD · NOT FOR EVERYONE · ";

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );
    const sections = ref.current?.querySelectorAll(".reveal-section");
    sections?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pageRef = useReveal();

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const data = await getFeaturedProducts();
      setFeaturedProducts(data.results || data);
    } catch (err) {
      console.error("Failed to fetch featured products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div ref={pageRef}>
      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-athnic-black via-athnic-dark to-athnic-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-athnic-acid/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-athnic-red/10 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <p className="font-mono text-xs tracking-[0.4em] text-athnic-acid mb-6 fade-in-up uppercase">
            Indian Streetwear · Est. 2024
          </p>
          <h1 className="font-display text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-extrabold leading-[0.85] tracking-tight fade-in-up fade-in-up-delay-1">
            NOT FOR
            <br />
            <span className="gradient-text">EVERYONE</span>
          </h1>
          <p className="font-mono text-sm md:text-base text-athnic-light-gray mt-6 max-w-md mx-auto fade-in-up fade-in-up-delay-2">
            Catch the vibe. Join the tribe. Raw, unapologetic streetwear rooted in Indian culture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 fade-in-up fade-in-up-delay-3">
            <Link href="/shop" className="btn-primary">
              SHOP NOW
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/shop" className="btn-secondary">
              EXPLORE THE DROP
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-athnic-light-gray uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-athnic-acid to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── MARQUEE TICKER ─────────────────────────── */}
      <div className="bg-athnic-acid py-3 overflow-hidden">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="font-display text-lg md:text-xl font-extrabold text-athnic-black tracking-[0.1em] whitespace-nowrap mx-0"
            >
              {TICKER_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED COLLECTION ────────────────────── */}
      <section className="reveal-section px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
              Featured Collection
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold uppercase">
              The Drop
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 font-display text-sm tracking-[0.15em] text-athnic-light-gray hover:text-athnic-acid transition-colors uppercase"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center font-mono text-athnic-acid">LOADING THE HEAT...</div>
          ) : featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="md:hidden text-center mt-8">
          <Link href="/shop" className="btn-secondary text-sm">
            View All Products
          </Link>
        </div>
      </section>

      {/* ── Brutal Divider ─────────────────────────── */}
      <div className="border-t-[3px] border-athnic-gray mx-6 md:mx-12" />

      {/* ── BRAND STATEMENT ────────────────────────── */}
      <section className="reveal-section px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-4">
              The Brand
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold uppercase leading-tight">
              We Don&apos;t Follow
              <br />
              <span className="text-athnic-acid">Trends.</span>
              <br />
              We Set Them.
            </h2>
            <p className="font-mono text-sm text-athnic-light-gray mt-6 leading-relaxed max-w-lg">
              Athnic isn&apos;t just clothing. It&apos;s identity. Born from the streets of India,
              designed for a generation that refuses to blend in. Every piece is a statement.
              Every fit tells your story.
            </p>
            <Link href="/about" className="btn-primary mt-8 inline-flex">
              OUR STORY
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: "50K+", label: "Tribe Members" },
              { number: "10K+", label: "Orders Shipped" },
              { number: "100+", label: "Designs Dropped" },
              { number: "4.8★", label: "Average Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-2 border-athnic-gray p-6 hover:border-athnic-acid transition-colors group"
              >
                <span className="font-display text-3xl md:text-4xl font-extrabold text-athnic-acid group-hover:text-athnic-off-white transition-colors">
                  {stat.number}
                </span>
                <p className="font-mono text-[10px] tracking-[0.2em] text-athnic-light-gray uppercase mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL WALL / LIFESTYLE ────────────────── */}
      <section className="reveal-section px-6 md:px-12 py-20 md:py-28 bg-athnic-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
              @AthnicClothing
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase">
              The Tribe Wears It Better
            </h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-athnic-gray relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-athnic-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="font-mono text-[10px] text-athnic-off-white">@athnic</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────── */}
      <section className="reveal-section bg-athnic-black border-t-[3px] border-athnic-gray">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-extrabold uppercase">
            Stay in the <span className="text-athnic-acid">Loop</span>
          </h2>
          <p className="font-mono text-sm text-athnic-light-gray mt-4 max-w-md mx-auto">
            Get first dibs on drops, exclusive deals, and culture updates. We don&apos;t spam. Promise.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mt-8 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-4 bg-athnic-gray border-2 border-athnic-gray text-athnic-off-white font-mono text-sm focus:border-athnic-acid focus:outline-none transition-colors"
            />
            <button type="submit" className="btn-primary px-8 py-4">
              {subscribed ? "YOU'RE IN!" : "I'M IN"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

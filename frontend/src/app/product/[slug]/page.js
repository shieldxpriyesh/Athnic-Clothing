"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProduct, getRelatedProducts, addToCart } from "@/lib/api";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [p, r] = await Promise.all([getProduct(slug), getRelatedProducts(slug)]);
      setProduct(p);
      setRelated(r);
      if (p.available_colors?.length > 0) setSelectedColor(p.available_colors[0]);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (buyNow = false) => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, selectedSize, selectedColor, quantity);
      window.dispatchEvent(new Event("cartUpdated"));
      if (buyNow) {
        router.push("/checkout");
      } else {
        alert("Added to cart!");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="pt-40 text-center font-mono text-athnic-acid">LOADING THE HEAT...</div>;
  if (!product) return <div className="pt-40 text-center font-mono">PRODUCT NOT FOUND</div>;

  const SIZE_GUIDE = {
    headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
    rows: [
      ["S", "40", "27", "19"],
      ["M", "42", "28", "20"],
      ["L", "44", "29", "21"],
      ["XL", "46", "30", "22"],
      ["XXL", "48", "31", "23"],
    ],
  };

  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-4 border-b border-athnic-gray">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-mono text-[10px] text-athnic-light-gray">
          <Link href="/" className="hover:text-athnic-acid">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-athnic-acid">Shop</Link>
          <span>/</span>
          <span className="text-athnic-off-white">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* ── Images ─────────────────────────────── */}
          <div>
            {/* Main Image */}
            <div className="aspect-[3/4] bg-athnic-dark border-2 border-athnic-gray mb-4 relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[activeImage]?.image}
                  alt={product.images[activeImage]?.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-6xl text-athnic-mid-gray">ATHNIC</span>
                </div>
              )}
              {product.is_new_arrival && (
                <span className="absolute top-4 left-4 bg-athnic-acid text-athnic-black font-display text-[10px] tracking-[0.2em] px-3 py-1 uppercase font-bold">
                  NEW
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-athnic-dark border-2 overflow-hidden transition-colors ${
                    activeImage === i ? "border-athnic-acid" : "border-athnic-gray hover:border-athnic-off-white"
                  }`}
                >
                  <img
                    src={img.image}
                    alt={img.alt_text || `${product.name} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ────────────────────────── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-athnic-acid uppercase mb-2">
              T-Shirts
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold uppercase">
              {product.name}
            </h1>
            <p className="font-mono text-sm text-athnic-light-gray mt-3">
              {product.brand_story_copy}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4 mt-6">
              <span className="font-display text-3xl text-athnic-acid">₹{product.price}</span>
              {product.compare_price && (
                <>
                  <span className="font-mono text-lg text-athnic-light-gray line-through">
                    ₹{product.compare_price}
                  </span>
                  <span className="bg-athnic-red text-white font-display text-xs px-3 py-1 uppercase">
                    -{product.discount_percent}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="font-mono text-[10px] text-athnic-light-gray mt-1">
              Inclusive of GST ({product.gst_percent}%)
            </p>

            {/* Color */}
            <div className="mt-8">
              <p className="font-display text-sm tracking-[0.15em] uppercase mb-3">
                Color: <span className="text-athnic-acid">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {product.available_colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 font-mono text-xs transition-colors ${
                      selectedColor === color
                        ? "border-athnic-acid bg-athnic-acid/10 text-athnic-acid"
                        : "border-athnic-gray text-athnic-light-gray hover:border-athnic-off-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-sm tracking-[0.15em] uppercase">
                  Size{selectedSize && <>: <span className="text-athnic-acid">{selectedSize}</span></>}
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="font-mono text-[10px] text-athnic-acid underline tracking-wider uppercase"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.available_sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border-2 font-display text-sm flex items-center justify-center transition-colors ${
                      selectedSize === size
                        ? "border-athnic-acid bg-athnic-acid text-athnic-black"
                        : "border-athnic-gray text-athnic-light-gray hover:border-athnic-off-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="font-display text-sm tracking-[0.15em] uppercase mb-3">Quantity</p>
              <div className="flex items-center border-2 border-athnic-gray w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center font-display text-lg hover:bg-athnic-gray transition-colors"
                >
                  −
                </button>
                <span className="w-12 h-12 flex items-center justify-center font-mono text-sm border-x-2 border-athnic-gray">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center font-display text-lg hover:bg-athnic-gray transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                onClick={() => handleAddToCart(false)}
                disabled={adding}
                className="btn-primary flex-1 justify-center py-4 text-lg disabled:opacity-50"
              >
                {adding ? "ADDING..." : "ADD TO CART"}
              </button>
              <button 
                onClick={() => handleAddToCart(true)}
                disabled={adding}
                className="btn-secondary flex-1 justify-center py-4 text-lg border-athnic-acid text-athnic-acid hover:bg-athnic-acid hover:text-athnic-black disabled:opacity-50"
              >
                BUY NOW
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-10 border-t-2 border-athnic-gray pt-8">
              <h3 className="font-display text-lg tracking-[0.1em] uppercase mb-4">Product Details</h3>
              <div
                className="font-mono text-sm text-athnic-light-gray leading-relaxed [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ───────────────────────── */}
      <section className="border-t-[3px] border-athnic-gray mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase mb-8">
            You Might Also <span className="text-athnic-acid">Like</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Size Guide Modal ───────────────────────── */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-athnic-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-athnic-dark border-2 border-athnic-gray max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-extrabold uppercase">Size Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-athnic-light-gray hover:text-athnic-off-white text-2xl"
              >
                ✕
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-athnic-gray">
                  {SIZE_GUIDE.headers.map((h) => (
                    <th key={h} className="font-display text-xs tracking-[0.1em] text-athnic-acid uppercase py-3 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.rows.map((row, i) => (
                  <tr key={i} className="border-b border-athnic-gray/50">
                    {row.map((cell, j) => (
                      <td key={j} className="font-mono text-sm text-athnic-off-white py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Sticky Add to Cart (Mobile) ────────────── */}
      <div className="fixed bottom-16 left-0 right-0 bg-athnic-black/95 backdrop-blur-md border-t border-athnic-gray p-4 md:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm uppercase truncate">{product.name}</p>
            <p className="font-display text-lg text-athnic-acid">₹{product.price}</p>
          </div>
          <button 
            onClick={() => handleAddToCart(false)}
            disabled={adding}
            className="btn-primary py-3 px-6 text-sm whitespace-nowrap disabled:opacity-50"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}

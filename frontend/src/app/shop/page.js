"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/api";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ name: "All", slug: "all" }]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSize, sortBy]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories([{ name: "All", slug: "all" }, ...data]);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== "all") params.category__slug = selectedCategory;
      if (selectedSize) params.variants__size = selectedSize;
      if (sortBy) params.ordering = sortBy === "price_low" ? "price" : sortBy === "price_high" ? "-price" : "-id";
      
      const data = await getProducts(params);
      setProducts(data.results || data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
  const SORT_OPTIONS = [
    { value: "newest", label: "New Arrivals" },
    { value: "price_low", label: "Price: Low → High" },
    { value: "price_high", label: "Price: High → Low" },
    { value: "bestsellers", label: "Bestsellers" },
  ];

  return (
    <div className="pt-20 md:pt-24">
      {/* Header */}
      <div className="px-6 md:px-12 py-12 border-b-[3px] border-athnic-gray">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.4em] text-athnic-acid uppercase mb-2">
            The Collection
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase">
            Shop
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ── Filter Sidebar ─────────────────────── */}
          <aside className={`md:w-64 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-display text-sm tracking-[0.2em] text-athnic-acid uppercase mb-4">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left font-mono text-xs py-2 px-3 transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-athnic-acid text-athnic-black"
                        : "text-athnic-light-gray hover:text-athnic-off-white hover:bg-athnic-gray"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <h3 className="font-display text-sm tracking-[0.2em] text-athnic-acid uppercase mb-4">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`w-10 h-10 border-2 font-mono text-xs flex items-center justify-center transition-colors ${
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

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-display text-sm tracking-[0.2em] text-athnic-acid uppercase mb-4">
                Price Range
              </h3>
              <div className="space-y-2">
                {["Under ₹1000", "₹1000 - ₹2000", "₹2000 - ₹3000", "₹3000+"].map((range) => (
                  <label key={range} className="flex items-center gap-3 font-mono text-xs text-athnic-light-gray hover:text-athnic-off-white cursor-pointer">
                    <input type="checkbox" className="accent-[#D4FF00]" />
                    {range}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Product Grid ───────────────────────── */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-athnic-gray">
              <button
                className="md:hidden font-display text-xs tracking-[0.15em] text-athnic-acid uppercase"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {loading ? (
                <div className="col-span-full py-20 text-center font-mono text-athnic-acid">LOADING THE HEAT...</div>
              ) : products.length === 0 ? (
                <div className="col-span-full py-20 text-center font-mono">No products found matching your vibe.</div>
              ) : (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="btn-secondary text-sm">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

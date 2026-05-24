"use client";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const {
    name,
    slug,
    price,
    compare_price,
    discount_percent,
    primary_image,
    is_new_arrival,
    brand_story_copy,
  } = product;

  return (
    <Link href={`/product/${slug}`} className="product-card group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-athnic-dark">
        {primary_image ? (
          <Image
            src={primary_image}
            alt={name}
            fill
            className="object-cover product-image-main transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-athnic-gray">
            <span className="font-display text-4xl text-athnic-mid-gray">ATHNIC</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {is_new_arrival && (
            <span className="bg-athnic-acid text-athnic-black font-display text-[10px] tracking-[0.2em] px-3 py-1 uppercase font-bold">
              NEW
            </span>
          )}
          {discount_percent > 0 && (
            <span className="bg-athnic-red text-white font-display text-[10px] tracking-[0.1em] px-3 py-1 uppercase font-bold">
              -{discount_percent}%
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-athnic-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="btn-primary text-sm px-6 py-2">QUICK VIEW</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t-2 border-athnic-gray">
        <h3 className="font-display text-sm md:text-base tracking-wider uppercase truncate">
          {name}
        </h3>
        {brand_story_copy && (
          <p className="text-athnic-light-gray font-mono text-[10px] mt-1 truncate">
            {brand_story_copy}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="font-display text-lg text-athnic-acid">₹{price}</span>
          {compare_price && compare_price > price && (
            <span className="font-mono text-xs text-athnic-light-gray line-through">
              ₹{compare_price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

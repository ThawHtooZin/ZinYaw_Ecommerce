import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { id, title, priceMmk, originalPriceMmk, storeName, verified, rating, soldCount, image, isBestseller } = product;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col justify-between group">
      {/* Product Image Container */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {isBestseller && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider z-10">
            BESTSELLER
          </span>
        )}
        <img
          src={image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Seller Line */}
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>{storeName || "URBAN CARRY"}</span>
            {verified && <span className="text-emerald-600 font-extrabold">• VERIFIED</span>}
          </div>

          {/* Title */}
          <Link to={`/catalog/base-products/${id}`} className="font-bold text-slate-900 text-sm mt-1 block line-clamp-2 hover:text-indigo-600 transition">
            {title}
          </Link>
        </div>

        {/* Pricing & Ratings */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-indigo-600">
              {(priceMmk || 0).toLocaleString()} MMK
            </span>
            {originalPriceMmk && (
              <span className="text-xs text-slate-400 line-through">
                {originalPriceMmk.toLocaleString()}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <span className="text-amber-500">★ {rating || "4.8"}</span>
            <span>•</span>
            <span>{soldCount || 120} sold</span>
          </div>
        </div>
      </div>
    </div>
  );
}
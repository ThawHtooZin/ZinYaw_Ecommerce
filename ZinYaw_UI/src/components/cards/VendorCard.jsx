import React from 'react';
import { Link } from 'react-router-dom';

export default function VendorCard({ vendor }) {
  const { id, name, code, category, rating } = vendor;

  return (
    <Link
      to={`/catalog?vendor_id=${id}`}
      className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition"
    >
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 font-black text-base rounded-lg flex items-center justify-center shrink-0">
        {code || "UC"}
      </div>
      <div>
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
          {name}
          <span className="text-emerald-600 text-xs font-bold">✓ Verified store</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          {category || "Bags & daily carry"} • {rating || "4.9"} seller rating
        </p>
      </div>
    </Link>
  );
}
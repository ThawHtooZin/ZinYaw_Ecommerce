import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/cards/ProductCard';
import VendorCard from '../../components/cards/VendorCard';
import { catalogService } from '../../services/catalogService';
import { vendorService } from '../../services/vendorService';

export default function HomePage() {

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);

      try {
        // 2. Fetch both products and vendors at the EXACT SAME TIME
        const [productsData, vendorsData] = await Promise.all([
          catalogService.getTrendingProducts(),
          vendorService.getFeaturedVendors()
        ]);
        
        // 3. If the component is still on the screen, update the state!
        if (isMounted) {
          // Assuming your API returns { success: true, data: [...] } and your interceptor unpacks it
          setProducts(productsData || []);
          setVendors(vendorsData || []);
        }
      } catch (error) {
        // 4. If the server is offline or throws a 500 error, it lands here
        console.error("Failed to fetch home page data:", error);
        
        if (isMounted) {
          // Optional: We set empty arrays so the UI doesn't crash on .map()
          setProducts([]);
          setVendors([]);
        }
      }finally {
        // 5. This block runs NO MATTER WHAT (success or failure)
        if (isMounted) {
          setLoading(false); // Turn OFF the skeleton loader
        }
      }
    }

    loadData();

    return () => {
      isMounted = false; // Cleanup function
    };
  },[]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">

      {/* 1. Hero Section (Completely Static HTML) */}
      <section className="bg-indigo-50/60 py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-black text-indigo-600 tracking-wider uppercase">
              EVERYDAY ESSENTIALS, BETTER SELECTED
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              Shop trusted stores across Myanmar.
            </h1>
            <p className="text-sm text-slate-600 max-w-lg">
              Clear prices, reliable delivery, and protected payments—everything you need in one marketplace.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/catalog" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow transition">
                Shop new arrivals
              </Link>
              <Link to="/catalog" className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-2.5 rounded-lg text-sm font-semibold transition">
                Browse categories
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" alt="Backpack" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3">
              <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" alt="Headphones" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500" alt="Tumbler" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-600 font-bold text-lg">✓</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Escrow protected</h4>
              <p className="text-[11px] text-slate-500">Funds released after delivery</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-600 font-bold text-lg">❖</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">MMK Wallet</h4>
              <p className="text-[11px] text-slate-500">Fast, secure local payments</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-600 font-bold text-lg">⚡</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Verified sellers</h4>
              <p className="text-[11px] text-slate-500">Stores reviewed by ZinYaw</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-600 font-bold text-lg">↺</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Buyer support</h4>
              <p className="text-[11px] text-slate-500">Help when you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Products Placeholder */}
      <section className="max-w-7xl mx-auto px-4 py-12 w-full space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-slate-900">Popular this week</h2>
            <p className="text-xs text-slate-500 mt-0.5">Products customers are choosing right now.</p>
          </div>
          <Link to="/catalog" className="text-xs font-bold text-indigo-600 hover:underline">
            Shop all →
          </Link>
        </div>

        <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500">
          {/* If loading is true, show the grey pulse blocks. Otherwise, show real cards. */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-xl p-4 h-72 animate-pulse flex flex-col justify-between">
                  <div className="bg-slate-200 aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Trusted Stores Placeholder */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16 w-full space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-slate-900">Trusted stores</h2>
            <p className="text-xs text-slate-500 mt-0.5">Independent sellers with a strong service record.</p>
          </div>
          <Link to="/catalog?type=stores" className="text-xs font-bold text-indigo-600 hover:underline">
            Explore stores →
          </Link>
        </div>

        <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-xl p-4 h-24 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
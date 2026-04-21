"use client";

import { useState, useEffect } from "react";
import { Store, User, Star, MapPin, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function MarketplaceVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await fetch("/api/vendors/public");
        if (res.ok) {
          const data = await res.json();
          setVendors(data);
        }
      } catch (e) {
        console.error("Failed to fetch vendors:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVendors();
  }, []);

  if (isLoading) {
    return (
      <div className="grid-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card animate-pulse" style={{ height: "180px", background: "var(--bg-subtle)" }}></div>
        ))}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="glass-card text-center p-12">
        <p className="text-secondary">No independent vendors are active currently.</p>
      </div>
    );
  }

  return (
    <div className="flex-col gap-6">
      <div className="grid-3 gap-6">
        {vendors.map((vendor) => (
          <Link href={`/dashboard/vendors/${vendor.storeSlug}`} key={vendor.id} className="vendor-search-card">
            <div className="glass-card hover:border-primary transition-all p-6 flex-col gap-4">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-grad-primary flex items-center justify-center text-white">
                     <Store size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-warning" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                    <Star size={14} fill="currentColor" /> 4.9
                  </div>
               </div>
               <div className="flex-col gap-1">
                  <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{vendor.storeName}</h4>
                  <p className="text-muted text-xs" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {vendor.description}
                  </p>
               </div>
               <div className="flex justify-between items-center pt-3 border-t border-subtle mt-auto">
                  <span className="text-xs font-bold text-primary">View Storefront</span>
                  <ArrowRight size={14} className="text-primary" />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

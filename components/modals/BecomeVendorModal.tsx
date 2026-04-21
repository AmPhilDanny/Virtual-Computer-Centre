"use client";

import { useState, useEffect } from "react";
import { X, Store, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface BecomeVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeVendorModal({ isOpen, onClose }: BecomeVendorModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  if (!shouldRender || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="glass-card flex-col gap-6 relative z-10 animate-in fade-in zoom-in duration-300" style={{ 
        width: "100%",
        maxWidth: "480px", 
        padding: "clamp(var(--space-6), 5vw, var(--space-10))", 
        border: "1px solid var(--brand-primary)",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
         <button 
           onClick={onClose}
           className="absolute top-4 right-4 p-2 rounded-full hover:bg-subtle text-muted transition-colors z-20"
         >
           <X size={20} />
         </button>

         <div className="flex-col items-center text-center gap-4">
            <div style={{ 
              width: 64, height: 64, borderRadius: "20px", 
              background: "var(--grad-primary)", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              color: "#fff", boxShadow: "0 8px 32px rgba(108, 71, 255, 0.4)",
              flexShrink: 0
            }}>
               <Store size={32} />
            </div>
            <div className="flex-col gap-1">
               <h2 style={{ margin: 0, fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>Become a <span className="text-gradient">Vendor</span></h2>
               <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                 Turn your expert skills into a profitable business on Nova Digital Centre.
               </p>
            </div>
         </div>

         <div className="flex-col gap-4 py-2">
            <FeatureItem 
              icon={<Sparkles size={16} className="text-primary" />} 
              title="Global Reach" 
              desc="Gain access to hundreds of clients searching for your expertise." 
            />
            <FeatureItem 
              icon={<CheckCircle2 size={16} className="text-success" />} 
              title="Secure Escrow" 
              desc="All funds are held in escrow until job completion." 
            />
            <FeatureItem 
              icon={<Store size={16} className="text-secondary" />} 
              title="Professional Storefront" 
              desc="Build a branded portfolio and showcase your verified services." 
            />
         </div>

         <div className="flex-col gap-3 pt-4 border-t border-subtle">
            <Link 
              href="/dashboard/become-vendor" 
              className="btn btn-primary btn-lg w-full gap-2"
              onClick={onClose}
              style={{ fontSize: "0.95rem" }}
            >
               Apply to Join Marketplace <ArrowRight size={18} />
            </Link>
            <button 
              className="btn btn-ghost btn-md w-full"
              onClick={onClose}
            >
               Maybe Later
            </button>
         </div>

         <p className="text-center text-muted" style={{ fontSize: "0.75rem", margin: 0, opacity: 0.8 }}>
            No upfront fees. We only take a small commission on successful sales.
         </p>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start">
       <div className="p-2 rounded-lg bg-subtle" style={{ marginTop: 2 }}>{icon}</div>
       <div className="flex-col gap-0.5">
          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{title}</div>
          <div className="text-muted" style={{ fontSize: "0.8rem", lineHeight: 1.4 }}>{desc}</div>
       </div>
    </div>
  );
}

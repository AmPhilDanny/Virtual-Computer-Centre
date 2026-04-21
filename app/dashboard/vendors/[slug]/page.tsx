import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store, Star, Globe, ShieldCheck, ChevronRight } from "lucide-react";

export default async function VendorStorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const vendor = await prisma.vendorProfile.findUnique({
    where: { storeSlug: resolvedParams.slug, status: "APPROVED" },
    include: {
      services: {
        where: { isActive: true, approvalStatus: "APPROVED" }
      }
    }
  });

  if (!vendor) {
    notFound();
  }

  return (
    <div className="flex-col gap-8">
      {/* Hero Header */}
      <div className="glass-card flex-col gap-6 bg-grad-primary text-white p-12" style={{ border: "none" }}>
        <Link href="/dashboard/services" className="btn btn-ghost btn-sm text-white w-fit" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ArrowLeft size={16} /> Back to Services
        </Link>
        <div className="flex justify-between items-end">
           <div className="flex-col gap-2">
              <div className="flex items-center gap-3">
                 <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-lg">
                    <Store size={32} />
                 </div>
                 <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#fff" }}>{vendor.storeName}</h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: "600px", margin: 0 }}>
                {vendor.description}
              </p>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex-col items-end">
                 <span style={{ fontSize: "0.7rem", opacity: 0.8, fontWeight: 700 }}>RATING</span>
                 <div className="flex items-center gap-1 font-bold" style={{ fontSize: "1.25rem" }}>
                    <Star size={18} fill="currentColor" /> 4.9
                 </div>
              </div>
              {vendor.portfolioUrl && (
                <a href={vendor.portfolioUrl} target="_blank" className="btn btn-ghost btn-sm text-white" style={{ background: "rgba(255,255,255,0.1)" }}>
                   <Globe size={16} /> Portfolio
                </a>
              )}
           </div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1fr 340px", alignItems: "start" }}>
        <div className="flex-col gap-6">
           <h3 style={{ margin: 0 }}>Services by {vendor.storeName}</h3>
           {vendor.services.length === 0 ? (
             <div className="glass-card text-center p-12">
                <p className="text-secondary">This vendor hasn't listed any services yet.</p>
             </div>
           ) : (
             <div className="grid-2 gap-6">
                {vendor.services.map((service) => (
                  <Link href={`/dashboard/services/${service.slug}`} key={service.id} className="service-card-link">
                    <div className="glass-card flex-col gap-4 hover:border-primary transition-all p-6 h-full">
                       <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{service.name}</h4>
                       <p className="text-muted text-sm line-clamp-2">
                         {service.description}
                       </p>
                       <div className="flex justify-between items-center mt-auto pt-4 border-t border-subtle">
                          <span style={{ fontWeight: 800, color: "var(--brand-primary)" }}>From ₦{service.basePrice.toLocaleString()}</span>
                          <ChevronRight size={18} className="text-primary" />
                       </div>
                    </div>
                  </Link>
                ))}
             </div>
           )}
        </div>

        <div className="flex-col gap-6">
           <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
              <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
                 <ShieldCheck className="text-success" size={20} /> Buyer Protection
              </h4>
              <p className="text-muted text-xs leading-relaxed">
                When you hire <strong>{vendor.storeName}</strong> through our marketplace, your payment is held in a secure escrow. 
                Funds are only released to the vendor after you've reviewed and accepted the final work.
              </p>
           </div>

           <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
              <h4 style={{ margin: 0, fontSize: "0.9rem" }}>Store Information</h4>
              <div className="flex-col gap-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Member Since</span>
                    <span style={{ fontWeight: 600 }}>{new Date(vendor.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Verified Status</span>
                    <span className="text-success" style={{ fontWeight: 700 }}>VERIFIED VENDOR</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

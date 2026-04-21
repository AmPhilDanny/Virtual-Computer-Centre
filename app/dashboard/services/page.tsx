import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Store, Globe } from "lucide-react";
import FeaturedOffers from "@/components/FeaturedOffers";
import MarketplaceVendors from "@/components/MarketplaceVendors";

export default async function DashboardServicesPage() {
  const settings = await prisma.siteSettings.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const isMarketplaceEnabled = settingsMap.multiVendorEnabled === "true";

  const services = await prisma.service.findMany({
    where: { isActive: true, vendorId: null }, // Only official platform services
    orderBy: { category: "asc" }
  });

  // Group by category
  const grouped = services.reduce((acc, current) => {
    const cat = current.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(current);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div>
      <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-6)" }}>
        <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ padding: "var(--space-2)" }}>
          <ArrowLeft size={18} />
        </Link>
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Select a Service</h2>
      </div>

      <FeaturedOffers />

      <p className="text-secondary" style={{ marginBottom: "var(--space-8)", maxWidth: 600 }}>
        Choose the service you need from the categories below to start your order. 
        Your request will be processed securely and AI-assisted for faster turnaround.
      </p>

      {Object.keys(grouped).length === 0 ? (
        <div className="glass-card text-center" style={{ padding: "var(--space-10)" }}>
          <p>No services are currently available.</p>
        </div>
      ) : (
        <div className="flex-col gap-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 style={{ 
                fontSize: "1rem", 
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--text-muted)", 
                marginBottom: "var(--space-4)",
                borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: "var(--space-2)"
              }}>
                {category.replace("_", " ")}
              </h3>
              <div className="grid-3">
                {items.map(service => (
                  <Link href={`/dashboard/services/${service.slug}`} key={service.id} style={{ textDecoration: "none" }}>
                    <div className="service-card" style={{ height: "100%", padding: "var(--space-5)" }}>
                      <h4 className="service-card-title">{service.name}</h4>
                      <p className="service-card-desc" style={{ marginBottom: "var(--space-4)", minHeight: "44px" }}>
                        {service.description.length > 80 ? service.description.substring(0, 80) + "..." : service.description}
                      </p>
                      <div className="flex justify-between items-center" style={{ marginTop: "auto" }}>
                        <span className="service-card-price">From ₦{service.basePrice.toLocaleString()}</span>
                        <ChevronRight size={20} color="var(--brand-primary)" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isMarketplaceEnabled && (
        <div className="flex-col gap-6" style={{ marginTop: "var(--space-12)" }}>
           <h3 style={{ 
              fontSize: "1.25rem", 
              fontWeight: 700, 
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
             <Store className="text-primary" /> Independent Member Marketplace
           </h3>
           <p className="text-secondary" style={{ maxWidth: 600 }}>
             Hire professional freelancers and agencies directly. Your payment is held securely in escrow until you're satisfied with the work.
           </p>
           
           <MarketplaceVendors />
        </div>
      )}
    </div>
  );
}

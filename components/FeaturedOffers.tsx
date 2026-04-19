import { prisma } from "@/lib/prisma";
import { Ticket, Clock, CheckCircle } from "lucide-react";

export default async function FeaturedOffers() {
  const featuredCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      isFeatured: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    take: 3,
  });

  if (featuredCoupons.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-[rgba(108,71,255,0.1)] to-[rgba(30,30,40,0.5)] border border-[rgba(108,71,255,0.2)] rounded-xl p-6 mb-8 relative overflow-hidden backdrop-blur-md shadow-xl">
      <div className="absolute -right-10 -top-10 opacity-10 blur-xl">
        <Ticket size={160} color="var(--brand-primary)" />
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-white">
            <Ticket size={24} className="text-brand-primary" /> Active Promos
          </h3>
          <p className="text-gray-400 text-sm m-0">Apply these codes at checkout to save on your next service.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {featuredCoupons.map(coupon => (
            <div key={coupon.id} className="flex flex-col gap-2 bg-[var(--bg-surface)] px-5 py-3 rounded-xl border border-[var(--border-medium)]">
              <div className="flex items-center gap-4">
                <span className="font-mono bg-[rgba(108,71,255,0.15)] text-[var(--brand-primary)] px-3 py-1 rounded font-black tracking-wider text-sm border border-[rgba(108,71,255,0.3)]">
                  {coupon.code}
                </span>
                <span className="font-bold text-white whitespace-nowrap">
                  {coupon.discountType === "PERCENTAGE" 
                    ? `${coupon.discountValue}% OFF` 
                    : `₦${coupon.discountValue.toLocaleString()} OFF`}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {coupon.minAmount > 0 && <span>Min. ₦{coupon.minAmount.toLocaleString()}</span>}
                {coupon.expiresAt && (
                  <span className="flex items-center gap-1 text-warning">
                    <Clock size={12} /> {new Date(coupon.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

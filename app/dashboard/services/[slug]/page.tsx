import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import ClientJobForm from "./ClientJobForm";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await prisma.service.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  });

  if (!service) {
    notFound();
  }

  // Parse custom metadata. Fallback if empty.
  const schemaDefinition = service.formSchema as any[] || [
    { name: "instructions", label: "Special Instructions", type: "textarea", required: true },
    { name: "pages", label: "Estimated Pages (Docs)", type: "number", required: false }
  ];

  return (
    <div className="grid-2" style={{ gridTemplateColumns: "1fr 340px", alignItems: "start" }}>
      <div>
        <div className="flex items-center gap-2" style={{ marginBottom: "var(--space-6)" }}>
          <Link href="/dashboard/services" className="btn btn-ghost btn-sm" style={{ padding: "var(--space-2)" }}>
            <ArrowLeft size={18} />
          </Link>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{service.name}</h2>
        </div>

        <div className="glass-card">
          <ClientJobForm serviceId={service.id} schema={schemaDefinition} />
        </div>
      </div>

      {/* Info Sidebar */}
      <div className="flex-col gap-6" style={{ position: "sticky", top: "24px" }}>
        
        {/* Important Info Card */}
        <div className="glass-card" style={{ padding: "var(--space-5)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-3)" }}>Service Details</h3>
          <p className="text-secondary" style={{ fontSize: "0.875rem", marginBottom: "var(--space-4)" }}>
            {service.description}
          </p>

          <div className="flex-col gap-3">
            <div className="flex items-center justify-between" style={{ paddingBottom: "var(--space-2)", borderBottom: "1px dashed var(--border-subtle)" }}>
              <span className="text-muted" style={{ fontSize: "0.875rem" }}>Base Price</span>
              <span style={{ fontWeight: 700, color: "var(--brand-primary)" }}>₦{service.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between" style={{ paddingBottom: "var(--space-2)", borderBottom: "1px dashed var(--border-subtle)" }}>
              <span className="text-muted" style={{ fontSize: "0.875rem" }}>Est. Turnaround</span>
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{service.turnaroundHours} Hours</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "var(--space-5)", background: "rgba(108, 71, 255, 0.05)", borderColor: "var(--border-medium)" }}>
           <div className="flex items-center gap-2" style={{ color: "var(--brand-primary)", marginBottom: "var(--space-2)", fontWeight: 600 }}>
              <ShieldAlert size={18} /> Satisfaction Guaranteed
           </div>
           <p className="text-muted" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
             Your request is analyzed by AI before human expert review. We verify all inputs for maximum accuracy.
           </p>
        </div>

      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { category: "asc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Service Management CMS</h2>
        <Link href="/admin/services/new" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Service
        </Link>
      </div>

      <div className="glass-card" style={{ padding: "var(--space-1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-medium)", textAlign: "left", background: "var(--bg-elevated)" }}>
              <th style={{ padding: "var(--space-4)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Name</th>
              <th style={{ padding: "var(--space-4)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Category</th>
              <th style={{ padding: "var(--space-4)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Price</th>
              <th style={{ padding: "var(--space-4)", color: "var(--text-secondary)", fontSize: "0.875rem" }}>AI Autonomy</th>
              <th style={{ padding: "var(--space-4)", color: "var(--text-secondary)", fontSize: "0.875rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => (
              <tr key={svc.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "var(--space-4)", fontWeight: 600 }}>
                  {svc.name}
                  {!svc.isActive && <span className="badge badge-danger" style={{marginLeft: 8}}>Disabled</span>}
                </td>
                <td style={{ padding: "var(--space-4)", color: "var(--text-muted)", fontSize: "0.875rem" }}>{svc.category}</td>
                <td style={{ padding: "var(--space-4)" }}>₦{svc.basePrice}</td>
                <td style={{ padding: "var(--space-4)" }}>
                  <span className={`badge badge-${svc.autonomyLevel === 'AI_ONLY' ? 'success' : svc.autonomyLevel === 'HUMAN_ONLY' ? 'danger' : 'primary'}`}>
                    {svc.autonomyLevel.replace("_", " ")}
                  </span>
                </td>
                <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                   <div className="flex gap-2 justify-end">
                     <button className="btn btn-ghost btn-sm"><Edit3 size={16} /></button>
                     <button className="btn btn-ghost btn-sm" style={{color: "var(--brand-danger)"}}><Trash2 size={16} /></button>
                   </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center" style={{ padding: "var(--space-10) 0", color: "var(--text-muted)" }}>
                  <p style={{marginBottom: "var(--space-4)"}}>No services defined yet.</p>
                  <Link href="/admin/services/new" className="btn btn-secondary">Create your first service</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

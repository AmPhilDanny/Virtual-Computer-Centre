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

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>AI Autonomy</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => (
              <tr key={svc.id}>
                <td style={{ fontWeight: 600 }}>
                  {svc.name}
                  {!svc.isActive && <span className="badge badge-danger" style={{marginLeft: 8}}>Disabled</span>}
                </td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{svc.category.replace("_", " ")}</td>
                <td>₦{svc.basePrice.toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${svc.autonomyLevel === 'AI_ONLY' ? 'success' : svc.autonomyLevel === 'HUMAN_ONLY' ? 'danger' : 'primary'}`}>
                    {svc.autonomyLevel.replace("_", " ")}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                   <div className="flex gap-2 justify-end">
                     <button className="btn btn-ghost btn-sm" title="Edit"><Edit3 size={16} /></button>
                     <button className="btn btn-ghost btn-sm" style={{color: "var(--brand-danger)"}} title="Delete"><Trash2 size={16} /></button>
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

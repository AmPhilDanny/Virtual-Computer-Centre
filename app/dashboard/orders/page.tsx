import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "warning",
  IN_PROGRESS: "info",
  REVIEW: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
  REVISION_REQUESTED: "warning",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const jobs = await prisma.job.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: {
      service: { select: { name: true } },
      order: { select: { total: true, status: true } },
    },
  });

  return (
    <div className="glass-card" style={{ padding: "var(--space-6)" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-6)" }}>Your Order History</h2>

      {jobs.length === 0 ? (
        <div className="text-center" style={{ padding: "var(--space-12) 0" }}>
          <FileText size={48} style={{ opacity: 0.2, margin: "0 auto var(--space-4)" }} />
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link href="/dashboard/services" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Service</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      #{job.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: "0.875rem" }}>{job.service.name}</td>
                  <td style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{job.title}</td>
                  <td>
                    <span className={`badge badge-${STATUS_COLORS[job.status] || "info"}`}>
                      {job.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${job.order?.status === "PAID" ? "success" : "warning"}`} style={{ fontSize: "0.7rem" }}>
                      {job.order?.status || "PENDING"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--brand-primary)" }}>
                    ₦{job.order?.total?.toLocaleString() ?? "—"}
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`/dashboard/orders/${job.id}`} className="btn btn-ghost btn-sm">
                      <ExternalLink size={14} />
                      {job.status === "COMPLETED" ? "View & Download" : "Track"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

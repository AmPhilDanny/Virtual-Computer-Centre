import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, PlusCircle, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const [jobs, user] = await Promise.all([
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { service: true }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true }
    })
  ]);

  const activeJobs = jobs.filter(j => 
    ["SUBMITTED", "IN_PROGRESS", "REVIEW", "REVISION_REQUESTED"].includes(j.status)
  ).length;
  
  const completedJobs = jobs.filter(j => j.status === "COMPLETED").length;

  return (
    <div>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-6)" }}>
        Welcome back, {session?.user?.name || "User"}
      </h2>
      
      {/* Metrics Row */}
      <div className="grid-3" style={{ marginBottom: "var(--space-10)" }}>
        <div className="metric-card">
          <div className="metric-card-label">Active Orders</div>
          <div className="metric-card-value">{activeJobs}</div>
          <Clock className="metric-card-icon" style={{ color: "var(--brand-warning)" }} />
        </div>
        <div className="metric-card">
          <div className="metric-card-label">Completed Orders</div>
          <div className="metric-card-value">{completedJobs}</div>
          <CheckCircle className="metric-card-icon" style={{ color: "var(--brand-success)" }} />
        </div>
        <div className="metric-card">
          <div className="metric-card-label">Wallet Balance</div>
          <div className="metric-card-value">₦{user?.walletBalance.toLocaleString() || "0.00"}</div>
          <div className="metric-card-change positive">Top up requested</div>
        </div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="glass-card" style={{ padding: "var(--space-6)" }}>
        <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "1.125rem", margin: 0 }}>Recent Orders</h3>
          <Link href="/dashboard/services" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> New Order
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-10" style={{ padding: "var(--space-10) 0" }}>
            <FileText size={48} style={{ opacity: 0.3, margin: "0 auto var(--space-4)" }} />
            <p className="text-secondary" style={{ marginBottom: "var(--space-4)" }}>
              You don't have any orders yet.
            </p>
            <Link href="/dashboard/services" className="btn btn-ghost">
              Browse Services
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                  <th style={{ padding: "var(--space-3) 0", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.875rem" }}>Service</th>
                  <th style={{ padding: "var(--space-3) var(--space-4)", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.875rem" }}>Title</th>
                  <th style={{ padding: "var(--space-3) var(--space-4)", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.875rem" }}>Status</th>
                  <th style={{ padding: "var(--space-3) var(--space-4)", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.875rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "var(--space-4) 0", fontWeight: 500 }}>{job.service.name}</td>
                    <td style={{ padding: "var(--space-4) var(--space-4)", color: "var(--text-secondary)" }}>{job.title}</td>
                    <td style={{ padding: "var(--space-4) var(--space-4)" }}>
                      <span className={`badge badge-${job.status === 'COMPLETED' ? 'success' : job.status === 'CANCELLED' ? 'danger' : 'info'}`}>
                        {job.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "var(--space-4) var(--space-4)", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

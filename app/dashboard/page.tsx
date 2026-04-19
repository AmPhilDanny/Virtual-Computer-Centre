import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  FileText, PlusCircle, CheckCircle, Clock, 
  Wallet, ArrowRight, ExternalLink, Calendar 
} from "lucide-react";

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
    <div className="flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 4px", fontWeight: 800 }}>
            Welcome back, {session?.user?.name?.split(' ')[0] || "User"}
          </h2>
          <p className="text-secondary" style={{ fontSize: "0.875rem", margin: 0 }}>
            Here's what's happening with your projects today.
          </p>
        </div>
        <Link href="/dashboard/services" className="btn btn-primary btn-sm gap-2">
            <PlusCircle size={16} /> Create New Order
        </Link>
      </div>
      
      {/* Metrics Row - Refined */}
      <div className="grid-3 gap-6">
        <MetricCard 
          label="In Progress" 
          value={activeJobs} 
          icon={<Clock size={20} />} 
          color="var(--brand-warning)"
          bg="rgba(255,193,7,0.05)"
        />
        <MetricCard 
          label="Completed" 
          value={completedJobs} 
          icon={<CheckCircle size={20} />} 
          color="var(--brand-success)"
          bg="rgba(0,200,83,0.05)"
        />
        <MetricCard 
          label="Wallet Balance" 
          value={`₦${user?.walletBalance.toLocaleString() || "0.00"}`}
          icon={<Wallet size={20} />} 
          color="var(--brand-primary)"
          bg="rgba(99,102,241,0.05)"
          footer={
            <Link href="/dashboard/wallet" style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                TOP UP <ArrowRight size={10} />
            </Link>
          }
        />
      </div>

      {/* Recent Orders - Tightly Closed Card */}
      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <div className="flex justify-between items-center" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: 8, borderRadius: 8, background: "var(--bg-elevated)", color: "var(--brand-primary)" }}>
                <FileText size={18} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Recent Activities</h3>
          </div>
          <Link href="/dashboard/orders" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            VIEW ALL <ExternalLink size={12} />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16" style={{ padding: "64px 24px" }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FileText size={32} style={{ opacity: 0.2 }} />
            </div>
            <h4 style={{ margin: "0 0 8px", fontWeight: 700 }}>No orders found</h4>
            <p className="text-muted text-sm" style={{ marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>
              You haven't placed any orders yet. Start your first project today!
            </p>
            <Link href="/dashboard/services" className="btn btn-secondary btn-sm px-6">
              Browse Services
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-subtle)", textAlign: "left" }}>
                  <th style={{ padding: "12px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Project / Service</th>
                  <th style={{ padding: "12px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                  <th style={{ padding: "12px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                  <th style={{ padding: "12px 24px", textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="hover-row" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div className="flex-col">
                        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{job.title}</span>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>{job.service.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className={`badge badge-${
                        job.status === 'COMPLETED' ? 'success' : 
                        job.status === 'CANCELLED' ? 'danger' : 
                        ['SUBMITTED', 'REVISION_REQUESTED'].includes(job.status) ? 'warning' : 'info'
                      }`} style={{ fontSize: '0.7rem' }}>
                        {job.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div className="flex items-center gap-2 text-muted" style={{ fontSize: "0.8rem" }}>
                        <Calendar size={12} />
                        {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <Link href={`/dashboard/orders/${job.id}`} className="btn btn-ghost btn-xs" style={{ borderRadius: 6 }}>
                            Details
                        </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`
        .hover-row:hover { background: rgba(0,0,0,0.02); }
        [data-theme='dark'] .hover-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>
    </div>
  );
}

function MetricCard({ label, value, icon, color, bg, footer }: any) {
  return (
    <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="flex justify-between items-start">
        <div className="flex-col gap-1">
          <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 900 }}>{value}</span>
        </div>
        <div style={{ 
          padding: 10, 
          borderRadius: 12, 
          background: bg, 
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </div>
      </div>
      {footer && <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>{footer}</div>}
    </div>
  );
}

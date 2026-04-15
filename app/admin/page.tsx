import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Clock, AlertTriangle, ChevronRight } from "lucide-react";

export default async function AdminOverviewPage() {
  const [totalJobs, pendingJobs, aiJobs, servicesCount] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: { in: ["SUBMITTED", "IN_PROGRESS"] } } }),
    prisma.job.count({ where: { aiOutput: { not: null } } }),
    prisma.service.count()
  ]);

  const recentJobs = await prisma.job.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      service: true,
      user: { select: { name: true, email: true } }
    }
  });

  return (
    <div>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-6)" }}>System Overview</h2>
      
      {/* Metrics Row */}
      <div className="grid-3" style={{ marginBottom: "var(--space-10)" }}>
        <div className="metric-card" style={{ borderColor: "var(--brand-warning)" }}>
          <div className="metric-card-label">Pending Orders</div>
          <div className="metric-card-value">{pendingJobs}</div>
          <Clock className="metric-card-icon" style={{ color: "var(--brand-warning)" }} />
        </div>
        <div className="metric-card">
          <div className="metric-card-label">Total Jobs</div>
          <div className="metric-card-value">{totalJobs}</div>
          <CheckCircle className="metric-card-icon" style={{ color: "var(--brand-success)" }} />
        </div>
        <div className="metric-card" style={{ borderColor: "var(--brand-primary)" }}>
          <div className="metric-card-label">Active AI Services</div>
          <div className="metric-card-value">{servicesCount}</div>
          <div className="metric-card-change positive">{aiJobs} AI processed tasks</div>
        </div>
      </div>

      <div className="glass-card">
         <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-6)" }}>
           <h3 style={{ fontSize: "1.125rem", margin: 0 }}>Recent Intakes</h3>
           <Link href="/admin/jobs" className="btn btn-secondary btn-sm">View All</Link>
         </div>
         
         <div className="table-container">
           <table className="table">
             <thead>
               <tr>
                 <th>Client</th>
                 <th>Service</th>
                 <th>Status</th>
                 <th>Priority</th>
               </tr>
             </thead>
             <tbody>
               {recentJobs.map((job: any) => (
                 <tr key={job.id}>
                   <td>
                     <div style={{ fontWeight: 600 }}>{job.user.name || "Unknown"}</div>
                     <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{job.user.email}</div>
                   </td>
                   <td>{job.service.name}</td>
                   <td>
                     <span className={`badge badge-${job.status === 'SUBMITTED' ? 'warning' : 'info'}`}>
                       {job.status}
                     </span>
                   </td>
                   <td>
                      {job.priority === "EXPRESS" ? (
                        <span style={{ color: "var(--brand-danger)", fontWeight: 'bold', fontSize: "0.8125rem" }}><AlertTriangle size={14} style={{display:'inline', verticalAlign:'middle'}}/> Express</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Normal</span>
                      )}
                   </td>
                 </tr>
               ))}
               {recentJobs.length === 0 && (
                 <tr>
                   <td colSpan={4} className="text-center" style={{ padding: "var(--space-8) 0", color: "var(--text-muted)" }}>
                     No jobs submitted yet.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}

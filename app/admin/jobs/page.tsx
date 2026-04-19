"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Eye, Play, Search, RefreshCw, AlertTriangle, 
  Clock, CheckCircle, XCircle, User, Briefcase, 
  Layers, ChevronRight, Filter
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "warning",
  IN_PROGRESS: "info",
  REVIEW: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
  REVISION_REQUESTED: "warning",
};

const COMPLEXITY_COLORS: Record<string, string> = {
  LOW: "var(--brand-success)",
  MEDIUM: "var(--brand-warning)",
  HIGH: "var(--brand-danger)",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/jobs/list?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) setJobs(data);
    } catch (e) {
      console.error("Failed to load jobs", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const triggerExecution = async (jobId: string) => {
    setProcessingId(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/process`, { method: "POST" });
      const data = await res.json();
      alert(data.message || "Done");
      fetchJobs();
    } catch {
      alert("Execution failed. Check console.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px" }}>Manage Orders</h2>
          <p className="text-secondary" style={{ fontSize: "0.875rem", margin: 0 }}>Review, track, and process client requests.</p>
        </div>
        <button onClick={fetchJobs} className="btn btn-ghost btn-sm gap-2" disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh List
        </button>
      </div>

      {/* Filters - Tightened */}
      <div className="glass-card" style={{ padding: "16px 20px" }}>
        <div className="flex gap-4 items-center" style={{ flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", opacity: 0.6 }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search client name, email or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              style={{ paddingLeft: "2.5rem", borderRadius: 10, fontSize: '0.875rem' }}
            />
          </div>
          <div className="flex items-center gap-3">
              <Filter size={16} className="text-muted" />
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: "auto", minWidth: 180, borderRadius: 10, fontSize: '0.875rem' }}
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="REVISION_REQUESTED">Revision Requested</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
          </div>
          <button onClick={fetchJobs} className="btn btn-primary btn-sm px-6">Search</button>
        </div>
      </div>

      {/* Table - Tightly Closed */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)", textAlign: "left" }}>
                <th style={{ padding: "14px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Client</th>
                <th style={{ padding: "14px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Project / Service</th>
                <th style={{ padding: "14px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th style={{ padding: "14px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Brief Info</th>
                <th style={{ padding: "14px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment</th>
                <th style={{ padding: "14px 24px", textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center" style={{ padding: "64px" }}>
                    <RefreshCw size={24} className="animate-spin text-primary" style={{ margin: "0 auto", opacity: 0.5 }} />
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                     <Briefcase size={40} style={{ opacity: 0.1, margin: '0 auto 12px' }} />
                     <p className="text-muted text-sm">No jobs match your criteria.</p>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover-row" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div className="flex items-center gap-3">
                        <div style={{ padding: 8, borderRadius: 8, background: "var(--bg-elevated)", color: "var(--brand-primary)" }}>
                            <User size={16} />
                        </div>
                        <div className="flex-col">
                            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{job.user?.name || "Unknown"}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{job.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div className="flex-col">
                        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{job.title}</span>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>{job.service?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className={`badge badge-${STATUS_COLORS[job.status] || "info"}`} style={{ fontSize: '0.7rem' }}>
                        {job.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div className="flex-col gap-1">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                             <span style={{ fontSize: '0.65rem', fontWeight: 800, color: COMPLEXITY_COLORS[job.complexity] || "inherit" }}>
                                {job.complexity}
                             </span>
                             {job.priority === "EXPRESS" && (
                                <span style={{ color: "var(--brand-danger)", fontWeight: 800, fontSize: "0.65rem", background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                                    EXPRESS
                                </span>
                             )}
                          </div>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "monospace" }}>#{job.id.slice(-8).toUpperCase()}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>
                        {job.order ? `₦${job.order.total?.toLocaleString()}` : "—"}
                      </div>
                      <span style={{ fontSize: '0.65rem' }} className={`text-${job.order?.status === 'PAID' ? 'success' : 'warning'} font-bold`}>
                         {job.order?.status || 'UNSET'}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <div className="flex gap-2" style={{ justifyContent: "flex-end" }}>
                        <Link href={`/admin/jobs/${job.id}`} className="btn btn-ghost btn-xs" style={{ borderRadius: 6 }}>
                          <Eye size={14} /> Detail
                        </Link>
                        {job.status !== "COMPLETED" && job.status !== "CANCELLED" && job.service?.autonomyLevel !== "HUMAN_ONLY" && (
                          <button
                            onClick={() => triggerExecution(job.id)}
                            className="bg-primary hover:bg-primary-dark text-white p-1.5 rounded-lg transition-all"
                            disabled={processingId === job.id}
                            title="Run AI Core"
                          >
                            {processingId === job.id ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Showing {jobs.length} total orders
        </p>
      </div>

      <style>{`
        .hover-row:hover { background: rgba(0,0,0,0.02); }
        [data-theme='dark'] .hover-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye, Play, Search, RefreshCw, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

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
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Job Management</h2>
        <button onClick={fetchJobs} className="btn btn-ghost btn-sm" disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: "var(--space-4)" }}>
        <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by title, client name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              style={{ paddingLeft: "2rem" }}
            />
          </div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "auto", minWidth: 160 }}
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="REVISION_REQUESTED">Revision Requested</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button onClick={fetchJobs} className="btn btn-primary btn-sm">Search</button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Job Title</th>
                <th>Service</th>
                <th>Status</th>
                <th>Complexity</th>
                <th>Priority</th>
                <th>Amount</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center" style={{ padding: "var(--space-12)" }}>
                    <RefreshCw size={20} className="animate-spin" style={{ margin: "0 auto", opacity: 0.4 }} />
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted" style={{ padding: "var(--space-12)" }}>
                    No jobs found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{job.user?.name || "Unknown"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{job.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{job.title}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "monospace" }}>#{job.id.slice(-8)}</div>
                    </td>
                    <td style={{ fontSize: "0.875rem" }}>{job.service?.name}</td>
                    <td>
                      <span className={`badge badge-${STATUS_COLORS[job.status] || "info"}`}>
                        {job.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: "0.8rem", color: COMPLEXITY_COLORS[job.complexity] || "inherit" }}>
                        {job.complexity}
                      </span>
                    </td>
                    <td>
                      {job.priority === "EXPRESS" ? (
                        <span style={{ color: "var(--brand-danger)", fontWeight: 700, fontSize: "0.8rem" }}>
                          <AlertTriangle size={12} style={{ display: "inline", verticalAlign: "middle" }} /> EXPRESS
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Normal</span>
                      )}
                    </td>
                    <td style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {job.order ? `₦${job.order.total?.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="flex gap-2" style={{ justifyContent: "flex-end" }}>
                        <Link href={`/admin/jobs/${job.id}`} className="btn btn-ghost btn-sm">
                          <Eye size={14} /> View
                        </Link>
                        {job.status !== "COMPLETED" && job.status !== "CANCELLED" && job.service?.autonomyLevel !== "HUMAN_ONLY" && (
                          <button
                            onClick={() => triggerExecution(job.id)}
                            className="btn btn-primary btn-sm"
                            disabled={processingId === job.id}
                          >
                            <Play size={14} />
                            {processingId === job.id ? "Running..." : "Run AI"}
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

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
        Total: {jobs.length} job(s) found
      </p>
    </div>
  );
}

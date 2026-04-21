"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function VendorJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vendor/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data || []);
      }
    } catch (e) {
      console.error("Failed to fetch vendor jobs:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex-col gap-1">
          <h2 style={{ margin: 0 }}>Managed Jobs</h2>
          <p className="text-secondary" style={{ fontSize: "0.875rem" }}>Track and fulfill orders assigned to your store.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="form-group flex-1" style={{ position: "relative" }}>
          <Search size={18} className="text-muted" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" className="form-input" placeholder="Search by Job ID or Title..." style={{ paddingLeft: "40px" }} />
        </div>
        <button className="btn btn-ghost btn-md flex items-center gap-2">
          <Filter size={18} /> Active Only
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card flex-col items-center justify-center p-20 gap-4 text-center">
           <div className="w-16 h-16 rounded-full bg-subtle flex items-center justify-center">
             <Briefcase size={32} className="text-muted" />
           </div>
           <h3 style={{ margin: 0 }}>No jobs assigned yet</h3>
           <p className="text-muted max-w-sm">When clients order your services, they will appear here for you to manage and fulfill.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--bg-elevated)" }}>
              <tr>
                <th style={{ padding: "var(--space-4)" }}>Job ID</th>
                <th style={{ padding: "var(--space-4)" }}>Service & Title</th>
                <th style={{ padding: "var(--space-4)" }}>Earnings</th>
                <th style={{ padding: "var(--space-4)" }}>Status</th>
                <th style={{ padding: "var(--space-4)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "var(--space-4)", fontSize: "0.75rem", fontFamily: "monospace" }}>#{job.id.substring(0, 8)}</td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <div className="flex-col">
                       <span style={{ fontWeight: 600 }}>{job.title}</span>
                       <span className="text-muted" style={{ fontSize: "0.75rem" }}>{job.service.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "var(--space-4)", fontWeight: 700 }}>
                    ₦{(job.order?.total * 0.8).toLocaleString()}
                    <div className="text-muted" style={{ fontSize: "0.6rem", fontWeight: 400 }}>(MKT-20% split)</div>
                  </td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <span className={`badge badge-${
                      job.status === 'COMPLETED' ? 'success' : 
                      job.status === 'IN_PROGRESS' ? 'info' : 'warning'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <div className="flex gap-2">
                       <Link href={`/vendor/jobs/${job.id}`} className="btn btn-ghost btn-sm flex items-center gap-2">
                         Open <ExternalLink size={12} />
                       </Link>
                       <button className="btn btn-ghost btn-sm" style={{ padding: "8px" }}><MessageSquare size={14} /></button>
                    </div>
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

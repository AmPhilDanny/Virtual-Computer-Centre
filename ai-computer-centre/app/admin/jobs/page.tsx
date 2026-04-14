"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Eye, Settings2 } from "lucide-react";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app we'd fetch this from a Server Component or API
  // For demo logic we simulate it
  useEffect(() => {
    fetch("/api/admin/jobs/list").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setJobs(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const triggerExecution = async (jobId: string) => {
    alert("Triggering AI Agent...");
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/process`, {
        method: "POST"
      });
      const data = await res.json();
      alert(data.message);
    } catch (e) {
      alert("Execution failed.");
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-6)" }}>Job Management</h2>
      <div className="glass-card" style={{ padding: "var(--space-1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
             <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-medium)" }}>
               <th style={{ padding: "var(--space-4)", textAlign: "left" }}>ID</th>
               <th style={{ padding: "var(--space-4)", textAlign: "left" }}>Title</th>
               <th style={{ padding: "var(--space-4)", textAlign: "left" }}>Status</th>
               <th style={{ padding: "var(--space-4)", textAlign: "right" }}>Actions</th>
             </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center" style={{padding: "var(--space-10)"}}>Loading...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-muted" style={{padding: "var(--space-10)"}}>No jobs found. (Note: create an API to list jobs for production).</td></tr>
            ) : (
              jobs.map(job => (
                 <tr key={job.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "var(--space-4)" }}>{job.id.slice(0,8)}</td>
                    <td style={{ padding: "var(--space-4)" }}>{job.title}</td>
                    <td style={{ padding: "var(--space-4)" }}>{job.status}</td>
                    <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                       <button onClick={() => triggerExecution(job.id)} className="btn btn-primary btn-sm">
                         <Play size={16} /> Run AI Agent
                       </button>
                    </td>
                 </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

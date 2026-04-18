"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Play, Save, CheckCircle, Clock, User,
  Paperclip, BrainCircuit, FileText, AlertTriangle, RefreshCw
} from "lucide-react";

const STATUS_OPTIONS = [
  "SUBMITTED", "IN_PROGRESS", "REVIEW",
  "REVISION_REQUESTED", "COMPLETED", "CANCELLED"
];

export default function AdminJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Editable fields
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`);
      const data = await res.json();
      setJob(data);
      setStatus(data.status || "");
      setAdminNotes(data.adminNotes || "");
      setAiOutput(data.aiOutput || "");
    } catch {
      setMsg({ type: "error", text: "Failed to load job." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes, aiOutput }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg({ type: "success", text: "Job updated successfully. Client will be notified if marked Completed." });
      fetchJob();
    } catch {
      setMsg({ type: "error", text: "Failed to save changes." });
    } finally {
      setSaving(false);
    }
  };

  const handleRunAI = async () => {
    setRunning(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/jobs/${id}/process`, { method: "POST" });
      const data = await res.json();
      setMsg({ type: data.success ? "success" : "error", text: data.message });
      if (data.success) fetchJob();
    } catch {
      setMsg({ type: "error", text: "AI execution failed." });
    } finally {
      setRunning(false);
    }
  };

  if (loading) return (
    <div className="text-center" style={{ padding: "var(--space-12)" }}>
      <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto", opacity: 0.4 }} />
    </div>
  );

  if (!job) return (
    <div className="text-center text-muted" style={{ padding: "var(--space-12)" }}>Job not found.</div>
  );

  const formData = job.formData ? (typeof job.formData === "string" ? JSON.parse(job.formData) : job.formData) : {};

  return (
    <div className="flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/jobs" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex-col" style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{job.title}</h2>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>Job ID: #{job.id}</span>
        </div>
        <div className="flex gap-2">
          {job.service?.autonomyLevel !== "HUMAN_ONLY" && job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
            <button onClick={handleRunAI} disabled={running} className="btn btn-primary">
              <Play size={16} /> {running ? "Running AI..." : "Run AI Agent"}
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="btn btn-secondary">
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {msg && (
        <div style={{
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "var(--radius-sm)",
          background: msg.type === "success" ? "rgba(0,200,83,0.08)" : "rgba(255,71,87,0.08)",
          color: msg.type === "success" ? "var(--brand-success)" : "var(--brand-danger)",
          border: `1px solid ${msg.type === "success" ? "var(--brand-success)" : "var(--brand-danger)"}`,
          fontSize: "0.875rem"
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        {/* LEFT COLUMN */}
        <div className="flex-col gap-6">

          {/* Client Info */}
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }} className="flex items-center gap-2">
              <User size={16} /> Client Information
            </h3>
            <div className="flex-col gap-2" style={{ fontSize: "0.875rem" }}>
              <div className="flex justify-between">
                <span className="text-muted">Name</span>
                <span style={{ fontWeight: 600 }}>{job.user?.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Email</span>
                <span>{job.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Phone</span>
                <span>{job.user?.phone || "—"}</span>
              </div>
            </div>
          </div>

          {/* Job Meta */}
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }} className="flex items-center gap-2">
              <Clock size={16} /> Order Details
            </h3>
            <div className="flex-col gap-2" style={{ fontSize: "0.875rem" }}>
              <div className="flex justify-between">
                <span className="text-muted">Service</span>
                <span style={{ fontWeight: 600 }}>{job.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Priority</span>
                <span style={{ color: job.priority === "EXPRESS" ? "var(--brand-danger)" : "inherit", fontWeight: 600 }}>
                  {job.priority === "EXPRESS" ? "⚡ Express" : "Normal"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Complexity (AI)</span>
                <span style={{ fontWeight: 700 }}>{job.complexity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Amount</span>
                <span style={{ fontWeight: 600 }}>₦{job.order?.total?.toLocaleString() || "Pending"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payment</span>
                <span className={`badge badge-${job.order?.status === "PAID" ? "success" : "warning"}`} style={{ fontSize: "0.7rem" }}>
                  {job.order?.status || "No Order"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Submitted</span>
                <span>{new Date(job.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Submitted Form Data */}
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }} className="flex items-center gap-2">
              <FileText size={16} /> Client Form Submission
            </h3>
            {Object.keys(formData).length === 0 ? (
              <p className="text-muted" style={{ fontSize: "0.875rem" }}>No form data submitted.</p>
            ) : (
              <div className="flex-col gap-3">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                      {key.replace(/_/g, " ")}
                    </div>
                    <div style={{ fontSize: "0.875rem", whiteSpace: "pre-wrap" }}>{String(value)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          {job.attachments?.length > 0 && (
            <div className="glass-card" style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }} className="flex items-center gap-2">
                <Paperclip size={16} /> Client Attachments ({job.attachments.length})
              </h3>
              <div className="flex-col gap-2">
                {job.attachments.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: "flex-start", textAlign: "left", width: "100%" }}
                  >
                    <Paperclip size={14} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {url.split("/").pop() || `File ${i + 1}`}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-col gap-6">

          {/* Update Status */}
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }}>Update Job Status</h3>
            <div className="flex-col gap-3">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Admin Notes (visible only to admin)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Add internal notes, missing info flags, or reminders..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* AI Analysis Notes */}
          {job.adminNotes && (
            <div className="glass-card" style={{ padding: "var(--space-5)", border: "1px solid var(--brand-warning)" }}>
              <h3 style={{ fontSize: "0.9rem", marginBottom: "var(--space-3)", color: "var(--brand-warning)" }} className="flex items-center gap-2">
                <AlertTriangle size={14} /> AI Intake Analysis
              </h3>
              <p style={{ fontSize: "0.875rem", whiteSpace: "pre-wrap" }}>{job.adminNotes}</p>
              <div className="flex gap-3 mt-3">
                <span style={{ fontSize: "0.75rem" }}>Complexity: <strong>{job.complexity}</strong></span>
                <span style={{ fontSize: "0.75rem" }}>AI Confidence: <strong>{job.aiConfidence ? `${(job.aiConfidence * 100).toFixed(0)}%` : "N/A"}</strong></span>
              </div>
            </div>
          )}

          {/* Deliverable / AI Output */}
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }} className="flex items-center gap-2">
              <BrainCircuit size={16} /> Deliverable / AI Output
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>
              This is what the client will see and download when the job is marked <strong>Completed</strong>. You can write it manually or run the AI Agent to auto-generate it.
            </p>
            <textarea
              className="form-textarea"
              rows={14}
              placeholder="AI output will appear here automatically after running the AI Agent. You can also type or paste the completed work here manually..."
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            />
            {aiOutput && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  <CheckCircle size={14} /> Save & Mark Completed
                </button>
              </div>
            )}
          </div>

          {/* Revision History */}
          {job.revisions?.length > 0 && (
            <div className="glass-card" style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }}>Revision Requests</h3>
              <div className="flex-col gap-3">
                {job.revisions.map((rev: any) => (
                  <div key={rev.id} style={{ borderLeft: "3px solid var(--brand-warning)", paddingLeft: "var(--space-3)", fontSize: "0.875rem" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 4 }}>
                      {new Date(rev.createdAt).toLocaleString()}
                    </div>
                    <div>{rev.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const [aiScore, setAiScore] = useState(100);
  const [grammarScore, setGrammarScore] = useState(100);
  const [plagiarismScore, setPlagiarismScore] = useState(0);
  const [isPlagiarismFree, setIsPlagiarismFree] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`);
      const data = await res.json();
      setJob(data);
      setStatus(data.status || "");
      setAdminNotes(data.adminNotes || "");
      setAiOutput(data.aiOutput || "");
      setAiScore(data.aiScore ?? 100);
      setGrammarScore(data.grammarScore ?? 100);
      setPlagiarismScore(data.plagiarismScore ?? 0);
      setIsPlagiarismFree(data.isPlagiarismFree ?? true);
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
        body: JSON.stringify({ 
          status, 
          adminNotes, 
          aiOutput,
          aiScore,
          grammarScore,
          plagiarismScore,
          isPlagiarismFree
        }),
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

          {/* Deliverable / Final Content */}
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }} className="flex items-center gap-2">
              <BrainCircuit size={16} /> Final Human-Verified Content
            </h3>

            {/* QA TABS */}
            <div className="flex gap-4 mb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
               <button 
                 onClick={() => setActiveTab("details")}
                 style={{ 
                   padding: "8px 16px", 
                   fontSize: "0.875rem", 
                   fontWeight: 600,
                   color: activeTab === "details" ? "var(--brand-primary)" : "var(--text-muted)",
                   borderBottom: activeTab === "details" ? "2px solid var(--brand-primary)" : "none",
                   background: "none", borderLeft: "none", borderRight: "none", borderTop: "none", cursor: "pointer"
                 }}
               >Content Editor</button>
               <button 
                 onClick={() => setActiveTab("quality")}
                 style={{ 
                   padding: "8px 16px", 
                   fontSize: "0.875rem", 
                   fontWeight: 600,
                   color: activeTab === "quality" ? "var(--brand-primary)" : "var(--text-muted)",
                   borderBottom: activeTab === "quality" ? "2px solid var(--brand-primary)" : "none",
                   background: "none", borderLeft: "none", borderRight: "none", borderTop: "none", cursor: "pointer"
                 }}
               >Quality Verification</button>
            </div>

            {activeTab === "details" ? (
              <>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>
                  Write manually or paste AI-generated text. Clients see this as the "delivered content".
                </p>
                <textarea
                  className="form-textarea"
                  rows={10}
                  placeholder="Paste AI text or write manually..."
                  value={aiOutput}
                  onChange={(e) => setAiOutput(e.target.value)}
                  style={{ fontFamily: "monospace", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}
                />
              </>
            ) : (
              <div className="flex-col gap-5 py-2">
                <div className="form-group">
                  <label className="form-label flex justify-between">
                    <span>Human Originality</span>
                    <span style={{ color: "var(--brand-primary)", fontWeight: 700 }}>{aiScore}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" className="w-full" 
                    value={aiScore} onChange={(e) => setAiScore(parseInt(e.target.value))} 
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <p className="text-xs text-muted mt-1">Realistic score of 85-95% is standard for human writing.</p>
                </div>


                <div className="form-group">
                  <label className="form-label flex justify-between">
                    <span>Grammar Accuracy</span>
                    <span style={{ color: "var(--brand-success)", fontWeight: 700 }}>{grammarScore}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" className="w-full" 
                    value={grammarScore} onChange={(e) => setGrammarScore(parseInt(e.target.value))} 
                    style={{ accentColor: "var(--brand-success)" }}
                  />
                  <p className="text-xs text-muted mt-1">Verified accuracy of syntax, spelling, and tone.</p>
                </div>


                <div className="form-group">
                  <label className="form-label flex justify-between">
                    <span>Plagiarism Score</span>
                    <span style={{ color: plagiarismScore > 15 ? "var(--brand-danger)" : "var(--brand-info)", fontWeight: 700 }}>{plagiarismScore}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" className="w-full" 
                    value={plagiarismScore} onChange={(e) => setPlagiarismScore(parseInt(e.target.value))} 
                    style={{ accentColor: plagiarismScore > 15 ? "var(--brand-danger)" : "var(--brand-info)" }}
                  />
                </div>

                <label className="flex items-center gap-3 p-3 bg-elevated rounded-lg cursor-pointer hover:bg-subtle transition-colors">
                  <input 
                    type="checkbox" 
                    checked={isPlagiarismFree} 
                    onChange={(e) => setIsPlagiarismFree(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Verify Plagiarism-Free</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Confirm this content has been checked and is original.</div>
                  </div>
                </label>
              </div>
            )}


            {/* Admin Upload Section */}
            <div style={{ 
              border: "2px dashed var(--border-medium)", 
              borderRadius: "var(--radius-lg)", 
              padding: "var(--space-5)",
              textAlign: "center",
              background: "rgba(108, 71, 255, 0.03)"
            }}>
              <h4 style={{ fontSize: "0.875rem", marginBottom: "var(--space-2)" }}>Attach Finished Documents</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
                Upload PDF, Word, or other files for the client to download.
              </p>
              
              <input
                type="file"
                id="admin-upload"
                multiple
                hidden
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  
                  const { upload } = await import("@vercel/blob/client");
                  
                  setSaving(true);
                  try {
                    const newUrls: string[] = [];
                    for (const file of Array.from(files)) {
                      const blob = await upload(file.name, file, {
                        access: "public",
                        handleUploadUrl: "/api/jobs/upload",
                      });
                      newUrls.push(blob.url);
                    }
                    
                    // Update job attachments with new URLs
                    const updatedAttachments = [...(job.attachments || []), ...newUrls];
                    
                    const res = await fetch(`/api/admin/jobs/${id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ attachments: updatedAttachments }),
                    });
                    
                    if (res.ok) {
                      setMsg({ type: "success", text: "Files uploaded and attached successfully." });
                      fetchJob();
                    }
                  } catch (err) {
                    setMsg({ type: "error", text: "Failed to upload files." });
                  } finally {
                    setSaving(false);
                  }
                }}
              />
              <label htmlFor="admin-upload" className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
                <Paperclip size={14} /> {saving ? "Uploading..." : "Click to Upload Files"}
              </label>
            </div>

            {aiOutput && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  <CheckCircle size={14} /> Update Text Content
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

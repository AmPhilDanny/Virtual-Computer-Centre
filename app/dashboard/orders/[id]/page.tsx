import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, CheckCircle, Clock, RefreshCw, AlertTriangle, Paperclip } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "warning",
  IN_PROGRESS: "info",
  REVIEW: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
  REVISION_REQUESTED: "warning",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { id } = await params;
  const userId = (session.user as any).id;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      service: { select: { name: true, description: true } },
      order: { select: { total: true, status: true, createdAt: true } },
      revisions: { orderBy: { createdAt: "desc" } },
    },
  });

  // Security: ensure the job belongs to this user
  if (!job || job.userId !== userId) notFound();

  const formData = job.formData
    ? typeof job.formData === "string"
      ? JSON.parse(job.formData)
      : (job.formData as Record<string, any>)
    : {};

  return (
    <div className="flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{job.title}</h2>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
            Order #{job.id.slice(-10).toUpperCase()}
          </span>
        </div>
        <span className={`badge badge-${STATUS_COLORS[job.status] || "info"}`} style={{ fontSize: "0.875rem", padding: "8px 14px" }}>
          {job.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Status Banner */}
      {job.status === "COMPLETED" && (
        <div style={{
          padding: "var(--space-4) var(--space-5)",
          background: "rgba(0,200,83,0.08)",
          border: "1px solid var(--brand-success)",
          borderRadius: "var(--radius-md)",
          color: "var(--brand-success)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)"
        }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>Your order is complete! Your deliverable is ready below.</span>
        </div>
      )}

      {job.status === "SUBMITTED" && (
        <div style={{
          padding: "var(--space-4) var(--space-5)",
          background: "rgba(255,193,7,0.08)",
          border: "1px solid var(--brand-warning)",
          borderRadius: "var(--radius-md)",
          color: "var(--brand-warning)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)"
        }}>
          <Clock size={20} />
          <span>Your order has been received and is in queue for processing. We'll notify you when it's ready.</span>
        </div>
      )}

      {job.status === "IN_PROGRESS" && (
        <div style={{
          padding: "var(--space-4) var(--space-5)",
          background: "rgba(99,102,241,0.08)",
          border: "1px solid var(--brand-primary)",
          borderRadius: "var(--radius-md)",
          color: "var(--brand-primary)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)"
        }}>
          <RefreshCw size={20} />
          <span>Our team is actively working on your order. You'll be notified on completion.</span>
        </div>
      )}

      {job.status === "REVIEW" && (
        <div style={{
          padding: "var(--space-4) var(--space-5)",
          background: "rgba(99,102,241,0.08)",
          border: "1px solid var(--brand-primary)",
          borderRadius: "var(--radius-md)",
          color: "var(--brand-primary)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)"
        }}>
          <AlertTriangle size={20} />
          <span>Your order is under final review. Almost done!</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "var(--space-6)", alignItems: "start" }}>
        {/* LEFT: Order Info */}
        <div className="flex-col gap-5">
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }}>Order Summary</h3>
            <div className="flex-col gap-3" style={{ fontSize: "0.875rem" }}>
              <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                <span className="text-muted">Service</span>
                <span style={{ fontWeight: 600 }}>{job.service.name}</span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                <span className="text-muted">Priority</span>
                <span style={{ fontWeight: 600, color: job.priority === "EXPRESS" ? "var(--brand-danger)" : "inherit" }}>
                  {job.priority === "EXPRESS" ? "⚡ Express" : "Normal"}
                </span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                <span className="text-muted">Submitted</span>
                <span>{new Date(job.createdAt).toLocaleString()}</span>
              </div>
              {job.completedAt && (
                <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                  <span className="text-muted">Completed</span>
                  <span>{new Date(job.completedAt).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Amount</span>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--brand-primary)" }}>
                  ₦{job.order?.total?.toLocaleString() || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted Files */}
          {job.attachments?.length > 0 && (
            <div className="glass-card" style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }} className="flex items-center gap-2">
                <Paperclip size={16} /> Your Uploaded Files
              </h3>
              <div className="flex-col gap-2">
                {job.attachments.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: "flex-start", width: "100%" }}
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

          {/* Revision History */}
          {job.revisions?.length > 0 && (
            <div className="glass-card" style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }}>Revision History</h3>
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

        {/* RIGHT: Deliverable */}
        <div className="flex-col gap-5">
          {job.status === "COMPLETED" && job.aiOutput ? (
            <div className="glass-card" style={{ padding: "var(--space-6)" }}>
              <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-5)" }}>
                <h3 style={{ fontSize: "1rem", margin: 0 }} className="flex items-center gap-2">
                  <CheckCircle size={16} style={{ color: "var(--brand-success)" }} /> Your Completed Work
                </h3>
                {/* Download as .txt */}
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(job.aiOutput)}`}
                  download={`${job.title.replace(/\s+/g, "_")}_delivery.txt`}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={14} /> Download
                </a>
              </div>
              <div
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-5)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  maxHeight: "65vh",
                  overflowY: "auto",
                  fontFamily: "inherit"
                }}
              >
                {job.aiOutput}
              </div>
            </div>
          ) : (
            <div className="glass-card text-center" style={{ padding: "var(--space-12) var(--space-6)" }}>
              <Clock size={48} style={{ opacity: 0.2, margin: "0 auto var(--space-4)" }} />
              <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)" }}>Work In Progress</h3>
              <p className="text-muted" style={{ fontSize: "0.875rem" }}>
                Your deliverable will appear here once the job is completed. You'll receive an email or SMS notification when it's ready.
              </p>
            </div>
          )}

          {/* Your original request summary */}
          {Object.keys(formData).length > 0 && (
            <div className="glass-card" style={{ padding: "var(--space-6)" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }}>Your Submitted Request</h3>
              <div className="flex-col gap-3">
                {Object.entries(formData)
                  .filter(([key]) => !["priority", "academicIntegrity"].includes(key))
                  .map(([key, value]) => (
                  <div key={key} style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                      {key.replace(/_/g, " ")}
                    </div>
                    <div style={{ fontSize: "0.875rem" }}>{String(value)}</div>
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

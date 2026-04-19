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

  // Fetch wallet balance for payment options
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { walletBalance: true }
  });

  const formData = job.formData
    ? typeof job.formData === "string"
      ? JSON.parse(job.formData)
      : (job.formData as Record<string, any>)
    : {};

  const isPaid = job.order?.status === "PAID";
  const walletBalance = user?.walletBalance || 0;

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
      {job.status === "COMPLETED" && isPaid && (
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

      {job.status === "COMPLETED" && !isPaid && (
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
          <AlertTriangle size={20} />
          <span style={{ fontWeight: 600 }}>Order completed, but payment is pending. Please settle your standing order to download the results.</span>
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

      {/* ... (IN_PROGRESS and REVIEW banners remain same) */}
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
           {/* Payment Trigger if Pending */}
           {!isPaid && job.order && (
              <OrderPaymentAction 
                jobId={job.id}
                orderId={job.order.id}
                totalAmount={job.order.total}
                walletBalance={walletBalance}
              />
           )}

          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-4)" }}>Order Summary</h3>
            <div className="flex-col gap-3" style={{ fontSize: "0.875rem" }}>
              <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                <span className="text-muted">Service</span>
                <span style={{ fontWeight: 600 }}>{job.service.name}</span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                <span className="text-muted">Status</span>
                <span className={`badge badge-${isPaid ? 'success' : 'warning'}`}>{isPaid ? 'PAID' : 'PENDING'}</span>
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
        </div>

        {/* RIGHT: Deliverable */}
        <div className="flex-col gap-5">
          {job.status === "COMPLETED" ? (
             isPaid ? (
                <div className="glass-card" style={{ padding: "var(--space-6)" }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-5)" }}>
                    <h3 style={{ fontSize: "1rem", margin: 0 }} className="flex items-center gap-2">
                      <CheckCircle size={16} style={{ color: "var(--brand-success)" }} /> Your Completed Work
                    </h3>
                  </div>
                  
                  {/* Delivery Content */}
                  {job.aiOutput && (
                    <div style={{ marginBottom: "var(--space-6)" }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-3)" }}>
                         <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>TEXT CONTENT</span>
                         <div className="flex gap-2">
                            <button
                              onClick={() => {
                                 const blob = new Blob([job.aiOutput || ""], { type: "text/plain" });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement("a");
                                 a.href = url;
                                 a.download = `${job.title.replace(/\s+/g, "_")}.txt`;
                                 a.click();
                              }}
                              className="btn btn-ghost btn-xs"
                              style={{ fontSize: "0.7rem", padding: "4px 8px" }}
                            >
                               TXT
                            </button>
                            <button
                              onClick={async () => {
                                 const { jsPDF } = await import("jspdf");
                                 const doc = new jsPDF();
                                 const lines = doc.splitTextToSize(job.aiOutput || "", 180);
                                 doc.text(lines, 15, 15);
                                 doc.save(`${job.title.replace(/\s+/g, "_")}.pdf`);
                              }}
                              className="btn btn-ghost btn-xs"
                              style={{ fontSize: "0.7rem", padding: "4px 8px" }}
                            >
                               PDF
                            </button>
                            <button
                              onClick={() => {
                                 const content = `<html><body>${(job.aiOutput || "").replace(/\n/g, "<br>")}</body></html>`;
                                 const blob = new Blob([content], { type: "application/msword" });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement("a");
                                 a.href = url;
                                 a.download = `${job.title.replace(/\s+/g, "_")}.doc`;
                                 a.click();
                              }}
                              className="btn btn-ghost btn-xs"
                              style={{ fontSize: "0.7rem", padding: "4px 8px" }}
                            >
                               WORD
                            </button>
                         </div>
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
                          maxHeight: "40vh",
                          overflowY: "auto",
                          fontFamily: "inherit"
                        }}
                      >
                        {job.aiOutput}
                      </div>
                    </div>
                  )}

                  {/* Manual File Deliverables */}
                  {job.attachments?.length > 0 && (
                    <div className="flex-col gap-3">
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Attached Documents</span>
                      <div className="flex-col gap-2">
                        {job.attachments.map((url: string, i: number) => {
                          const fileName = url.split("/").pop() || `Deliverable_${i+1}`;
                          const isLikelyDeliverable = i >= (job.formData?.original_attachment_count || 0); // Logic helper
                          
                          return (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              download={fileName}
                              className="btn btn-primary w-full justify-between"
                              style={{ background: "rgba(108, 71, 255, 0.1)", color: "var(--brand-primary)", border: "1px solid var(--border-medium)" }}
                            >
                              <div className="flex items-center gap-3">
                                 <Download size={18} />
                                 <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{fileName}</span>
                              </div>
                              <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>DOWNLOAD</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
             ) : (
                <div className="glass-card text-center" style={{ padding: "var(--space-12) var(--space-6)", borderColor: "var(--brand-warning)" }}>
                  <CreditCard size={48} style={{ color: "var(--brand-warning)", margin: "0 auto var(--space-4)", opacity: 0.5 }} />
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)" }}>Download Locked</h3>
                  <p className="text-muted" style={{ fontSize: "0.875rem" }}>
                    Your job is ready! Please pay the order total to unlock and download your finished files.
                  </p>
                </div>
             )
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

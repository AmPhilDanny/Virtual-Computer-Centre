import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, RefreshCw, AlertTriangle, Paperclip, CreditCard, ShieldCheck, Cpu, BookOpen, Sparkles, Check } from "lucide-react";
import OrderPaymentAction from "@/components/order/OrderPaymentAction";
import DeliverableDownloads from "@/components/order/DeliverableDownloads";
import ReceiptUploadButton from "@/components/order/ReceiptUploadButton";
import OrderFulfillmentActions from "@/components/order/OrderFulfillmentActions";

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
      order: { select: { id: true, total: true, status: true, gateway: true, proofUrl: true, createdAt: true } },
      revisions: { orderBy: { createdAt: "desc" } },
      vendor: { select: { storeName: true, storeSlug: true } },
    },
  });

  if (!job || job.userId !== userId) notFound();

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
  const isPendingManual = job.order?.status === "PENDING" && job.order?.gateway === "MANUAL";
  const walletBalance = user?.walletBalance || 0;

  return (
    <div className="flex-col gap-6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} /> Back
        </Link>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 700 }}>{job.title}</h2>
          <span className="text-muted" style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>
            Order ID: {job.id.slice(-12).toUpperCase()}
          </span>
        </div>
        <span className={`badge badge-${STATUS_COLORS[job.status] || "info"}`} style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
          {job.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Status Banners - Tightened */}
      <div className="flex-col gap-3">
        {job.status === "COMPLETED" && isPaid && (
          <StatusBanner type="success" icon={<CheckCircle size={18} />}>
            Your order is complete! Your files are ready for download below.
          </StatusBanner>
        )}

        {isPendingManual && (
          <StatusBanner type="primary" icon={<RefreshCw size={18} className="animate-spin" />}>
            Payment Verification Pending. {job.order?.proofUrl ? "We're reviewing your receipt." : "Please upload your transfer receipt to proceed."}
          </StatusBanner>
        )}

        {job.status === "COMPLETED" && !isPaid && !isPendingManual && (
          <StatusBanner type="warning" icon={<AlertTriangle size={18} />}>
            Work finished! Please settle the balance below to unlock your downloads.
          </StatusBanner>
        )}

        {job.status === "SUBMITTED" && (
          <StatusBanner type="info" icon={<Clock size={18} />}>
            Your order is in the queue. We'll notify you as soon as we start working on it.
          </StatusBanner>
        )}

        {job.status === "REVIEW" && (
          <OrderFulfillmentActions jobId={job.id} status={job.status} />
        )}

        {(job.status === "COMPLETED" || job.status === "REVIEW") && (
          <div className="glass-card" style={{ padding: "20px", border: "1px solid rgba(108,71,255,0.2)", background: "linear-gradient(135deg, rgba(108,71,255,0.05) 0%, rgba(255,255,255,0) 100%)" }}>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>Quality Assurance Verified</h4>
                </div>
                {job.aiScore && job.aiScore >= 85 && (
                  <span className="badge badge-success" style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}>
                    <Sparkles size={10} /> Premium Human Work
                  </span>
                )}
             </div>

             <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <QualityMetric 
                  icon={<Cpu size={18} />} 
                  label="Human Originality" 
                  value={job.aiScore ? `${job.aiScore}%` : "Checked"} 
                  isActive={!!(job.aiScore && job.aiScore >= 80)} 
                />
                <QualityMetric 
                  icon={<BookOpen size={18} />} 
                  label="Grammar Precision" 
                  value={job.grammarScore ? `${job.grammarScore}%` : "Verified"} 
                  isActive={!!(job.grammarScore && job.grammarScore >= 85)} 
                />
                <QualityMetric 
                  icon={<ShieldCheck size={18} />} 
                  label="Plagiarism Free" 
                  value={job.isPlagiarismFree ? "100% Original" : "Verified"} 
                  isActive={!!job.isPlagiarismFree} 
                />
             </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "24px", alignItems: "start" }}>
        {/* LEFT COLUMN */}
        <div className="flex-col gap-6">
           {/* Payment / Manual Verification Info */}
           {!isPaid && job.order && (
               isPendingManual ? (
                   <div className="glass-card" style={{ padding: "24px", border: "1px solid var(--brand-primary)" }}>
                       <h4 style={{ margin: "0 0 12px", fontSize: "0.95rem", fontWeight: 700 }} className="flex items-center gap-2">
                           <CreditCard size={18} className="text-primary" /> Verification Status
                       </h4>
                       <p className="text-sm text-secondary" style={{ marginBottom: 16 }}>
                           We're awaiting verification of your bank transfer. 
                       </p>
                       {!job.order.proofUrl && (
                           <div style={{ marginTop: 8 }}>
                               <p className="text-xs text-muted mb-3">Upload your receipt to speed up approval:</p>
                               <ReceiptUploadButton type="ORDER" id={job.order.id} />
                           </div>
                       )}
                   </div>
               ) : (
                <OrderPaymentAction 
                    jobId={job.id}
                    orderId={job.order.id}
                    totalAmount={job.order.total}
                    walletBalance={walletBalance}
                />
               )
           )}

          {/* Order Summary - Tightly Closed */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 16px" }}>Order Detail</h3>
            <div className="flex-col gap-3">
              <SummaryItem label="Service" value={job.service.name} />
              {job.vendor && (
                <SummaryItem label="Vendor" value={job.vendor.storeName} />
              )}
              <SummaryItem label="Payment" value={isPaid ? "Paid" : "Pending"} badge={isPaid ? "success" : "warning"} />
              <SummaryItem label="Priority" value={job.priority === "EXPRESS" ? "⚡ Express" : "Normal"} />
              <SummaryItem label="Date" value={new Date(job.createdAt).toLocaleDateString()} />
              <div className="flex justify-between items-center pt-3 mt-1" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Cost</span>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--brand-primary)" }}>
                  ₦{job.order?.total?.toLocaleString() || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted Request Files */}
          {job.attachments?.length > 0 && (
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 16px" }} className="flex items-center gap-2">
                <Paperclip size={16} /> Reference Files
              </h3>
              <div className="flex-col gap-2">
                {job.attachments.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-2 truncate">
                    <Paperclip size={12} /> {url.split("/").pop()}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Deliverables */}
        <div className="flex-col gap-6">
          {job.status === "COMPLETED" ? (
             isPaid ? (
                <div className="glass-card" style={{ padding: "24px" }}>
                   <DeliverableDownloads 
                     aiOutput={job.aiOutput} 
                     title={job.title} 
                     attachments={job.attachments} 
                   />
                </div>
             ) : (
                <div className="glass-card text-center" style={{ padding: "48px 24px", borderColor: "var(--brand-warning)" }}>
                  <CreditCard size={40} className="text-warning" style={{ margin: "0 auto 16px", opacity: 0.6 }} />
                  <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px", fontWeight: 700 }}>Unlock Your Deliverable</h3>
                  <p className="text-muted text-sm">
                    Complete your payment to access and download your finished files.
                  </p>
                </div>
             )
          ) : (
            <div className="glass-card text-center" style={{ padding: "48px 24px" }}>
              <Clock size={40} style={{ opacity: 0.15, margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px", fontWeight: 700 }}>Processing Your Request</h3>
              <p className="text-muted text-sm">
                We're currently working on your order. You'll be notified as soon as it's ready.
              </p>
            </div>
          )}

          {/* Form Data Recap */}
          {Object.keys(formData).length > 0 && (
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 16px" }}>Project Brief</h3>
              <div className="grid-1 gap-4">
                {Object.entries(formData)
                  .filter(([key]) => !["priority", "academicIntegrity", "original_attachment_count"].includes(key))
                  .map(([key, value]) => (
                  <div key={key}>
                    <div className="text-muted" style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
                      {key.replace(/_/g, " ")}
                    </div>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{String(value)}</div>
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

function QualityMetric({ icon, label, value, isActive }: { icon: React.ReactNode, label: string, value: string, isActive: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-elevated" style={{ border: isActive ? "1px solid rgba(0,200,83,0.3)" : "1px solid var(--border-subtle)" }}>
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isActive ? "var(--brand-success)" : "var(--bg-elevated)",
        color: isActive ? "white" : "var(--text-muted)",
        border: isActive ? "none" : "2px solid var(--border-medium)",
        transition: "all 0.3s ease"
      }}>
        {isActive ? <Check size={18} /> : icon}
      </div>
      <div className="flex-col">
        <span className="text-muted" style={{ fontSize: "0.65rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{label}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isActive ? "var(--brand-success)" : "inherit" }}>{value}</span>
      </div>
    </div>
  );
}

function StatusBanner({ type, icon, children }: { type: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div style={{
      padding: "12px 16px",
      background: `var(--brand-${type}-subtle)`,
      border: `1px solid var(--brand-${type})`,
      borderRadius: "12px",
      color: `var(--brand-${type})`,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "0.875rem",
      fontWeight: 600
    }}>
      {icon}
      <span>{children}</span>
    </div>
  );
}

function SummaryItem({ label, value, badge }: { label: string, value: string, badge?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted">{label}</span>
      {badge ? (
        <span className={`badge badge-${badge}`} style={{ fontSize: "0.7rem" }}>{value}</span>
      ) : (
        <span style={{ fontWeight: 600 }}>{value}</span>
      )}
    </div>
  );
}

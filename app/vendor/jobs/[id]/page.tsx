"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  MessageSquare, 
  FileText, 
  User,
  ShieldCheck,
  Check,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function VendorJobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/vendor/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
          setAdminNotes(data.adminNotes || "");
        } else {
          router.push("/vendor/jobs");
        }
      } catch (e) {
        console.error("Failed to fetch job:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleSubmitWork = async () => {
    if (!confirm("Are you sure you want to submit this work for review?")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/vendor/jobs/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (res.ok) {
        alert("Work submitted successfully!");
        router.refresh();
      }
    } catch (e) {
      console.error("Submission failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/vendor/jobs" className="btn btn-ghost btn-sm" style={{ padding: "8px" }}>
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-col">
           <h2 style={{ margin: 0 }}>Job Details</h2>
           <span className="text-muted" style={{ fontSize: "0.8rem" }}>Job ID: #{id}</span>
        </div>
      </div>

      <div className="grid-3 gap-8">
         <div className="col-span-2 flex-col gap-8">
            {/* Main Info */}
            <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
               <div className="flex justify-between items-start">
                  <div className="flex-col gap-1">
                    <h3 style={{ margin: 0 }}>{job.title}</h3>
                    <p className="text-secondary">{job.service.name}</p>
                  </div>
                  <span className={`badge badge-${
                    job.status === 'COMPLETED' ? 'success' : 
                    job.status === 'IN_PROGRESS' ? 'info' : 'warning'
                  }`}>
                    {job.status}
                  </span>
               </div>

               <div className="flex-col gap-3">
                  <label className="form-label" style={{ fontWeight: 700 }}>Client Requirements</label>
                  <div className="p-4 bg-elevated rounded-xl text-secondary" style={{ fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>
                     {job.description}
                  </div>
               </div>

               {job.formData && (
                 <div className="flex-col gap-3">
                    <label className="form-label" style={{ fontWeight: 700 }}>Service Details</label>
                    <div className="grid-2 gap-4">
                       {Object.entries(job.formData).map(([key, value]: [string, any]) => (
                         <div key={key} className="flex-col p-3 border border-subtle rounded-lg">
                            <span className="text-muted" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>{key.replace(/_/g, " ")}</span>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{String(value)}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* Fulfiller Workspace */}
            <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)", border: "1px solid var(--brand-primary)" }}>
               <h3 className="flex items-center gap-2">
                 <ShieldCheck className="text-primary" size={24} /> Fulfiller Workspace
               </h3>
               
               <div className="flex-col gap-3">
                  <label className="form-label">Submission Notes / Deliverable URL</label>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: "150px" }}
                    placeholder="Enter final summary or download links for the client..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    disabled={job.status === 'COMPLETED'}
                  />
                  <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                    Provide clear instructions or links to the deliverables. Once submitted, the client will review the work.
                  </p>
               </div>

               {job.status !== 'COMPLETED' && (
                 <div className="flex justify-end gap-3 pt-4 border-t border-subtle">
                    <button className="btn btn-ghost btn-md"><MessageSquare size={18} /> Message Client</button>
                    <button onClick={handleSubmitWork} className="btn btn-primary btn-md flex items-center gap-2" disabled={isSubmitting}>
                       <Check size={18} /> Submit Work for Review
                    </button>
                 </div>
               )}
            </div>
         </div>

         <div className="flex-col gap-8">
            {/* Client Info */}
            <div className="glass-card flex-col gap-4" style={{ padding: "var(--space-6)" }}>
               <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
                  <User size={18} className="text-muted" /> Client Information
               </h4>
               <div className="flex-col gap-2">
                  <div className="flex justify-between items-center">
                     <span className="text-secondary" style={{ fontSize: "0.85rem" }}>Name:</span>
                     <span style={{ fontWeight: 600 }}>{job.user.name || "Customer"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-secondary" style={{ fontSize: "0.85rem" }}>Timeline:</span>
                     <span className="badge badge-info">{job.priority}</span>
                  </div>
               </div>
            </div>

            {/* Financials */}
            <div className="glass-card flex-col gap-4 bg-grad-glow" style={{ padding: "var(--space-6)" }}>
               <h4 className="flex items-center gap-2" style={{ margin: 0 }}>
                  <DollarSign size={18} className="text-success" /> Marketplace Escrow
               </h4>
               <div className="flex justify-between items-center">
                  <span className="text-secondary" style={{ fontSize: "0.85rem" }}>Order Total:</span>
                  <span style={{ fontWeight: 600 }}>₦{job.order?.total?.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-secondary" style={{ fontSize: "0.85rem" }}>Platform (20%):</span>
                  <span className="text-danger" style={{ fontWeight: 600 }}>-₦{(job.order?.total * 0.2).toLocaleString()}</span>
               </div>
               <hr style={{ border: "none", borderTop: "1px dashed var(--border-medium)" }} />
               <div className="flex justify-between items-center">
                  <span style={{ fontWeight: 700 }}>Your Earnings:</span>
                  <span className="text-success" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                    ₦{(job.order?.total * 0.8).toLocaleString()}
                  </span>
               </div>
               <div className="flex items-center gap-2 text-warning" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                  <Clock size={12} /> HELD IN ESCROW
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

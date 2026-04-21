"use client";

import { useState } from "react";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderFulfillmentActionsProps {
  jobId: string;
  status: string;
}

export default function OrderFulfillmentActions({ jobId, status }: OrderFulfillmentActionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!confirm("Are you sure you want to accept this work? Funds will be released to the vendor and the order will be marked as completed.")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/accept`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to accept work.");
      }
    } catch (error) {
      console.error("Error accepting work:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevision = async () => {
    const reason = prompt("Describe what needs to be fixed or changed:");
    if (!reason) return;
    
    setIsSubmitting(true);
    try {
      // Reusing the existing revision logic if available, or creating a simple one
      const res = await fetch(`/api/jobs/${jobId}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error requesting revision:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status !== "REVIEW") return null;

  return (
    <div className="glass-card flex-col gap-6" style={{ padding: "24px", border: "1px solid var(--brand-info)" }}>
      <div className="flex-col gap-2">
        <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>Review Delivered Work</h3>
        <p className="text-sm text-secondary">
          The service provider has submitted the work for your review. Please check the deliverables and choose to accept or request a revision.
        </p>
      </div>
      
      <div className="flex gap-4">
         <button 
           onClick={handleAccept} 
           disabled={isSubmitting}
           className="btn btn-primary flex-1 flex items-center justify-center gap-2"
           style={{ background: "var(--brand-success)", borderColor: "var(--brand-success)" }}
         >
           <CheckCircle size={18} /> Accept Work
         </button>
         <button 
           onClick={handleRevision} 
           disabled={isSubmitting}
           className="btn btn-ghost flex-1 flex items-center justify-center gap-2 border border-danger text-danger"
         >
           <XCircle size={18} /> Request Revision
         </button>
      </div>
      <p className="text-center text-xs text-muted">
        Accepting work releases the held escrow funds to the vendor.
      </p>
    </div>
  );
}

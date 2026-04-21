"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Store, Send, CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function BecomeVendorPage() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    storeName: "",
    storeSlug: "",
    description: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login");
    
    async function checkExisting() {
      try {
        const res = await fetch("/api/vendor/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) setExistingProfile(data.profile);
        }
      } catch (e) {
        console.error("Error checking vendor profile:", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (status === "authenticated") checkExisting();
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/vendor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitStatus("success");
        const data = await res.json();
        setExistingProfile(data.profile);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Application failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (existingProfile) {
    return (
      <div className="container-sm section">
        <div className="glass-card flex-col items-center text-center gap-6" style={{ padding: "var(--space-12)" }}>
          {existingProfile.status === "PENDING" ? (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 179, 71, 0.1)", border: "2px solid var(--brand-warning)" }}>
                <Send className="text-warning" size={40} />
              </div>
              <h1 style={{ margin: 0 }}>Application Under Review</h1>
              <p className="text-secondary">
                Thanks for applying to be a vendor at {existingProfile.storeName}! Our team is currently reviewing your professional portfolio. 
                We will update your account once approved.
              </p>
              <div className="badge badge-warning">Status: Pending Review</div>
            </>
          ) : existingProfile.status === "APPROVED" ? (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(0, 229, 160, 0.1)", border: "2px solid var(--brand-success)" }}>
                <CheckCircle2 className="text-success" size={40} />
              </div>
              <h1 style={{ margin: 0 }}>Welcome, Vendor!</h1>
              <p className="text-secondary">
                Your application for <strong>{existingProfile.storeName}</strong> has been approved. You can now start listing your services and managing orders.
              </p>
              <a href="/vendor" className="btn btn-primary btn-md">Go to Vendor Dashboard</a>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 71, 87, 0.1)", border: "2px solid var(--brand-danger)" }}>
                <AlertCircle className="text-danger" size={40} />
              </div>
              <h1 style={{ margin: 0 }}>Application Update</h1>
              <p className="text-secondary">
                Your application was not approved at this time. Admin notes: {existingProfile.adminNotes || "None provided."}
              </p>
              <div className="badge badge-danger">Status: {existingProfile.status}</div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-sm section">
      <div className="glass-card flex-col gap-8" style={{ padding: "var(--space-10)" }}>
        <div className="flex-col gap-3">
          <div className="flex items-center gap-3">
            <Store className="text-primary" size={32} />
            <h1 style={{ margin: 0, fontSize: "2rem" }}>Join as a Vendor</h1>
          </div>
          <p className="text-secondary">
            Apply to become a verified service provider on our platform. Reach more clients and manage your digital business with ease.
          </p>
        </div>

        <div className="bg-info-subtle p-6 rounded-2xl flex gap-4">
           <Info className="text-primary flex-shrink-0" size={24} />
           <div className="flex-col gap-2">
              <h5 style={{ margin: 0, color: "var(--brand-primary)" }}>Why join the Marketplace?</h5>
              <ul className="text-muted" style={{ fontSize: "0.85rem", paddingLeft: "1.2rem", margin: 0 }}>
                 <li>Access to a wide pool of digital clients.</li>
                 <li>Secure Escrow payments (80/20 split).</li>
                 <li>Easy payout to your local bank account.</li>
                 <li>Professional dashboard and order tracking.</li>
              </ul>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
           <div className="grid-2 gap-6">
              <div className="form-group">
                <label className="form-label">Store / Business Name</label>
                <input 
                  type="text" 
                  name="storeName" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Master Typists Nigeria"
                  value={form.storeName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Store Slug (Unique ID)</label>
                <input 
                  type="text" 
                  name="storeSlug" 
                  className="form-input" 
                  required 
                  placeholder="e.g. master-typists"
                  value={form.storeSlug.toLowerCase().replace(/ /g, "-")}
                  onChange={handleChange}
                />
              </div>
           </div>

           <div className="form-group">
              <label className="form-label">Professional Portfolio Link (URL)</label>
              <input 
                type="url" 
                name="portfolioUrl" 
                className="form-input" 
                placeholder="https://..."
                value={form.portfolioUrl}
                onChange={handleChange}
              />
              <p className="text-muted" style={{ fontSize: "0.7rem" }}>Link to your previous work, website, or LinkedIn profile.</p>
           </div>

           <div className="form-group">
              <label className="form-label">Business Description & Expertise</label>
              <textarea 
                name="description" 
                className="form-input" 
                required 
                style={{ minHeight: "120px" }}
                placeholder="Briefly describe your services and why you're a professional in this field..."
                value={form.description}
                onChange={handleChange}
              />
           </div>

           <div className="flex-col gap-4">
             <button 
               type="submit" 
               className="btn btn-primary btn-lg" 
               disabled={isSubmitting}
             >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
             </button>
             
             {submitStatus === "error" && (
               <div className="text-danger text-center" style={{ fontSize: "0.875rem" }}>
                 Failed to submit application. Please check your details and try again.
               </div>
             )}
           </div>
        </form>
      </div>
    </div>
  );
}

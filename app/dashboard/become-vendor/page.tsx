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
    fullName: "",
    address: "",
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "idProof") setIdFile(files[0]);
      if (name === "resume") setResumeFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFile || !resumeFile) {
      alert("Please upload both ID Proof and Resume.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("idProof", idFile);
      formData.append("resume", resumeFile);

      const res = await fetch("/api/vendor/apply", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSubmitStatus("success");
        const data = await res.json();
        setExistingProfile(data.profile);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to submit application.");
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
                Thanks for applying to be a vendor at {existingProfile.storeName}! Our team is currently reviewing your professional portfolio and identity documents for verification. 
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
            Apply to become a verified service provider on our platform. Professional verification is required to maintain platform security.
          </p>
        </div>

        <div className="bg-info-subtle p-6 rounded-2xl flex gap-4">
           <Info className="text-primary flex-shrink-0" size={24} />
           <div className="flex-col gap-2">
              <h5 style={{ margin: 0, color: "var(--brand-primary)" }}>Verification Requirements</h5>
              <p className="text-muted" style={{ fontSize: "0.85rem", margin: 0 }}>
                To protect our clients, all vendors must submit a valid National ID and a professional Resume. Your data is encrypted and only visible to administrators.
              </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-8">
           <div className="flex-col gap-6">
              <h3 style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>Personal Information</h3>
              <div className="grid-2 gap-6">
                 <div className="form-group">
                   <label className="form-label">Full Legal Name</label>
                   <input 
                     type="text" 
                     name="fullName" 
                     className="form-input" 
                     required 
                     placeholder="As it appears on your ID"
                     value={form.fullName}
                     onChange={handleChange}
                   />
                 </div>
                 <div className="form-group">
                   <label className="form-label">Portfolio URL</label>
                   <input 
                     type="url" 
                     name="portfolioUrl" 
                     className="form-input" 
                     placeholder="https://..."
                     value={form.portfolioUrl}
                     onChange={handleChange}
                   />
                 </div>
              </div>
              <div className="form-group">
                 <label className="form-label">Home / Business Address</label>
                 <textarea 
                   name="address" 
                   className="form-input" 
                   required 
                   placeholder="Your physical address..."
                   style={{ minHeight: "80px" }}
                   value={form.address}
                   onChange={handleChange}
                 />
              </div>
           </div>

           <div className="flex-col gap-6">
              <h3 style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>Store Details</h3>
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
                 <label className="form-label">Expertise & Experience</label>
                 <textarea 
                   name="description" 
                   className="form-input" 
                   required 
                   style={{ minHeight: "100px" }}
                   placeholder="Describe your specialized skills..."
                   value={form.description}
                   onChange={handleChange}
                 />
              </div>
           </div>

           <div className="flex-col gap-6">
              <h3 style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>Verification Documents</h3>
              <div className="grid-2 gap-6">
                 <div className="form-group">
                   <label className="form-label">National Identity Card (Image/PDF)</label>
                   <input 
                     type="file" 
                     name="idProof" 
                     className="form-input" 
                     required 
                     accept="image/*,.pdf"
                     onChange={handleFileChange}
                     style={{ padding: "8px" }}
                   />
                 </div>
                 <div className="form-group">
                   <label className="form-label">Professional Resume / CV (PDF)</label>
                   <input 
                     type="file" 
                     name="resume" 
                     className="form-input" 
                     required 
                     accept=".pdf"
                     onChange={handleFileChange}
                     style={{ padding: "8px" }}
                   />
                 </div>
              </div>
           </div>

           <div className="flex-col gap-4">
             <button 
               type="submit" 
               className="btn btn-primary btn-lg" 
               disabled={isSubmitting}
             >
                {isSubmitting ? "Submitting Secured Application..." : "Submit Application for Review"}
             </button>
             
        </form>
      </div>
    </div>
  );
}

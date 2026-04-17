"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Upload, X, Paperclip, CheckCircle, ShieldAlert } from "lucide-react";

export default function ClientJobForm({ 
  serviceId, 
  schema,
  basePrice,
  expressMultiplier
}: { 
  serviceId: string, 
  schema: any[],
  basePrice: number,
  expressMultiplier: number
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Record<string, any>>({ 
    priority: "NORMAL",
    academicIntegrity: false 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: basePrice })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data.coupon);
      } else {
        setError(data.error);
        setAppliedCoupon(null);
      }
    } catch (err) {
      setError("Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const calculateTotals = () => {
    const isExpress = formData.priority === "EXPRESS";
    const subtotal = basePrice;
    const priorityFee = isExpress ? (basePrice * (expressMultiplier - 1)) : 0;
    const preDiscountTotal = subtotal + priorityFee;
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        discount = preDiscountTotal * (appliedCoupon.discountValue / 100);
      } else {
        discount = appliedCoupon.discountValue;
      }
    }
    
    return {
      subtotal,
      priorityFee,
      discount: Math.round(discount * 100) / 100,
      total: Math.max(0, preDiscountTotal - discount)
    };
  };

  const { subtotal, priorityFee, discount, total } = calculateTotals();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > 50 * 1024 * 1024) {
        setError("Total file size exceeds 50MB limit.");
        return;
      }
      setFiles(prev => [...prev, ...selectedFiles]);
      setError("");
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.academicIntegrity) {
      setError("Please confirm the Academic Integrity disclosure.");
      return;
    }
    
    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];

      // 1. Upload files first
      if (files.length > 0) {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/jobs/upload',
          });
          uploadedUrls.push(newBlob.url);
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }
        setUploading(false);
      }

      // 2. Submit Job with Pricing Info
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          title: `${formData['title'] || 'Order'} - ${Date.now().toString().slice(-4)}`,
          formData,
          description: formData['description'] || "Submitted via Client Portal",
          attachments: uploadedUrls,
          couponId: appliedCoupon?.id
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to submit job");
      }
      
      router.push("/dashboard?order_success=true");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-6" style={{ padding: "var(--space-6)" }}>
      <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>Order Request</h3>

      {error && (
        <div style={{ padding: "var(--space-3)", background: "rgba(255, 71, 87, 0.08)", color: "var(--brand-danger)", borderRadius: "var(--radius-sm)", border: "1px solid var(--brand-danger)", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      <div className="flex-col gap-4">
        {schema.map((field, idx) => (
          <div key={idx} className="form-group">
            <label className="form-label">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea 
                className="form-textarea" 
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : (
              <input 
                type={field.type} 
                className="form-input"
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="form-group">
        <label className="form-label">Priority Level</label>
        <select 
           className="form-select" 
           value={formData['priority']} 
           onChange={(e) => handleChange("priority", e.target.value)}
        >
          <option value="NORMAL">Standard Processing (Normal Fee)</option>
          <option value="EXPRESS">Express Processing ({expressMultiplier}x Fee)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label font-bold text-sm flex items-center gap-2">
          Files & Attachments 
          <span className="text-secondary font-normal" style={{ fontSize: "0.7rem" }}>(Encrypted & Scanned)</span>
        </label>
        <div className="file-upload-zone p-6 text-center border-2 border-dashed border-subtle rounded-xl cursor-pointer hover:bg-glass" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple style={{ display: "none" }} />
          <Upload size={24} className="text-primary mb-2 mx-auto" />
          <p className="text-sm">Click to select files (Max 50MB)</p>
          <p className="text-xs text-muted mt-1">All uploads are scanned for security.</p>
        </div>
        
        {files.length > 0 && (
          <div className="flex-col gap-2 mt-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-subtle p-2 rounded-lg text-xs border border-subtle">
                <span className="font-medium truncate">{file.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-danger"><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Section */}
      <div className="form-group bg-subtle p-4 rounded-xl border border-subtle">
        <label className="form-label" style={{ fontSize: "0.8rem" }}>Promo Code</label>
        <div className="flex gap-2 mt-1">
          <input 
            type="text" 
            className="form-input font-mono" 
            placeholder="CODE..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          />
          <button 
            type="button" 
            className="btn btn-ghost border border-subtle" 
            onClick={handleApplyCoupon}
            disabled={validatingCoupon || !couponCode}
          >
            {validatingCoupon ? "..." : "Apply"}
          </button>
        </div>
        {appliedCoupon && (
          <div className="text-success text-xs mt-2 flex items-center gap-1">
            <CheckCircle size={12} /> Coupon "{appliedCoupon.code}" Applied!
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-glass p-6 rounded-2xl border border-subtle flex-col gap-3 mt-4">
        <div className="flex justify-between text-secondary">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        {priorityFee > 0 && (
          <div className="flex justify-between text-secondary">
            <span>Priority Fee</span>
            <span>+ ₦{priorityFee.toLocaleString()}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount Applied</span>
            <span>- ₦{discount.toLocaleString()}</span>
          </div>
        )}
        <hr className="border-subtle my-1" />
        <div className="flex justify-between font-bold text-lg" style={{ color: "var(--brand-primary)" }}>
          <span>Payable Amount</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Compliance & Disclosure */}
      <div className="bg-glass p-6 rounded-2xl border border-subtle flex-col gap-4">
        <label className="flex items-start gap-4 cursor-pointer group">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 accent-primary cursor-pointer"
            checked={formData.academicIntegrity}
            onChange={(e) => setFormData({...formData, academicIntegrity: e.target.checked})}
            required
          />
          <div className="flex-col gap-1">
            <span className="text-sm font-bold flex items-center gap-2">
              <ShieldAlert size={14} className="text-primary" /> Academic Integrity & AI Disclosure
            </span>
            <span className="text-xs text-secondary leading-relaxed">
              I certify that this request follows my institution's academic integrity policies. 
              I understand that the AI Computer Centre provides **drafting and research assistance** 
              and I am responsible for final verification. Data is processed securely and encrypted.
            </span>
          </div>
        </label>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary w-full py-5 text-xl font-bold shadow-2xl hover:translate-y-[-2px]"
        disabled={loading || uploading || !formData.academicIntegrity}
      >
        {loading ? "Processing Order..." : `Confirm & Pay ₦${total.toLocaleString()}`}
      </button>
    </form>
  );
}

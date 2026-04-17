"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Upload, X, Paperclip, CheckCircle } from "lucide-react";

export default function ClientJobForm({ serviceId, schema }: { serviceId: string, schema: any[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validation: Total size or individual size? User said "not more than 50mb"
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
    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];

      // 1. Upload files first if any
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

      // 2. Submit Job
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          title: `Job Order ${Date.now().toString().slice(-6)}`,
          formData,
          description: "Submitted via Client Portal",
          attachments: uploadedUrls
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit job");
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
    <form onSubmit={handleSubmit} className="flex-col gap-5" style={{ padding: "var(--space-6)" }}>
      <h3 style={{ fontSize: "1.125rem", margin: 0, borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-4)" }}>
        Order Details
      </h3>

      {error && (
        <div style={{ padding: "var(--space-3)", background: "rgba(255, 71, 87, 0.1)", color: "var(--brand-danger)", borderRadius: "var(--radius-sm)", border: "1px solid var(--brand-danger)" }}>
          {error}
        </div>
      )}

      {schema.map((field, idx) => (
        <div key={idx} className="form-group">
          <label className="form-label">
            {field.label} {field.required && <span style={{color: "var(--brand-danger)"}}>*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea 
              className="form-textarea" 
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ) : (
            <input 
              type={field.type} 
              className="form-input"
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}

      {/* File Upload Section */}
      <div className="form-group">
        <label className="form-label">Attachments (Max 50MB total)</label>
        <div 
          className="file-upload-zone"
          style={{
            border: "2px dashed var(--border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-6)",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            style={{ display: "none" }} 
          />
          <Upload size={24} style={{ marginBottom: "var(--space-2)", color: "var(--brand-primary)" }} />
          <p style={{ margin: 0, fontSize: "0.875rem" }}>Click to select files or drag and drop</p>
          <p className="text-muted" style={{ fontSize: "0.75rem" }}>Supported: Images, PDF, Docs, Zip</p>
        </div>

        {files.length > 0 && (
          <div className="flex-col gap-2" style={{ marginTop: "var(--space-3)" }}>
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between" style={{ background: "var(--bg-elevated)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)", fontSize: "0.8125rem" }}>
                <div className="flex items-center gap-2">
                  <Paperclip size={14} className="text-muted" />
                  <span style={{ fontWeight: 500 }}>{file.name}</span>
                  <span className="text-muted">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ background: "none", border: "none", color: "var(--brand-danger)", cursor: "pointer" }}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploading && (
           <div style={{ marginTop: "var(--space-3)" }}>
              <div className="flex justify-between" style={{ fontSize: "0.75rem", marginBottom: "var(--space-1)" }}>
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ height: "4px", width: "100%", background: "var(--bg-elevated)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${uploadProgress}%`, background: "var(--grad-primary)", transition: "width 0.3s ease" }}></div>
              </div>
           </div>
        )}
      </div>
      
       <div className="form-group" style={{ marginTop: "var(--space-2)" }}>
          <label className="form-label">Priority</label>
          <select 
             className="form-select" 
             value={formData['priority'] || "NORMAL"} 
             onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="NORMAL">Normal Processing</option>
            <option value="EXPRESS">Express Processing (1.5x fee)</option>
          </select>
       </div>

      <button 
        type="submit" 
        className="btn btn-primary btn-lg" 
        style={{ marginTop: "var(--space-4)" }} 
        disabled={loading || uploading}
      >
        {loading ? (uploading ? "Uploading..." : "Submitting...") : (
          <>Submit Order</>
        )}
      </button>
    </form>
  );
}


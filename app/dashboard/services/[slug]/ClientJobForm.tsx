"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientJobForm({ serviceId, schema }: { serviceId: string, schema: any[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          title: `Job Order ${Date.now().toString().slice(-6)}`,
          formData,
          description: "Submitted via Client Portal"
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit job");
      }
      
      router.push("/dashboard?order_success=true");
    } catch (err: any) {
      setError(err.message || "An error occurred");
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

      <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: "var(--space-4)" }} disabled={loading}>
        {loading ? "Submitting Order..." : "Submit Order"}
      </button>
    </form>
  );
}

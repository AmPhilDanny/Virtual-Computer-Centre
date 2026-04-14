"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "TYPING",
    basePrice: 500,
    turnaroundHours: 24,
    aiPrompt: "",
    autonomyLevel: "AI_PLUS_HUMAN"
  });

  const [formFields, setFormFields] = useState<any[]>([
    { name: "instructions", label: "Special Instructions", type: "textarea", required: true }
  ]);

  const addField = () => {
    setFormFields([...formFields, { name: `field_${Date.now()}`, label: "New Field", type: "text", required: false }]);
  };

  const updateField = (index: number, key: string, value: any) => {
    const updated = [...formFields];
    updated[index][key] = value;
    setFormFields(updated);
  };

  const removeField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, formSchema: formFields })
      });

      if (res.ok) {
        router.push("/admin/services");
        router.refresh();
      } else {
        alert("Failed to create service");
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col gap-6" style={{ paddingBottom: "var(--space-10)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/services" className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} />
          </Link>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Create New Service</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid-2 gap-6" style={{ alignItems: "start" }}>
        
        {/* Left Column: Basic Info */}
        <div className="glass-card flex-col gap-5" style={{ padding: "var(--space-6)" }}>
          <h3 style={{ fontSize: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>Basic Configuration</h3>
          
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input className="form-input" required value={formData.name} onChange={e => {
              setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
            }} />
          </div>

          <div className="grid-2 gap-4">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="TYPING">Typing</option>
                <option value="ACADEMIC">Academic</option>
                <option value="GOVERNMENT">Government</option>
                <option value="DIGITAL_BUSINESS">Digital/Business</option>
                <option value="AI_ENHANCED">AI Enhanced</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Base Price (₦)</label>
              <input type="number" className="form-input" required value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" required style={{ minHeight: "80px" }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <h3 style={{ fontSize: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)", marginTop: "var(--space-4)" }}>AI Automation Rules</h3>
          
          <div className="form-group">
            <label className="form-label">AI Execution Prompt (System Instructions)</label>
            <textarea className="form-textarea" placeholder="Tell the AI exactly what to do with the submitted data..." value={formData.aiPrompt} onChange={e => setFormData({...formData, aiPrompt: e.target.value})}></textarea>
          </div>
        </div>

        {/* Right Column: Dynamic Form Builder */}
        <div className="flex-col gap-6">
          <div className="glass-card" style={{ padding: "var(--space-6)" }}>
            <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "1rem", margin: 0 }}>Client Form Builder</h3>
              <button type="button" onClick={addField} className="btn btn-secondary btn-sm"><Plus size={16} /> Add Field</button>
            </div>
            
            <p className="text-secondary text-sm" style={{ marginBottom: "var(--space-4)" }}>
              Define exactly what inputs the client needs to fill out for this service.
            </p>

            <div className="flex-col gap-4">
              {formFields.map((field, index) => (
                <div key={index} style={{ padding: "var(--space-4)", background: "rgba(108, 71, 255, 0.05)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div className="flex justify-between" style={{ marginBottom: "var(--space-3)" }}>
                    <strong>Field {index + 1}</strong>
                    <button type="button" onClick={() => removeField(index)} style={{ color: "var(--brand-danger)", background: "transparent", border: "none", cursor: "pointer" }}><Trash2 size={16} /></button>
                  </div>
                  
                  <div className="grid-2 gap-3">
                    <div className="form-group">
                      <label className="form-label" style={{fontSize: "0.75rem"}}>Label Name</label>
                      <input className="form-input" style={{padding: "var(--space-2)"}} value={field.label} onChange={e => updateField(index, "label", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{fontSize: "0.75rem"}}>Programmatic Key Name</label>
                      <input className="form-input" style={{padding: "var(--space-2)"}} value={field.name} onChange={e => updateField(index, "name", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{fontSize: "0.75rem"}}>Input Type</label>
                      <select className="form-select" style={{padding: "var(--space-2)"}} value={field.type} onChange={e => updateField(index, "type", e.target.value)}>
                        <option value="text">Text (Short)</option>
                        <option value="textarea">Textarea (Long)</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="file">File Upload</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ justifyContent: "center", paddingTop: "var(--space-4)" }}>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={field.required} onChange={e => updateField(index, "required", e.target.checked)} />
                        Required Field
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formFields.length === 0 && <div className="text-center text-muted" style={{padding: "var(--space-4)"}}>No fields added. Form is empty.</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "var(--space-4)", fontSize: "1.0625rem" }} disabled={loading}>
            {loading ? "Creating Service..." : <><Save size={20} /> Save & Publish Service</>}
          </button>
        </div>
      </form>
    </div>
  );
}

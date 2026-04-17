"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Upload, 
  Trash2, 
  Edit3, 
  Plus, 
  Globe, 
  Search, 
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [editingDataset, setEditingDataset] = useState<any>(null);
  
  // Upload State
  const [uploadName, setUploadName] = useState("");
  const [selectedService, setSelectedService] = useState("global");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [dsRes, svRes] = await Promise.all([
        fetch("/api/admin/datasets"),
        fetch("/api/admin/services")
      ]);
      if (dsRes.ok) setDatasets(await dsRes.json());
      if (svRes.ok) setServices(await svRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0] || !uploadName) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("name", uploadName);
      formData.append("serviceId", selectedService);

      const res = await fetch("/api/admin/datasets", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchData();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dataset?")) return;

    try {
      const res = await fetch(`/api/admin/datasets/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingDataset) return;

    try {
      const res = await fetch(`/api/admin/datasets/${editingDataset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editingDataset.content,
          name: editingDataset.name,
          serviceId: editingDataset.serviceId
        })
      });

      if (res.ok) {
        setEditingDataset(null);
        fetchData();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="flex items-center gap-2" style={{ margin: 0 }}>
            <BookOpen size={24} className="text-primary" /> AI Knowledge Base
          </h2>
          <p className="text-secondary">Manage documents and datasets the AI uses for training.</p>
        </div>
      </div>

      <div className="grid-2 gap-8">
        {/* Dataset List */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-6)" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>All Datasets</h3>
          
          {isLoading ? (
            <div className="flex justify-center p-8 animate-pulse">Loading Knowledge Base...</div>
          ) : datasets.length === 0 ? (
            <div className="flex-col items-center gap-4 p-12 text-center bg-subtle rounded-xl border border-dashed border-subtle">
              <FileText size={48} className="text-muted opacity-30" />
              <p className="text-secondary">No datasets found. Upload your first document to train the AI.</p>
            </div>
          ) : (
            <div className="flex-col gap-4">
              {datasets.map((ds) => (
                <div key={ds.id} className="dataset-item flex justify-between items-center p-4 bg-glass rounded-xl border border-subtle">
                  <div className="flex items-center gap-4">
                    <div className="icon-box bg-primary-subtle text-primary p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1rem" }}>{ds.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="badge badge-info" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                          {ds.fileType?.split("/")[1]?.toUpperCase() || "TEXT"}
                        </span>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {ds.serviceId ? `Service: ${ds.service?.name}` : "Global Context"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingDataset(ds)}
                      className="btn btn-ghost btn-sm p-2"
                      title="Edit Content"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(ds.id)}
                      className="btn btn-ghost btn-sm text-danger p-2"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Form */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-6)" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Upload New Document</h3>
          <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
            The system will automatically extract text from your files and use it as AI context.
          </p>

          <form onSubmit={handleUpload} className="flex-col gap-5">
            <div className="form-group">
              <label className="form-label">Dataset Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Terms of Service v2, Visa Guide 2024"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Scope / Service</label>
              <select 
                className="form-select"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="global">Global (All Services)</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">File (PDF, DOCX, TXT)</label>
              <div 
                className="file-dropzone flex-col items-center justify-center p-8 border-2 border-dashed border-subtle rounded-xl cursor-pointer hover:bg-glass"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} className="text-primary mb-3" />
                <span className="text-sm font-medium">Click to select file</span>
                <span className="text-xs text-secondary mt-1">PDF, DOCX, or TXT (Max 50MB)</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: "none" }} 
                  accept=".pdf,.docx,.txt,.csv"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full py-3"
              disabled={isUploading}
            >
              {isUploading ? "Extracting & Uploading..." : "Add to Knowledge Base"}
            </button>
          </form>

          <div className="bg-info-subtle p-4 rounded-xl flex gap-3">
            <Info size={20} className="text-info shrink-0" />
            <div className="text-xs text-info leading-relaxed">
              <strong>Tip:</strong> Keep documents focused. Instead of one massive PDF, upload separate smaller datasets for better AI precision.
            </div>
          </div>
        </div>
      </div>

      {/* Manual Edit Modal */}
      {editingDataset && (
        <div className="modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="glass-card flex-col gap-6 w-full max-w-4xl max-h-[90vh] overflow-hidden" style={{ padding: "var(--space-8)" }}>
            <div className="flex justify-between items-center">
              <div>
                <h3 style={{ margin: 0 }}>Review & Refine Context</h3>
                <p className="text-secondary text-sm">Edit the extracted text to improve AI accuracy.</p>
              </div>
              <button onClick={() => setEditingDataset(null)} className="btn btn-ghost p-2">
                <Plus size={20} style={{ transform: "rotate(45deg)" }} />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <textarea 
                className="form-input w-full font-mono text-sm leading-relaxed"
                style={{ minHeight: "400px" }}
                value={editingDataset.content || ""}
                onChange={(e) => setEditingDataset({ ...editingDataset, content: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-subtle">
              <button onClick={() => setEditingDataset(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleUpdate} className="btn btn-primary px-8">Save Knowledge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

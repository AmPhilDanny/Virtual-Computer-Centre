"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle 
} from "lucide-react";

export default function VendorServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: 0,
    category: "DIGITAL_BUSINESS",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vendor/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data || []);
      }
    } catch (e) {
      console.error("Failed to fetch services:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/vendor/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setForm({ name: "", description: "", basePrice: 0, category: "DIGITAL_BUSINESS" });
        fetchServices();
      }
    } catch (e) {
      console.error("Failed to create service:", e);
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex-col gap-1">
          <h2 style={{ margin: 0 }}>My Services</h2>
          <p className="text-secondary" style={{ fontSize: "0.875rem" }}>Manage the services you offer on the marketplace.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-md flex items-center gap-2">
          <Plus size={18} /> Add New Service
        </button>
      </div>

      <div className="flex gap-4">
        <div className="form-group flex-1" style={{ position: "relative" }}>
          <Search size={18} className="text-muted" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" className="form-input" placeholder="Search services..." style={{ paddingLeft: "40px" }} />
        </div>
        <button className="btn btn-ghost btn-md flex items-center gap-2">
          <Filter size={18} /> Filter
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card flex-col items-center justify-center p-20 gap-4 text-center">
           <div className="w-16 h-16 rounded-full bg-subtle flex items-center justify-center">
             <Plus size={32} className="text-muted" />
           </div>
           <h3 style={{ margin: 0 }}>No services listed yet</h3>
           <p className="text-muted max-w-sm">Create your first marketplace service to start receiving orders from clients.</p>
           <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-md">Create Service</button>
        </div>
      ) : (
        <div className="grid-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="glass-card flex-col gap-4 hover:border-medium transition-all">
              <div className="flex justify-between items-start">
                <span className={`badge badge-${
                  service.approvalStatus === 'APPROVED' ? 'success' : 
                  service.approvalStatus === 'PENDING' ? 'warning' : 'danger'
                }`} style={{ fontSize: "0.65rem" }}>
                  {service.approvalStatus}
                </span>
                <button className="text-muted hover:text-primary"><MoreVertical size={18} /></button>
              </div>
              <div className="flex-col gap-1">
                <h4 style={{ margin: 0 }}>{service.name}</h4>
                <p className="text-muted" style={{ fontSize: "0.8rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {service.description}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ fontWeight: 800, color: "var(--brand-primary)" }}>₦{service.basePrice.toLocaleString()}</span>
                <div className="flex gap-2">
                   <button className="btn btn-ghost btn-sm" style={{ padding: "8px" }}><Edit2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simple Modal for adding service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="glass-card flex-col gap-6 max-w-lg w-full bg-base shadow-2xl" style={{ padding: "var(--space-8)" }}>
             <h3 style={{ margin: 0 }}>List a New Service</h3>
             <form onSubmit={handleCreateService} className="flex-col gap-4">
               <div className="form-group text-left">
                 <label className="form-label">Service Name</label>
                 <input 
                   type="text" 
                   required
                   className="form-input" 
                   placeholder="e.g. Professional Ghostwriting" 
                   value={form.name}
                   onChange={(e) => setForm({...form, name: e.target.value})}
                 />
               </div>
               <div className="form-group text-left">
                 <label className="form-label">Base Price (₦)</label>
                 <input 
                   type="number" 
                   required
                   className="form-input" 
                   placeholder="5000" 
                   value={form.basePrice}
                   onChange={(e) => setForm({...form, basePrice: parseInt(e.target.value)})}
                 />
               </div>
               <div className="form-group text-left">
                 <label className="form-label">Description</label>
                 <textarea 
                   required
                   className="form-input" 
                   style={{ minHeight: "100px" }}
                   placeholder="Describe what you will deliver..." 
                   value={form.description}
                   onChange={(e) => setForm({...form, description: e.target.value})}
                 />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-md">Cancel</button>
                 <button type="submit" className="btn btn-primary btn-md">List Service</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Power, 
  Calendar, 
  Hash, 
  Tag,
  AlertCircle,
  TrendingUp,
  Clock
} from "lucide-react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minAmount: "0",
    maxUses: "",
    expiresAt: ""
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowAddForm(false);
        setFormData({
          code: "",
          discountType: "PERCENTAGE",
          discountValue: "",
          minAmount: "0",
          maxUses: "",
          expiresAt: ""
        });
        fetchCoupons();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create coupon");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) fetchCoupons();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon permanently?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) fetchCoupons();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="flex items-center gap-2" style={{ margin: 0 }}>
            <Ticket size={24} className="text-primary" /> Promo Codes & Discounts
          </h2>
          <p className="text-secondary">Create and manage coupons to drive sales and customer loyalty.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`btn ${showAddForm ? 'btn-ghost' : 'btn-primary'} flex items-center gap-2`}
        >
          {showAddForm ? "Cancel" : <><Plus size={18} /> Create New Coupon</>}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card animate-in slide-in-from-top-4" style={{ padding: "var(--space-8)" }}>
          <h3 style={{ margin: 0, marginBottom: "var(--space-6)" }}>New Discount Rule</h3>
          <form onSubmit={handleCreate} className="grid-2 gap-6">
            <div className="form-group">
              <label className="form-label">Coupon Code (e.g. SAVE20)</label>
              <input 
                type="text" 
                className="form-input" 
                style={{ textTransform: "uppercase" }}
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select 
                className="form-select"
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₦)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Discount Value</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Min. Order Amount (Optional)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.minAmount}
                onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Uses (Optional)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date (Optional)</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
              />
            </div>
            <div className="span-2 flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-ghost">Discard</button>
              <button type="submit" className="btn btn-primary px-10" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Save Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="p-6 border-b border-subtle flex justify-between items-center">
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Active Promo Codes</h3>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center animate-pulse">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-20 text-center flex-col items-center gap-4">
            <Tag size={48} className="text-muted opacity-30" />
            <p className="text-secondary">No discount rules found. Start by creating your first promo code.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Value</th>
                  <th>Usage</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-subtle px-3 py-1 rounded border border-subtle text-primary font-bold">
                          {c.code}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="font-bold">
                        {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `₦${c.discountValue.toLocaleString()}`}
                      </span>
                      <div className="text-xs text-secondary">
                        {c.minAmount > 0 ? `Min. spend: ₦${c.minAmount}` : "No min. spend"}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={14} className="text-muted" />
                        {c.usedCount} / {c.maxUses || "∞"}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-muted" />
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                      </div>
                    </td>
                    <td>
                      <button 
                        onClick={() => toggleStatus(c.id, c.isActive)}
                        className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'} cursor-pointer border-none`}
                        title="Click to toggle"
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="btn btn-ghost btn-sm text-danger p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

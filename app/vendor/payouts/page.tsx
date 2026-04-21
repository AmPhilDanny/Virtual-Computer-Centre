"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Wallet,
  Info,
  Calendar
} from "lucide-react";

export default function VendorPayoutsPage() {
  const [data, setData] = useState<any>({ earnings: 0, payouts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    amount: 0,
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const fetchPayoutData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vendor/payouts");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setForm(prev => ({ ...prev, amount: json.earnings > 0 ? json.earnings : 0 }));
      }
    } catch (e) {
      console.error("Failed to fetch payout data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount > data.earnings) {
      alert("Insufficient available balance.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vendor/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchPayoutData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to submit request.");
      }
    } catch (e) {
      console.error("Payout request failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex-col gap-1">
          <h2 style={{ margin: 0 }}>Earnings & Payouts</h2>
          <p className="text-secondary" style={{ fontSize: "0.875rem" }}>Monitor your revenue and request withdrawals.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn btn-primary btn-md flex items-center gap-2"
          disabled={data.earnings <= 0}
        >
          <ArrowUpRight size={18} /> Request Withdrawal
        </button>
      </div>

      <div className="grid-3 gap-6">
         <div className="glass-card flex-col gap-3 bg-grad-primary text-white" style={{ border: "none" }}>
            <span style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: 700, textTransform: "uppercase" }}>Available to Withdraw</span>
            <div className="flex justify-between items-end">
               <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>₦{data.earnings.toLocaleString()}</span>
               <Wallet size={32} opacity={0.3} />
            </div>
         </div>
         <div className="glass-card flex-col gap-3 justify-center">
            <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Lifetime Earnings</span>
            <div className="flex justify-between items-center">
               <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>₦{data.lifetimeEarnings?.toLocaleString() || "0"}</span>
               <TrendingUp size={24} className="text-success" opacity={0.4} />
            </div>
         </div>
         <div className="glass-card flex-col gap-3 justify-center">
            <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Pending Payouts</span>
            <div className="flex justify-between items-center">
               <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>{data.payouts.filter((p: any) => p.status === 'PENDING').length}</span>
               <Clock size={24} className="text-warning" opacity={0.4} />
            </div>
         </div>
      </div>

      <div className="bg-warning-subtle p-6 rounded-2xl flex gap-4 border border-warning" style={{ background: "rgba(255, 179, 71, 0.05)" }}>
         <Info className="text-warning flex-shrink-0" size={24} />
         <div className="flex-col gap-2">
            <h5 style={{ margin: 0, color: "var(--brand-warning)" }}>Withdrawal Policy</h5>
            <p className="text-muted" style={{ fontSize: "0.85rem", margin: 0 }}>
               Payout requests are processed manually by our finance team. Please note that withdrawals typically take <strong>up to 5 working hours</strong> to arrive in your bank account once requested during business hours.
            </p>
         </div>
      </div>

      <div className="glass-card flex-col gap-6" style={{ padding: 0, overflow: "hidden" }}>
        <div className="p-6 border-b border-subtle">
           <h3 style={{ margin: 0 }}>Payout History</h3>
        </div>
        <table className="table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--bg-elevated)" }}>
            <tr>
              <th style={{ padding: "var(--space-4)" }}>Date</th>
              <th style={{ padding: "var(--space-4)" }}>Amount</th>
              <th style={{ padding: "var(--space-4)" }}>Bank Details</th>
              <th style={{ padding: "var(--space-4)" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "var(--space-8)" }}>Loading history...</td></tr>
            ) : data.payouts.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "var(--space-20)", color: "var(--text-muted)" }}>You haven't requested any payouts yet.</td></tr>
            ) : (
              data.payouts.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "var(--space-4)" }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted" />
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: "var(--space-4)", fontWeight: 700 }}>₦{p.amount.toLocaleString()}</td>
                  <td style={{ padding: "var(--space-4)", fontSize: "0.8rem" }}>
                    {p.bankName} - {p.accountNumber}
                  </td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <span className={`badge badge-${
                      p.status === 'PAID' ? 'success' : 
                      p.status === 'PENDING' ? 'warning' : 'danger'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Withdrawal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="glass-card flex-col gap-6 max-w-lg w-full bg-base shadow-2xl" style={{ padding: "var(--space-8)" }}>
             <h3 style={{ margin: 0 }}>Request Payout</h3>
             <form onSubmit={handleSubmitPayout} className="flex-col gap-4">
               <div className="form-group text-left">
                 <label className="form-label">Amount to Withdraw (₦)</label>
                 <input 
                   type="number" 
                   required
                   className="form-input" 
                   max={data.earnings}
                   value={form.amount}
                   onChange={(e) => setForm({...form, amount: parseFloat(e.target.value)})}
                 />
                 <p className="text-muted" style={{ fontSize: "0.7rem" }}>Maximum available: ₦{data.earnings.toLocaleString()}</p>
               </div>
               <div className="grid-2 gap-4">
                  <div className="form-group text-left">
                    <label className="form-label">Bank Name</label>
                    <input 
                      type="text" 
                      required
                      className="form-input" 
                      placeholder="e.g. Zenith Bank"
                      value={form.bankName}
                      onChange={(e) => setForm({...form, bankName: e.target.value})}
                    />
                  </div>
                  <div className="form-group text-left">
                    <label className="form-label">Account Number</label>
                    <input 
                      type="text" 
                      required
                      maxLength={10}
                      className="form-input" 
                      placeholder="0123456789"
                      value={form.accountNumber}
                      onChange={(e) => setForm({...form, accountNumber: e.target.value})}
                    />
                  </div>
               </div>
               <div className="form-group text-left">
                 <label className="form-label">Account Holder Name</label>
                 <input 
                   type="text" 
                   required
                   className="form-input" 
                   placeholder="Name on your bank account"
                   value={form.accountName}
                   onChange={(e) => setForm({...form, accountName: e.target.value})}
                 />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-md">Cancel</button>
                 <button type="submit" className="btn btn-primary btn-md" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Submit Request"}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

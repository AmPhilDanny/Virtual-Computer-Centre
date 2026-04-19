"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, ArrowUpRight, ArrowDownLeft, PlusCircle, 
  RefreshCw, History, Calendar, CheckCircle2, AlertCircle,
  Receipt
} from "lucide-react";
import FundWalletModal from "@/components/modals/FundWalletModal";
import ReceiptUploadButton from "@/components/order/ReceiptUploadButton";

export default function WalletPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
       setTimeout(fetchWalletData, 2000); 
    }
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const transactions = data?.transactions || [];
  const balance = data?.balance || 0;
  const totalSpent = transactions
    .filter((t: any) => t.type === "DEBIT")
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 4px", fontWeight: 800 }}>My Wallet</h2>
          <p className="text-secondary" style={{ fontSize: "0.875rem", margin: 0 }}>
            Manage your funds and track your transaction history.
          </p>
        </div>
        <button className="btn btn-primary btn-sm gap-2" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={16} /> Add Funds
        </button>
      </div>

      <div className="grid-3 gap-6">
        <MetricCard 
          label="Available Balance" 
          value={`₦${balance.toLocaleString()}`}
          icon={<CreditCard size={20} />} 
          color="var(--brand-primary)"
          bg="rgba(99,102,241,0.05)"
        />
        <MetricCard 
          label="Total Expenditure" 
          value={`₦${totalSpent.toLocaleString()}`}
          icon={<ArrowUpRight size={20} />} 
          color="var(--brand-success)"
          bg="rgba(0,200,83,0.05)"
        />
        <MetricCard 
          label="Recent Activity" 
          value={transactions.length}
          icon={<History size={20} />} 
          color="var(--brand-warning)"
          bg="rgba(255,193,7,0.05)"
        />
      </div>

      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
         <div className="flex justify-between items-center" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
           <div className="flex items-center gap-3">
             <div style={{ padding: 8, borderRadius: 8, background: "var(--bg-elevated)", color: "var(--brand-primary)" }}>
                 <History size={18} />
             </div>
             <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Transaction History</h3>
           </div>
         </div>

         {transactions.length === 0 ? (
           <div className="text-center py-20">
             <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Receipt size={32} style={{ opacity: 0.2 }} />
             </div>
             <p className="text-muted text-sm">You haven't made any transactions yet.</p>
           </div>
         ) : (
           <div style={{ overflowX: "auto" }}>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr style={{ background: "var(--bg-subtle)", textAlign: "left" }}>
                   <th style={{ padding: "12px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</th>
                   <th style={{ padding: "12px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                   <th style={{ padding: "12px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount</th>
                   <th style={{ padding: "12px 24px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.map((t: any) => (
                   <tr key={t.id} className="hover-row" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                     <td style={{ padding: "16px 24px" }}>
                        <div className="flex-col">
                            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.description || "N/A"}</span>
                            <div className="flex items-center gap-2 text-muted" style={{ fontSize: "0.7rem" }}>
                                <Calendar size={10} />
                                {new Date(t.createdAt).toLocaleDateString()}
                                {t.gateway && <span style={{ opacity: 0.5 }}>• {t.gateway}</span>}
                            </div>
                        </div>
                     </td>
                     <td style={{ padding: "16px 24px" }}>
                        <span className={`badge badge-${
                        t.status === 'SUCCESS' ? 'success' : 
                        t.status === 'PENDING' ? 'warning' : 'danger'
                        }`} style={{ fontSize: '0.7rem' }}>
                        {t.status}
                        </span>
                     </td>
                     <td style={{ padding: "16px 24px" }}>
                        <div className="flex-col">
                            <span style={{ fontWeight: 800, fontSize: "1rem", color: t.type === 'CREDIT' ? 'var(--brand-success)' : 'inherit' }}>
                                {t.type === 'CREDIT' ? '+' : '-'} ₦{t.amount.toLocaleString()}
                            </span>
                            <span className="text-muted" style={{ fontSize: "0.7rem" }}>Bal: ₦{t.balanceAfter.toLocaleString()}</span>
                        </div>
                     </td>
                     <td style={{ padding: "16px 24px" }}>
                        {t.status === 'PENDING' && t.gateway === 'MANUAL' ? (
                            t.proofUrl ? (
                                <div className="text-xs text-primary font-bold flex items-center gap-2 bg-primary-subtle px-3 py-1.5 rounded-full" style={{ width: 'fit-content' }}>
                                   <RefreshCw size={12} className="animate-spin" /> Verifying Transfer
                                </div>
                            ) : (
                                <ReceiptUploadButton type="WALLET" id={t.id} onSuccess={fetchWalletData} />
                            )
                        ) : (
                            <span className="text-muted" style={{ fontSize: "0.8rem" }}>—</span>
                        )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
      </div>
      
      <FundWalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchWalletData}
      />

      <style>{`
        .hover-row:hover { background: rgba(0,0,0,0.02); }
        [data-theme='dark'] .hover-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>
    </div>
  );
}

function MetricCard({ label, value, icon, color, bg }: any) {
    return (
      <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="flex justify-between items-start">
          <div className="flex-col gap-1">
            <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
            <span style={{ fontSize: "1.75rem", fontWeight: 900 }}>{value}</span>
          </div>
          <div style={{ 
            padding: 10, 
            borderRadius: 12, 
            background: bg, 
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {icon}
          </div>
        </div>
      </div>
    );
  }

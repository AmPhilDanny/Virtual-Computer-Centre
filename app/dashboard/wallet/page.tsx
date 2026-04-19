"use client";

import { useState, useEffect } from "react";
import { CreditCard, ArrowUpRight, ArrowDownLeft, PlusCircle, RefreshCw, History } from "lucide-react";
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
    
    // Check for success status in URL after Paystack redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
       setTimeout(fetchWalletData, 2000); 
    }
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
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
      <div className="grid-3" style={{ marginBottom: "var(--space-10)" }}>
        <div className="metric-card" style={{ borderColor: "var(--brand-primary)" }}>
          <div className="metric-card-label">Current Balance</div>
          <div className="metric-card-value">₦{balance.toLocaleString()}</div>
          <CreditCard className="metric-card-icon" style={{ color: "var(--brand-primary)" }} />
        </div>
        <div className="metric-card" style={{ borderColor: "var(--brand-success)" }}>
          <div className="metric-card-label">Total Spent</div>
          <div className="metric-card-value">₦{totalSpent.toLocaleString()}</div>
          <ArrowUpRight className="metric-card-icon" style={{ color: "var(--brand-success)" }} />
        </div>
        <div className="metric-card" style={{ borderColor: "var(--brand-warning)" }}>
          <div className="metric-card-label">Transaction Count</div>
          <div className="metric-card-value">{transactions.length}</div>
          <History className="metric-card-icon" style={{ color: "var(--brand-warning)" }} />
        </div>
      </div>

      <div className="glass-card" style={{ padding: "var(--space-8)" }}>
         <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-8)" }}>
           <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Wallet Transactions</h2>
           <button 
             className="btn btn-primary btn-sm"
             onClick={() => setIsModalOpen(true)}
           >
             <PlusCircle size={16} /> Fund Wallet
           </button>
         </div>

         {transactions.length === 0 ? (
           <div className="text-center" style={{ padding: "var(--space-12) 0" }}>
             <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>💳</div>
             <p className="text-muted">No transactions found in your history.</p>
           </div>
         ) : (
           <div style={{ overflowX: "auto" }}>
             <table className="table">
               <thead>
                 <tr>
                   <th>Date</th>
                   <th>Description</th>
                   <th>Status</th>
                   <th>Amount</th>
                   <th>Action / Info</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.map((t: any) => (
                   <tr key={t.id}>
                     <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                     <td style={{ maxWidth: "240px" }}>
                        <div className="flex-col">
                            <span className="font-medium">{t.description || "N/A"}</span>
                            {t.gateway && <span className="text-[0.65rem] text-muted uppercase font-bold">{t.gateway}</span>}
                        </div>
                     </td>
                     <td>
                        <div className="flex-col gap-1 items-start">
                             <span className={`badge badge-${
                                t.status === 'SUCCESS' ? 'success' : 
                                t.status === 'PENDING' ? 'warning' : 'danger'
                             }`}>
                                {t.status}
                             </span>
                        </div>
                     </td>
                     <td style={{ fontWeight: 800, color: t.type === 'CREDIT' ? 'var(--brand-success)' : 'var(--brand-danger)' }}>
                        {t.type === 'CREDIT' ? '+' : '-'} ₦{t.amount.toLocaleString()}
                     </td>
                     <td>
                        {t.status === 'PENDING' && t.gateway === 'MANUAL' ? (
                            t.proofUrl ? (
                                <span className="text-xs text-success font-bold flex items-center gap-1">
                                   <RefreshCw size={12} className="animate-spin" /> Verifying...
                                </span>
                            ) : (
                                <ReceiptUploadButton type="WALLET" id={t.id} onSuccess={fetchWalletData} />
                            )
                        ) : (
                            <span className="text-xs text-muted">₦{t.balanceAfter.toLocaleString()} (Bal)</span>
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
    </div>
  );
}

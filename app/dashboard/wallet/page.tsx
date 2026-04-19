"use client";

import { useState, useEffect } from "react";
import { CreditCard, ArrowUpRight, ArrowDownLeft, PlusCircle, RefreshCw, History } from "lucide-react";
import FundWalletModal from "@/components/modals/FundWalletModal";

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
       // Optional: show a toast or refresh data
       setTimeout(fetchWalletData, 2000); // Wait a bit for webhook to process
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
                   <th>Type</th>
                   <th>Amount</th>
                   <th>Balance After</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.map((t: any) => (
                   <tr key={t.id}>
                     <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                     <td>{t.description || "N/A"}</td>
                     <td>
                        <span className={`badge badge-${t.type === 'CREDIT' ? 'success' : 'danger'}`}>
                          {t.type}
                        </span>
                     </td>
                     <td style={{ fontWeight: 600, color: t.type === 'CREDIT' ? 'var(--brand-success)' : 'var(--brand-danger)' }}>
                        {t.type === 'CREDIT' ? '+' : '-'} ₦{t.amount.toLocaleString()}
                     </td>
                     <td>₦{t.balanceAfter.toLocaleString()}</td>
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

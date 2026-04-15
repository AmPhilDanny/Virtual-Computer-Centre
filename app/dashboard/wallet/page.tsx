import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreditCard, ArrowUpRight, ArrowDownLeft, PlusCircle } from "lucide-react";

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="flex-col gap-8">
      <div className="grid-3" style={{ marginBottom: "var(--space-10)" }}>
        <div className="metric-card" style={{ borderColor: "var(--brand-primary)" }}>
          <div className="metric-card-label">Current Balance</div>
          <div className="metric-card-value">₦0.00</div>
          <CreditCard className="metric-card-icon" style={{ color: "var(--brand-primary)" }} />
        </div>
        <div className="metric-card" style={{ borderColor: "var(--brand-success)" }}>
          <div className="metric-card-label">Total Spent</div>
          <div className="metric-card-value">₦0.00</div>
          <ArrowUpRight className="metric-card-icon" style={{ color: "var(--brand-success)" }} />
        </div>
        <div className="metric-card" style={{ borderColor: "var(--brand-warning)" }}>
          <div className="metric-card-label">Pending Payments</div>
          <div className="metric-card-value">₦0.00</div>
          <ArrowDownLeft className="metric-card-icon" style={{ color: "var(--brand-warning)" }} />
        </div>
      </div>

      <div className="glass-card" style={{ padding: "var(--space-8)" }}>
         <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-8)" }}>
           <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Wallet Transactions</h2>
           <button className="btn btn-primary btn-sm">
             <PlusCircle size={16} /> Fund Wallet
           </button>
         </div>

         <div className="text-center" style={{ padding: "var(--space-12) 0" }}>
           <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>💳</div>
           <p className="text-muted">No transactions found in your history.</p>
         </div>
      </div>
    </div>
  );
}

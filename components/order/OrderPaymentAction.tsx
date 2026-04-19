"use client";

import { useState } from "react";
import { CreditCard, Wallet, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

interface OrderPaymentActionProps {
  jobId: string;
  orderId: string;
  totalAmount: number;
  walletBalance: number;
}

export default function OrderPaymentAction({ 
  jobId, 
  orderId, 
  totalAmount, 
  walletBalance 
}: OrderPaymentActionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (method: "WALLET" | "DIRECT" | "MIXED") => {
    setLoading(true);
    setError(null);

    let walletAmount = 0;
    if (method === "MIXED") {
        walletAmount = Math.min(walletBalance, totalAmount - 1);
    }

    try {
      const res = await fetch(`/api/jobs/${jobId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            paymentMethod: method,
            walletAmount
        })
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.success) {
        window.location.reload(); // Refresh to show deliverables
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const canUseWallet = walletBalance >= totalAmount;
  const canUseMixed = walletBalance > 0 && walletBalance < totalAmount;

  return (
    <div className="glass-card" style={{ padding: "var(--space-6)", border: "1px solid var(--brand-primary)" }}>
      <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-2)" }} className="flex items-center gap-2">
        <CreditCard size={18} className="text-primary" /> 
        Payment Required
      </h3>
      <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>
        Please settle the standing order to access your completed documents. 
        Your current wallet balance is <strong>₦{walletBalance.toLocaleString()}</strong>.
      </p>

      {error && (
        <div style={{ 
          padding: "var(--space-3)", background: "rgba(255,71,87,0.1)", 
          border: "1px solid var(--brand-danger)", borderRadius: "var(--radius-md)",
          color: "var(--brand-danger)", fontSize: "0.875rem", marginBottom: "var(--space-4)"
        }}>
          {error}
        </div>
      )}

      <div className="flex-col gap-3">
        {canUseWallet && (
          <button 
            className="btn btn-primary w-full justify-between py-5"
            onClick={() => handlePay("WALLET")}
            disabled={loading}
          >
            <div className="flex items-center gap-3">
               <Wallet size={20} />
               <div className="flex-col items-start">
                 <span style={{ fontSize: "0.95rem" }}>Pay with Wallet Full</span>
                 <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Deduct ₦{totalAmount.toLocaleString()} from balance</span>
               </div>
            </div>
            <ArrowRight size={18} />
          </button>
        )}

        {canUseMixed && (
          <button 
            className="btn btn-ghost w-full justify-between py-5"
            onClick={() => handlePay("MIXED")}
            disabled={loading}
            style={{ borderColor: "var(--brand-primary)" }}
          >
             <div className="flex items-center gap-3">
               <ShieldCheck size={20} />
               <div className="flex-col items-start text-left">
                 <span style={{ fontSize: "0.95rem" }}>Mixed Payment</span>
                 <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                   Use ₦{walletBalance.toLocaleString()} from wallet + ₦{(totalAmount - walletBalance).toLocaleString()} via Card
                 </span>
               </div>
            </div>
            <ArrowRight size={18} />
          </button>
        )}

        <button 
          className="btn btn-secondary w-full justify-between py-5"
          onClick={() => handlePay("DIRECT")}
          disabled={loading}
        >
          <div className="flex items-center gap-3">
             <CreditCard size={20} />
             <div className="flex-col items-start text-left">
               <span style={{ fontSize: "0.95rem" }}>Pay Directly (Card/Bank)</span>
               <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Pay full ₦{totalAmount.toLocaleString()} via Paystack</span>
             </div>
          </div>
          <ArrowRight size={18} />
        </button>

        {loading && (
           <div className="flex items-center justify-center gap-2 text-primary font-semibold mt-2">
              <Loader2 size={18} className="animate-spin" /> Initializing secure payment...
           </div>
        )}
      </div>
    </div>
  );
}

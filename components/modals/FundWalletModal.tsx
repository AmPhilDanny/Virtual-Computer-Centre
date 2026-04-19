"use client";

import { useState } from "react";
import { X, CreditCard, Loader2, CheckCircle2 } from "lucide-react";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FundWalletModal({ isOpen, onClose, onSuccess }: FundWalletModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFund = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          gateway: "paystack"
        })
      });

      const data = await res.json();

      if (data.authorization_url) {
        // Redirect to Paystack
        window.location.href = data.authorization_url;
      } else {
        throw new Error(data.error || "Failed to initialize payment");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "420px" }}
      >
        <div className="modal-header">
          <h3 className="modal-title flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            Fund Your Wallet
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-col gap-5">
          <p className="text-secondary text-sm">
            Enter the amount you'd like to add to your wallet. You can use this balance to pay for any service.
          </p>

          <div className="form-group">
            <label className="form-label">Amount (₦)</label>
            <div style={{ position: "relative" }}>
              <span style={{ 
                position: "absolute", left: "12px", top: "50%", 
                transform: "translateY(-50%)", color: "var(--text-muted)",
                fontWeight: 600, zIndex: 10
              }}>₦</span>
              <input 
                type="number" 
                className="form-input" 
                placeholder="0.00"
                style={{ paddingLeft: "32px" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
              />
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Min: ₦100.00
            </p>
          </div>

          {error && (
            <div style={{ 
              padding: "var(--space-3)", background: "rgba(255,71,87,0.1)", 
              border: "1px solid var(--brand-danger)", borderRadius: "var(--radius-md)",
              color: "var(--brand-danger)", fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          <div className="flex gap-3">
             <button 
               className="btn btn-ghost flex-1" 
               onClick={onClose}
               disabled={loading}
             >
               Cancel
             </button>
             <button 
               className="btn btn-primary flex-1"
               onClick={handleFund}
               disabled={loading || !amount}
             >
               {loading ? (
                 <>
                   <Loader2 size={18} className="animate-spin" /> Processing...
                 </>
               ) : (
                 "Fund Now"
               )}
             </button>
          </div>

          <div className="flex items-center justify-center gap-2" style={{ opacity: 0.5, fontSize: "0.75rem" }}>
             <CheckCircle2 size={12} />
             Secure payment via Paystack
          </div>
        </div>
      </div>
    </div>
  );
}

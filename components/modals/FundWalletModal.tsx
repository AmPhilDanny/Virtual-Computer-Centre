"use client";

import { useState } from "react";
import { X, CreditCard, Loader2, CheckCircle2 } from "lucide-react";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FundWalletModal({ isOpen, onClose, onSuccess }: FundWalletModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState<string>("");
  const [gateway, setGateway] = useState<"paystack" | "flutterwave" | "manual">("paystack");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState<any>(null);

  useState(() => {
    fetch("/api/admin/settings").then(res => res.json()).then(data => {
        setBankDetails({
            bankName: data.bankName || "Pending",
            accountName: data.accountName || "Virtual Computer Centre",
            accountNumber: data.accountNumber || "0000000000"
        });
    }).catch(() => {});
  });

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
          gateway
        })
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.success) {
        onSuccess();
        onClose();
        alert(data.message);
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
        style={{ maxWidth: "440px" }}
      >
        <div className="modal-header">
          <h3 className="modal-title flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            {step === 1 ? "Fund Your Wallet" : "Select Payment Method"}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-col gap-5">
          {step === 1 ? (
             <>
                <p className="text-secondary text-sm">
                    Enter the amount you'd like to add to your wallet.
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
                </div>
                <button 
                    className="btn btn-primary w-full py-4"
                    onClick={() => setStep(2)}
                    disabled={!amount || parseFloat(amount) < 100}
                >
                    Next
                </button>
             </>
          ) : (
            <>
              <div className="flex-col gap-3">
                 <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${gateway === "paystack" ? "border-primary bg-primary-subtle" : "border-subtle"}`}
                   onClick={() => setGateway("paystack")}>
                    <input type="radio" checked={gateway === "paystack"} readOnly className="accent-primary" />
                    <div className="flex-col">
                        <span style={{ fontWeight: 600 }}>Paystack</span>
                        <span className="text-xs text-muted">Card, Bank Transfer, USSD</span>
                    </div>
                 </label>

                 <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${gateway === "flutterwave" ? "border-primary bg-primary-subtle" : "border-subtle"}`}
                   onClick={() => setGateway("flutterwave")}>
                    <input type="radio" checked={gateway === "flutterwave"} readOnly className="accent-primary" />
                    <div className="flex-col">
                        <span style={{ fontWeight: 600 }}>Flutterwave</span>
                        <span className="text-xs text-muted">Card, Bank Transfer, Mobile Money</span>
                    </div>
                 </label>

                 <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${gateway === "manual" ? "border-primary bg-primary-subtle" : "border-subtle"}`}
                   onClick={() => setGateway("manual")}>
                    <input type="radio" checked={gateway === "manual"} readOnly className="accent-primary" />
                    <div className="flex-col">
                        <span style={{ fontWeight: 600 }}>Manual Bank Transfer</span>
                        <span className="text-xs text-muted">Pay directly to our account</span>
                    </div>
                 </label>
              </div>

              {gateway === "manual" && bankDetails && (
                <div className="bg-info-subtle p-4 rounded-xl border border-info flex-col gap-1 text-sm">
                   <div className="flex justify-between">
                       <span className="text-muted">Bank Name:</span>
                       <span style={{ fontWeight: 600 }}>{bankDetails.bankName}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-muted">Account Name:</span>
                       <span style={{ fontWeight: 600 }}>{bankDetails.accountName}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-muted">Account Number:</span>
                       <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "var(--brand-primary)" }}>{bankDetails.accountNumber}</span>
                   </div>
                   <div className="mt-2 text-xs text-info" style={{ opacity: 0.8 }}>
                       * Please include your email in the transfer narration.
                   </div>
                </div>
              )}

              {error && (
                <div className="bg-danger-subtle p-3 rounded-lg border border-danger text-danger text-sm">
                {error}
                </div>
              )}

              <div className="flex gap-3">
                <button className="btn btn-ghost flex-1" onClick={() => setStep(1)} disabled={loading}>
                    Back
                </button>
                <button className="btn btn-primary flex-1" onClick={handleFund} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

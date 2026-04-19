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
  const [gateway, setGateway] = useState<"PAYSTACK" | "FLUTTERWAVE" | "MANUAL">("PAYSTACK");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [receipt, setReceipt] = useState<File | null>(null);

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
        // Handle receipt upload for manual funding if provided
        if (gateway === "MANUAL" && receipt && data.transaction?.id) {
            const formData = new FormData();
            formData.append("type", "WALLET");
            formData.append("id", data.transaction.id);
            formData.append("receipt", receipt);

            await fetch("/api/payments/upload-receipt", {
                method: "POST",
                body: formData
            });
        }

        onSuccess();
        onClose();
        alert(data.message || "Request submitted successfully.");
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
            {step === 1 ? "Fund Your Wallet" : "Confirm Funding"}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-col gap-6">
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
                        style={{ paddingLeft: "32px", fontSize: "1.1rem", fontWeight: 700 }}
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
                    Review & Continue
                </button>
             </>
          ) : (
            <>
              {/* Summary Breakdown */}
              <div className="bg-surface p-4 rounded-xl border-dashed border-subtle flex justify-between items-center">
                  <span className="text-secondary text-sm">Funding Amount</span>
                  <span className="text-primary font-bold" style={{ fontSize: "1.2rem" }}>₦{parseFloat(amount).toLocaleString()}</span>
              </div>

              <div className="flex-col gap-3">
                 <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${gateway === "PAYSTACK" ? "border-primary bg-primary-subtle" : "border-subtle"}`}
                   onClick={() => setGateway("PAYSTACK")}>
                    <input type="radio" checked={gateway === "PAYSTACK"} readOnly className="accent-primary" />
                    <div className="flex-col">
                        <span style={{ fontWeight: 600 }}>Paystack</span>
                        <span className="text-xs text-muted">Instant Credit (Card, Transfer, USSD)</span>
                    </div>
                 </label>

                 <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${gateway === "FLUTTERWAVE" ? "border-primary bg-primary-subtle" : "border-subtle"}`}
                   onClick={() => setGateway("FLUTTERWAVE")}>
                    <input type="radio" checked={gateway === "FLUTTERWAVE"} readOnly className="accent-primary" />
                    <div className="flex-col">
                        <span style={{ fontWeight: 600 }}>Flutterwave</span>
                        <span className="text-xs text-muted">Instant Credit (Card, Mobile Money)</span>
                    </div>
                 </label>

                 <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${gateway === "MANUAL" ? "border-primary bg-primary-subtle" : "border-subtle"}`}
                   onClick={() => setGateway("MANUAL")}>
                    <input type="radio" checked={gateway === "MANUAL"} readOnly className="accent-primary" />
                    <div className="flex-col">
                        <span style={{ fontWeight: 600 }}>Manual Bank Transfer</span>
                        <span className="text-xs text-muted">Verification required (1-24 hours)</span>
                    </div>
                 </label>
              </div>

              {gateway === "MANUAL" && bankDetails && (
                <div className="bg-info-subtle p-5 rounded-xl border border-info flex-col gap-4">
                   <div className="flex-col gap-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted">Bank:</span>
                            <span style={{ fontWeight: 600 }}>{bankDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">Account Name:</span>
                            <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>{bankDetails.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">Number:</span>
                            <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--brand-primary)" }}>{bankDetails.accountNumber}</span>
                        </div>
                   </div>

                   <hr style={{ border: "none", borderTop: "1px dashed var(--border-info)", opacity: 0.3 }} />

                   <div className="flex-col gap-2">
                        <label className="text-xs font-semibold text-secondary">Upload Proof of Payment (Optional)</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="form-input text-xs" 
                            style={{ padding: "8px" }}
                            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                        />
                   </div>
                </div>
              )}

              {error && (
                <div className="bg-danger-subtle p-3 rounded-lg border border-danger text-danger text-sm">
                {error}
                </div>
              )}

              <div className="flex gap-3">
                <button className="btn btn-ghost flex-1 py-4" onClick={() => setStep(1)} disabled={loading}>
                    Back
                </button>
                <button className="btn btn-primary flex-1 py-4" onClick={handleFund} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Complete Process"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

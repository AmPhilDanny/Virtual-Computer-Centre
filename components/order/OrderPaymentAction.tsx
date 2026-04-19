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
  const [receipt, setReceipt] = useState<File | null>(null);
  const [showManualInfo, setShowManualInfo] = useState(false);
  const [bankDetails, setBankDetails] = useState<{ bankName: string; accountName: string; accountNumber: string } | null>(null);

  const fetchBankDetails = async () => {
    try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setBankDetails({
            bankName: data.bankName || "Pending",
            accountName: data.accountName || "Virtual Computer Centre",
            accountNumber: data.accountNumber || "0000000000"
        });
    } catch {}
  };

  const handlePay = async (method: "WALLET" | "DIRECT" | "MIXED" | "MANUAL", gateway?: string) => {
    if (loading) return;
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
            walletAmount,
            gateway
        })
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.success) {
        // If manual and has receipt, upload it now
        if (method === "MANUAL" && receipt) {
            const formData = new FormData();
            formData.append("type", "ORDER");
            formData.append("id", orderId);
            formData.append("receipt", receipt);
            
            await fetch("/api/payments/upload-receipt", {
                method: "POST",
                body: formData
            });
        }

        if (method === "MANUAL") {
            alert(data.message || "Payment notification sent. Please wait for admin verification.");
        }
        window.location.reload(); 
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const netTotal = Math.max(0, totalAmount - (walletBalance > 0 && totalAmount > walletBalance ? walletBalance : 0));
  const walletDeduction = totalAmount > walletBalance ? walletBalance : totalAmount;

  return (
    <div className="glass-card flex-col gap-8" style={{ padding: "var(--space-8)", border: "1px solid var(--brand-primary)" }}>
      {/* Invoice Breakdown */}
      <div className="flex-col gap-4 bg-surface rounded-2xl p-6 border-subtle">
          <div className="flex justify-between items-center pb-2 border-b-subtle">
              <span className="text-secondary font-medium">Service Subtotal</span>
              <span className="font-bold">₦{totalAmount.toLocaleString()}</span>
          </div>
          
          {(walletBalance > 0) && (
              <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Wallet Contribution</span>
                  <span className="text-success font-medium">-₦{walletDeduction.toLocaleString()}</span>
              </div>
          )}

          <div className="flex justify-between items-center pt-2">
              <span className="text-primary font-bold" style={{ fontSize: "1.1rem" }}>Total to Pay</span>
              <span className="text-primary font-bold" style={{ fontSize: "1.25rem" }}>
                ₦{ (walletBalance >= totalAmount ? 0 : netTotal).toLocaleString() }
              </span>
          </div>
      </div>

      <div className="flex-col gap-2">
          <h3 style={{ fontSize: "1.25rem", margin: 0 }} className="flex items-center gap-2">
            <CreditCard size={22} className="text-primary" /> 
            Payment Gateway
          </h3>
          <p className="text-muted" style={{ fontSize: "0.85rem" }}>
            Select your preferred method to complete this order. 
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

      <div className="flex-col gap-5">
        {/* Wallet Options */}
        {walletBalance >= totalAmount && (
          <button className="btn btn-primary w-full justify-between py-6" onClick={() => handlePay("WALLET")} disabled={loading}>
            <div className="flex items-center gap-4 text-left">
               <Wallet size={24} />
               <div className="flex-col">
                 <span style={{ fontWeight: 600 }}>Pay with Wallet</span>
                 <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Balance: ₦{walletBalance.toLocaleString()}</span>
               </div>
            </div>
            <ArrowRight size={20} />
          </button>
        )}

        {walletBalance > 0 && walletBalance < totalAmount && (
          <button className="btn btn-ghost w-full justify-between py-6 border-primary" onClick={() => handlePay("MIXED", "paystack")} disabled={loading}>
             <div className="flex items-center gap-4 text-left">
               <ShieldCheck size={24} className="text-primary" />
               <div className="flex-col text-primary">
                 <span style={{ fontWeight: 600 }}>Mixed Payment</span>
                 <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                   Wallet (₦{walletBalance.toLocaleString()}) + Card (₦{netTotal.toLocaleString()})
                 </span>
               </div>
            </div>
            <ArrowRight size={20} />
          </button>
        )}

        <div className="grid-2 gap-3">
            <button className="btn btn-secondary w-full py-5 flex-col items-center gap-2" onClick={() => handlePay("DIRECT", "paystack")} disabled={loading}>
                <CreditCard size={20} />
                <span style={{ fontSize: "0.85rem" }}>Paystack</span>
            </button>
            <button className="btn btn-secondary w-full py-5 flex-col items-center gap-2" onClick={() => handlePay("DIRECT", "flutterwave")} disabled={loading}>
                <ShieldCheck size={20} />
                <span style={{ fontSize: "0.85rem" }}>Flutterwave</span>
            </button>
        </div>

        {/* Manual Option */}
        <button className="btn btn-ghost w-full py-2 text-xs" onClick={() => { setShowManualInfo(!showManualInfo); if (!bankDetails) fetchBankDetails(); }}>
            {showManualInfo ? "Hide Bank Details" : "Show Manual Bank Transfer Options"}
        </button>

        {showManualInfo && bankDetails && (
            <div className="bg-info-subtle border border-info p-6 rounded-2xl flex-col gap-6 animate-in fade-in slide-in-from-top-2">
                <div className="flex-col gap-3 text-sm">
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
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--brand-primary)" }}>{bankDetails.accountNumber}</span>
                    </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px dashed var(--border-subtle)" }} />
                
                <div className="flex-col gap-2">
                    <label className="text-xs font-semibold text-secondary">Upload Payment Receipt (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                      className="form-input text-xs"
                      style={{ padding: "8px" }}
                    />
                    <p className="text-[0.7rem] text-muted">You can also upload this later from your dashboard.</p>
                </div>

                <button className="btn btn-primary w-full py-4 text-sm gap-2" onClick={() => handlePay("MANUAL")} disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    Notify Admin of Transfer
                </button>
            </div>
        )}

        {loading && !showManualInfo && (
           <div className="flex items-center justify-center gap-2 text-primary font-semibold mt-2">
              <Loader2 size={18} className="animate-spin" /> Processing request...
           </div>
        )}
      </div>
    </div>
  );
}

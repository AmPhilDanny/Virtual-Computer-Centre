"use client";

import { useState } from "react";
import { 
  CreditCard, Wallet, Loader2, ArrowRight, ShieldCheck, 
  CheckCircle, Building2, Landmark, AlertCircle
} from "lucide-react";

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
  const [success, setSuccess] = useState<string | null>(null);
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
    setSuccess(null);

    let walletAmount = 0;
    if (method === "MIXED") {
      walletAmount = Math.min(walletBalance, totalAmount - 1);
    }

    try {
      const res = await fetch(`/api/jobs/${jobId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: method, walletAmount, gateway })
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.success) {
        if (method === "MANUAL" && receipt) {
          const formData = new FormData();
          formData.append("type", "ORDER");
          formData.append("id", orderId);
          formData.append("receipt", receipt);
          await fetch("/api/payments/upload-receipt", { method: "POST", body: formData });
        }
        if (method === "MANUAL") {
          setSuccess(data.message || "Payment notification sent. Admin will verify shortly.");
          setLoading(false);
        } else {
          window.location.reload();
        }
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const walletCoversAll = walletBalance >= totalAmount;
  const hasPartialWallet = walletBalance > 0 && walletBalance < totalAmount;
  const walletDeduction = walletCoversAll ? totalAmount : walletBalance;
  const netToPay = walletCoversAll ? 0 : totalAmount - (hasPartialWallet ? walletBalance : 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Invoice Summary Card */}
      <div className="glass-card" style={{ padding: "28px 28px 20px" }}>
        <h3 style={{ margin: "0 0 18px", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <CreditCard size={18} className="text-primary" /> Invoice Summary
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="text-secondary" style={{ fontSize: "0.9rem" }}>Service Subtotal</span>
            <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>₦{totalAmount.toLocaleString()}</span>
          </div>
          {walletBalance > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-secondary" style={{ fontSize: "0.875rem" }}>
                Wallet Balance Available
              </span>
              <span style={{ color: "var(--brand-success)", fontWeight: 600, fontSize: "0.9rem" }}>
                ₦{walletBalance.toLocaleString()}
              </span>
            </div>
          )}
          {hasPartialWallet && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-secondary" style={{ fontSize: "0.875rem" }}>Wallet Deduction</span>
              <span style={{ color: "var(--brand-success)", fontWeight: 600 }}>−₦{walletDeduction.toLocaleString()}</span>
            </div>
          )}
          <div style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: 14, borderTop: "1px solid var(--border-subtle)"
          }}>
            <span style={{ fontWeight: 800, fontSize: "1rem" }}>Total to Pay</span>
            <span style={{ fontWeight: 900, fontSize: "1.5rem", color: "var(--brand-primary)" }}>
              ₦{netToPay.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div style={{ 
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "14px 18px", background: "var(--brand-danger-subtle)", 
          border: "1px solid var(--brand-danger)", borderRadius: 12,
          color: "var(--brand-danger)", fontSize: "0.875rem"
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          padding: "20px", background: "var(--brand-success-subtle)", 
          border: "1px solid var(--brand-success)", borderRadius: 12,
          color: "var(--brand-success)", textAlign: "center"
        }}>
          <CheckCircle size={28} />
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{success}</span>
          <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>You can track the status from your order page.</span>
        </div>
      )}

      {/* Payment Gateway Selection */}
      {!success && (
        <div className="glass-card" style={{ padding: "28px" }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 700 }}>Choose Payment Method</h3>
            <p className="text-muted" style={{ fontSize: "0.825rem", margin: 0 }}>
              Select how you'd like to complete this order.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Wallet Full Payment */}
            {walletCoversAll && (
              <button 
                className="btn btn-primary"
                style={{ justifyContent: "space-between", padding: "18px 20px", width: "100%" }}
                onClick={() => handlePay("WALLET")} 
                disabled={loading}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Wallet size={22} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700 }}>Pay with Wallet</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Balance: ₦{walletBalance.toLocaleString()}</div>
                  </div>
                </div>
                <ArrowRight size={20} />
              </button>
            )}

            {/* Mixed Payment */}
            {hasPartialWallet && (
              <button 
                className="btn btn-ghost"
                style={{ 
                  justifyContent: "space-between", padding: "18px 20px", width: "100%",
                  borderColor: "var(--brand-primary)", color: "var(--brand-primary)"
                }}
                onClick={() => handlePay("MIXED", "paystack")} 
                disabled={loading}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <ShieldCheck size={22} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700 }}>Mixed Payment</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                      Wallet (₦{walletBalance.toLocaleString()}) + Card (₦{netToPay.toLocaleString()})
                    </div>
                  </div>
                </div>
                <ArrowRight size={20} />
              </button>
            )}

            {/* Online Gateways */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button 
                className="btn btn-secondary"
                style={{ 
                  flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "18px 12px", width: "100%"
                }}
                onClick={() => handlePay("DIRECT", "paystack")} 
                disabled={loading}
              >
                <CreditCard size={22} />
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Paystack</span>
                <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>Card / Transfer</span>
              </button>
              <button 
                className="btn btn-secondary"
                style={{ 
                  flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "18px 12px", width: "100%"
                }}
                onClick={() => handlePay("DIRECT", "flutterwave")} 
                disabled={loading}
              >
                <ShieldCheck size={22} />
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Flutterwave</span>
                <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>Card / Mobile</span>
              </button>
            </div>

            {/* Manual Transfer Toggle */}
            <button 
              className="btn btn-ghost"
              style={{ padding: "10px", fontSize: "0.8rem", justifyContent: "center", gap: 6 }}
              onClick={() => { setShowManualInfo(!showManualInfo); if (!bankDetails) fetchBankDetails(); }}
            >
              <Landmark size={14} />
              {showManualInfo ? "Hide Bank Transfer Details" : "Pay via Manual Bank Transfer"}
            </button>

            {/* Manual Transfer Panel */}
            {showManualInfo && (
              <div style={{
                padding: "20px 22px", borderRadius: 14,
                background: "var(--bg-info-subtle)", border: "1px solid var(--border-info)",
                display: "flex", flexDirection: "column", gap: 18
              }}>
                {!bankDetails ? (
                  <div className="flex items-center justify-center gap-2 text-muted">
                    <Loader2 size={16} className="animate-spin" /> Loading bank details...
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <Building2 size={18} className="text-primary" />
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Bank Transfer Details</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { label: "Bank Name", value: bankDetails.bankName },
                        { label: "Account Name", value: bankDetails.accountName },
                        { label: "Account Number", value: bankDetails.accountNumber },
                        { label: "Amount", value: `₦${totalAmount.toLocaleString()}` },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="text-muted" style={{ fontSize: "0.825rem" }}>{label}</span>
                          <span style={{ 
                            fontWeight: label === "Account Number" || label === "Amount" ? 800 : 600,
                            fontSize: label === "Account Number" || label === "Amount" ? "1.05rem" : "0.9rem",
                            color: label === "Account Number" || label === "Amount" ? "var(--brand-primary)" : "inherit"
                          }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: 16 }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                        Upload Payment Receipt <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional — you can do this later)</span>
                      </label>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                        className="form-input"
                        style={{ padding: "10px", fontSize: "0.8rem" }}
                      />
                    </div>

                    <button 
                      className="btn btn-primary gap-2" 
                      style={{ width: "100%", padding: "14px", justifyContent: "center" }}
                      onClick={() => handlePay("MANUAL")} 
                      disabled={loading}
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                      I've Made the Transfer — Notify Admin
                    </button>
                  </>
                )}
              </div>
            )}

            {loading && !showManualInfo && (
              <div className="flex items-center justify-center gap-2 text-primary" style={{ padding: "10px", fontWeight: 600 }}>
                <Loader2 size={18} className="animate-spin" /> Processing...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

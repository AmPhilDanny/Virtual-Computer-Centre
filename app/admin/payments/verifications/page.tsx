"use client";

import { useState, useEffect } from "react";
import { Landmark, Check, X, User, Calendar, ExternalLink, ShieldCheck, Wallet, Loader2, AlertCircle } from "lucide-react";

export default function VerificationsPage() {
  const [data, setData] = useState<any>({ walletPending: [], manualOrders: [] });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/payments/verifications");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (type: 'WALLET' | 'ORDER', id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this payment?`)) return;

    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/payments/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, action })
      });

      if (res.ok) {
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to process action");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const hasPending = data.walletPending.length > 0 || data.manualOrders.length > 0;

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex-col gap-1">
          <h2 style={{ fontSize: "1.5rem", margin: 0 }} className="flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Manual Payment Verifications
          </h2>
          <p className="text-secondary text-sm">Review and approve bank transfer notifications from clients.</p>
        </div>
      </div>

      {!hasPending && (
          <div className="glass-card flex-col items-center justify-center p-20 gap-4" style={{ minHeight: "300px" }}>
              <div className="bg-success-subtle p-6 rounded-full">
                  <Check size={40} className="text-success" />
              </div>
              <p className="text-secondary">No pending verifications found. All clear!</p>
          </div>
      )}

      {data.walletPending.length > 0 && (
          <div className="flex-col gap-4">
              <h3 className="flex items-center gap-2" style={{ fontSize: "1.1rem", margin: 0 }}>
                  <Wallet size={18} className="text-primary" /> Wallet Funding Requests
              </h3>
              <div className="grid-1 gap-4">
                  {data.walletPending.map((tx: any) => (
                      <VerificationCard 
                        key={tx.id} 
                        item={tx} 
                        type="WALLET" 
                        onAction={handleAction} 
                        processing={processingId === tx.id}
                      />
                  ))}
              </div>
          </div>
      )}

      {data.manualOrders.length > 0 && (
          <div className="flex-col gap-4">
              <h3 className="flex items-center gap-2" style={{ fontSize: "1.1rem", margin: 0 }}>
                  <Landmark size={18} className="text-primary" /> Direct Order Payments
              </h3>
              <div className="grid-1 gap-4">
                  {data.manualOrders.map((order: any) => (
                      <VerificationCard 
                        key={order.id} 
                        item={order} 
                        type="ORDER" 
                        onAction={handleAction}
                        processing={processingId === order.id}
                      />
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}

function VerificationCard({ item, type, onAction, processing }: any) {
    const isOrder = type === "ORDER";
    const amount = item.amount || item.total;
    const title = isOrder ? `Order #${item.id.slice(-6).toUpperCase()}` : "Wallet Funding";
    const user = item.user;

    return (
        <div className="glass-card flex items-center justify-between p-6 gap-6 hover-lift border-subtle">
            <div className="flex items-center gap-6 flex-1">
                <div className={`p-4 rounded-2xl ${isOrder ? 'bg-indigo-subtle' : 'bg-primary-subtle'}`}>
                    {isOrder ? <Landmark size={24} className="text-indigo" /> : <Wallet size={24} className="text-primary" />}
                </div>
                
                <div className="flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 700, fontSize: "1rem" }}>{title}</span>
                        <span className="badge badge-warning">PENDING</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary">
                        <span className="flex items-center gap-1"><User size={14} /> {user.name} ({user.email})</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(item.createdAt).toLocaleString()}</span>
                        {isOrder && <span className="text-indigo">Job: {item.job?.title}</span>}
                    </div>
                    {item.proofUrl && (
                        <a href={item.proofUrl} target="_blank" className="flex items-center gap-1 text-xs text-primary font-semibold mt-2">
                            <ExternalLink size={12} /> View Uploaded Proof
                        </a>
                    )}
                </div>

                <div className="flex-col items-end gap-1">
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        ₦{amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted">Requested Amount</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button 
                  className="btn btn-ghost text-danger border-danger hover:bg-danger hover:text-white px-4"
                  onClick={() => onAction(type, item.id, 'REJECT')}
                  disabled={processing}
                >
                    <X size={18} />
                </button>
                <button 
                  className="btn btn-primary px-6 gap-2"
                  onClick={() => onAction(type, item.id, 'APPROVE')}
                  disabled={processing}
                >
                    {processing ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    Approve
                </button>
            </div>
        </div>
    );
}

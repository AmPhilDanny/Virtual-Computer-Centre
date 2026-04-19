"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ReceiptUploadButtonProps {
  type: "WALLET" | "ORDER";
  id: string;
  onSuccess?: () => void;
}

export default function ReceiptUploadButton({ type, id, onSuccess }: ReceiptUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("idle");
    setError(null);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("id", id);
    formData.append("receipt", file);

    try {
      const res = await fetch("/api/payments/upload-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        if (onSuccess) onSuccess();
      } else {
        throw new Error(data.error || "Failed to upload receipt");
      }
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-success text-sm font-semibold bg-success-subtle p-3 rounded-lg">
        <CheckCircle2 size={16} /> Receipt Uploaded
      </div>
    );
  }

  return (
    <div className="flex-col gap-2">
      <label className="btn btn-secondary btn-sm flex items-center gap-2 cursor-pointer relative">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading..." : "Upload Payment Receipt"}
        <input 
          type="file" 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      {status === "error" && (
        <span className="text-[0.7rem] text-danger flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

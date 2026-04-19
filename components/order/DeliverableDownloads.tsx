"use client";

import { Download } from "lucide-react";

interface DeliverableDownloadsProps {
  aiOutput: string | null | undefined;
  title: string;
  attachments: string[];
}

export default function DeliverableDownloads({ aiOutput, title, attachments }: DeliverableDownloadsProps) {
  const safeName = title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");

  const downloadTxt = () => {
    const blob = new Blob([aiOutput || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(aiOutput || "", 180);
    doc.text(lines, 15, 15);
    doc.save(`${safeName}.pdf`);
  };

  const downloadWord = () => {
    const content = `<html><body>${(aiOutput || "").replace(/\n/g, "<br>")}</body></html>`;
    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {aiOutput && (
        <div>
          <div style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 12
          }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Text Content
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { label: "TXT", action: downloadTxt },
                { label: "PDF", action: downloadPdf },
                { label: "WORD", action: downloadWord },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: "0.7rem", padding: "4px 10px" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-5)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            maxHeight: "40vh",
            overflowY: "auto",
            fontFamily: "inherit"
          }}>
            {aiOutput}
          </div>
        </div>
      )}

      {attachments?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Attached Documents
          </span>
          {attachments.map((url: string, i: number) => {
            const fileName = url.split("/").pop() || `Deliverable_${i + 1}`;
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                download={fileName}
                className="btn w-full justify-between"
                style={{ 
                  background: "rgba(108,71,255,0.1)", 
                  color: "var(--brand-primary)", 
                  border: "1px solid var(--border-medium)",
                  padding: "14px 18px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Download size={18} />
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{fileName}</span>
                </div>
                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>DOWNLOAD</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

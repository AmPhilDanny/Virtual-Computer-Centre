"use client";

import { useState, useRef } from "react";
import { Download, Loader2, FileText, File as FileIcon, FileType } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface DeliverableDownloadsProps {
  aiOutput: string | null | undefined;
  title: string;
  attachments: string[];
}

export default function DeliverableDownloads({ aiOutput, title, attachments }: DeliverableDownloadsProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const hiddenRenderRef = useRef<HTMLDivElement>(null);
  const safeName = title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");

  const getCleanHtml = () => {
    if (!aiOutput) return "";
    const rawHtml = marked.parse(aiOutput) as string;
    return DOMPurify.sanitize(rawHtml);
  };

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
    setIsGenerating("PDF");
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
      
      const element = hiddenRenderRef.current;
      if (!element) return;

      // Show temporary element for capturing
      element.style.display = "block";
      element.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; color: #333; line-height: 1.6;">
          <div style="border-bottom: 2px solid #6c47ff; margin-bottom: 30px; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: 0; font-size: 24px; color: #6c47ff;">${title}</h1>
            <span style="font-size: 12px; color: #666;">Generated on ${new Date().toLocaleDateString()}</span>
          </div>
          <div style="font-size: 14px;">
            ${getCleanHtml()}
          </div>
          <div style="margin-top: 50px; padding-top: 10px; border-top: 1px solid #eee; font-size: 10px; color: #999; text-align: center;">
            Official Deliverable from AI Computer Centre
          </div>
        </div>
      `;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      } as any);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${safeName}.pdf`);
      element.style.display = "none";
    } catch (err) {
      console.error("PDF Generation failed:", err);
    } finally {
      setIsGenerating(null);
    }
  };

  const downloadWord = async () => {
    setIsGenerating("WORD");
    try {
      const { asBlob } = await import("html-docx-js-typescript");
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <style>
              body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.5; }
              h1 { color: #6c47ff; }
              h2 { color: #333; border-bottom: 1px solid #eee; }
              code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
              pre { background: #f4f4f4; padding: 10px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <p style="color: #666; font-size: 10pt;">Generated on ${new Date().toLocaleDateString()}</p>
            <hr>
            ${getCleanHtml()}
            <br><br>
            <hr>
            <p style="font-size: 8pt; color: #999; text-align: center;">Official Deliverable from AI Computer Centre</p>
          </body>
        </html>
      `;

      const blob = await asBlob(htmlContent);
      const url = URL.createObjectURL(blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeName}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Word Generation failed:", err);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hidden container for PDF rendering */}
      <div 
        ref={hiddenRenderRef} 
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          top: 0, 
          width: "800px", 
          background: "white", 
          display: "none" 
        }} 
      />

      {aiOutput && (
        <div>
          <div style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 12
          }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Formatted Content
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { label: "TXT", action: downloadTxt, icon: <FileIcon size={12} /> },
                { label: "PDF", action: downloadPdf, icon: <FileText size={12} /> },
                { label: "WORD", action: downloadWord, icon: <FileType size={12} /> },
              ].map(({ label, action, icon }) => (
                <button
                  key={label}
                  onClick={action}
                  disabled={isGenerating !== null}
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: "0.7rem", padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}
                >
                  {isGenerating === label ? <Loader2 size={12} className="animate-spin" /> : icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <div 
            className="prose-container"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-6)",
              fontSize: "0.9375rem",
              lineHeight: 1.8,
              maxHeight: "50vh",
              overflowY: "auto",
              color: "var(--text-primary)"
            }}
          >
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: getCleanHtml() }} 
            />
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

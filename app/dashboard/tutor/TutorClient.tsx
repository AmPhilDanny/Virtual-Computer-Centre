"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { 
  BookOpen, Upload, Send, Bot, User, 
  FileText, Plus, AlertCircle, CheckCircle2, 
  ChevronRight, Library, Sparkles
} from "lucide-react";

interface TutorClientProps {
  materials: any[];
  subscription: any;
  user: any;
}

export default function TutorClient({ materials: initialMaterials, subscription, user }: TutorClientProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<any>(initialMaterials[0] || null);
  const [materials, setMaterials] = useState(initialMaterials);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [subscribing, setSubscribing] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/tutor/chat",
    body: { materialId: selectedMaterial?.id },
  });

  const onSubscribe = async () => {
    setSubscribing(true);
    try {
      const res = await fetch("/api/tutor/subscribe", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      } else {
        const err = await res.text();
        if (err.includes("wallet")) {
          if (confirm("Insufficient balance. Go to wallet to fund?")) {
            window.location.href = "/dashboard/wallet";
          }
        } else {
          alert(err);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubscribing(false);
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      const res = await fetch("/api/tutor/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newDoc = await res.json();
        setMaterials([...materials, newDoc]);
        if (!selectedMaterial) setSelectedMaterial(newDoc);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        const err = await res.text();
        alert(err);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (!subscription) {
    return (
      <div className="section-sm flex-col items-center justify-center text-center gap-6">
        <div className="glass-card flex-col items-center gap-6" style={{ maxWidth: "500px", padding: "var(--space-12)" }}>
           <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(108,71,255,0.1)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
              <Bot size={40} className="text-primary" />
           </div>
           <h2>Unlock Your <span className="text-gradient">AI Tutor</span></h2>
           <p className="text-secondary">
             Upload your textbooks and curriculums to get personalized, 24/7 tutoring tailored to your learning style.
           </p>
           <button 
             className="btn btn-primary btn-xl" 
             onClick={onSubscribe}
             disabled={subscribing}
           >
             {subscribing ? "Activating..." : "Unlock Monthly Access"}
           </button>
           <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>
             Payments are deducted from your wallet balance.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "320px 1fr", gap: "var(--space-6)", height: "calc(100vh - 180px)" }}>
      
      {/* Sidebar: Materials Library */}
      <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-6)", overflowY: "auto" }}>
        <div className="flex items-center justify-between">
           <h3 className="flex items-center gap-2" style={{ fontSize: "1.1rem", margin: 0 }}>
             <Library size={18} /> Library
           </h3>
           <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{materials.length}/12</span>
        </div>

        <div className="flex-col gap-2">
           {materials.map((m) => (
             <button
               key={m.id}
               onClick={() => setSelectedMaterial(m)}
               className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${selectedMaterial?.id === m.id ? "bg-primary text-white" : "hover:bg-subtle"}`}
               style={{ border: "none", cursor: "pointer", width: "100%", fontSize: "0.9rem" }}
             >
               <FileText size={16} />
               <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</span>
             </button>
           ))}

           {materials.length < 12 && (
             <label className="flex items-center gap-3 p-3 rounded-lg border-dashed border-2 hover:border-primary transition-all cursor-pointer" style={{ marginTop: "var(--space-2)" }}>
                <Plus size={16} className="text-primary" />
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{uploading ? "Uploading..." : "Add Material"}</span>
                <input type="file" hidden onChange={onUpload} disabled={uploading} accept=".pdf,.docx,.txt" />
             </label>
           )}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)" }} />

        <div className="bg-primary-subtle p-4 rounded-xl flex-col gap-2">
           <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--brand-primary)" }}>
              <Sparkles size={14} /> Learning Insights
           </div>
           <p style={{ fontSize: "0.75rem", margin: 0, opacity: 0.8 }}>
             Your AI Tutor has noted you prefer <strong>{user?.studentProfile?.learningStyle || "Logical"}</strong> explanations.
           </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass-card flex-col" style={{ padding: 0, overflow: "hidden" }}>
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
           <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "var(--grad-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                 <Bot size={20} />
              </div>
              <div>
                 <div style={{ fontWeight: 700, fontSize: "0.950rem" }}>AI Tutor</div>
                 <div style={{ fontSize: "0.75rem", color: "var(--brand-success)" }}>
                    {selectedMaterial ? `Tutoring: ${selectedMaterial.title}` : "Ready to teach"}
                 </div>
              </div>
           </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-6 flex-col gap-6" style={{ overflowY: "auto" }}>
          {messages.length === 0 && (
            <div className="flex-col items-center justify-center text-center gap-4 p-12 opacity-50">
               <BookOpen size={48} />
               <div>
                  <h3>Start the Lesson</h3>
                  <p style={{ maxWidth: "300px" }}>Ask anything about your uploaded material or request a summary.</p>
               </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
               <div style={{ 
                 width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
                 background: m.role === "user" ? "var(--brand-secondary)" : "var(--brand-primary)",
                 display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
               }}>
                 {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
               </div>
               <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-subtle text-primary rounded-tl-none border border-subtle"}`} style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {m.content}
               </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
               <div style={{ width: 32, height: 32, borderRadius: "8px", background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                 <Bot size={16} />
               </div>
               <div className="p-4 rounded-2xl bg-subtle text-primary rounded-tl-none border border-subtle">
                  <span className="dot-pulse"></span>
               </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
           <div className="flex gap-2">
              <input
                className="form-input"
                style={{ borderRadius: "12px", background: "var(--bg-subtle)" }}
                value={input}
                onChange={handleInputChange}
                placeholder={selectedMaterial ? `Ask about ${selectedMaterial.title}...` : "Select a material to begin"}
              />
              <button 
                type="submit" 
                disabled={!selectedMaterial || !input}
                className="btn btn-primary" 
                style={{ width: "48px", height: "48px", padding: 0, borderRadius: "12px", flexShrink: 0 }}
              >
                 <Send size={18} />
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}

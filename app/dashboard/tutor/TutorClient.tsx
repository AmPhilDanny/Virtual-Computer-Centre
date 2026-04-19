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
  initialMessages?: any[];
}

export default function TutorClient({ materials: initialMaterials, subscription, user, initialMessages = [] }: TutorClientProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<any>(initialMaterials[0] || null);
  const [materials, setMaterials] = useState(initialMaterials);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [subscribing, setSubscribing] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: "/api/tutor/chat",
    body: { materialId: selectedMaterial?.id },
    initialMessages,
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
      <div className="section-sm flex-col items-center justify-center text-center gap-6" style={{ minHeight: "60vh" }}>
        <div className="glass-card flex-col items-center gap-6" style={{ maxWidth: "500px", padding: "var(--space-12)" }}>
           <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(108,71,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={40} className="text-primary" />
           </div>
           <h2 style={{ fontSize: "2rem" }}>Unlock Your <span className="text-gradient">AI Tutor</span></h2>
           <p className="text-secondary">
             Upload your textbooks and curriculums to get personalized, 24/7 tutoring tailored to your learning style.
           </p>
           <button 
             className="btn btn-primary btn-xl w-full" 
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
    <div className="grid" style={{ gridTemplateColumns: "320px 1fr", gap: "var(--space-6)", height: "calc(100vh - 200px)" }}>
      
      {/* Sidebar: Materials Library */}
      <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-6)", overflowY: "auto" }}>
        <div className="flex items-center justify-between">
           <h3 className="flex items-center gap-2" style={{ fontSize: "1.1rem", margin: 0 }}>
             <Library size={18} /> Library
           </h3>
           <span className="badge" style={{ fontSize: "0.75rem" }}>{materials.length}/12</span>
        </div>

        <div className="flex-col gap-2">
           {materials.length === 0 && (
             <div className="p-8 text-center bg-subtle rounded-xl border border-dashed border-subtle flex-col items-center gap-2">
                <FileText size={24} className="opacity-20" />
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>No materials yet</p>
             </div>
           )}
           {materials.map((m) => (
             <button
               key={m.id}
               onClick={() => setSelectedMaterial(m)}
               className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${selectedMaterial?.id === m.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-subtle"}`}
               style={{ border: "none", cursor: "pointer", width: "100%", fontSize: "0.9rem" }}
             >
               <FileText size={16} />
               <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</span>
             </button>
           ))}

           {materials.length < 12 && (
             <label className="flex items-center gap-3 p-3 rounded-lg border-dashed border-2 border-subtle hover:border-primary transition-all cursor-pointer bg-subtle/30" style={{ marginTop: "var(--space-2)" }}>
                <Plus size={16} className="text-primary" />
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{uploading ? "Uploading..." : "Add Material"}</span>
                <input type="file" hidden onChange={onUpload} disabled={uploading} accept=".pdf,.docx,.txt" />
             </label>
           )}
        </div>

        <div className="mt-auto flex-col gap-4">
          <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)" }} />
          <div className="bg-primary-subtle p-4 rounded-xl flex-col gap-2 border border-primary/10">
             <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--brand-primary)" }}>
                <Sparkles size={14} /> Learning Insights
             </div>
             <p style={{ fontSize: "0.75rem", margin: 0, opacity: 0.8, lineHeight: 1.4 }}>
               Your AI Tutor follows a <strong>{user?.studentProfile?.learningStyle || "Logical"}</strong> approach for <strong>{user?.studentProfile?.academicLevel || "General Learning"}</strong> content.
             </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass-card flex-col" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
           <div className="flex items-center gap-3">
              <div style={{ width: 42, height: 42, borderRadius: "12px", background: "var(--grad-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(108,71,255,0.3)" }}>
                 <Bot size={22} />
              </div>
              <div>
                 <div style={{ fontWeight: 700, fontSize: "1rem" }}>AI Tutor</div>
                 <div className="flex items-center gap-2" style={{ fontSize: "0.75rem" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-success)" }}></span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {selectedMaterial ? `Focusing on: ${selectedMaterial.title}` : "System Online"}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-6 flex-col gap-6" style={{ overflowY: "auto" }}>
          {messages.length === 0 && (
            <div className="flex-col items-center justify-center text-center gap-6 p-12 opacity-50" style={{ height: "100%" }}>
               <div className="icon-box bg-subtle p-6 rounded-3xl">
                  <BookOpen size={48} className="text-primary" />
               </div>
               <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>Your Study Hub</h3>
                  <p className="text-secondary" style={{ maxWidth: "320px", margin: "0 auto" }}>
                    Select a material from your library and ask questions, request summaries, or seek explanations.
                  </p>
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
               <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${m.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-subtle text-primary rounded-tl-none border border-subtle"}`} style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {m.content}
               </div>
            </div>
          ))}

          {error && (
            <div className="flex-col items-center gap-3 p-6 bg-danger/5 border border-danger/20 rounded-2xl">
               <div className="flex items-center gap-2 text-danger font-bold">
                  <AlertCircle size={18} /> Connection Lost
               </div>
               <p className="text-secondary text-sm text-center">Failed to get a response from the AI. Check your internet or try reloading.</p>
               <button onClick={() => reload()} className="btn btn-ghost btn-sm text-primary">Try Again</button>
            </div>
          )}

          {isLoading && !error && (
            <div className="flex gap-4">
               <div style={{ width: 32, height: 32, borderRadius: "8px", background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                 <Bot size={16} />
               </div>
               <div className="p-4 rounded-2xl bg-subtle text-primary rounded-tl-none border border-subtle shadow-sm">
                  <div className="flex gap-1 items-center" style={{ height: "20px" }}>
                    <span className="dot animate-bounce" style={{ width: 4, height: 4, background: "currentColor", borderRadius: "50%", animationDelay: "0ms" }}></span>
                    <span className="dot animate-bounce" style={{ width: 4, height: 4, background: "currentColor", borderRadius: "50%", animationDelay: "150ms" }}></span>
                    <span className="dot animate-bounce" style={{ width: 4, height: 4, background: "currentColor", borderRadius: "50%", animationDelay: "300ms" }}></span>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="p-4 bg-glass" style={{ borderTop: "1px solid var(--border-subtle)" }}>
           <div className="flex gap-3 items-center">
              <input
                className="form-input"
                style={{ borderRadius: "14px", background: "var(--bg-subtle)", padding: "var(--space-4) var(--space-6)" }}
                value={input}
                onChange={handleInputChange}
                disabled={isLoading || !selectedMaterial}
                placeholder={selectedMaterial ? `Ask about ${selectedMaterial.title}...` : "Select a material to begin"}
              />
              <button 
                type="submit" 
                disabled={!selectedMaterial || !input || isLoading}
                className="btn btn-primary" 
                style={{ width: "52px", height: "52px", padding: 0, borderRadius: "14px", flexShrink: 0, boxShadow: "0 4px 14px rgba(108,71,255,0.4)" }}
              >
                 <Send size={20} />
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}

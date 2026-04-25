"use client";

import { useState } from "react";
import { 
  X, CheckCircle2, AlertCircle, 
  HelpCircle, ChevronRight, Award, 
  Loader2, RefreshCw
} from "lucide-react";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId: string;
  topic: string;
}

export default function AssessmentModal({ isOpen, onClose, materialId, topic }: AssessmentModalProps) {
  const [step, setStep] = useState<"idle" | "loading" | "quiz" | "result">("idle");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startAssessment = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/tutor/assessment", {
        method: "POST",
        body: JSON.stringify({ action: "generate", materialId, topic })
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(-1));
        setStep("quiz");
      } else {
        alert("Failed to generate assessment. Please try again.");
        setStep("idle");
      }
    } catch (error) {
      console.error(error);
      setStep("idle");
    }
  };

  const submitAssessment = async () => {
    if (answers.includes(-1)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tutor/assessment", {
        method: "POST",
        body: JSON.stringify({ action: "submit", materialId, topic, questions, answers })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setStep("result");
      } else {
        alert("Failed to submit assessment.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
      <div className="glass-card flex-col gap-6" style={{ width: "100%", maxWidth: "600px", position: "relative", maxHeight: "90vh", overflow: "auto" }}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle pb-4">
           <div className="flex items-center gap-3">
              <div className="bg-primary-subtle p-2 rounded-lg text-primary">
                 <Award size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Knowledge Assessment</h3>
           </div>
           <button onClick={onClose} className="btn btn-ghost p-2 rounded-full">
              <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-grow">
          {step === "idle" && (
            <div className="flex-col items-center gap-6 py-8 text-center">
               <div className="bg-subtle p-6 rounded-full">
                  <HelpCircle size={48} className="text-muted" />
               </div>
               <div>
                  <h4 style={{ marginBottom: "var(--space-2)" }}>Test Your Mastery</h4>
                  <p className="text-secondary text-sm">
                    Generate a personalized quiz based on <strong>{topic}</strong> to verify your learning outcomes.
                  </p>
               </div>
               <button onClick={startAssessment} className="btn btn-primary btn-lg px-8">
                  Generate Quiz
               </button>
            </div>
          )}

          {step === "loading" && (
            <div className="flex-col items-center justify-center py-16 gap-4">
               <Loader2 size={40} className="text-primary animate-spin" />
               <p className="text-secondary animate-pulse">Analyzing materials & generating questions...</p>
            </div>
          )}

          {step === "quiz" && (
            <div className="flex-col gap-8 py-4">
               {questions.map((q, qIdx) => (
                 <div key={qIdx} className="flex-col gap-4 p-4 bg-subtle/30 rounded-2xl border border-subtle">
                    <div className="flex gap-3">
                       <span className="font-bold text-primary">Q{qIdx + 1}.</span>
                       <p className="font-semibold" style={{ margin: 0 }}>{q.question}</p>
                    </div>
                    <div className="grid gap-2">
                       {q.options.map((opt: string, oIdx: number) => (
                         <button
                           key={oIdx}
                           onClick={() => {
                             const newAnswers = [...answers];
                             newAnswers[qIdx] = oIdx;
                             setAnswers(newAnswers);
                           }}
                           className={`p-3 rounded-xl text-left transition-all border ${
                             answers[qIdx] === oIdx 
                               ? "bg-primary text-white border-primary" 
                               : "bg-white/5 border-subtle hover:border-primary/50"
                           }`}
                           style={{ fontSize: "0.9rem" }}
                         >
                           {opt}
                         </button>
                       ))}
                    </div>
                 </div>
               ))}

               <button 
                 onClick={submitAssessment} 
                 className="btn btn-primary btn-lg w-full mt-4" 
                 disabled={loading}
               >
                  {loading ? "Grading..." : "Submit Answers"}
               </button>
            </div>
          )}

          {step === "result" && result && (
            <div className="flex-col gap-8 py-6 items-center text-center">
               <div className="relative">
                  <div className="flex items-center justify-center" style={{ width: 120, height: 120, borderRadius: "50%", background: "var(--grad-primary)", color: "#fff", fontSize: "2rem", fontWeight: 800, boxShadow: "0 10px 30px rgba(108,71,255,0.4)" }}>
                     {Math.round(result.result.score)}%
                  </div>
                  {result.result.score >= 70 && (
                    <div className="absolute -bottom-2 -right-2 bg-success text-white p-2 rounded-full shadow-lg">
                       <CheckCircle2 size={24} />
                    </div>
                  )}
               </div>

               <div className="flex-col gap-2">
                  <h4 style={{ fontSize: "1.5rem", margin: 0 }}>
                    {result.result.score >= 80 ? "Mastery Achieved!" : result.result.score >= 50 ? "Good Effort!" : "Keep Studying!"}
                  </h4>
                  <p className="text-secondary text-sm">
                    You got {result.result.correctCount} out of {questions.length} questions correct.
                  </p>
               </div>

               <div className="bg-primary-subtle/20 p-6 rounded-2xl border border-primary/10 text-left w-full">
                  <p className="font-bold text-primary mb-2 flex items-center gap-2">
                    <Sparkles size={16} /> AI Feedback:
                  </p>
                  <p className="text-sm leading-relaxed" style={{ margin: 0 }}>
                    {result.result.feedback}
                  </p>
               </div>

               <div className="flex gap-4 w-full">
                  <button onClick={onClose} className="btn btn-ghost btn-lg flex-grow">Close</button>
                  <button onClick={() => setStep("idle")} className="btn btn-primary btn-lg flex-grow flex items-center justify-center gap-2">
                     <RefreshCw size={18} /> Retake
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Sparkles({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}

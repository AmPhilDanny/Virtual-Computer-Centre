import { prisma } from "@/lib/prisma";
import { Award, MessageSquare, TrendingUp, AlertCircle, User, Calendar, CheckCircle, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TutorHealthPage() {
  const sessions = await prisma.tutorSession.findMany({
    include: { user: true },
    orderBy: { updatedAt: "desc" },
    take: 20
  });

  const assessments = await prisma.assessment.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const avgScore = assessments.length > 0 
    ? assessments.reduce((acc, curr) => acc + curr.score, 0) / assessments.length 
    : 0;

  return (
    <div className="flex-col gap-8">
      {/* Overview Stats */}
      <div className="grid-4 gap-6">
        <div className="glass-card p-6 flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-secondary text-sm">Avg. Mastery Score</span>
              <Award className="text-primary" size={20} />
           </div>
           <div className="flex items-end gap-2">
              <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>{Math.round(avgScore)}%</span>
              <span className="text-success text-xs flex items-center mb-1"><TrendingUp size={12} /> +2.4%</span>
           </div>
        </div>
        <div className="glass-card p-6 flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-secondary text-sm">Total Sessions</span>
              <MessageSquare className="text-primary" size={20} />
           </div>
           <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>{sessions.length}</div>
        </div>
        <div className="glass-card p-6 flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-secondary text-sm">Active Assessments</span>
              <CheckCircle className="text-primary" size={20} />
           </div>
           <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>{assessments.length}</div>
        </div>
        <div className="glass-card p-6 flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-secondary text-sm">Logic Drift Alerts</span>
              <AlertCircle className="text-warning" size={20} />
           </div>
           <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>0</div>
        </div>
      </div>

      <div className="grid-2 gap-8">
        {/* Recent Sessions */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-6)" }}>
           <h3 className="flex items-center gap-2" style={{ fontSize: "1.1rem", margin: 0 }}>
             <MessageSquare size={18} className="text-primary" /> Recent Tutor Interactions
           </h3>
           <div className="flex-col gap-4">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 bg-subtle/30 rounded-2xl border border-subtle flex-col gap-3">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <User size={14} className="text-primary" />
                         <span className="font-bold text-sm">{session.user.name || "Student"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted text-xs">
                         <Calendar size={12} />
                         {new Date(session.updatedAt).toLocaleDateString()}
                      </div>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-subtle">
                      <p className="text-xs font-bold text-primary mb-1">Learning Patterns:</p>
                      <pre className="text-[10px] text-secondary opacity-80 overflow-hidden text-ellipsis">
                         {JSON.stringify(session.learningPatterns, null, 2)}
                      </pre>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Recent Assessments */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-6)" }}>
           <h3 className="flex items-center gap-2" style={{ fontSize: "1.1rem", margin: 0 }}>
             <Award size={18} className="text-primary" /> Verified Outcomes
           </h3>
           <div className="flex-col gap-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="p-4 bg-subtle/30 rounded-2xl border border-subtle flex-col gap-3">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm">
                         {assessment.user.name || "Student"}
                      </div>
                      <div className={`badge badge-${assessment.score >= 70 ? 'success' : 'warning'}`}>
                         {Math.round(assessment.score)}% Score
                      </div>
                   </div>
                   <div className="text-xs text-secondary">
                      <span className="font-bold">Topic:</span> {assessment.topic}
                   </div>
                   <div className="p-3 bg-primary-subtle/10 rounded-xl border border-primary/10 italic text-[11px]">
                      <Sparkles size={10} className="inline mr-1 text-primary" />
                      "{assessment.aiFeedback?.substring(0, 120)}..."
                   </div>
                </div>
              ))}
              {assessments.length === 0 && (
                <div className="p-12 text-center text-muted flex-col items-center gap-4">
                   <Award size={40} className="opacity-10" />
                   <p className="text-sm">No outcomes recorded yet. Students need to complete assessments to verify mastery.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

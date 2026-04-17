"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Send, User, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
}

export default function CommentSection({ 
  postId, 
  initialComments 
}: { 
  postId: string; 
  initialComments: any[] 
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: newComment })
      });

      if (res.ok) {
        const data = await res.json();
        setComments([data, ...comments]);
        setNewComment("");
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to post comment");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-col gap-8" id="comments">
       <div className="flex items-center gap-3">
          <MessageSquare size={24} className="text-primary" />
          <h3 style={{ margin: 0 }}>Discussion ({comments.length})</h3>
       </div>

       {/* Comment Input */}
       <div className="glass-card" style={{ padding: "var(--space-6)" }}>
          {session ? (
            <form onSubmit={handleSubmit} className="flex-col gap-4">
               <div className="flex items-center gap-3 mb-2">
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.8rem" }}>
                    {session.user?.name?.charAt(0)}
                  </div>
                  <span className="font-medium text-sm">{session.user?.name}</span>
               </div>
               
               <textarea 
                  className="form-input" 
                  placeholder="Share your thoughts on this article..."
                  style={{ minHeight: "100px", resize: "none", border: "1px solid var(--border-subtle)" }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmitting}
               />
               
               {error && (
                 <div className="flex items-center gap-2 text-danger text-xs">
                    <AlertCircle size={14} /> {error}
                 </div>
               )}

               <button 
                  type="submit" 
                  className="btn btn-primary btn-sm flex items-center gap-2" 
                  style={{ alignSelf: "flex-end" }}
                  disabled={isSubmitting || !newComment.trim()}
               >
                  <Send size={14} /> {isSubmitting ? "Posting..." : "Post Comment"}
               </button>
            </form>
          ) : (
            <div className="p-6 text-center bg-glass rounded-xl border border-dashed border-subtle">
               <LogIn className="mx-auto mb-3 text-muted" size={32} />
               <h4 style={{ margin: "0 0 8px 0" }}>Join the conversation</h4>
               <p className="text-secondary text-sm mb-4">Please sign in to share your thoughts and reply to this article.</p>
               <Link href="/auth/signin" className="btn btn-primary btn-sm">Sign In to Comment</Link>
            </div>
          )}
       </div>

       {/* Comment List */}
       <div className="flex-col gap-6">
          {comments.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm italic">
               No comments yet. Be the first to start the discussion!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-glass transition-colors">
                 <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)", flexShrink: 0 }}>
                    <User size={20} className="text-muted" />
                 </div>
                 <div className="flex-col gap-1 flex-1">
                    <div className="flex justify-between items-center">
                       <span className="font-bold text-sm">{comment.user.name}</span>
                       <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <p style={{ fontSize: "0.9375rem", margin: 0, lineHeight: 1.5, color: "var(--text-secondary)" }}>
                       {comment.content}
                    </p>
                 </div>
              </div>
            ))
          )}
       </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { User, Phone, Book, GraduationCap, Briefcase, Zap, Heart, Save, CheckCircle } from "lucide-react";

interface ProfileFormProps {
  initialUser: any;
}

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    phone: initialUser.phone || "",
    bio: initialUser.studentProfile?.bio || "",
    academicLevel: initialUser.studentProfile?.academicLevel || "Undergraduate",
    occupation: initialUser.studentProfile?.occupation || "",
    learningStyle: initialUser.studentProfile?.learningStyle || "Visual",
    interests: initialUser.studentProfile?.interests || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-col gap-8">
      <div className="grid-2" style={{ gap: "var(--space-8)" }}>
        
        {/* Basic Information */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
          <h3 className="flex items-center gap-2" style={{ fontSize: "1.25rem", margin: 0 }}>
            <User size={20} className="text-primary" /> Personal Details
          </h3>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+234 ..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio / About You</label>
            <textarea 
              className="form-input" 
              style={{ minHeight: "100px", paddingTop: "var(--space-3)" }}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell the AI more about your learning goals..."
            />
          </div>
        </div>

        {/* Academic & Learning Profile */}
        <div className="glass-card flex-col gap-6" style={{ padding: "var(--space-8)" }}>
          <h3 className="flex items-center gap-2" style={{ fontSize: "1.25rem", margin: 0 }}>
            <GraduationCap size={20} className="text-secondary" /> Academic Profile
          </h3>

          <div className="form-group">
            <label className="form-label">Educational Level</label>
            <select 
              className="form-input"
              value={formData.academicLevel}
              onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
            >
              <option>Primary School</option>
              <option>Secondary School</option>
              <option>Undergraduate</option>
              <option>Postgraduate</option>
              <option>Professional / Adult Learner</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Occupation / Current Pursuit</label>
            <div className="flex items-center gap-2">
               <Briefcase size={16} className="text-muted" />
               <input 
                 type="text" 
                 className="form-input" 
                 value={formData.occupation}
                 onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                 placeholder="e.g. Computer Science Student"
               />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Learning Style</label>
            <select 
              className="form-input"
              value={formData.learningStyle}
              onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
            >
              <option value="Visual">Visual (I learn best by seeing)</option>
              <option value="Auditory">Auditory (I learn best by listening)</option>
              <option value="Kinesthetic">Kinesthetic (I learn best by doing)</option>
              <option value="Logical">Logical (I learn best by analyzing patterns)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Interests / Subjects</label>
            <div className="flex items-center gap-2">
               <Heart size={16} className="text-muted" />
               <input 
                 type="text" 
                 className="form-input" 
                 value={formData.interests}
                 onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                 placeholder="e.g. AI, Mathematics, Literature"
               />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between glass-card" style={{ padding: "var(--space-4) var(--space-8)", position: "sticky", bottom: "20px", zIndex: 10 }}>
        <div className="flex items-center gap-3">
          {success ? (
            <span className="flex items-center gap-2 text-success" style={{ fontWeight: 600 }}>
              <CheckCircle size={20} /> Changes Saved Successfully
            </span>
          ) : (
            <span className="text-muted" style={{ fontSize: "0.9rem" }}>
              Update your profile to help the AI Tutor serve you better.
            </span>
          )}
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary btn-lg flex items-center gap-2"
          style={{ padding: "var(--space-3) var(--space-8)" }}
        >
          {loading ? "Saving..." : <><Save size={18} /> Save Profile</>}
        </button>
      </div>
    </form>
  );
}

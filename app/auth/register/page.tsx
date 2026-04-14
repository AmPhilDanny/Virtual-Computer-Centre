"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/auth/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div 
        className="flex items-center justify-center p-6"
        style={{ minHeight: "calc(100vh - 80px)", background: "var(--grad-hero)", padding: "var(--space-8) 0" }}
      >
        <div className="glass-card" style={{ maxWidth: "460px", width: "100%", padding: "var(--space-8)" }}>
          <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>Create Account</h1>
            <p className="text-secondary text-sm">Join the AI-powered online computer centre.</p>
          </div>

          {error && (
            <div 
              style={{
                background: "rgba(255, 71, 87, 0.1)",
                color: "var(--brand-danger)",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "var(--space-4)",
                fontSize: "0.875rem",
                border: "1px solid rgba(255, 71, 87, 0.3)"
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "var(--space-6)" }}>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "var(--space-3)" }}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: "var(--space-6)" }}>
            <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
              Already have an account?{" "}
              <Link href="/auth/login" style={{ color: "var(--brand-primary)", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

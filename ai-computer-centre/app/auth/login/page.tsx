"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <>
      <Navbar />
      <div 
        className="flex items-center justify-center p-6"
        style={{ minHeight: "calc(100vh - 80px)", background: "var(--grad-hero)" }}
      >
        <div className="glass-card" style={{ maxWidth: "420px", width: "100%", padding: "var(--space-8)" }}>
          <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>Welcome Back</h1>
            <p className="text-secondary text-sm">Sign in to track your orders and services.</p>
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
              <div className="flex justify-between items-center">
                <label className="form-label" htmlFor="password">Password</label>
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "var(--space-3)" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: "var(--space-6)" }}>
            <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
              Don't have an account?{" "}
              <Link href="/auth/register" style={{ color: "var(--brand-primary)", fontWeight: 600 }}>
                Sign up
              </Link>
            </p>
          </div>
          
          <div style={{ marginTop: "var(--space-6)", textAlign: "center" }}>
             <p className="text-muted" style={{fontSize: "0.75rem", marginBottom: "var(--space-3)"}}>Or continue with</p>
             <button 
               onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
               className="btn btn-secondary"
               style={{ width: "100%", borderRadius: "var(--radius-md)", padding: "var(--space-2)" }}
              >
               Google
             </button>
          </div>
        </div>
      </div>
    </>
  );
}

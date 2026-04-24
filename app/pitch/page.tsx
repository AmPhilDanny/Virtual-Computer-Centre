import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NovaX Digital Centre — Investor Briefing",
  description: "Africa's most advanced AI-powered digital services ecosystem.",
  robots: "noindex, nofollow", // Keep hidden from search engines
};

const features = [
  {

    icon: "👨‍💻",
    title: "Human-Verified Quality",
    desc: "Every AI-generated output is meticulously reviewed and edited by human experts to ensure 100% accuracy, professional tone, and human originality.",
  },
  {
    icon: "🧠",
    title: "Hybrid Multi-Model Engine",
    desc: "We combine the speed of Gemini, Llama, and Mistral with human editorial oversight, delivering 'High-Confidence' work that bypasses AI detectors.",
  },
  {
    icon: "📚",
    title: "AI Tutor Subscription",
    desc: "Adaptive, curriculum-aware tutoring with RAG-based document retrieval. Students upload textbooks; our AI delivers course-specific answers with persistent memory.",
  },
  {
    icon: "🛒",
    title: "Verified Vendor Marketplace",
    desc: "Identity-verified service providers (National ID required) operating under escrow-protected transactions and an 80/20 revenue share model.",
  },
  {
    icon: "🛡️",
    title: "Institutional Trust",
    desc: "Built-in plagiarism checks, human originality scores, and grammar verification bars build deep trust with students and professional clients.",
  },
  {
    icon: "📱",
    title: "Native Mobile Ecosystem",
    desc: "A single codebase powers a full website, an installable PWA, and a native Android APK — all updating live without re-downloading.",
  },


];

const services = ["Academic Typing & Proofreading", "NIN & Government Registrations", "AI Document Generation", "Business Plans & Proposals", "Virtual Administrative Assistance", "AI-Powered Tutoring Sessions"];


const techStack = [
  ["Framework", "Next.js 16 (App Router, Edge-Ready)"],
  ["Database", "PostgreSQL via Neon (Serverless)"],
  ["Mobile", "PWA + Native Android APK (Capacitor 8)"],
  ["Payments", "Paystack, Flutterwave"],
  ["AI Providers", "Gemini, Groq, Mistral, Together AI, Fireworks, OpenRouter"],
  ["Deployment", "Vercel Global Edge Network"],
];

const revenueStreams = [
  { icon: "💼", name: "Service Commission", desc: "Platform fee on every completed job order" },
  { icon: "🏪", name: "Vendor Marketplace", desc: "20% commission on all marketplace transactions" },
  { icon: "📘", name: "Tutor Subscriptions", desc: "Monthly recurring revenue via Paystack subscriptions" },
  { icon: "💳", name: "Wallet Top-Ups", desc: "Every deposit is a committed platform spend" },
  { icon: "⚡", name: "Express Pricing", desc: "1.5x–3x multiplier on priority job delivery" },
  { icon: "🔖", name: "Promotions Engine", desc: "Featured coupon codes that drive acquisition spikes" },
];

export default function PitchPage() {
  return (
    <div style={{ fontFamily: "var(--font-inter, Inter, sans-serif)", background: "#0a0a0f", color: "#f1f1f1", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ 
        padding: "80px 24px 100px", 
        textAlign: "center", 
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,71,255,0.35) 0%, transparent 70%)",
        borderBottom: "1px solid rgba(108,71,255,0.15)"
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ 
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(108,71,255,0.12)", border: "1px solid rgba(108,71,255,0.3)",
            borderRadius: "100px", padding: "6px 20px", marginBottom: "40px",
            fontSize: "0.8rem", color: "#a78bfa", letterSpacing: "1.5px", textTransform: "uppercase"
          }}>
            🔒 Confidential Investor Briefing
          </div>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px",
            background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>
            NovaX Digital Centre
          </h1>
          <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "#cbd5e1", lineHeight: 1.7, marginBottom: "48px" }}>
            Africa's most advanced AI-powered digital services ecosystem.<br/>
            Built for the next generation of entrepreneurs, students, and professionals.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://novaxdigitalcentre.vercel.app" target="_blank" style={{
              display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #6C47FF, #00d4ff)",
              borderRadius: "100px", fontWeight: 700, color: "#fff", textDecoration: "none",
              fontSize: "1rem", boxShadow: "0 0 40px rgba(108,71,255,0.4)"
            }}>
              🚀 Visit Live Platform
            </a>
            <a href="/pitch/premium" style={{
              display: "inline-block", padding: "14px 36px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px", fontWeight: 600,
              color: "#e2e8f0", textDecoration: "none", fontSize: "1rem"
            }}>
              📊 View Financial Projections →
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: "80px 24px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "16px" }}>The Problem We're Solving</h2>
          <p style={{ color: "#cbd5e1", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
            Nigeria has over <strong style={{ color: "#a78bfa" }}>210 million people</strong>, 35%+ youth unemployment, and a rapidly growing digital economy — yet everyday access to professional digital services remains broken.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {[
            { emoji: "📂", title: "Fragmented Services", desc: "Typing, government registration, and document services are all scattered across unverified, unreliable providers." },
            { emoji: "📖", title: "Tutoring Gap", desc: "Millions of students in underserved communities lack access to quality academic support at affordable rates." },
            { emoji: "🔗", title: "No Trusted Marketplace", desc: "There is no identity-verified, escrow-protected platform for digital service providers to operate professionally." },
          ].map((item) => (
            <div key={item.title} style={{ 
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "32px", backdropFilter: "blur(8px)"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{item.emoji}</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>{item.title}</h3>
              <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0, fontSize: "0.9rem" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 24px", background: "rgba(108,71,255,0.04)", borderTop: "1px solid rgba(108,71,255,0.1)", borderBottom: "1px solid rgba(108,71,255,0.1)" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "16px" }}>Platform Capabilities</h2>
            <p style={{ color: "#cbd5e1" }}>Six integrated engines powering an end-to-end digital services ecosystem.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px", padding: "32px", transition: "border-color 0.2s"
              }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0, fontSize: "0.88rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVENUE STREAMS */}
      <section style={{ padding: "80px 24px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "16px" }}>Revenue Model</h2>
          <p style={{ color: "#cbd5e1" }}>Six independent income streams — diversified, recurring, and scalable.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {revenueStreams.map((r) => (
            <div key={r.name} style={{
              display: "flex", gap: "16px", alignItems: "flex-start",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px", padding: "20px"
            }}>
              <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>{r.name}</div>
                <div style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "60px 24px", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, marginBottom: "40px" }}>Technology Foundation</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "12px" }}>
            {techStack.map(([label, value]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "14px 20px",
                border: "1px solid rgba(255,255,255,0.06)"
              }}>
                <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>{label}</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#a78bfa", textAlign: "right", maxWidth: "200px" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NOW / TRACTION */}
      <section style={{ padding: "80px 24px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "16px" }}>Traction & Market Timing</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "60px" }}>
          {[
            { stat: "$88B", label: "Nigeria digital economy by 2030" },
            { stat: "210M+", label: "Nigerian population" },
            { stat: "6 AI", label: "Provider integrations" },
            { stat: "99.9%", label: "AI uptime via failover" },
          ].map(({ stat, label }) => (
            <div key={stat} style={{ textAlign: "center", padding: "32px 16px", background: "rgba(108,71,255,0.08)", borderRadius: "16px", border: "1px solid rgba(108,71,255,0.2)" }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#a78bfa", marginBottom: "8px" }}>{stat}</div>
              <div style={{ color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.5 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {[
            "✅ Live Production Platform — novaxdigitalcentre.vercel.app",
            "✅ Human-in-the-Loop (HITL) Verification Pipeline Active",
            "✅ Native Android APK via automated GitHub Actions CI/CD",
            "✅ Multi-AI redundancy with automatic failover live",
            "✅ Vendor identity verification pipeline active",
            "✅ PostgreSQL database with full schema deployed",
          ].map((item) => (

            <div key={item} style={{ 
              padding: "14px 18px", background: "rgba(0,229,160,0.05)",
              border: "1px solid rgba(0,229,160,0.15)", borderRadius: "10px",
              fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.5
            }}>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "60px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "40px" }}>Active Service Catalogue</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {services.map((s) => (
              <span key={s} style={{
                padding: "10px 20px", background: "rgba(108,71,255,0.1)",
                border: "1px solid rgba(108,71,255,0.25)", borderRadius: "100px",
                fontSize: "0.9rem", color: "#c4b5fd"
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(108,71,255,0.25) 0%, transparent 70%)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "20px" }}>
            Ready to Invest in Africa's Digital Future?
          </h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: "48px", fontSize: "1.05rem" }}>
            We are seeking strategic partners who share our vision of empowering Africa's digital workforce. Early partnership today secures a foundational stake in the most complete digital services platform on the continent.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://novaxdigitalcentre.vercel.app" target="_blank" style={{
              display: "inline-block", padding: "16px 40px", background: "linear-gradient(135deg, #6C47FF, #00d4ff)",
              borderRadius: "100px", fontWeight: 700, color: "#fff", textDecoration: "none",
              fontSize: "1.05rem", boxShadow: "0 0 60px rgba(108,71,255,0.5)"
            }}>
              Experience the Platform
            </a>
            <a href="/pitch/premium" style={{
              display: "inline-block", padding: "16px 40px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px", fontWeight: 600,
              color: "#e2e8f0", textDecoration: "none", fontSize: "1.05rem"
            }}>
              View Financial Model →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          © 2026 NovaX Digital Centre. All rights reserved. This document is confidential and intended solely for the recipient.
        </p>
      </footer>
    </div>
  );
}

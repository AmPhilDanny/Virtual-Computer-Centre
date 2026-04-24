import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovaX Digital Centre — Investor Edition (Financial Model)",
  description: "Full financial projections, pricing tiers, and investment opportunity.",
  robots: "noindex, nofollow",
};

const projections = [
  { year: "Year 1 (2026)", users: "2,500", vendors: "40", mrr: "₦1.8M", arr: "₦21.6M", highlight: false },
  { year: "Year 2 (2027)", users: "12,000", vendors: "180", mrr: "₦8.5M", arr: "₦102M", highlight: false },
  { year: "Year 3 (2028)", users: "45,000", vendors: "600", mrr: "₦32M", arr: "₦384M", highlight: true },
  { year: "Year 4 (2029)", users: "120,000", vendors: "1,400", mrr: "₦88M", arr: "₦1.05B", highlight: false },
  { year: "Year 5 (2030)", users: "300,000", vendors: "3,500", mrr: "₦220M", arr: "₦2.64B", highlight: false },
];

const servicePricing = [
  { service: "Document Typing (per page)", price: "₦200 – ₦500", category: "Academic" },
  { service: "Assignment / Research Help", price: "₦1,500 – ₦8,000", category: "Academic" },
  { service: "NIN Registration", price: "₦1,000 – ₦2,500", category: "Government" },
  { service: "Business Plan (AI)", price: "₦5,000 – ₦25,000", category: "Business" },
  { service: "AI Document Generation", price: "₦800 – ₦4,000", category: "AI-Enhanced" },
  { service: "Virtual Assistant (hourly)", price: "₦1,500 – ₦4,500/hr", category: "VA" },
];

const tutorPlans = [
  {
    name: "Starter",
    price: "₦2,500/mo",
    priceUSD: "~$1.60",
    features: ["10 AI Tutor sessions/month", "2 document uploads", "Basic learning profile", "Email support"],
    highlight: false,
    badge: null,
  },
  {
    name: "Scholar",
    price: "₦5,000/mo",
    priceUSD: "~$3.20",
    features: ["Unlimited AI sessions", "12 document uploads", "RAG-enhanced responses", "Persistent memory", "Priority support"],
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Institution",
    price: "₦40,000/mo",
    priceUSD: "~$25.60",
    features: ["Up to 20 student accounts", "Shared AI tutor workspace", "Admin learning reports", "Dedicated support", "Custom pricing available"],
    highlight: false,
    badge: "For Schools",
  },
];

const vendorTiers = [
  {
    name: "Solo Vendor",
    commission: "20%",
    desc: "Individual service providers. ID-verified. Full access to marketplace.",
    perks: ["Escrow protection", "Payout on demand", "Personal dashboard"],
  },
  {
    name: "Pro Vendor",
    commission: "15%",
    desc: "High-volume sellers with 50+ completed orders.",
    perks: ["Reduced commission", "Featured listings", "Priority job routing", "Business analytics"],
  },
  {
    name: "Enterprise Partner",
    commission: "Negotiated",
    desc: "Businesses, agencies, and institutional operators.",
    perks: ["Custom revenue split", "Dedicated account manager", "API access", "White-label options"],
  },
];

const revenueBreakdown = [
  { stream: "Service Commissions", pct: "35%", color: "#6C47FF" },
  { stream: "Vendor Marketplace (20% cut)", pct: "28%", color: "#00d4ff" },
  { stream: "Tutor Subscriptions (MRR)", pct: "22%", color: "#00e5a0" },
  { stream: "Express Delivery Premiums", pct: "8%", color: "#f59e0b" },
  { stream: "Wallet Funding Spread", pct: "5%", color: "#f43f5e" },
  { stream: "Promotions & Coupons", pct: "2%", color: "#a78bfa" },
];

export default function PitchPremiumPage() {
  return (
    <div style={{ fontFamily: "var(--font-inter, Inter, sans-serif)", background: "#0a0a0f", color: "#f1f1f1", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{
        padding: "80px 24px 100px", textAlign: "center",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.25) 0%, rgba(108,71,255,0.2) 40%, transparent 70%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: "100px", padding: "6px 20px", marginBottom: "40px",
            fontSize: "0.8rem", color: "#38bdf8", letterSpacing: "1.5px", textTransform: "uppercase"
          }}>
            📊 Financial Projections & Pricing Model
          </div>
          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px",
            background: "linear-gradient(135deg, #ffffff 0%, #38bdf8 40%, #a78bfa 80%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>
            NovaX Digital Centre
            <br />
            <span style={{ fontSize: "65%" }}>Investor Edition — Financial Model</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#cbd5e1", lineHeight: 1.7, marginBottom: "40px" }}>
            Full revenue model, pricing architecture, five-year growth projections,<br />
            and investment opportunity breakdown.
          </p>
          <a href="/pitch" style={{
            display: "inline-block", padding: "12px 28px", background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", fontWeight: 600,
            color: "#cbd5e1", textDecoration: "none", fontSize: "0.9rem"
          }}>
            ← Back to Standard Pitch
          </a>
        </div>
      </section>

      {/* 5-YEAR PROJECTIONS */}
      <section style={{ padding: "80px 24px", maxWidth: "1040px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>5-Year Growth Projections</h2>
          <p style={{ color: "#cbd5e1" }}>Modelled on conservative adoption rates within Nigeria's growing digital economy.</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                {["Period", "Active Users", "Active Vendors", "Monthly Revenue", "Annual Revenue"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projections.map((row) => (
                <tr key={row.year} style={{
                  background: row.highlight ? "rgba(108,71,255,0.12)" : "rgba(255,255,255,0.03)",
                  border: row.highlight ? "1px solid rgba(108,71,255,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "12px"
                }}>
                  <td style={{ padding: "18px 16px", fontWeight: 700, color: row.highlight ? "#a78bfa" : "#e2e8f0", borderRadius: "12px 0 0 12px" }}>{row.year} {row.highlight ? "🎯" : ""}</td>
                  <td style={{ padding: "18px 16px", color: "#cbd5e1" }}>{row.users}</td>
                  <td style={{ padding: "18px 16px", color: "#cbd5e1" }}>{row.vendors}</td>
                  <td style={{ padding: "18px 16px", fontWeight: 600, color: "#00e5a0" }}>{row.mrr}</td>
                  <td style={{ padding: "18px 16px", fontWeight: 800, color: "#ffffff", borderRadius: "0 12px 12px 0" }}>{row.arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "20px", color: "#94a3b8", fontSize: "0.8rem", textAlign: "center" }}>
          * Projections assume 15% MoM user growth in Y1–Y2, scaling to 8% by Y3–Y5. Revenue modelled on average ARPU of ₦720/month per active user.
        </p>
      </section>

      {/* REVENUE BREAKDOWN */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>Revenue Stream Composition</h2>
            <p style={{ color: "#cbd5e1" }}>Diversified revenue protects against single-stream volatility.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {revenueBreakdown.map((r) => (
              <div key={r.stream} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "180px", fontSize: "0.9rem", flexShrink: 0, color: "#cbd5e1" }}>{r.stream}</div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "100px", height: "12px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: r.pct, background: r.color, borderRadius: "100px", transition: "width 1s" }} />
                </div>
                <div style={{ width: "48px", textAlign: "right", fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE PRICING */}
      <section style={{ padding: "80px 24px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>Service Pricing Catalogue</h2>
          <p style={{ color: "#cbd5e1" }}>Competitively priced for Nigeria's market with a 15–30% margin per order.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {servicePricing.map((s) => (
            <div key={s.service} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px", padding: "18px 20px"
            }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "0.9rem" }}>{s.service}</div>
                <div style={{ 
                  display: "inline-block", padding: "2px 10px", borderRadius: "100px", fontSize: "0.72rem",
                  background: "rgba(108,71,255,0.15)", color: "#a78bfa", fontWeight: 600
                }}>{s.category}</div>
              </div>
              <div style={{ fontWeight: 800, color: "#00e5a0", whiteSpace: "nowrap", marginLeft: "16px", fontSize: "0.95rem" }}>{s.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TUTOR PLANS */}
      <section style={{ padding: "80px 24px", background: "rgba(108,71,255,0.04)", borderTop: "1px solid rgba(108,71,255,0.1)", borderBottom: "1px solid rgba(108,71,255,0.1)" }}>
        <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>AI Tutor Subscription Tiers</h2>
            <p style={{ color: "#cbd5e1" }}>Monthly recurring revenue from the fastest-growing segment of our user base.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {tutorPlans.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "linear-gradient(135deg, rgba(108,71,255,0.2) 0%, rgba(0,212,255,0.1) 100%)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${plan.highlight ? "rgba(108,71,255,0.5)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "20px", padding: "36px 28px",
                boxShadow: plan.highlight ? "0 0 40px rgba(108,71,255,0.15)" : "none",
                position: "relative" as any,
              }}>
                {plan.badge && (
                  <div style={{
                    position: "absolute" as any, top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #6C47FF, #00d4ff)", padding: "4px 16px",
                    borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" as any
                  }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "4px" }}>{plan.name}</h3>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: plan.highlight ? "#a78bfa" : "#e2e8f0", marginBottom: "4px" }}>{plan.price}</div>
                <div style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "28px" }}>{plan.priceUSD} USD equivalent</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.88rem", color: "#cbd5e1" }}>
                      <span style={{ color: "#00e5a0", flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENDOR TIERS */}
      <section style={{ padding: "80px 24px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>Vendor Partner Tiers</h2>
          <p style={{ color: "#cbd5e1" }}>Graduated commission structure incentivizes high-quality, high-volume vendors.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {vendorTiers.map((tier) => (
            <div key={tier.name} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "28px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontWeight: 800 }}>{tier.name}</h3>
                <span style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0", padding: "4px 12px", borderRadius: "100px", fontWeight: 700, fontSize: "0.85rem" }}>{tier.commission}</span>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "20px" }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {tier.perks.map((p) => (
                  <li key={p} style={{ fontSize: "0.85rem", color: "#cbd5e1", display: "flex", gap: "8px" }}>
                    <span style={{ color: "#6C47FF" }}>▸</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* INVESTMENT USE OF FUNDS */}
      <section style={{ padding: "80px 24px", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>Use of Investment Funds</h2>
            <p style={{ color: "#cbd5e1" }}>Disciplined capital allocation to drive user growth, product depth, and market expansion.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {[
              { pct: "35%", label: "User Acquisition", desc: "University campaigns, SME partnerships, social media" },
              { pct: "25%", label: "AI Enhancement", desc: "Local data fine-tuning, prompt engineering, model hosting" },
              { pct: "20%", label: "Payment Infrastructure", desc: "Local bank APIs, real-time payout processing" },
              { pct: "12%", label: "Geographic Expansion", desc: "Ghana, Kenya, and South Africa market entry" },
              { pct: "8%", label: "Operations & Compliance", desc: "Legal, customer support, platform reliability" },
            ].map((item) => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "24px"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#6C47FF", marginBottom: "6px" }}>{item.pct}</div>
                <div style={{ fontWeight: 700, marginBottom: "6px" }}>{item.label}</div>
                <div style={{ color: "#cbd5e1", fontSize: "0.82rem" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,212,255,0.2) 0%, rgba(108,71,255,0.15) 40%, transparent 70%)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "20px" }}>
            Partner With the Platform<br />Powering Africa's Digital Economy
          </h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.8, marginBottom: "48px", fontSize: "1.05rem" }}>
            A ₦2.64 billion annual revenue trajectory by 2030, built on proven infrastructure, a live production platform, and a verified vendor ecosystem — the foundation is in place. What we need is the fuel.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://novaxdigitalcentre.vercel.app" target="_blank" style={{
              display: "inline-block", padding: "16px 40px",
              background: "linear-gradient(135deg, #6C47FF, #00d4ff)",
              borderRadius: "100px", fontWeight: 700, color: "#fff", textDecoration: "none",
              fontSize: "1.05rem", boxShadow: "0 0 60px rgba(0,212,255,0.4)"
            }}>
              Explore the Live Platform
            </a>
            <a href="/pitch" style={{
              display: "inline-block", padding: "16px 40px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px", fontWeight: 600,
              color: "#e2e8f0", textDecoration: "none", fontSize: "1.05rem"
            }}>
              ← Standard Pitch Deck
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          © 2026 NovaX Digital Centre. Confidential. For authorised investors and partners only.<br/>
          Financial projections are forward-looking estimates and not guaranteed.
        </p>
      </footer>
    </div>
  );
}

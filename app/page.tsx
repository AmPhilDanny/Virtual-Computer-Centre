import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  { icon: "⌨️", title: "Typing Services", desc: "Fast, accurate document typing from handwritten notes, PDFs or audio recordings.", price: "From ₦500", href: "/services/document-typing", category: "Core" },
  { icon: "🎓", title: "Academic Assistance", desc: "Essays, assignments, thesis formatting, research papers, and project writing.", price: "From ₦1,500", href: "/services/assignment-writing", category: "Academic" },
  { icon: "📋", title: "CV & Resume", desc: "ATS-optimized CV writing, LinkedIn profile, and cover letter packages.", price: "From ₦2,000", href: "/services/cv-resume-writing", category: "Professional" },
  { icon: "🏛️", title: "Government Forms", desc: "JAMB, NYSC, BVN, FRSC, Immigration, NIN issue resolution & more.", price: "From ₦1,000", href: "/services/nin-assistance", category: "Government" },
  { icon: "🤖", title: "AI Document Summarizer", desc: "Upload any document and receive an intelligent, accurate summary in minutes.", price: "From ₦300", href: "/services/document-summarization", category: "AI" },
  { icon: "📊", title: "Data Entry & Excel", desc: "Professional data entry, spreadsheet formatting, and database management.", price: "From ₦800", href: "/services/data-entry", category: "Business" },
  { icon: "🎤", title: "Transcription", desc: "Convert audio and video recordings to accurate, well-formatted text.", price: "From ₦700", href: "/services/transcription", category: "AI" },
  { icon: "📝", title: "Grant & NGO Applications", desc: "Professional grant writing, scholarship applications, and SOP drafting.", price: "From ₦3,000", href: "/services/ngo-grant-application", category: "Professional" },
];

const steps = [
  { num: "01", title: "Choose a Service", desc: "Browse our catalog and select the service that fits your need." },
  { num: "02", title: "Submit Your Job", desc: "Fill out the smart form, attach files, and choose your delivery speed." },
  { num: "03", title: "AI Gets to Work", desc: "Our intelligent agents process, review, and quality-check your task." },
  { num: "04", title: "Receive & Review", desc: "Download your completed work. Request free revisions if needed." },
];

const testimonials = [
  { name: "Chioma A.", role: "Student, UNILAG", text: "I submitted my thesis formatting at 11pm and it was done by 6am. Absolutely incredible service.", avatar: "C" },
  { name: "Emmanuel T.", role: "HR Manager", text: "The CV writing service got me 3 interview calls in one week. Worth every kobo.", avatar: "E" },
  { name: "Fatima K.", role: "Small Business Owner", text: "They handled my CAC registration assistance smoothly. No stress at all.", avatar: "F" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ======= HERO ======= */}
      <section className="hero">
        <div className="hero-bg-orb hero-bg-orb-1" />
        <div className="hero-bg-orb hero-bg-orb-2" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-badge">
            <span>🤖</span> Powered by Advanced AI Agents
          </div>
          <h1 className="hero-title">
            Your Digital Computer Centre,
            <br />
            <span className="text-gradient">Now Powered by AI</span>
          </h1>
          <p className="hero-subtitle">
            Professional typing, academic, government, and business services completed by intelligent AI agents — fast, accurate, and affordable.
          </p>
          <div className="hero-actions">
            <Link href="/services" className="btn btn-primary btn-xl">
              Explore Services →
            </Link>
            <Link href="/auth/register" className="btn btn-secondary btn-xl">
              Create Free Account
            </Link>
          </div>
          <div className="hero-stats">
            {[
              { value: "50+", label: "Services Available" },
              { value: "24/7", label: "AI Availability" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "5min", label: "Avg. Response Time" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SERVICES ======= */}
      <section className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">What We Offer</div>
            <h2>Services Built for <span className="text-gradient">Every Need</span></h2>
            <p>From government form filling to AI-powered document analysis — we handle it all professionally.</p>
          </div>
          <div className="grid-4" style={{ marginBottom: "var(--space-10)" }}>
            {services.map((s) => (
              <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
                <div className="service-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                    <div className="service-card-icon">{s.icon}</div>
                    <span className="badge badge-primary">{s.category}</span>
                  </div>
                  <h3 className="service-card-title">{s.title}</h3>
                  <p className="service-card-desc">{s.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="service-card-price">{s.price}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--brand-primary)" }}>Order →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <Link href="/services" className="btn btn-secondary btn-lg">
              View All 50+ Services
            </Link>
          </div>
        </div>
      </section>

      {/* ======= HOW IT WORKS ======= */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Simple Process</div>
            <h2>How It <span className="text-gradient">Works</span></h2>
            <p>Submit your task in minutes. Our AI handles the rest.</p>
          </div>
          <div className="grid-4">
            {steps.map((step, i) => (
              <div key={step.num} className="glass-card" style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3rem",
                  fontWeight: 900,
                  background: "var(--grad-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "var(--space-4)",
                  lineHeight: 1,
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-3)" }}>{step.title}</h3>
                <p style={{ fontSize: "0.9rem" }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{
                    position: "absolute",
                    right: "-20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--border-medium)",
                    fontSize: "1.5rem",
                    display: "none",
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= AI AGENTS SECTION ======= */}
      <section className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container">
          <div className="grid-2" style={{ gap: "var(--space-16)", alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-primary)", marginBottom: "var(--space-3)" }}>
                AI-First Architecture
              </div>
              <h2 style={{ marginBottom: "var(--space-5)" }}>
                Five AI Agents Working <span className="text-gradient">For You</span>
              </h2>
              <p style={{ marginBottom: "var(--space-8)" }}>
                Every job you submit flows through a pipeline of specialized AI agents — each responsible for a different stage of your task.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {[
                  { icon: "🔍", name: "Intake Agent", desc: "Validates your submission and flags missing information instantly." },
                  { icon: "🧠", name: "Analysis Agent", desc: "Determines complexity, scope, and the best execution path." },
                  { icon: "⚙️", name: "Execution Agent", desc: "Completes the task using specialized AI models and tools." },
                  { icon: "✅", name: "QA Agent", desc: "Reviews the output for quality, accuracy, and compliance." },
                  { icon: "🚨", name: "Escalation Agent", desc: "Flags complex tasks for human expert review automatically." },
                ].map((agent) => (
                  <div key={agent.name} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-4)",
                    padding: "var(--space-4)",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    transition: "all var(--transition-base)",
                  }}>
                    <span style={{ fontSize: "1.25rem" }}>{agent.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "var(--space-1)" }}>{agent.name}</div>
                      <p style={{ fontSize: "0.875rem", margin: 0 }}>{agent.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card" style={{ padding: "var(--space-6)" }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 2 }}>
                <div style={{ color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>// Live job processing pipeline</div>
                {[
                  { status: "✅", text: "Intake Agent → Job validated", color: "var(--brand-success)" },
                  { status: "✅", text: "Analysis Agent → Complexity: MEDIUM", color: "var(--brand-success)" },
                  { status: "🔄", text: "Execution Agent → Generating output...", color: "var(--brand-secondary)" },
                  { status: "⏳", text: "QA Agent → Waiting...", color: "var(--text-muted)" },
                  { status: "⏳", text: "Delivery → Pending...", color: "var(--text-muted)" },
                ].map((line, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)", background: i === 2 ? "rgba(0,212,255,0.05)" : "transparent" }}>
                    <span>{line.status}</span>
                    <span style={{ color: line.color }}>{line.text}</span>
                  </div>
                ))}
                <div style={{ marginTop: "var(--space-4)", padding: "var(--space-3)", background: "rgba(108,71,255,0.08)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--brand-primary)" }}>AI Confidence Score: 94.7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= AI TUTOR CTA ======= */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="glass-card" style={{ 
            background: "linear-gradient(145deg, rgba(108,71,255,0.1) 0%, rgba(30,30,40,0.8) 100%)",
            border: "1px solid rgba(108,71,255,0.3)",
            padding: "var(--space-10)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-10)",
            justifyContent: "space-between",
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, fontSize: "15rem", opacity: 0.05 }}>🤖</div>
            <div style={{ flex: "1 1 400px", position: "relative", zIndex: 1 }}>
              <div className="eyebrow" style={{ color: "var(--brand-primary)" }}>New Feature</div>
              <h2 style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>
                Meet Your Personal <span className="text-gradient">AI Tutor</span>
              </h2>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
                Upload your textbooks, slides, and curriculums. Get 24/7 personalized tutoring tailored to your exact learning style and academic level.
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)", listStyle: "none", padding: 0 }}>
                {["Adaptive learning based on your profile", "Document analysis & quiz generation", "Always available, never gets tired"].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-primary)" }}>
                    <span style={{ color: "var(--brand-success)" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: "var(--space-4)" }}>
                <Link href="/dashboard/tutor" className="btn btn-primary btn-lg flex items-center gap-2">
                  Start Learning Now →
                </Link>
                <Link href="/auth/register" className="btn btn-secondary btn-lg">
                  Free Trial
                </Link>
              </div>
            </div>
            <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
              <div style={{ 
                width: "100%", 
                maxWidth: "350px", 
                height: "350px", 
                borderRadius: "var(--radius-xl)", 
                background: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800')", 
                backgroundSize: "cover", 
                backgroundPosition: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                border: "4px solid rgba(255,255,255,0.05)"
              }} />
            </div>
          </div>
        </div>
      </section>

          </div>
        </div>
      </section>

      {/* ======= MARKETPLACE CTA ======= */}
      <section className="section" style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div className="glass-card flex items-center justify-between gap-10 flex-wrap" style={{ padding: "var(--space-10)", border: "1px solid var(--brand-primary)" }}>
            <div style={{ flex: "1 1 400px" }}>
              <div className="eyebrow">Marketplace</div>
              <h2 style={{ marginBottom: "var(--space-4)" }}>Earn by Sharing Your <span className="text-gradient">Expertise</span></h2>
              <p style={{ marginBottom: "var(--space-6)" }}>
                Are you a skilled writer, data entry expert, or digital professional? Join our marketplace and start selling your services to our global client base.
              </p>
              <div className="flex gap-4">
                <Link href="/dashboard/become-vendor" className="btn btn-primary btn-lg">
                  Become a Vendor →
                </Link>
                <Link href="/services" className="btn btn-ghost btn-lg">
                  Browse Projects
                </Link>
              </div>
            </div>
            <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
               <div style={{ position: "relative" }}>
                  <div style={{ 
                    width: "120px", height: "120px", borderRadius: "30px", 
                    background: "var(--grad-primary)", display: "flex", 
                    alignItems: "center", justifyContent: "center", color: "#fff",
                    boxShadow: "var(--shadow-glow)"
                  }}>
                    <Store size={48} />
                  </div>
                  <div style={{ position: "absolute", bottom: -20, right: -20, background: "var(--brand-success)", color: "#fff", padding: "8px 16px", borderRadius: "var(--radius-full)", fontWeight: 700, fontSize: "0.8rem", boxShadow: "var(--shadow-md)" }}>
                    Verified Vendor
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= CTA BANNER ======= */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            background: "var(--grad-primary)",
            borderRadius: "var(--radius-2xl)",
            padding: "var(--space-16) var(--space-12)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }} />
            <h2 style={{ color: "#fff", marginBottom: "var(--space-4)", position: "relative" }}>
              Ready to Get Your Task Done?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "var(--space-8)", position: "relative", maxWidth: "480px", margin: "0 auto var(--space-8)" }}>
              Join thousands of students, professionals, and businesses who trust AI Computer Centre for their digital service needs.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/auth/register" className="btn btn-lg" style={{ background: "#fff", color: "var(--brand-primary)", fontWeight: 700 }}>
                Start Free Today
              </Link>
              <Link href="/services" className="btn btn-lg" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle, ShieldCheck, Zap, Info, Clock } from "lucide-react";

export default async function PublicServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;

  // 1. Fetch Service
  const service = await prisma.service.findUnique({
    where: { slug, isActive: true },
  });

  if (!service) {
    notFound();
  }

  // 2. Auth Guard: If logged in, send to dashboard directly for better UX
  if (session?.user) {
    redirect(`/dashboard/services/${slug}`);
  }

  return (
    <>
      <Navbar />

      <main className="section" style={{ background: "var(--bg-surface)", minHeight: "80vh" }}>
        <div className="container">
          {/* Back Button */}
          <Link href="/services" className="btn btn-ghost btn-sm" style={{ marginBottom: "var(--space-8)", display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
            <ArrowLeft size={16} /> Back to All Services
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "var(--space-12)", alignItems: "start" }}>
            {/* Left: Info */}
            <div className="flex-col gap-8">
              <div>
                <div className="badge badge-primary" style={{ marginBottom: "var(--space-4)" }}>{service.category.replace("_", " ")}</div>
                <h1 style={{ marginBottom: "var(--space-4)", fontSize: "clamp(2rem, 5vw, 3rem)" }}>{service.name}</h1>
                <p className="hero-subtitle" style={{ textAlign: "left", margin: 0, fontSize: "1.125rem" }}>
                  {service.description}
                </p>
              </div>

              <div className="grid-2">
                <div className="glass-card" style={{ padding: "var(--space-6)" }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: "var(--space-2)", color: "var(--brand-primary)" }}>
                    <Zap size={20} />
                    <span style={{ fontWeight: 700 }}>Starting Price</span>
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>₦{service.basePrice.toLocaleString()}</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>Transparent pricing, no hidden fees</div>
                </div>

                <div className="glass-card" style={{ padding: "var(--space-6)" }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: "var(--space-2)", color: "var(--brand-secondary)" }}>
                    <Clock size={20} />
                    <span style={{ fontWeight: 700 }}>Turnaround</span>
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>{service.turnaroundHours}h</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>Estimated delivery time</div>
                </div>
              </div>

              <div className="flex-col gap-6">
                 <h3 style={{ fontSize: "1.25rem" }}>Why use our AI Computer Centre?</h3>
                 <div className="flex-col gap-4">
                    {[
                      { title: "AI-Powered Accuracy", desc: "Our intelligent agents process your request with 99.9% precision." },
                      { title: "Human Expert Review", desc: "Every job is cross-checked by a professional before delivery." },
                      { title: "Secure & Confidential", desc: "Your data is encrypted and handled with strict privacy protocols." },
                      { title: "Instant Status Tracking", desc: "Monitor your job progress in real-time from your dashboard." },
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div style={{ 
                          width: "28px", 
                          height: "28px", 
                          borderRadius: "var(--radius-full)", 
                          background: "var(--grad-primary)", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          color: "#fff",
                          flexShrink: 0
                        }}>
                          <CheckCircle size={14} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "1rem" }}>{feature.title}</div>
                          <p style={{ fontSize: "0.9rem", margin: 0 }}>{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Right: CTA Card */}
            <div className="glass-card" style={{ padding: "var(--space-8)", position: "sticky", top: "100px", borderColor: "var(--brand-primary)", borderWidth: "2px" }}>
              <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>🤖</div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "var(--space-3)" }}>Ready to Start?</h2>
                <p className="text-muted" style={{ fontSize: "0.9375rem" }}>
                  Join thousands of users getting their tasks done faster with AI. Create an account to place your order.
                </p>
              </div>

              <div className="flex-col gap-4">
                <Link href={`/auth/register?callbackUrl=/dashboard/services/${slug}`} className="btn btn-primary btn-xl w-full">
                  Create Free Account
                </Link>
                <Link href={`/auth/login?callbackUrl=/dashboard/services/${slug}`} className="btn btn-secondary btn-xl w-full">
                  Sign In to Continue
                </Link>
              </div>

              <div style={{ marginTop: "var(--space-8)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-3" style={{ color: "var(--brand-success)", fontSize: "0.875rem", fontWeight: 600 }}>
                  <ShieldCheck size={18} /> Secure Transaction
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
                  Your secure payment is handled via Paystack. Your satisfaction is our top priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

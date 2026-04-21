import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://novaxdigitalcentre.vercel.app";

export const metadata: Metadata = {
  title: "All Services — Typing, NIN, Academic Help, AI Tools & More | NovaX Digital Centre",
  description: "Browse 50+ professional services: document typing, NIN registration, assignment writing, CV and resume, transcription, data entry, AI summarization, grant writing — all delivered fast online.",
  keywords: [
    "document typing Nigeria", "NIN registration Nigeria", "assignment writing Nigeria",
    "CV writing Nigeria", "resume writing Nigeria", "JAMB registration help Nigeria",
    "NYSC portal assistance", "BVN assistance Nigeria", "transcription services Nigeria",
    "data entry Nigeria", "AI summarizer Nigeria", "grant writing Nigeria",
    "CAC business registration Nigeria", "TIN registration Nigeria", "proofreading Nigeria",
    "SOP writing Nigeria", "PowerPoint design Nigeria", "translation services Nigeria",
    "computer centre services Nigeria", "thesis writing Nigeria",
  ],
  alternates: { canonical: `${BASE}/services` },
  openGraph: {
    title: "All Services | NovaX Digital Centre",
    description: "50+ professional digital services — typing, academic help, government forms, AI tools. Fast delivery. Affordable prices.",
    url: `${BASE}/services`,
    images: [{ url: `${BASE}/favicon.png`, width: 1200, height: 630, alt: "NovaX Digital Centre Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "50+ Services | NovaX Digital Centre",
    description: "Document typing, NIN help, academic writing, AI tools and more. Order in minutes.",
    images: [`${BASE}/favicon.png`],
  },
};

const allServices = [
  {
    category: "Typing & Documents",
    icon: "⌨️",
    color: "#6C47FF",
    services: [
      { name: "Document Typing", price: "₦500", time: "2-4hrs", desc: "Handwritten → typed with 99.9% accuracy." },
      { name: "Form Typing", price: "₦300", time: "1-2hrs", desc: "Fill and type structured forms from your data." },
      { name: "Manuscript Typing", price: "₦1,000", time: "4-8hrs", desc: "Full book, thesis, or manuscript typing." },
      { name: "Data Entry", price: "₦800", time: "2-3hrs", desc: "Spreadsheet, database, and catalog data entry." },
    ],
  },
  {
    category: "Academic & Research",
    icon: "🎓",
    color: "#00D4FF",
    services: [
      { name: "Assignment Writing", price: "₦1,500", time: "6-12hrs", desc: "Any subject, any level." },
      { name: "Project / Thesis Writing", price: "₦5,000", time: "24-48hrs", desc: "Full chapters, references, appendices." },
      { name: "Thesis Formatting", price: "₦2,000", time: "4-8hrs", desc: "APA, MLA, Harvard, Chicago formatting." },
      { name: "Research Assistance", price: "₦1,000", time: "3-6hrs", desc: "Literature review and data compilation." },
      { name: "Proofreading & Editing", price: "₦800", time: "2-4hrs", desc: "Grammar correction and coherence review." },
      { name: "Plagiarism Check", price: "₦500", time: "30min", desc: "AI-powered originality verification." },
    ],
  },
  {
    category: "Professional Documents",
    icon: "📋",
    color: "#00E5A0",
    services: [
      { name: "CV / Resume Writing", price: "₦2,000", time: "4-8hrs", desc: "ATS-optimized, role-specific resumes." },
      { name: "Cover Letter Writing", price: "₦1,000", time: "2-4hrs", desc: "Compelling, personalized letters." },
      { name: "Statement of Purpose (SOP)", price: "₦2,500", time: "6-12hrs", desc: "For universities and scholarship bodies." },
      { name: "Scholarship Application", price: "₦3,000", time: "8-24hrs", desc: "Essays, recommendations, full packages." },
      { name: "PowerPoint / Pitch Deck", price: "₦3,500", time: "6-24hrs", desc: "Professional, visually stunning slides." },
    ],
  },
  {
    category: "Government & Corporate",
    icon: "🏛️",
    color: "#FFB347",
    services: [
      { name: "NIN Assistance", price: "₦1,000", time: "1-2hrs", desc: "NIN issues, linkage, corrections." },
      { name: "JAMB Registration", price: "₦500", time: "1hr", desc: "UTME, Direct Entry, mock registration." },
      { name: "NYSC Portal Assistance", price: "₦800", time: "1-3hrs", desc: "Registration, mobilisation, exemptions." },
      { name: "BVN / Bank Assistance", price: "₦600", time: "1-2hrs", desc: "BVN enrollment and bank onboarding." },
      { name: "Business Name Registration", price: "₦5,000", time: "24-48hrs", desc: "CAC registration assistance end-to-end." },
      { name: "TIN Registration", price: "₦2,000", time: "4-8hrs", desc: "Tax Identification Number assistance." },
      { name: "NGO / Grant Application", price: "₦3,000", time: "12-24hrs", desc: "Grant writing for NGOs and startups." },
    ],
  },
  {
    category: "AI-Enhanced Services",
    icon: "🤖",
    color: "#FF6B6B",
    services: [
      { name: "Document Summarization", price: "₦300", time: "15min", desc: "AI-generated concise summaries of any doc." },
      { name: "Translation", price: "₦700", time: "1-3hrs", desc: "50+ languages with context awareness." },
      { name: "Transcription", price: "₦700", time: "2-4hrs", desc: "Audio / video → formatted text." },
      { name: "Grammar & Style Check", price: "₦400", time: "30min", desc: "Deep AI grammar and style correction." },
      { name: "Content Writing", price: "₦1,200", time: "2-6hrs", desc: "SEO articles, blogs, product descriptions." },
      { name: "Email Marketing Setup", price: "₦2,500", time: "4-8hrs", desc: "Campaign design, sequences, and copy." },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "var(--space-16) 0",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <div className="badge badge-primary" style={{ margin: "0 auto var(--space-5)" }}>
            50+ Services Available
          </div>
          <h1 style={{ marginBottom: "var(--space-4)" }}>
            Every Service, <span className="text-gradient">AI-Powered</span>
          </h1>
          <p style={{ maxWidth: "560px", margin: "0 auto", fontSize: "1.0625rem" }}>
            Browse our full catalog of professional digital services. All orders are processed by intelligent AI agents and reviewed by human experts.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section">
        <div className="container">
          {allServices.map((cat) => (
            <div key={cat.category} style={{ marginBottom: "var(--space-16)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-8)",
                  paddingBottom: "var(--space-4)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--radius-md)",
                    background: `${cat.color}1A`,
                    border: `1px solid ${cat.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                >
                  {cat.icon}
                </div>
                <h2 style={{ fontSize: "1.375rem", margin: 0 }}>{cat.category}</h2>
              </div>

              <div className="grid-3">
                {cat.services.map((svc) => (
                  <div key={svc.name} className="glass-card" style={{ padding: "var(--space-5)" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      <h3 style={{ fontSize: "1rem", margin: 0 }}>{svc.name}</h3>
                      <span
                        className="badge badge-info"
                        style={{ flexShrink: 0, marginLeft: "var(--space-2)" }}
                      >
                        {svc.time}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.875rem", marginBottom: "var(--space-4)" }}>
                      {svc.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "1.0625rem",
                          color: cat.color,
                        }}
                      >
                        {svc.price}
                      </span>
                      <Link href="/auth/register" className="btn btn-primary btn-sm">
                        Order Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

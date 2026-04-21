import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://novaxdigitalcentre.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const settingsList = await prisma.siteSettings.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const siteName = settings.siteName || "NovaX Digital Centre";
  const title = settings.seoContactTitle || `Contact Information | ${siteName}`;
  const description = settings.seoContactDesc || "Get in touch with NovaX Digital Centre. Have questions about our services or need assistance? Our team is here to help.";
  const keywords = settings.seoContactKeywords ? settings.seoContactKeywords.split(",").map(k => k.trim()) : [
    "contact NovaX", "customer support Nigeria", "digital centre location",
    "help desk Nigeria", "service center contact",
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `${BASE}/contact` },
    openGraph: {
      title,
      description,
      url: `${BASE}/contact`,
      images: [{ url: `${BASE}/favicon.png`, width: 1200, height: 630, alt: "NovaX Digital Centre Contact" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE}/favicon.png`],
    },
  };
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Contact Us</span>
            <h1>Get In Touch</h1>
            <p>Have questions or need assistance? Our team is here to help.</p>
          </div>

          <div className="grid-2" style={{ gap: "var(--space-12)" }}>
            <div className="flex-col gap-8">
              <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-6)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(108, 71, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)" }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Email Us</h4>
                  <p style={{ margin: 0 }}>support@aicomputercentre.com</p>
                </div>
              </div>
              
              <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-6)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(108, 71, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)" }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Call Us</h4>
                  <p style={{ margin: 0 }}>+234 812 345 6789</p>
                </div>
              </div>

              <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-6)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(108, 71, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)" }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Visit Us</h4>
                  <p style={{ margin: 0 }}>123 AI Plaza, Digital Road, Lagos, Nigeria</p>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: "var(--space-6)" }}>Send a Message</h3>
              <form className="flex-col gap-4">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="Your Email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "var(--space-3)" }}>
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

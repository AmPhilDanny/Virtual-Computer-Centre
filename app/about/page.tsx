import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">About Us</span>
            <h1>Virtual Computer Centre</h1>
            <p>Empowering digital services through artificial intelligence and expert human oversight.</p>
          </div>

          <div className="grid-2" style={{ alignItems: "center", gap: "var(--space-12)" }}>
            <div className="glass-card">
              <h2 style={{ marginBottom: "var(--space-4)" }}>Our Mission</h2>
              <p style={{ marginBottom: "var(--space-6)" }}>
                To provide accessible, high-quality digital services to everyone, everywhere. We leverage cutting-edge AI technology to speed up processing times while maintaining the highest standards of accuracy through our network of expert reviewers.
              </p>
              <h2 style={{ marginBottom: "var(--space-4)" }}>How It Works</h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <li className="flex items-center gap-3">
                  <div className="badge badge-primary">1</div>
                  <span className="text-secondary">Choose a service from our extensive catalog.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="badge badge-primary">2</div>
                  <span className="text-secondary">Upload your requirements or data.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="badge badge-primary">3</div>
                  <span className="text-secondary">AI agents process your request instantly.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="badge badge-primary">4</div>
                  <span className="text-secondary">Human experts review and deliver your final document.</span>
                </li>
              </ul>
            </div>
            <div 
              style={{ 
                height: "400px", 
                background: "var(--grad-primary)", 
                borderRadius: "var(--radius-2xl)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem"
              }}
            >
              🏢
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

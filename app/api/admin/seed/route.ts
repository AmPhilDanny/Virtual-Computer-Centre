import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = [
      { key: "pageContent_about", value: "<h2>About NovaX Digital Centre</h2><p>NovaX Digital Centre is Nigeria's premier AI-powered digital services platform. We combine the efficiency of artificial intelligence with the precision of human expertise to deliver top-notch academic, legal, and professional services.</p><h3>Our Mission</h3><p>To digitize and simplify access to essential services for businesses, students, and professionals across Africa.</p><h3>Why Choose Us?</h3><ul><li><strong>Speed:</strong> Accelerated by AI.</li><li><strong>Accuracy:</strong> Reviewed by experts.</li><li><strong>Accessibility:</strong> 100% online operations.</li></ul>" },
      { key: "pageContent_privacy", value: "<h2>Privacy Policy</h2><p>Your privacy is important to us. This Privacy Policy explains how NovaX Digital Centre collects, uses, and safeguards your personal information.</p><h3>1. Information Collection</h3><p>We collect information such as your name, email, and service documents solely for processing your orders.</p><h3>2. Data Security</h3><p>All data is encrypted in transit and at rest. We do not sell or share your personal data with third parties.</p><h3>3. User Rights</h3><p>You have the right to request deletion or modification of your data at any time by contacting our support team.</p>" },
      { key: "pageContent_terms", value: "<h2>Terms of Service</h2><p>Welcome to NovaX Digital Centre. By using our platform, you agree to these terms.</p><h3>1. Service Agreement</h3><p>We provide digital services as outlined in the service description. Turnaround times are estimates and may vary.</p><h3>2. Payment and Delivery</h3><p>All payments are non-refundable once work has commenced unless explicitly stated in our Refund Policy. Documents are delivered digitally.</p><h3>3. User Conduct</h3><p>Users must not submit illegal, defamatory, or harmful materials for processing.</p>" },
      { key: "pageContent_refund", value: "<h2>Refund Policy</h2><p>We strive for 100% customer satisfaction. Our refund policy is designed to be fair.</p><h3>1. Eligibility</h3><p>Refunds are applicable if we fail to deliver the service within the agreed timeline or if the final output significantly deviates from our quality standards.</p><h3>2. Process</h3><p>To request a refund, please contact support within 3 days of receiving your order.</p><h3>3. Non-refundable</h3><p>Services involving government registration fees (e.g., CAC, NIN) are non-refundable once the application has been submitted.</p>" },
      { key: "pageContent_legal", value: "<h2>Legal Information</h2><p>NovaX Digital Centre is a registered entity operating under the laws of the Federal Republic of Nigeria.</p><h3>Disclaimer</h3><p>While our AI models assist in generating content and completing tasks, final legal or academic compliance remains the responsibility of the user. Our services do not constitute certified legal counsel.</p>" },
      { key: "pageContent_careers", value: "<h2>Careers at NovaX</h2><p>Join the future of digital services. We are always looking for talented individuals to join our team of AI operators and domain experts.</p><h3>Current Openings</h3><p>There are no open positions at the moment, but we encourage you to send your CV to <strong>careers@novax.centre</strong> for future considerations.</p>" },
      { key: "pageContent_aiDisclosure", value: "<h2>AI Usage Disclosure</h2><p>Transparency is a core value at NovaX Digital Centre.</p><h3>How We Use AI</h3><p>Our platform utilizes advanced large language models (LLMs) to accelerate document drafting, transcription, code generation, and data analysis.</p><h3>Human in the Loop</h3><p>All AI-generated outputs are subject to human review before final delivery to ensure accuracy, cultural relevance, and factual correctness.</p>" },
    ];

    for (const setting of settings) {
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      });
    }

    return NextResponse.json({ success: true, message: "Demo content seeded successfully!" });
  } catch (error) {
    console.error("Seed failed:", error);
    return new NextResponse("Seed failed", { status: 500 });
  }
}

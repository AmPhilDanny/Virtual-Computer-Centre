import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONTENT_SEEDS = [
  {
    key: "pageContent_about",
    value: `
      <h2>About NovaX Digital Centre</h2>
      <p>NovaX Digital Centre is Nigeria's premier hybrid digital services platform. We bridge the gap between traditional computer centre services and the future of AI-driven productivity.</p>
      
      <h3>Our Mission</h3>
      <p>To empower Nigerians with high-quality, affordable, and lightning-fast digital services. Whether you are a student needing academic help, a professional seeking to optimize your CV, or a citizen navigating government registrations, we are here to ensure your success.</p>
      
      <h3>The Hybrid Advantage</h3>
      <p>We don't just use AI; we perfect it. Every job submitted to our platform is processed by advanced AI agents and then meticulously reviewed by human experts. This ensures that you get the speed of modern technology with the precision and reliability of human oversight.</p>
      
      <h3>Our Services</h3>
      <ul>
        <li>Professional Document Typing & Formatting</li>
        <li>Academic Research & Assignment Assistance</li>
        <li>NIN, JAMB, NYSC & Government Form Registrations</li>
        <li>ATS-Optimized CV & Resume Writing</li>
        <li>AI-Powered Tutoring & Study Support</li>
      </ul>
    `
  },
  {
    key: "pageContent_privacy",
    value: `
      <h2>Privacy Policy</h2>
      <p>Last Updated: April 2026</p>
      <p>At NovaX Digital Centre, your privacy is our priority. This policy outlines how we handle your data.</p>
      
      <h3>1. Data Collection</h3>
      <p>We collect information you provide when creating an account, submitting jobs, or contacting support. This includes your name, email, phone number, and any documents you upload for processing.</p>
      
      <h3>2. Data Usage</h3>
      <p>Your data is used solely to provide and improve our services. We use AI models to process your documents, but your personal information is never sold to third parties.</p>
      
      <h3>3. Security</h3>
      <p>We use industry-standard encryption to protect your data. Documents uploaded for processing are stored securely and accessible only to authorized personnel and the AI agents assigned to your task.</p>
      
      <h3>4. Your Rights</h3>
      <p>You have the right to request access to, correction of, or deletion of your personal data at any time through your dashboard or by contacting support.</p>
    `
  },
  {
    key: "pageContent_terms",
    value: `
      <h2>Terms of Service</h2>
      <p>By using NovaX Digital Centre, you agree to the following terms:</p>
      
      <h3>1. Service Delivery</h3>
      <p>We strive for 100% accuracy and timely delivery. Delivery times are estimates and may vary based on job complexity and current volume.</p>
      
      <h3>2. User Responsibility</h3>
      <p>You are responsible for the accuracy of the information and documents you provide. You must not use our services for illegal purposes or to generate prohibited content.</p>
      
      <h3>3. Academic Integrity</h3>
      <p>Our academic assistance services are intended as study aids and reference materials. We encourage all students to uphold the academic integrity policies of their respective institutions.</p>
      
      <h3>4. Payments & Refunds</h3>
      <p>Payments are required to initiate or unlock completed jobs. Refunds are processed according to our Refund Policy.</p>
    `
  },
  {
    key: "pageContent_refund",
    value: `
      <h2>Refund Policy</h2>
      <p>We stand behind the quality of our work. If you are not satisfied, we want to make it right.</p>
      
      <h3>1. Revision Guarantee</h3>
      <p>We offer unlimited free revisions for 7 days after job completion if the work does not meet your initial requirements.</p>
      
      <h3>2. Refund Eligibility</h3>
      <p>Full refunds are issued if we fail to deliver your job within the agreed timeframe or if the quality remains unsatisfactory after two revision attempts.</p>
      
      <h3>3. Process</h3>
      <p>To request a refund, please contact support with your Order ID and a brief explanation of the issue. Refunds are typically processed back to your original payment method or wallet within 3-5 business days.</p>
    `
  },
  {
    key: "pageContent_aiDisclosure",
    value: `
      <h2>AI Usage Disclosure</h2>
      <p>NovaX Digital Centre utilizes advanced Artificial Intelligence to enhance service delivery.</p>
      
      <h3>Human-Verified AI</h3>
      <p>While AI generates the initial drafts for many of our services, every single deliverable is reviewed, edited, and verified by a human professional. We do not provide "raw" AI output for any premium service.</p>
      
      <h3>Originality Guarantee</h3>
      <p>Our hybrid process is designed to produce high-quality, original content that reflects human creativity and expert knowledge. We provide a Human Originality Score with our completed jobs to give you full confidence in the work.</p>
    `
  },
  {
    key: "topNavLinks",
    value: JSON.stringify([
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Marketplace", href: "/services?market=true" },
      { label: "AI Tutor", href: "/dashboard/tutor" },
      { label: "About", href: "/p/about" },
    ])
  },
  {
    key: "footerMenuLinks",
    value: JSON.stringify({
      Services: [
        { label: "Typing Services", href: "/services/document-typing" },
        { label: "Academic Help", href: "/services/assignment-writing" },
        { label: "NIN Assistance", href: "/services/nin-assistance" },
        { label: "CV & Resume", href: "/services/cv-resume-writing" },
      ],
      Company: [
        { label: "About Us", href: "/p/about" },
        { label: "Careers", href: "/p/careers" },
        { label: "Investor Pitch", href: "/pitch" },
        { label: "Contact Us", href: "/contact" },
      ],
      Legal: [
        { label: "Privacy Policy", href: "/p/privacy" },
        { label: "Terms of Service", href: "/p/terms" },
        { label: "Refund Policy", href: "/p/refund" },
        { label: "AI Disclosure", href: "/p/aiDisclosure" },
      ],
    })
  }
];

async function main() {
  console.log("Seeding site content and navigation...");
  
  for (const seed of CONTENT_SEEDS) {
    await prisma.siteSettings.upsert({
      where: { key: seed.key },
      update: { value: seed.value },
      create: { key: seed.key, value: seed.value },
    });
    console.log(`- Upserted: ${seed.key}`);
  }
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

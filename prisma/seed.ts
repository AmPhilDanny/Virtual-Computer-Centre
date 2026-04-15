import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fhinovax.com' },
    update: {},
    create: {
      email: 'admin@fhinovax.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log({ admin })

  // Seed Services
  const services = [
    // Typing & Documents
    { name: "Document Typing", slug: "document-typing", basePrice: 500, category: "TYPING", description: "Handwritten → typed with 99.9% accuracy.", turnaroundHours: 4 },
    { name: "Form Typing", slug: "form-typing", basePrice: 300, category: "TYPING", description: "Fill and type structured forms from your data.", turnaroundHours: 2 },
    { name: "Manuscript Typing", slug: "manuscript-typing", basePrice: 1000, category: "TYPING", description: "Full book, thesis, or manuscript typing.", turnaroundHours: 8 },
    { name: "Data Entry", slug: "data-entry", basePrice: 800, category: "TYPING", description: "Spreadsheet, database, and catalog data entry.", turnaroundHours: 3 },

    // Academic & Research
    { name: "Assignment Writing", slug: "assignment-writing", basePrice: 1500, category: "ACADEMIC", description: "Any subject, any level.", turnaroundHours: 12 },
    { name: "Project / Thesis Writing", slug: "project-thesis-writing", basePrice: 5000, category: "ACADEMIC", description: "Full chapters, references, appendices.", turnaroundHours: 48 },
    { name: "Thesis Formatting", slug: "thesis-formatting", basePrice: 2000, category: "ACADEMIC", description: "APA, MLA, Harvard, Chicago formatting.", turnaroundHours: 8 },
    { name: "Research Assistance", slug: "research-assistance", basePrice: 1000, category: "ACADEMIC", description: "Literature review and data compilation.", turnaroundHours: 6 },
    { name: "Proofreading & Editing", slug: "proofreading-editing", basePrice: 800, category: "ACADEMIC", description: "Grammar correction and coherence review.", turnaroundHours: 4 },
    { name: "Plagiarism Check", slug: "plagiarism-check", basePrice: 500, category: "ACADEMIC", description: "AI-powered originality verification.", turnaroundHours: 1 },

    // Professional Documents
    { name: "CV / Resume Writing", slug: "cv-resume-writing", basePrice: 2000, category: "DIGITAL_BUSINESS", description: "ATS-optimized, role-specific resumes.", turnaroundHours: 8 },
    { name: "Cover Letter Writing", slug: "cover-letter-writing", basePrice: 1000, category: "DIGITAL_BUSINESS", description: "Compelling, personalized letters.", turnaroundHours: 4 },
    { name: "Statement of Purpose (SOP)", slug: "sop-writing", basePrice: 2500, category: "DIGITAL_BUSINESS", description: "For universities and scholarship bodies.", turnaroundHours: 12 },
    { name: "Scholarship Application", slug: "scholarship-application", basePrice: 3000, category: "DIGITAL_BUSINESS", description: "Essays, recommendations, full packages.", turnaroundHours: 24 },
    { name: "PowerPoint / Pitch Deck", slug: "powerpoint-pitch-deck", basePrice: 3500, category: "DIGITAL_BUSINESS", description: "Professional, visually stunning slides.", turnaroundHours: 24 },

    // Government & Corporate
    { name: "NIN Assistance", slug: "nin-assistance", basePrice: 1000, category: "GOVERNMENT", description: "NIN issues, linkage, corrections.", turnaroundHours: 2 },
    { name: "JAMB Registration", slug: "jamb-registration", basePrice: 500, category: "GOVERNMENT", description: "UTME, Direct Entry, mock registration.", turnaroundHours: 1 },
    { name: "NYSC Portal Assistance", slug: "nysc-portal-assistance", basePrice: 800, category: "GOVERNMENT", description: "Registration, mobilisation, exemptions.", turnaroundHours: 3 },
    { name: "BVN / Bank Assistance", slug: "bvn-bank-assistance", basePrice: 600, category: "GOVERNMENT", description: "BVN enrollment and bank onboarding.", turnaroundHours: 2 },
    { name: "Business Name Registration", slug: "business-name-registration", basePrice: 5000, category: "GOVERNMENT", description: "CAC registration assistance end-to-end.", turnaroundHours: 48 },
    { name: "TIN Registration", slug: "tin-registration", basePrice: 2000, category: "GOVERNMENT", description: "Tax Identification Number assistance.", turnaroundHours: 8 },
    { name: "NGO / Grant Application", slug: "ngo-grant-application", basePrice: 3000, category: "GOVERNMENT", description: "Grant writing for NGOs and startups.", turnaroundHours: 24 },

    // AI-Enhanced Services
    { name: "Document Summarization", slug: "document-summarization", basePrice: 300, category: "AI_ENHANCED", description: "AI-generated concise summaries of any doc.", turnaroundHours: 1 },
    { name: "Translation", slug: "translation", basePrice: 700, category: "AI_ENHANCED", description: "50+ languages with context awareness.", turnaroundHours: 3 },
    { name: "Transcription", slug: "transcription", basePrice: 700, category: "AI_ENHANCED", description: "Audio / video → formatted text.", turnaroundHours: 4 },
    { name: "Grammar & Style Check", slug: "grammar-style-check", basePrice: 400, category: "AI_ENHANCED", description: "Deep AI grammar and style correction.", turnaroundHours: 1 },
    { name: "Content Writing", slug: "content-writing", basePrice: 1200, category: "AI_ENHANCED", description: "SEO articles, blogs, product descriptions.", turnaroundHours: 6 },
    { name: "Email Marketing Setup", slug: "email-marketing-setup", basePrice: 2500, category: "AI_ENHANCED", description: "Campaign design, sequences, and copy.", turnaroundHours: 8 },
  ]

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        basePrice: svc.basePrice,
        description: svc.description,
        category: svc.category as any,
        turnaroundHours: svc.turnaroundHours,
      },
      create: {
        ...svc,
        category: svc.category as any,
      },
    })
  }

  console.log("Services seeded successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

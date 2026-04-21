import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveAiModel } from "@/lib/ai/factory";
import { generateText } from "ai";

export async function POST(req: Request) {
  const session = await auth();

  const user = session?.user as any;
  if (user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { page } = await req.json();

    const settingsList = await prisma.siteSettings.findMany();
    const settings = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const siteName = settings.siteName || "NovaX Digital Centre";
    
    // Fetch relevant data based on page
    let context = "";
    if (page === "homepage" || page === "services") {
      const services = await prisma.service.findMany({ select: { name: true } });
      context += `Available Services: ${services.map(s => s.name).join(", ")}. `;
    }
    
    if (page === "blog") {
      const recentPosts = await prisma.blogPost.findMany({ 
        where: { isPublished: true },
        take: 5,
        select: { title: true }
      });
      context += `Recent Blog Posts: ${recentPosts.map(p => p.title).join(", ")}. `;
    }

    const model = await getActiveAiModel();

    const prompt = `
      You are an expert SEO strategist. Generate a high-performance SEO configuration for the "${page}" page of a digital services platform in Nigeria.
      
      Site Name: ${siteName}
      Location: Nigeria
      Context: ${context}
      
      Return a JSON object with exactly these fields:
      - title: A compelling browser title (max 60 characters)
      - description: A persuasive meta description (max 160 characters)
      - keywords: A string of 15-20 relevant comma-separated keywords
      
      The tone should be professional, trustworthy, and optimized for high click-through rates on Google. Focus on local Nigerian context where relevant.
      
      Format the response as raw JSON without markdown blocks.
    `;

    const { text } = await generateText({
      model,
      prompt,
    });

    // Clean up response if AI included markdown blocks
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleanedText);

    // Save to settings
    const prefix = `seo${page.charAt(0).toUpperCase() + page.slice(1)}`;
    const updates = [
      { key: `${prefix}Title`, value: result.title },
      { key: `${prefix}Desc`, value: result.description },
      { key: `${prefix}Keywords`, value: result.keywords }
    ];

    for (const update of updates) {
      await prisma.siteSettings.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value },
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("AI SEO Generation Failed:", error);
    return new NextResponse("Failed to generate SEO", { status: 500 });
  }
}

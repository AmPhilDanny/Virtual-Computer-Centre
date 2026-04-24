import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";
import { getActiveAiModel } from "@/lib/ai/factory";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";


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

    let model;
    try {
      model = await getActiveAiModel();
    } catch (e) {
      console.error("AI FACTORY FAILED:", e);
      const google = createGoogleGenerativeAI({
        apiKey: settings.geminiApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
      });
      model = google("gemini-1.5-flash");
    }

    const prompt = `
      You are an expert SEO strategist. Generate a high-performance SEO configuration for the "${page}" page of a digital services platform in Nigeria.
      
      Site Name: ${siteName}
      Location: Nigeria
      Context: ${context}
      
      Return ONLY a JSON object with exactly these fields:
      {
        "title": "Compelling browser title (max 60 characters)",
        "description": "Persuasive meta description (max 160 characters)",
        "keywords": "15-20 comma-separated keywords"
      }
      
      Format the response as raw JSON without markdown blocks.
    `;

    const { text } = await generateText({
      model,
      prompt,
    });


    try {
      // Clean up response if AI included markdown blocks or extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      const result = JSON.parse(jsonText.replace(/```json\n?|\n?```/g, "").trim());

      // Save to settings
      const prefix = `seo${page.charAt(0).toUpperCase() + page.slice(1)}`;
      const updates = [
        { key: `${prefix}Title`, value: result.title || "" },
        { key: `${prefix}Desc`, value: result.description || result.desc || "" },
        { key: `${prefix}Keywords`, value: result.keywords || "" }
      ];

      for (const update of updates) {
        await prisma.siteSettings.upsert({
          where: { key: update.key },
          update: { value: update.value },
          create: { key: update.key, value: update.value },
        });
      }

      return NextResponse.json({ success: true, result });
    } catch (parseError) {
      console.error("AI Response Parsing Failed:", parseError, "Raw Text:", text);
      return new NextResponse("AI returned invalid data format. Please try again.", { status: 500 });
    }

  } catch (error: any) {
    console.error("AI SEO Generation Failed:", error);
    const message = error.message || "Failed to generate SEO configuration";
    return new NextResponse(message, { status: 500 });
  }
}


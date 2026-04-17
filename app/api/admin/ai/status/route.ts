import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST() {
  try {
    const settingsList = await prisma.siteSettings.findMany();
    const settings = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const apiKey = settings.geminiApiKey;

    if (!apiKey) {
      return NextResponse.json({ status: "inactive", message: "API Key not found in settings." }, { status: 400 });
    }

    // Try a simple call to verify the key
    try {
      await generateText({
        model: google("gemini-1.5-flash", { apiKey }),
        prompt: "Hello",
        maxTokens: 1,
      });

      return NextResponse.json({ status: "active", message: "API Key is valid and AI is ready." });
    } catch (aiError: any) {
      console.error("AI Check Error:", aiError);
      return NextResponse.json({ 
        status: "error", 
        message: "API Key invalid or quota exceeded: " + (aiError.message || "Unknown AI error") 
      }, { status: 401 });
    }

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}

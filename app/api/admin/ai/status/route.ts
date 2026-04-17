import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
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

    // Create a provider instance with the dynamic API key
    const google = createGoogleGenerativeAI({ apiKey });

    // Try a simple call to verify the key
    try {
      await generateText({
        model: google("gemini-1.5-flash"),
        prompt: "Hello",
      });

      return NextResponse.json({ status: "active", message: "API Key is valid and AI is ready." });
    } catch (aiError: any) {
      console.error("FULL AI ERROR:", aiError);
      return NextResponse.json({ 
        status: "error", 
        message: "API Key error: " + (aiError.message || "Unknown error") + ". Details: " + JSON.stringify(aiError)
      }, { status: 401 });
    }

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAiModel, type AiProviderType } from "@/lib/ai/factory";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, apiKey, model } = body as { provider: AiProviderType; apiKey: string; model?: string };

    if (!apiKey) {
      return NextResponse.json({ status: "error", message: "API Key is required to test." }, { status: 400 });
    }

    // Prepare settings object for the factory
    // We use the provided apiKey instead of what's in the DB to allow testing before saving
    const tempSettings: Record<string, string> = {
      [`${provider}ApiKey`]: apiKey,
      [`${provider}Model`]: model || "",
      // Map geminiApiKey for google provider
      geminiApiKey: provider === 'google' ? apiKey : "",
      geminiModel: provider === 'google' ? model || "" : "",
    };

    try {
      const aiModel = getAiModel(provider, tempSettings);
      
      await generateText({
        model: aiModel,
        prompt: "Hello",
      });

      return NextResponse.json({ 
        status: "active", 
        message: `${provider.toUpperCase()} AI is active and responding correctly.` 
      });
    } catch (aiError: any) {
      console.error("AI Check Error:", aiError);
      return NextResponse.json({ 
        status: "error", 
        message: `API Key error: ` + (aiError.message || "Unknown error")
      }, { status: 401 });
    }

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}

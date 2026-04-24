import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { prisma } from "@/lib/prisma";

export type AiProviderType = 'google' | 'groq' | 'mistral' | 'togetherai' | 'fireworks' | 'openrouter';

export async function getActiveAiModel() {
  const settingsList = await prisma.siteSettings.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const activeProvider = (settings.activeAiProvider || 'google') as AiProviderType;
  
  return getAiModel(activeProvider, settings);
}

export function getAiModel(provider: AiProviderType, settings: Record<string, string>) {
  try {
    switch (provider) {
      case 'google': {
        const apiKey = settings.geminiApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
          throw new Error("Google Gemini API Key is missing. Please configure it in Settings.");
        }
        const google = createGoogleGenerativeAI({ apiKey });
        return google(settings.geminiModel || "gemini-1.5-flash");
      }
      case 'groq': {
        const apiKey = settings.groqApiKey || process.env.GROQ_API_KEY;
        if (!apiKey) {
          throw new Error("Groq API Key is missing. Please configure it in Settings.");
        }
        const groq = createGroq({ apiKey });
        return groq(settings.groqModel || "llama-3.3-70b-versatile");
      }
      case 'mistral': {
        const apiKey = settings.mistralApiKey || process.env.MISTRAL_API_KEY;
        if (!apiKey) {
          throw new Error("Mistral API Key is missing. Please configure it in Settings.");
        }
        const mistral = createMistral({ apiKey });
        return mistral(settings.mistralModel || "mistral-large-latest");
      }
      case 'togetherai': {
        const apiKey = settings.togetherApiKey || process.env.TOGETHER_API_KEY;
        if (!apiKey) {
          throw new Error("Together AI API Key is missing. Please configure it in Settings.");
        }
        const together = createTogetherAI({ apiKey });
        return together(settings.togetherModel || "meta-llama/Llama-Vision-Free");
      }
      case 'fireworks': {
        const apiKey = settings.fireworksApiKey || process.env.FIREWORKS_API_KEY;
        if (!apiKey) {
          throw new Error("Fireworks AI API Key is missing. Please configure it in Settings.");
        }
        const fireworks = createOpenAI({
          baseURL: 'https://api.fireworks.ai/inference/v1',
          apiKey,
        });
        return fireworks(settings.fireworksModel || "accounts/fireworks/models/llama-v3p1-70b-instruct");
      }
      case 'openrouter': {
        const apiKey = settings.openRouterApiKey || process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          throw new Error("OpenRouter API Key is missing. Please configure it in Settings.");
        }
        const openrouter = createOpenRouter({ apiKey });
        return openrouter(settings.openRouterModel || "google/gemini-2.0-flash-001");
      }
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error: any) {
    console.error(`AI FACTORY ERROR (${provider}):`, error.message);
    throw error;
  }
}



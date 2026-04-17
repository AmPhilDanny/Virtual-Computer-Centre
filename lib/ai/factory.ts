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
  switch (provider) {
    case 'google': {
      const google = createGoogleGenerativeAI({
        apiKey: settings.geminiApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return google(settings.geminiModel || "gemini-2.0-flash-exp");
    }
    case 'groq': {
      const groq = createGroq({
        apiKey: settings.groqApiKey,
      });
      return groq(settings.groqModel || "llama-3.3-70b-versatile");
    }
    case 'mistral': {
      const mistral = createMistral({
        apiKey: settings.mistralApiKey,
      });
      return mistral(settings.mistralModel || "mistral-large-latest");
    }
    case 'togetherai': {
      const together = createTogetherAI({
        apiKey: settings.togetherApiKey,
      });
      return together(settings.togetherModel || "meta-llama/Llama-Vision-Free");
    }
    case 'fireworks': {
      const fireworks = createOpenAI({
        baseURL: 'https://api.fireworks.ai/inference/v1',
        apiKey: settings.fireworksApiKey,
      });
      return fireworks(settings.fireworksModel || "accounts/fireworks/models/llama-v3p1-70b-instruct");
    }
    case 'openrouter': {
      const openrouter = createOpenRouter({
        apiKey: settings.openRouterApiKey,
      });
      return openrouter(settings.openRouterModel || "google/gemini-2.0-flash-001");
    }
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

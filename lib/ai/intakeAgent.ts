import { generateText } from "ai";
import { getActiveAiModel } from "./factory";
import { prisma } from "@/lib/prisma";

export async function analyzeJobIntake(
  serviceName: string, 
  servicePrompt: string | null, 
  clientFormData: Record<string, any>
) {
  try {
    // Fetch relevant knowledge base datasets (Global or Service-Specific)
    const datasets = await prisma.dataset.findMany({
      where: {
        OR: [
          { serviceId: null }, // Global knowledge
          { serviceId: (await prisma.service.findFirst({ where: { name: serviceName } }))?.id }
        ]
      },
      select: { content: true }
    });

    const knowledgeContext = datasets
      .map(d => d.content)
      .filter(Boolean)
      .join("\n\n---\n\n")
      .slice(0, 15000); // 15k char truncation for context window safety

    const intakePrompt = `
      You are the Intake Agent for an online Computer Centre.
      A client has requested the service: "${serviceName}".
      
      REFERENCE KNOWLEDGE (Use this to guide your assessment):
      ${knowledgeContext || "No supplementary knowledge available."}

      Service specific rules/instructions defined by admin:
      ${servicePrompt || "No specific rules defined. Proceed with standard analysis."}

      The client provided the following form data:
      ${JSON.stringify(clientFormData, null, 2)}

      Your task is to analyze this data.
      Assess its complexity (LOW, MEDIUM, HIGH) based on the amount of work required.
      Check if the request violates any ethical boundaries (e.g., illegal activities, severe academic dishonesty like taking an online exam for someone else instead of just editing an essay).

      Return your assessment in strict JSON format:
      {
        "complexity": "LOW | MEDIUM | HIGH",
        "isValid": boolean,
        "notesForAdmin": "Any warnings, missing data flags, or summary of the task."
      }
    `;

    const intakeModel = await getActiveAiModel();

    const { text } = await generateText({
      model: intakeModel,
      prompt: intakePrompt,
      system: "You are a precise JSON-only outputting intake agent."
    });

    // Strip markdown formatting if the model wrapped it (e.g. ```json ... ```)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Intake Agent Error:", error);
    return {
      complexity: "MEDIUM",
      isValid: true,
      notesForAdmin: "AI Intake could not analyze this job due to an error. Manual review required."
    };
  }
}

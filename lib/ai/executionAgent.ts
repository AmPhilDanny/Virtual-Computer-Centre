import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { prisma } from "@/lib/prisma";

export async function processJobExecution(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { service: true }
    });

    if (!job) return { success: false, message: "Job not found" };

    const { service, formData } = job;

    if (service.autonomyLevel === "HUMAN_ONLY") {
      return { success: false, message: "Job is set to Human Only processing." };
    }

    const executionPrompt = `
      You are the Execution Agent for the AI Computer Centre.
      You have been tasked to process a digital service request.

      Service Request: ${service.name}
      Service Instructions (from Admin): ${service.aiPrompt || "Execute the client's request based on the form data."}

      Client Data Submitted:
      ${JSON.stringify(formData, null, 2)}

      Perform the required task accurately. This might involve rewriting Text, formatting a CV, writing an email sequence, translating, etc.
      
      Return your completed work in clean, structured formatting. Provide ONLY the final output the client requested, do not include preamble.
    `;

    // Process using Gemini 1.5 Pro to handle complex creative/reasoning tasks
    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: executionPrompt,
      system: "You are an expert AI Execution Agent completing professional digital services."
    });

    // Determine the next status based on Autonomy Level
    const newStatus = service.autonomyLevel === "AI_ONLY" ? "COMPLETED" : "REVIEW";

    // Update the Job in the database
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        aiOutput: text,
        aiConfidence: 0.95, // mock confidence score
        status: newStatus,
        completedAt: newStatus === "COMPLETED" ? new Date() : null
      }
    });

    return { 
      success: true, 
      message: `AI Execution successful. Status changed to ${newStatus}.`,
      job: updatedJob
    };

  } catch (error: any) {
    console.error("Execution Agent Error:", error);
    return { success: false, message: error.message || "Failed AI Execution" };
  }
}

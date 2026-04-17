import { generateText } from "ai";
import { prisma } from "@/lib/prisma";
import { getActiveAiModel } from "./factory";

export async function processJobExecution(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { 
        service: true,
        user: { select: { email: true, name: true, phone: true } }
      }
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

    // Process using the active provider
    const executionModel = await getActiveAiModel();

    const { text } = await generateText({
      model: executionModel,
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

    // Send Notification
    import("@/lib/notifications").then(n => {
      n.sendNotification({
        toEmail: job.user.email || undefined,
        toPhone: job.user.phone || undefined,
        subject: `Service Completed: ${job.title}`,
        event: 'AI_COMPLETED',
        data: {
          job_id: job.id,
          job_title: job.title,
          customer_name: job.user.name || "Customer",
          service_name: job.service.name,
          status: newStatus
        }
      });
    }).catch(e => console.error("Completion notification error:", e));

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

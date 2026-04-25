import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTutorResponse } from "@/lib/ai/tutorAgent";
import { NextResponse } from "next/server";
import { convertToModelMessages } from "ai";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    // 1. Check Subscription Status
    const subscription = await prisma.subscription.findFirst({
      where: { 
        userId,
        status: "ACTIVE",
        expiresAt: { gt: new Date() }
      }
    });

    if (!subscription) {
      return new NextResponse("Active subscription required for AI Tutoring.", { status: 403 });
    }

    const { messages, materialId } = await req.json();

    // 2. Fetch User & Materials
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tutorSessions: { orderBy: { updatedAt: "desc" }, take: 1 } }
    });

    const material = await prisma.studyMaterial.findUnique({
      where: { id: materialId }
    });

    if (!material) {
      return new NextResponse("Study material not found.", { status: 404 });
    }

    // 3. Get or Create Session
    const sessionData = user?.tutorSessions[0] || { learningPatterns: {} };
    const sessionId = user?.tutorSessions[0]?.id;

    // 4. Return Data Stream Response with persistence
    const result = await generateTutorResponse(
      await convertToModelMessages(messages),
      { name: user?.name, ...((user?.studentProfile as any) || {}) },
      material.extractedText || "",
      sessionData.learningPatterns
    );

    // Save to DB on finish
    return result.toUIMessageStreamResponse({
      onFinish: async ({ responseMessage }) => {
        const updatedMessages = [
          ...messages,
          responseMessage
        ];
        
        // 5. Run Reflection Agent to update learning patterns
        // Note: We do this after saving the message to ensure context is complete
        const newPatterns = await import("@/lib/ai/tutorAgent").then(m => 
          m.reflectOnSession(updatedMessages as any, sessionData.learningPatterns)
        );

        if (sessionId) {
          await prisma.tutorSession.update({
            where: { id: sessionId },
            data: {
              messages: updatedMessages as any,
              learningPatterns: newPatterns,
              lastActivity: new Date()
            },
          });
        } else {
          await prisma.tutorSession.create({
            data: {
              userId,
              messages: updatedMessages as any,
              learningPatterns: newPatterns
            }
          });
        }

        // 6. Sync with Global Student Profile
        if (newPatterns.preferredStyle) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              studentProfile: {
                ...(user?.studentProfile as any || {}),
                learningStyle: newPatterns.preferredStyle
              }
            }
          });
        }
      }
    });
  } catch (error) {
    console.error("[TUTOR_CHAT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

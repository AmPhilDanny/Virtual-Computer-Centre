import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTutorResponse } from "@/lib/ai/tutorAgent";
import { NextResponse } from "next/server";

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

    // 4. Return Data Stream Response with persistence
    const result = await generateTutorResponse(
      messages,
      { name: user?.name, ...((user?.studentProfile as any) || {}) },
      material.extractedText || "",
      sessionData.learningPatterns
    );

    return result.toDataStreamResponse({
      onFinish: async ({ text }) => {
        // Save the exchange to TutorSession
        const updatedMessages = [
          ...messages,
          { role: "assistant", content: text }
        ];

        if (user?.tutorSessions[0]) {
          await prisma.tutorSession.update({
            where: { id: user.tutorSessions[0].id },
            data: { 
              messages: updatedMessages as any,
              lastActivity: new Date()
            }
          });
        } else {
          await prisma.tutorSession.create({
            data: {
              userId,
              messages: updatedMessages as any,
              learningPatterns: {}
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

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAssessment, gradeAssessment } from "@/lib/ai/tutorAgent";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const { action, materialId, topic, questions, answers, assessmentId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (action === "generate") {
      const material = await prisma.studyMaterial.findUnique({
        where: { id: materialId }
      });

      if (!material) {
        return new NextResponse("Material not found", { status: 404 });
      }

      const generatedQuestions = await generateAssessment(
        material.extractedText || "",
        topic || material.title,
        (user?.studentProfile as any)?.academicLevel || "General"
      );

      return NextResponse.json({ questions: generatedQuestions });
    }

    if (action === "submit") {
      if (!questions || !answers) {
        return new NextResponse("Missing questions or answers", { status: 400 });
      }

      const studentContext = `Student Level: ${(user?.studentProfile as any)?.academicLevel || "General"}`;
      const result = await gradeAssessment(questions, answers, studentContext);

      const assessment = await prisma.assessment.create({
        data: {
          userId,
          materialId,
          topic: topic || "General Quiz",
          score: result.score,
          totalQuestions: questions.length,
          correctAnswers: result.correctCount,
          questions: questions as any,
          answers: answers as any,
          aiFeedback: result.feedback
        }
      });

      return NextResponse.json({ assessment, result });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("[ASSESSMENT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

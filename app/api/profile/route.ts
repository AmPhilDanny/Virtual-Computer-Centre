import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, phone, bio, academicLevel, occupation, learningStyle, interests } = await req.json();
    const userId = (session.user as any).id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        studentProfile: {
          bio,
          academicLevel,
          occupation,
          learningStyle,
          interests
        }
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

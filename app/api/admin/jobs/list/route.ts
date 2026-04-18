import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const jobs = await prisma.job.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
                { user: { email: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true, autonomyLevel: true } },
        user: { select: { name: true, email: true } },
        order: { select: { total: true, status: true } },
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("ADMIN JOBS LIST ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

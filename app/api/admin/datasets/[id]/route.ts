import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { content, name, serviceId } = await req.json();

    const dataset = await prisma.dataset.update({
      where: { id: params.id },
      data: {
        content,
        name,
        serviceId: serviceId === "global" ? null : serviceId,
      }
    });

    return NextResponse.json(dataset);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update dataset" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: params.id }
    });

    if (dataset?.fileUrl) {
      await del(dataset.fileUrl);
    }

    await prisma.dataset.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete dataset" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: true
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { 
      title, 
      slug, 
      content, 
      excerpt, 
      coverImage, 
      categoryId, 
      isPublished,
      metaTitle,
      metaDesc
    } = body;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        content,
        excerpt,
        coverImage,
        authorId: (session!.user as any).id,
        categoryId: categoryId || null,
        isPublished: isPublished || false,
        metaTitle,
        metaDesc
      }
    });

    return NextResponse.json(post);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

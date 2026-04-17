import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogPostEditor from "../../new/BlogPostEditor";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return <BlogPostEditor initialData={post} />;
}

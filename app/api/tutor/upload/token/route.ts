import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        console.log("[BLOB_TOKEN_REQ] Generating token for:", pathname);
        // Only enforce auth on token generation, not on webhook
        const session = await auth();
        if (!session?.user) {
          throw new Error("Unauthorized Token Generation");
        }
        
        return {
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: (session.user as any).id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("[BLOB_UPLOAD_COMPLETED]", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[Vercel Blob Token Error]:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

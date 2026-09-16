import { files } from "@/db/schema";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await getServerSession(req.headers);

  if (!session) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const res = await db
    .select()
    .from(files)
    .where(eq(files.userId, session.user.id));

  return Response.json(
    {
      message: "Files fetched successfully",
      data: res,
    },
    {
      status: 200,
    },
  );
}

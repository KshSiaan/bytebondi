import { files } from "@/db/schema";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSupabaseStorageClient } from "@/lib/storage/supabase";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;

  // 1. Get the database row first.
  // Keep this object as the source of truth for the entire operation.
  const [row] = await db.select().from(files).where(eq(files.id, id)).limit(1);

  if (!row) {
    return Response.json(
      {
        message: `File with id ${id} not found`,
      },
      {
        status: 404,
      },
    );
  }

  // 2. Only update the DB row after storage update succeeds.
  try {
    await db.update(files).set({ star: !row.star }).where(eq(files.id, id));
  } catch (error) {
    console.error("Error updating file in database:", error);

    return Response.json(
      {
        message: "File was removed from storage, but database update failed",
        data: row,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(
    {
      message: `File ${row.fileName} updated successfully`,
      data: row,
    },
    {
      status: 200,
    },
  );
}

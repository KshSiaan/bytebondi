import { files } from "@/db/schema";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSupabaseStorageClient } from "@/lib/storage/supabase";
import { eq } from "drizzle-orm";

export async function DELETE(
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

  // From this point onward, `row` contains everything
  // needed to perform the deletion.

  try {
    const supabase = createSupabaseStorageClient();

    // IMPORTANT:
    // This should be the actual storage object path,
    // NOT the public URL.
    const { error: storageError } = await supabase.storage
      .from("files")
      .remove([row.fileUrl]);

    if (storageError) {
      return Response.json(
        {
          message: `Error deleting file from storage: ${storageError.message}`,
        },
        {
          status: 500,
        },
      );
    }
  } catch (error) {
    console.error("Error deleting file from storage:", error);

    return Response.json(
      {
        message: "Error deleting file from storage",
      },
      {
        status: 500,
      },
    );
  }

  // 2. Only delete the DB row after storage deletion succeeds.
  try {
    await db.delete(files).where(eq(files.id, row.id));
  } catch (error) {
    console.error("Error deleting file from database:", error);

    return Response.json(
      {
        message: "File was removed from storage, but database deletion failed",
        data: row,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(
    {
      message: `File ${row.fileName} deleted successfully`,
      data: row,
    },
    {
      status: 200,
    },
  );
}

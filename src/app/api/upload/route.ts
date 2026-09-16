import { createSupabaseStorageClient } from "@/lib/storage/supabase";
//! import your db instance and file schema here
import { db } from "@/lib/db";
import { files as FILES } from "@/db/schema";
import { getServerSession } from "@/lib/auth";

export async function POST(req: Request) {
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
  try {
    const formData = await req.formData();

    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);

    if (!files.length) {
      return Response.json(
        {
          message: "No files provided",
        },
        {
          status: 400,
        },
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: object) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(data)}\n`));
        };

        //! Keep track of only successfully uploaded files.
        //! These will be inserted into the database after every upload is finished.
        const successfulFiles: {
          fileKey: string;
          fileName: string;
          path: string;
          size: number;
          type: string;
          lastModified: number;
        }[] = [];

        try {
          const supabase = createSupabaseStorageClient();

          for (const file of files) {
            const fileKey = `${file.name}-${file.size}-${file.lastModified}`;

            try {
              send({
                type: "start",
                fileKey,
                fileName: file.name,
              });

              const extension = file.name.split(".").pop();

              const path = `${crypto.randomUUID()}${
                extension ? `.${extension}` : ""
              }`;

              const buffer = Buffer.from(await file.arrayBuffer());

              const { data, error } = await supabase.storage
                .from("file")
                .upload(path, buffer, {
                  contentType: file.type || "application/octet-stream",
                  upsert: false,
                });

              if (error) {
                send({
                  type: "error",
                  fileKey,
                  fileName: file.name,
                  message: error.message,
                });

                continue;
              }

              const {
                data: { publicUrl },
              } = supabase.storage.from("file").getPublicUrl(data.path);

              successfulFiles.push({
                fileKey,
                fileName: file.name,
                path: publicUrl,
                size: file.size,
                type: file.type || "application/octet-stream",
                lastModified: file.lastModified,
              });

              send({
                type: "complete",
                fileKey,
                fileName: file.name,
                path: publicUrl,
              });
            } catch (error) {
              send({
                type: "error",
                fileKey,
                fileName: file.name,
                message:
                  error instanceof Error
                    ? error.message
                    : "Unknown upload error",
              });
            }
          }

          if (successfulFiles.length) {
            for (const file of successfulFiles) {
              await db.insert(FILES).values({
                id: crypto.randomUUID(),
                fileName: file.fileName,
                fileUrl: file.path,
                type: file.type,
                size: file.size.toString(),
                userId: session.user.id,
              });
            }
          }

          send({
            type: "done",
            files: successfulFiles,
            uploadedCount: successfulFiles.length,
            failedCount: files.length - successfulFiles.length,
          });

          controller.close();
        } catch (error) {
          send({
            type: "error",
            message: error instanceof Error ? error.message : "Upload failed",
          });

          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Upload request failed:", error);

    return Response.json(
      {
        message: "Invalid upload request",
      },
      {
        status: 400,
      },
    );
  }
}

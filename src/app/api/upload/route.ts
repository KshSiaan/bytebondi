import { createSupabaseStorageClient } from "@/lib/storage/supabase";

export async function POST(req: Request) {
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

              send({
                type: "complete",
                fileKey,
                fileName: file.name,
                path: data.path,
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

          send({
            type: "done",
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

export function FileValidator(file: File) {
  let type = file.type;
  const fileName = file.name;
  const size = file.size;

  if (type.startsWith("image/")) {
    type = "image";
  }

  if (type.startsWith("video/")) {
    type = "video";
  }

  if (type.startsWith("audio/")) {
    type = "audio";
  }

  if (type.startsWith("text/")) {
    type = "text";
  }

  if (type === "application/zip" || type === "application/x-zip-compressed") {
    type = "zip";
  }

  if (size > 100 * 1024 * 1024) {
    return {
      name: fileName,
      type,
      size,
      isError: true,
      errorMessage: "File size exceeds 100MB limit.",
    };
  }

  return {
    name: fileName,
    type,
    size,
    isError: false,
  };
}

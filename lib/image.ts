// Browser only. Re-draws the image on a canvas and exports WebP:
// smaller files (free storage is 1 GB) and EXIF/GPS is dropped because only pixels are copied.
export async function toWebp(file: File, maxWidth: number, quality = 0.82) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("This photo format can't be read here. Please use JPG or PNG.");
  }
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
  if (!blob) throw new Error("Could not process this image.");
  return { blob, width, height };
}

export const newFileName = (folder: string) => `${folder}/${crypto.randomUUID()}.webp`;

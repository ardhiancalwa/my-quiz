import { z } from "zod";
import { allowRequest } from "./rate-limit";
export async function body<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!allowRequest(request))
    throw new Error("Terlalu banyak permintaan. Coba lagi dalam satu menit.");
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Error("Gunakan JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Request kosong.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 32768) {
        await reader.cancel();
        throw new Error("Request terlalu besar.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return schema.parse(JSON.parse(new TextDecoder().decode(bytes)));
}
export function failure(error: unknown) {
  const message =
    error instanceof z.ZodError
      ? "Data tidak valid."
      : error instanceof SyntaxError
        ? "JSON tidak valid."
        : error instanceof Error &&
            /Sesi|sesi|soal|Jawaban|JSON|Request|Gunakan|Data|Terlalu|Versi/.test(
              error.message,
            )
          ? error.message
          : "Layanan belum dapat memproses permintaan.";
  const limited = message.startsWith("Terlalu banyak");
  return Response.json(
    { error: message },
    {
      status: limited ? 429 : 400,
      headers: {
        "Cache-Control": "no-store",
        ...(limited ? { "Retry-After": "60" } : {}),
      },
    },
  );
}

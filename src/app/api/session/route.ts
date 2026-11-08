import { z } from "zod";
import { getBank, getExamBank } from "@/lib/content";
import { sectionSchema, SECTIONS } from "@/lib/contracts";
import { sessionFor } from "@/lib/engine";
import { body, failure } from "@/lib/http";
import { selectPractice } from "@/lib/selection";
const schema = z.object({
  mode: z.enum(["practice", "exam"]),
  packageId: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(100)
    .optional(),
  section: sectionSchema.optional(),
  topic: z.string().max(100).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  count: z.number().int().min(1).max(50).default(10),
  ids: z.array(z.string().max(80)).max(2000).optional(),
  excludeIds: z.array(z.string().max(80)).max(2000).optional(),
});
export async function POST(request: Request) {
  try {
    const input = await body(request, schema);
    const bank = await (input.mode === "exam"
      ? getExamBank(input.packageId)
      : getBank());
    let selected = bank.filter(
      (q) =>
        (!input.section || q.section === input.section) &&
        (!input.topic || q.topic === input.topic) &&
        (!input.difficulty || q.difficulty === input.difficulty) &&
        (!input.ids || input.ids.includes(q.id)) &&
        !input.excludeIds?.includes(q.id),
    );
    if (input.mode === "exam") {
      selected = SECTIONS.flatMap((s) =>
        bank.filter((q) => q.section === s.id).slice(0, s.count),
      );
      if (
        SECTIONS.some(
          (s) => selected.filter((q) => q.section === s.id).length !== s.count,
        )
      )
        throw new Error(
          "Belum tersedia paket lengkap 140 soal. Pilih latihan per bagian.",
        );
    } else {
      selected = selectPractice(selected, input.count);
    }
    if (!selected.length)
      throw new Error("Tidak ada soal yang cocok. Coba filter lain.");
    const now = Date.now();
    return Response.json(
      sessionFor(
        {
          id: crypto.randomUUID(),
          mode: input.mode,
          ids: selected.map((q) => q.id),
          versions: selected.map((q) => q.version),
          stage: 0,
          startedAt: now,
          deadline: input.mode === "exam" ? now + 45 * 60000 : null,
          prior: {},
        },
        bank,
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}

import { openDB } from "idb";
import { z } from "zod";
import {
  EMPTY_PROGRESS,
  explanationSchema,
  optionSchema,
  sectionSchema,
  type Progress,
} from "./contracts";
const publicSchema = z.object({
  id: z.string().max(100),
  section: sectionSchema,
  topic: z.string().max(100),
  difficulty: z.enum(["easy", "medium", "hard"]),
  type: z.enum([
    "completion",
    "error",
    "short-dialogue",
    "long-dialogue",
    "lecture",
    "reading",
  ]),
  prompt: z.string().max(10000),
  options: z.array(optionSchema).length(4),
  version: z.number(),
  status: z.enum(["draft", "validated", "published"]),
  passage: z
    .object({
      id: z.string(),
      title: z.string().max(500),
      text: z.string().max(30000),
    })
    .optional(),
  audio: z
    .object({
      id: z.string(),
      url: z.string().regex(/^\/audio\/[a-z0-9-]+\.mp3$/),
      transcript: z.string().max(30000),
      kind: z.enum(["short-dialogue", "long-dialogue", "lecture"]),
    })
    .optional(),
  segments: z
    .array(
      z.object({
        label: z.enum(["A", "B", "C", "D"]).optional(),
        text: z.string().max(3000),
      }),
    )
    .max(20)
    .optional(),
});
const resultSchema = z
  .object({
    id: z.string().uuid(),
    mode: z.enum(["practice", "exam"]),
    completedAt: z.number().nonnegative(),
    startedAt: z.number().nonnegative(),
    correct: z.number().int().min(0).max(140),
    incorrect: z.number().int().min(0).max(140),
    unanswered: z.number().int().min(0).max(140),
    total: z.number().int().min(1).max(140),
    reviews: z
      .array(
        z.object({
          question: publicSchema,
          selected: z.enum(["A", "B", "C", "D"]).optional(),
          correct: z.enum(["A", "B", "C", "D"]),
          explanation: explanationSchema,
        }),
      )
      .max(140),
  })
  .superRefine((r, ctx) => {
    if (
      r.correct + r.incorrect + r.unanswered !== r.total ||
      r.reviews.length !== r.total ||
      new Set(r.reviews.map((x) => x.question.id)).size !== r.total ||
      r.reviews.filter((x) => x.selected === x.correct).length !== r.correct ||
      r.reviews.filter((x) => !x.selected).length !== r.unanswered ||
      r.completedAt < r.startedAt
    )
      ctx.addIssue({ code: "custom", message: "Hasil tidak konsisten." });
  });
const transferSchema = z.object({
  version: z.literal(1),
  history: z.array(resultSchema).max(1000),
  bookmarks: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(2000),
  active: z.null(),
});
export function parseImport(text: string): Progress {
  if (text.length > 10 * 1024 * 1024) throw new Error("File maksimal 10 MB.");
  return transferSchema.parse(JSON.parse(text));
}
async function database() {
  return openDB("eprt-practice", 1, {
    upgrade(db) {
      db.createObjectStore("progress");
    },
  });
}
export async function readProgress(): Promise<Progress> {
  const db = await database();
  return (await db.get("progress", "main")) ?? structuredClone(EMPTY_PROGRESS);
}
export async function writeProgress(progress: Progress) {
  const db = await database();
  await db.put("progress", progress, "main");
}
export async function resetProgress() {
  const db = await database();
  await db.delete("progress", "main");
}

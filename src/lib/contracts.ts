import { z } from "zod";
export const sectionSchema = z.enum(["listening", "grammar", "reading"]);
export type Section = z.infer<typeof sectionSchema>;
export const SECTIONS = [
  {
    id: "listening" as const,
    name: "Listening",
    count: 50,
    minutes: 45,
    description: "Dengarkan, pahami, lalu jawab.",
  },
  {
    id: "grammar" as const,
    name: "Grammar",
    count: 40,
    minutes: 25,
    description: "Kenali pola dan struktur kalimat.",
  },
  {
    id: "reading" as const,
    name: "Reading",
    count: 50,
    minutes: 55,
    description: "Temukan jawaban di dalam bacaan.",
  },
];
export const optionSchema = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  text: z.string().min(1),
});
export const explanationSchema = z.object({
  why: z.string().min(10).max(10000),
  incorrect: z.record(z.string(), z.string().max(10000)),
  concept: z.string().min(1).max(500),
  tip: z.string().min(5).max(2000),
  evidence: z.string().max(30000).optional(),
  rule: z.string().max(3000).optional(),
  steps: z.array(z.string().min(1).max(5000)).min(2).max(5).optional(),
  pitfall: z.string().max(2000).optional(),
  example: z.string().max(3000).optional(),
  correction: z
    .object({ from: z.string(), to: z.string(), sentence: z.string() })
    .optional(),
});
export const questionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  section: sectionSchema,
  topic: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  type: z.enum([
    "completion",
    "error",
    "short-dialogue",
    "long-dialogue",
    "lecture",
    "reading",
  ]),
  prompt: z.string().min(1),
  options: z.array(optionSchema).length(4),
  correct: z.enum(["A", "B", "C", "D"]),
  explanation: explanationSchema,
  passage: z
    .object({ id: z.string(), title: z.string(), text: z.string() })
    .optional(),
  audio: z
    .object({
      id: z.string(),
      url: z.string().startsWith("/audio/"),
      transcript: z.string(),
      kind: z.enum(["short-dialogue", "long-dialogue", "lecture"]),
    })
    .optional(),
  segments: z
    .array(
      z.object({
        label: z.enum(["A", "B", "C", "D"]).optional(),
        text: z.string(),
      }),
    )
    .optional(),
  version: z.number().int().positive(),
  compatibleVersions: z.array(z.number().int().positive()).optional(),
  status: z.enum(["draft", "validated", "published"]),
  source: z.string(),
  license: z.string(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().datetime().optional(),
});
export type Question = z.infer<typeof questionSchema>;
export type PublicQuestion = Omit<
  Question,
  | "correct"
  | "explanation"
  | "source"
  | "license"
  | "reviewedBy"
  | "reviewedAt"
  | "compatibleVersions"
>;
export const answerSchema = z
  .record(z.string().regex(/^[a-z0-9-]+$/), z.enum(["A", "B", "C", "D"]))
  .refine((v) => Object.keys(v).length <= 140);
export type Answers = z.infer<typeof answerSchema>;
export type Review = {
  question: PublicQuestion;
  selected?: string;
  correct: string;
  explanation: Question["explanation"];
};
export type Result = {
  id: string;
  mode: "practice" | "exam";
  completedAt: number;
  startedAt: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  reviews: Review[];
};
export type Session = {
  id: string;
  token: string;
  mode: "practice" | "exam";
  questions: PublicQuestion[];
  allIds: string[];
  stage: number;
  deadline: number | null;
  startedAt: number;
  answers: Answers;
  index: number;
  played: string[];
};
export type Progress = {
  version: 1;
  history: Result[];
  bookmarks: string[];
  active: Session | null;
};
export const EMPTY_PROGRESS: Progress = {
  version: 1,
  history: [],
  bookmarks: [],
  active: null,
};
export function publicQuestion(q: Question): PublicQuestion {
  // Keys and explanations remain server-side; transcripts are revealed only after submission.
  const safe = {
    id: q.id,
    section: q.section,
    topic: q.topic,
    difficulty: q.difficulty,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
    passage: q.passage,
    audio: q.audio,
    segments: q.segments,
    version: q.version,
    status: q.status,
  };
  return {
    ...safe,
    audio: safe.audio ? { ...safe.audio, transcript: "" } : undefined,
  };
}

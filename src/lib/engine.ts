import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import {
  SECTIONS,
  answerSchema,
  publicQuestion,
  type Answers,
  type Question,
  type Result,
  type Session,
} from "./contracts";
function secret() {
  const configured = process.env.SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (
    process.env.NODE_ENV === "production" &&
    process.env.CONTENT_MODE !== "demo"
  )
    throw new Error("SESSION_SECRET minimal 32 karakter diperlukan.");
  // shortcut: known key for localhost demo only; public deployment requires a private SESSION_SECRET.
  return "localhost-demo-only-not-for-public-deployment-2026";
}
const claimSchema = z.object({
  id: z.string().uuid(),
  mode: z.enum(["practice", "exam"]),
  ids: z.array(z.string()).min(1).max(140),
  versions: z.array(z.number()),
  stage: z.number().int().min(0).max(2),
  startedAt: z.number(),
  deadline: z.number().nullable(),
  prior: answerSchema,
});
export type Claim = z.infer<typeof claimSchema>;
export function sign(claim: Claim) {
  const data = Buffer.from(JSON.stringify(claim)).toString("base64url");
  return `${data}.${createHmac("sha256", secret()).update(data).digest("base64url")}`;
}
export function verify(token: string): Claim {
  if (token.length > 24000) throw new Error("Sesi tidak valid.");
  const [data, signature, ...extra] = token.split(".");
  if (!data || !signature || extra.length) throw new Error("Sesi tidak valid.");
  const expected = createHmac("sha256", secret()).update(data).digest();
  const actual = Buffer.from(signature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
    throw new Error("Sesi tidak valid.");
  const claim = claimSchema.parse(
    JSON.parse(Buffer.from(data, "base64url").toString()),
  );
  if (Date.now() - claim.startedAt > 7 * 86400000)
    throw new Error("Sesi kedaluwarsa. Mulai sesi baru.");
  return claim;
}
export function questionsFor(claim: Claim, bank: Question[]) {
  const selected = claim.ids.map((id, i) => {
    const q = bank.find(
      (q) =>
        q.id === id &&
        (q.version === claim.versions[i] ||
          q.compatibleVersions?.includes(claim.versions[i])),
    );
    if (!q) throw new Error("Versi soal berubah. Mulai sesi baru.");
    return q;
  });
  return claim.mode === "exam"
    ? selected.filter((q) => q.section === SECTIONS[claim.stage].id)
    : selected;
}
export function sessionFor(claim: Claim, bank: Question[]): Session {
  return {
    id: claim.id,
    token: sign(claim),
    mode: claim.mode,
    questions: questionsFor(claim, bank).map(publicQuestion),
    allIds: claim.ids,
    stage: claim.stage,
    deadline: claim.deadline,
    startedAt: claim.startedAt,
    answers: {},
    index: 0,
    played: [],
  };
}
export function grade(
  questions: Question[],
  answers: Answers,
  claim: Pick<Claim, "id" | "mode" | "startedAt">,
): Result {
  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  const unanswered = questions.filter((q) => !answers[q.id]).length;
  return {
    id: claim.id,
    mode: claim.mode,
    startedAt: claim.startedAt,
    completedAt: Date.now(),
    correct,
    unanswered,
    incorrect: questions.length - correct - unanswered,
    total: questions.length,
    reviews: questions.map((q) => ({
      question: { ...publicQuestion(q), audio: q.audio },
      selected: answers[q.id],
      correct: q.correct,
      explanation: q.explanation,
    })),
  };
}
export function advance(
  claim: Claim,
  answers: Answers,
  bank: Question[],
  now = Date.now(),
): Session | Result {
  const current = questionsFor(claim, bank);
  const allowed = new Set(current.map((q) => q.id));
  if (Object.keys(answers).some((id) => !allowed.has(id)))
    throw new Error("Jawaban di luar sesi.");
  const combined = { ...claim.prior, ...answers };
  if (claim.mode === "practice" || claim.stage === 2)
    return grade(
      claim.ids.map((id, i) => {
        const q = bank.find(
          (q) =>
            q.id === id &&
            (q.version === claim.versions[i] ||
              q.compatibleVersions?.includes(claim.versions[i])),
        );
        if (!q) throw new Error("Versi soal tidak tersedia.");
        return q;
      }),
      combined,
      claim,
    );
  const stage = claim.stage + 1;
  const start =
    claim.deadline !== null && now > claim.deadline ? claim.deadline : now;
  return sessionFor(
    {
      ...claim,
      stage,
      deadline: start + SECTIONS[stage].minutes * 60000,
      prior: combined,
    },
    bank,
  );
}

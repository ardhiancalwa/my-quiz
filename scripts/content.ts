import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { bank } from "../content/bank";
import { examPackages } from "../content/packages";
import { questionSchema, SECTIONS, type Question } from "../src/lib/contracts";
export function validateBank(input: unknown[], audioCheck = false) {
  const questions = input.map((q) => questionSchema.parse(q));
  const errors: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) errors.push(`Duplicate id: ${q.id}`);
    ids.add(q.id);
    const stem = (
      q.prompt === "Which underlined part needs correction?"
        ? (q.segments ?? []).map((s) => s.text).join(" ")
        : q.prompt + (q.passage?.text ?? "") + (q.audio?.transcript ?? "")
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    if (stems.has(stem)) errors.push(`Duplicate stem: ${q.id}`);
    stems.add(stem);
    if (
      new Set(q.options.map((o) => o.id)).size !== 4 ||
      new Set(q.options.map((o) => o.text.toLowerCase())).size !== 4
    )
      errors.push(`Duplicate options: ${q.id}`);
    for (const o of q.options)
      if (o.id !== q.correct && !q.explanation.incorrect[o.id])
        errors.push(`Missing explanation: ${q.id}/${o.id}`);
    if (q.section === "listening" && !q.audio)
      errors.push(`Missing audio: ${q.id}`);
    if (q.section === "reading" && !q.passage)
      errors.push(`Missing passage: ${q.id}`);
    if (
      q.type === "error" &&
      (q.segments?.length !== 4 ||
        new Set(q.segments.map((s) => s.label)).size !== 4)
    )
      errors.push(`Invalid error segments: ${q.id}`);
    if (q.status !== "draft" && (!q.reviewedBy?.trim() || !q.reviewedAt))
      errors.push(`Human review missing: ${q.id}`);
    if (
      audioCheck &&
      q.audio &&
      !existsSync(resolve("public", q.audio.url.slice(1)))
    )
      errors.push(`Missing file: ${q.audio.url}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return questions;
}
export function report(questions: Question[]) {
  return {
    generatedAt: new Date().toISOString(),
    total: questions.length,
    draft: questions.filter((q) => q.status === "draft").length,
    validated: questions.filter((q) => q.status === "validated").length,
    published: questions.filter((q) => q.status === "published").length,
    sections: Object.fromEntries(
      SECTIONS.map((s) => [
        s.id,
        questions.filter((q) => q.section === s.id).length,
      ]),
    ),
    uniqueAudio: new Set(
      questions.filter((q) => q.audio).map((q) => q.audio!.id),
    ).size,
    packages: examPackages.map((p) => ({
      id: p.id,
      name: p.name,
      questions: p.questionIds.filter((id) =>
        questions.some((q) => q.id === id),
      ).length,
    })),
    additionalPractice: questions.filter(
      (q) => !examPackages.some((p) => p.questionIds.includes(q.id)),
    ).length,
    warning:
      "Schema checks do not establish semantic correctness, originality, licensing or human review.",
  };
}
if (process.argv[1]?.replace(/\\/g, "/").endsWith("/scripts/content.ts")) {
  const mode = process.argv[2] ?? "check";
  const source = process.argv[3];
  const questions = validateBank(
    source ? JSON.parse(readFileSync(source, "utf8")) : bank,
    mode !== "blueprint",
  );
  if (mode === "report") {
    mkdirSync("docs", { recursive: true });
    writeFileSync(
      "docs/content-quality.json",
      JSON.stringify(report(questions), null, 2),
    );
  }
  if (mode === "blueprint") {
    mkdirSync("content/batches", { recursive: true });
    writeFileSync(
      "content/batches/blueprint.json",
      JSON.stringify(
        {
          targetMvp: 720,
          targetExpansion: 2000,
          sections: SECTIONS,
          steps: [
            "author original batch",
            "validate schema",
            "semantic and distractor review",
            "audio and license review",
            "human reviewer metadata",
            "import draft",
            "publish reviewed content only",
          ],
          questionsNeededForMvp: Math.max(
            0,
            720 - questions.filter((q) => q.status !== "draft").length,
          ),
          draftsNeededForMvp: Math.max(0, 720 - questions.length),
        },
        null,
        2,
      ),
    );
  }
  console.log(JSON.stringify(report(questions), null, 2));
}

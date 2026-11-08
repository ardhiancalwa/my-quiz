import type { Question } from "../src/lib/contracts";
export type Item = [string, string, string, string, string, string];
export const letters = ["A", "B", "C", "D"] as const;
export function make(
  id: string,
  section: Question["section"],
  type: Question["type"],
  topic: string,
  item: Item,
): Question {
  const [prompt, right, w1, w2, w3, why] = item;
  const choices = [right, w1, w2, w3];
  const offset = Number(id.split("-").at(-1)) % 4;
  const options = letters.map((label, i) => ({
    id: label,
    text: choices[(i - offset + 4) % 4],
  }));
  return {
    id,
    section,
    type,
    topic,
    difficulty: "medium",
    prompt,
    options,
    correct: letters[offset],
    explanation: {
      why,
      concept: topic,
      tip:
        section === "grammar"
          ? "Periksa struktur kalimat sebelum memilih bentuk kata."
          : "Cari informasi pendukung sebelum memilih jawaban.",
      incorrect: Object.fromEntries(
        options
          .filter((o) => o.text !== right)
          .map((o) => [
            o.id,
            `“${o.text}” tidak memenuhi jawaban yang diminta. ${why}`,
          ]),
      ),
    },
    version: 1,
    status: "draft",
    source:
      "Original authoring for this project; generated draft, pending educator review.",
    license:
      "Project-authored draft; audio redistribution pending operator review.",
  };
}

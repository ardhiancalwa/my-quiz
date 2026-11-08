import { writeFileSync, mkdirSync } from "node:fs";
import { bank } from "../content/bank";
mkdirSync("tmp", { recursive: true });
const groups = [
  ...new Map(
    bank.filter((q) => q.audio).map((q) => [q.audio!.id, q.audio!]),
  ).values(),
];
writeFileSync(
  "tmp/audio-manifest.json",
  JSON.stringify(
    groups.map((a) => ({
      id: a.id,
      text:
        a.transcript.replace(/Woman:|Man:|Speaker:/g, "") +
        " " +
        bank
          .filter((q) => q.audio?.id === a.id)
          .map((q) => "Question. " + q.prompt)
          .join(" "),
    })),
    null,
    2,
  ),
);

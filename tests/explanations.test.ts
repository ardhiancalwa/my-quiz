import { describe, it, expect } from "vitest";
import { bank } from "../content/bank";
import { grade, advance, sessionFor, type Claim } from "../src/lib/engine";
import { parseImport } from "../src/lib/progress";
import { publicQuestion } from "../src/lib/contracts";
describe("learner explanations", () => {
  it("provides reasoning, traps and examples for every question without exposing them before submit", () => {
    expect(bank).toHaveLength(720);
    for (const q of bank) {
      expect(q.explanation.steps).toHaveLength(3);
      expect(q.explanation.rule!.length).toBeGreaterThan(40);
      expect(q.explanation.tip).not.toBe(
        "Periksa struktur kalimat sebelum memilih bentuk kata.",
      );
      expect(q.explanation.pitfall!.length).toBeGreaterThan(40);
      expect(q.explanation.example!.length).toBeGreaterThan(40);
      expect(Object.keys(q.explanation.incorrect).sort()).toEqual(
        q.options
          .filter((o) => o.id !== q.correct)
          .map((o) => o.id)
          .sort(),
      );
      expect(
        Object.values(q.explanation.incorrect).some((reason) =>
          reason.includes("tidak memenuhi jawaban yang diminta"),
        ),
      ).toBe(false);
      expect(publicQuestion(q)).not.toHaveProperty("explanation");
      expect(q.version).toBe(2);
    }
  });
  it("explains why grammar distractors fail individually rather than repeating the right answer", () => {
    const e = bank.find((q) => q.id === "grammar-1")!.explanation;
    expect(e.why).toContain("satu collection");
    expect(e.incorrect.A).toContain("aktif");
    expect(e.incorrect.C).toContain("jamak");
    expect(e.incorrect.D).toContain("pasif");
    expect(e.tip).toContain("inti subjek");
    const gerund = bank.find((q) => q.id === "grammar-4")!;
    expect(gerund.explanation.why).toContain("nama kegiatan");
    expect(gerund.explanation.incorrect.B).toContain("infinitive");
  });
  it("treats the other Error Recognition segments as correct parts of the sentence", () => {
    const q = bank.find((q) => q.id === "grammar-16")!;
    expect(q.explanation.correction).toEqual({
      from: "have arranged",
      to: "has arranged",
      sentence: "The librarian has arranged the new books on the upper shelf.",
    });
    expect(q.explanation.incorrect.A).toContain("satu pustakawan");
    expect(q.explanation.incorrect.C).toContain("benda yang ditata");
    expect(q.explanation.incorrect.D).toContain("lokasi");
    expect(q.explanation.why).toContain("satu pustakawan");
    expect(q.explanation.why).not.toContain("undefined");
  });
  it("keeps the direction of EXCEPT questions and explains corrected listening information", () => {
    const except = bank.find((q) => q.id === "reading-9")!;
    expect(except.explanation.why).toContain("pengecualian");
    for (const reason of Object.values(except.explanation.incorrect))
      expect(reason).toContain("sesuai bacaan");
    const listen = bank.find((q) => q.id === "listening-1")!;
    expect(listen.explanation.why).toContain("auditorium utama");
    expect(Object.values(listen.explanation.incorrect).join(" ")).toContain(
      "lokasi lama",
    );
    for (const q of bank.filter(
      (q) => q.section === "reading" || q.section === "listening",
    ))
      expect(q.passage?.text ?? q.audio!.transcript).toContain(
        q.explanation.evidence,
      );
    expect(
      bank.find((q) => q.id === "reading-12")!.explanation.incorrect.C,
    ).toContain("durasi");
    expect(
      bank.find((q) => q.id === "reading-319")!.explanation.rule,
    ).toContain("tidak didukung");
    expect(
      bank.find((q) => q.id === "reading-335")!.explanation.rule,
    ).toContain("informasi yang dinyatakan");
    expect(
      bank.find((q) => q.id === "reading-335")!.explanation.rule,
    ).not.toContain("kata ganti");
    expect(
      bank.find((q) => q.id === "reading-9")!.explanation.evidence,
    ).toContain("next spring");
  });
  it("round-trips new fields and still imports valid legacy history", () => {
    const result = grade(
      bank.slice(0, 2),
      {},
      { id: crypto.randomUUID(), mode: "practice", startedAt: Date.now() },
    );
    const transfer = {
      version: 1,
      history: [result],
      bookmarks: [],
      active: null,
    };
    const restored = parseImport(JSON.stringify(transfer));
    expect(restored.history[0].reviews[0].explanation.steps).toHaveLength(3);
    for (const r of result.reviews)
      r.explanation = {
        why: r.explanation.why,
        incorrect: r.explanation.incorrect,
        concept: r.explanation.concept,
        tip: r.explanation.tip,
      };
    expect(
      parseImport(JSON.stringify(transfer)).history[0].reviews[0].explanation
        .steps,
    ).toBeUndefined();
  });
  it("accepts previously started sessions for the explanation-only revision, while rejecting unsupported question versions", () => {
    const q = bank[0];
    const claim: Claim = {
      id: crypto.randomUUID(),
      mode: "practice",
      ids: [q.id],
      versions: [1],
      stage: 0,
      startedAt: Date.now(),
      deadline: null,
      prior: {},
    };
    expect(sessionFor(claim, bank).questions).toHaveLength(1);
    expect(advance(claim, { [q.id]: q.correct }, bank)).toHaveProperty(
      "correct",
      1,
    );
    expect(() => sessionFor({ ...claim, versions: [99] }, bank)).toThrow(
      "Versi soal",
    );
  });
});

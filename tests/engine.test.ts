import { describe, it, expect, vi, afterEach } from "vitest";
import { bank } from "../content/bank";
import { examPackages } from "../content/packages";
import { selectPractice } from "../src/lib/selection";
import { SECTIONS, publicQuestion, type Answers } from "../src/lib/contracts";
import {
  advance,
  grade,
  sign,
  verify,
  sessionFor,
  type Claim,
} from "../src/lib/engine";
import { validateBank } from "../scripts/content";
import { parseImport } from "../src/lib/progress";
import { body } from "../src/lib/http";
import { z } from "zod";
import { allowRequest } from "../src/lib/rate-limit";
const examBank = examPackages[0].questionIds.map((id) =>
  bank.find((q) => q.id === id)!,
);
const claim = (): Claim => ({
  id: crypto.randomUUID(),
  mode: "exam",
  ids: SECTIONS.flatMap((s) =>
    examBank.filter((q) => q.section === s.id).map((q) => q.id),
  ),
  versions: examBank.map((q) => q.version),
  stage: 0,
  startedAt: Date.now(),
  deadline: Date.now() + 45 * 60000,
  prior: {},
});
afterEach(() => vi.useRealTimers());
describe("question bank", () => {
  it("contains 720 unique draft questions with complete explanations and audio", () => {
    expect(validateBank(bank, true)).toHaveLength(720);
    expect(
      SECTIONS.map((s) => bank.filter((q) => q.section === s.id).length),
    ).toEqual([150, 220, 350]);
    expect(bank.filter((q) => q.type === "completion")).toHaveLength(75);
    expect(bank.filter((q) => q.type === "error")).toHaveLength(145);
    expect(new Set(bank.map((q) => q.id)).size).toBe(720);
  });
  it("provides three disjoint complete exam packages plus 300 extra practice questions", () => {
    const assigned = new Set<string>();
    for (const pack of examPackages) {
      const questions = pack.questionIds.map((id) =>
        bank.find((q) => q.id === id)!,
      );
      expect(questions).toHaveLength(140);
      expect(questions.every(Boolean)).toBe(true);
      expect(
        SECTIONS.map((s) => questions.filter((q) => q.section === s.id).length),
      ).toEqual([50, 40, 50]);
      expect(
        [
          "short-dialogue",
          "long-dialogue",
          "lecture",
          "completion",
          "error",
        ].map((type) => questions.filter((q) => q.type === type).length),
      ).toEqual([30, 10, 10, 15, 25]);
      for (const q of questions) {
        expect(assigned.has(q.id)).toBe(false);
        assigned.add(q.id);
      }
    }
    expect(assigned.size).toBe(420);
    expect(bank.filter((q) => !assigned.has(q.id))).toHaveLength(300);
  });
  it("rejects duplicate context even if the IDs are changed", () => {
    const q = bank.find((q) => q.section === "reading")!;
    expect(() =>
      validateBank([
        q,
        {
          ...q,
          id: "cloned-question",
          passage: { ...q.passage!, id: "cloned-passage" },
        },
      ]),
    ).toThrow("Duplicate stem");
  });
  it("makes new practice selections while preserving passage/audio group order", () => {
    const input = bank.filter((q) => q.section === "reading");
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      const selected = selectPractice(input, 20);
      expect(selected).toHaveLength(20);
      expect(new Set(selected.map((q) => q.id)).size).toBe(20);
      expect(selected[0].id).not.toBe(input[0].id);
      expect(
        new Set(selected.slice(0, 10).map((q) => q.passage!.id)).size,
      ).toBe(1);
    } finally {
      random.mockRestore();
    }
  });
  it("rejects duplicate IDs and content without human review when published", () => {
    expect(() => validateBank([bank[0], bank[0]])).toThrow("Duplicate");
    expect(() => validateBank([{ ...bank[0], status: "published" }])).toThrow(
      "Human review",
    );
  });
  it("never delivers answer keys, explanations or transcripts before submission", () => {
    for (const q of bank) {
      const safe = publicQuestion(q);
      expect(safe).not.toHaveProperty("correct");
      expect(safe).not.toHaveProperty("explanation");
      if (q.audio) expect(safe.audio?.transcript).toBe("");
    }
  });
});
describe("exam integrity", () => {
  it("rejects a tampered or expired session token", () => {
    const c = claim();
    const token = sign(c);
    expect(verify(token).id).toBe(c.id);
    expect(() => verify(token.slice(0, -3) + "xxx")).toThrow();
    expect(() =>
      verify(sign({ ...c, startedAt: Date.now() - 8 * 86400000 })),
    ).toThrow("kedaluwarsa");
  });
  it("keeps deadlines across serialization and advances expired sections without extending time", () => {
    const c = claim();
    const restored = verify(sign(c));
    expect(sessionFor(restored, bank).deadline).toBe(c.deadline);
    const later = c.deadline! + 30000;
    const next = advance(c, {}, bank, later);
    expect(next).toHaveProperty("stage", 1);
    expect(next).toHaveProperty("deadline", c.deadline! + 25 * 60000);
  });
  it.each(examPackages)(
    "scores all 140 questions only after the final section: $name",
    (pack) => {
      const examBank = pack.questionIds.map((id) =>
        bank.find((q) => q.id === id)!,
      );
      const c = {
        ...claim(),
        ids: examBank.map((q) => q.id),
        versions: examBank.map((q) => q.version),
      };
      const answers = Object.fromEntries(
        examBank.map((q) => [q.id, q.correct]),
      ) as Answers;
      const listen = advance(
        c,
        Object.fromEntries(
          examBank
            .filter((q) => q.section === "listening")
            .map((q) => [q.id, q.correct]),
        ),
        bank,
      );
      expect(listen).not.toHaveProperty("reviews");
      if (!("token" in listen)) throw new Error("expected stage");
      const grammar = advance(
        verify(listen.token),
        Object.fromEntries(
          examBank
            .filter((q) => q.section === "grammar")
            .map((q) => [q.id, q.correct]),
        ),
        bank,
      );
      if (!("token" in grammar)) throw new Error("expected stage");
      const result = advance(
        verify(grammar.token),
        Object.fromEntries(
          examBank
            .filter((q) => q.section === "reading")
            .map((q) => [q.id, q.correct]),
        ),
        bank,
      );
      expect(result).toHaveProperty("correct", 140);
      expect(result).toHaveProperty("total", 140);
      expect(Object.keys(answers)).toHaveLength(140);
    },
  );
  it("rejects answers for questions outside the current section", () => {
    expect(() => advance(claim(), { "grammar-1": "A" }, bank)).toThrow(
      "di luar sesi",
    );
  });
  it("counts wrong and blank answers separately", () => {
    const q = bank.slice(0, 3);
    const result = grade(
      q,
      {
        [q[0].id]: q[0].correct,
        [q[1].id]: q[1].options.find((o) => o.id !== q[1].correct)!.id,
      },
      claim(),
    );
    expect([result.correct, result.incorrect, result.unanswered]).toEqual([
      1, 1, 1,
    ]);
  });
});
describe("trust boundaries", () => {
  it("limits repeated requests within a window and allows them after expiry", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "unit-test" },
    });
    const now = Date.now();
    for (let i = 0; i < 60; i++) expect(allowRequest(req, now)).toBe(true);
    expect(allowRequest(req, now)).toBe(false);
    expect(allowRequest(req, now + 60001)).toBe(true);
  });
  it("round-trips results and rejects inconsistent imported results without touching stored data", () => {
    const r = grade(bank.slice(0, 2), {}, claim());
    const data = { version: 1, history: [r], bookmarks: [], active: null };
    expect(parseImport(JSON.stringify(data)).history).toHaveLength(1);
    expect(() =>
      parseImport(JSON.stringify({ ...data, history: [{ ...r, correct: 2 }] })),
    ).toThrow();
    expect(() => parseImport("{bad")).toThrow();
    expect(() =>
      parseImport(JSON.stringify({ ...data, version: 2 })),
    ).toThrow();
  });
  it("rejects oversized request bodies and non-JSON input", async () => {
    const request = new Request("http://localhost/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: "a".repeat(33000) }),
    });
    await expect(body(request, z.unknown())).rejects.toThrow("terlalu besar");
    await expect(
      body(
        new Request("http://localhost", { method: "POST", body: "text" }),
        z.unknown(),
      ),
    ).rejects.toThrow("JSON");
  });
});

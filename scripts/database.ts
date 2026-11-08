import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { neon } from "@neondatabase/serverless";
import { bank } from "../content/bank";
import { examPackages } from "../content/packages";
import { validateBank, report } from "./content";
if (!process.env.DATABASE_URL)
  throw new Error("Set DATABASE_URL in .env.local.");
const sql = neon(process.env.DATABASE_URL);
if (process.argv[2] === "migrate") {
  // This checked-in SQL contains no user input. Content imports below use bound parameters.
  const statements = readFileSync("migrations/001_content.sql", "utf8")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  await sql.transaction(statements.map((s) => sql.query(s)));
  console.log("Migration applied.");
} else if (process.argv[2] === "import") {
  const source = process.argv[3];
  const questions = validateBank(
    source ? JSON.parse(readFileSync(source, "utf8")) : bank,
    true,
  );
  const existing =
    await sql`SELECT id,version,document FROM questions WHERE id=ANY(${questions.map((q) => q.id)})`;
  for (const row of existing) {
    const incoming = questions.find((q) => q.id === row.id)!;
    if (
      incoming.version < row.version ||
      (incoming.version === row.version &&
        !isDeepStrictEqual(incoming, row.document))
    )
      throw new Error(`Bump content version before changing ${row.id}.`);
  }
  await sql.transaction(
    questions.flatMap((q, ordinal) => {
      const topicId = `${q.section}:${q.topic}`;
      const sourceId = createHash("sha256")
        .update(q.source + q.license)
        .digest("hex")
        .slice(0, 24);
      const queries = [
        sql`INSERT INTO categories(id,name) VALUES(${q.section},${q.section}) ON CONFLICT(id) DO NOTHING`,
        sql`INSERT INTO topics(id,category_id,name) VALUES(${topicId},${q.section},${q.topic}) ON CONFLICT(id) DO NOTHING`,
        sql`INSERT INTO question_sources(id,description,license) VALUES(${sourceId},${q.source},${q.license}) ON CONFLICT(id) DO UPDATE SET description=EXCLUDED.description,license=EXCLUDED.license`,
      ];
      if (q.passage)
        queries.push(
          sql`INSERT INTO passages(id,title,body) VALUES(${q.passage.id},${q.passage.title},${q.passage.text}) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,body=EXCLUDED.body`,
        );
      if (q.audio)
        queries.push(
          sql`INSERT INTO audio_assets(id,url,transcript,kind) VALUES(${q.audio.id},${q.audio.url},${q.audio.transcript},${q.audio.kind}) ON CONFLICT(id) DO UPDATE SET url=EXCLUDED.url,transcript=EXCLUDED.transcript,kind=EXCLUDED.kind`,
        );
      queries.push(
        sql`INSERT INTO questions(id,topic_id,passage_id,audio_id,source_id,ordinal,difficulty,version,status,reviewed_by,reviewed_at,document) VALUES(${q.id},${topicId},${q.passage?.id ?? null},${q.audio?.id ?? null},${sourceId},${ordinal},${q.difficulty},${q.version},${q.status},${q.reviewedBy ?? null},${q.reviewedAt ?? null},${JSON.stringify(q)}::jsonb) ON CONFLICT(id) DO UPDATE SET topic_id=EXCLUDED.topic_id,passage_id=EXCLUDED.passage_id,audio_id=EXCLUDED.audio_id,source_id=EXCLUDED.source_id,ordinal=EXCLUDED.ordinal,difficulty=EXCLUDED.difficulty,version=EXCLUDED.version,status=EXCLUDED.status,reviewed_by=EXCLUDED.reviewed_by,reviewed_at=EXCLUDED.reviewed_at,document=EXCLUDED.document WHERE questions.version <= EXCLUDED.version`,
      );
      queries.push(
        sql`INSERT INTO answer_explanations(question_id,correct,document) VALUES(${q.id},${q.correct},${JSON.stringify(q.explanation)}::jsonb) ON CONFLICT(question_id) DO UPDATE SET correct=EXCLUDED.correct,document=EXCLUDED.document`,
      );
      for (const o of q.options)
        queries.push(
          sql`INSERT INTO question_options(question_id,label,body) VALUES(${q.id},${o.id},${o.text}) ON CONFLICT(question_id,label) DO UPDATE SET body=EXCLUDED.body`,
        );
      return queries;
    }),
  );
  const completeBatch =
    source &&
    questions.length === 140 &&
    ["listening", "grammar", "reading"].every(
      (s, i) =>
        questions.filter((q) => q.section === s).length === [50, 40, 50][i],
    );
  const packs = completeBatch
    ? [
        {
          id: source!
            .split(/[\\/]/)
            .at(-1)!
            .replace(/\.json$/, ""),
          name: source!
            .split(/[\\/]/)
            .at(-1)!
            .replace(/\.json$/, ""),
          questionIds: ["listening", "grammar", "reading"].flatMap((s) =>
            questions.filter((q) => q.section === s).map((q) => q.id),
          ),
        },
      ]
    : examPackages;
  for (const pack of packs) {
    const ordered = pack.questionIds.map((id) =>
      questions.find((q) => q.id === id),
    );
    if (ordered.some((q) => !q)) continue;
    const packageId = pack.id;
    await sql.transaction([
      sql`INSERT INTO exam_packages(id,name,status) VALUES(${packageId},${pack.name},${ordered.every((q) => q!.status === "published") ? "published" : "draft"}) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,status=EXCLUDED.status`,
      sql`DELETE FROM exam_package_questions WHERE package_id=${packageId}`,
      ...ordered.map(
        (q, i) =>
          sql`INSERT INTO exam_package_questions(package_id,question_id,ordinal) VALUES(${packageId},${q!.id},${i})`,
      ),
    ]);
  }
  console.log(report(questions));
} else throw new Error("Use migrate or import [batch.json].");

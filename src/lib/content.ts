import "server-only";
import { neon } from "@neondatabase/serverless";
import { bank } from "../../content/bank";
import { questionSchema, type Question } from "./contracts";
export const isDemo =
  process.env.CONTENT_MODE === "demo" || process.env.NODE_ENV === "development";
export async function getBank(): Promise<Question[]> {
  if (isDemo) return bank;
  if (!process.env.DATABASE_URL)
    throw new Error("Database belum dikonfigurasi.");
  const sql = neon(process.env.DATABASE_URL);
  const rows =
    await sql`SELECT document FROM questions WHERE status='published' ORDER BY ordinal LIMIT 2000`;
  return rows.map((r) => {
    const q = questionSchema.parse(r.document);
    if (q.status !== "published" || !q.reviewedBy?.trim() || !q.reviewedAt)
      throw new Error("Konten belum ditinjau.");
    return q;
  });
}
export async function getExamBank(): Promise<Question[]> {
  if (isDemo) return bank;
  if (!process.env.DATABASE_URL)
    throw new Error("Database belum dikonfigurasi.");
  const sql = neon(process.env.DATABASE_URL);
  const rows =
    await sql`SELECT q.document FROM exam_package_questions p JOIN questions q ON q.id=p.question_id WHERE p.package_id=(SELECT id FROM exam_packages WHERE status='published' ORDER BY id LIMIT 1) AND q.status='published' ORDER BY p.ordinal LIMIT 140`;
  return rows.map((r) => {
    const q = questionSchema.parse(r.document);
    if (q.status !== "published" || !q.reviewedBy || !q.reviewedAt)
      throw new Error("Konten belum ditinjau.");
    return q;
  });
}

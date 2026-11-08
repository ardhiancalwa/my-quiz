import { getBank, isDemo } from "@/lib/content";
export async function GET() {
  try {
    const bank = await getBank();
    return Response.json({
      demo: isDemo,
      total: bank.length,
      published: bank.filter((q) => q.status === "published").length,
      topics: [...new Set(bank.map((q) => q.topic))],
      counts: Object.fromEntries(
        ["listening", "grammar", "reading"].map((s) => [
          s,
          bank.filter((q) => q.section === s).length,
        ]),
      ),
    });
  } catch {
    return Response.json({ error: "Konten belum tersedia." }, { status: 503 });
  }
}

import { PracticeSetup } from "@/components/practice-setup";
import { getBank, isDemo } from "@/lib/content";
import { sectionSchema } from "@/lib/contracts";
export const dynamic = "force-dynamic";
export default async function Practice({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const params = await searchParams;
  const initial = sectionSchema.safeParse(params.section);
  const bank = await getBank().catch(() => null);
  if (!bank)
    return (
      <div className="wrap page-space">
        <h1>Bank soal belum tersedia.</h1>
        <p>Silakan coba lagi setelah pengelola menyiapkan konten.</p>
      </div>
    );
  const topics = [
    ...new Map(
      bank.map((q) => [
        q.section + q.topic,
        { section: q.section, topic: q.topic },
      ]),
    ).values(),
  ];
  return (
    <div className="wrap page-space">
      <PracticeSetup
        initial={initial.success ? initial.data : "grammar"}
        topics={topics}
        counts={Object.fromEntries(
          ["listening", "grammar", "reading"].map((s) => [
            s,
            bank.filter((q) => q.section === s).length,
          ]),
        )}
        demo={isDemo}
      />
    </div>
  );
}

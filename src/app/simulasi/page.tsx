import { PracticeSetup } from "@/components/practice-setup";
import { getBank, isDemo } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function Exam() {
  const bank = await getBank().catch(() => null);
  if (!bank)
    return (
      <div className="wrap page-space">
        <h1>Simulasi belum tersedia.</h1>
        <p>Pengelola perlu menyiapkan bank soal terlebih dahulu.</p>
      </div>
    );
  return (
    <div className="wrap page-space">
      <PracticeSetup
        exam
        topics={[]}
        demo={isDemo}
        counts={Object.fromEntries(
          ["listening", "grammar", "reading"].map((s) => [
            s,
            bank.filter((q) => q.section === s).length,
          ]),
        )}
      />
    </div>
  );
}

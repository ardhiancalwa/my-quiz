import type { Question } from "../../src/lib/contracts";
import { lessons, completionReasons } from "./grammar";
import { readingMeanings, listeningMeanings } from "./meanings";
import { errorReasons, errorCorrections } from "./error-reasons";
import { additionalListeningNotes } from "./listening-reasons";
import { readingReasons } from "./reading-reasons";
import { readingEvidenceSentences } from "./reading-evidence";
const readingLessons: Record<
  string,
  { rule: string; tip: string; pitfall: string; example: string }
> = {
  "Main idea": {
    rule: "Ide utama mencakup pembahasan bacaan secara keseluruhan. Detail seperti angka, satu alat, atau satu masalah hanya menjadi pendukungnya.",
    tip: "Ringkas bacaan dalam satu kalimat setelah membaca pembuka dan penutup. Periksa apakah ringkasan itu juga cocok dengan paragraf tengah.",
    pitfall:
      "Pilihan bisa memakai kata yang muncul dalam teks tetapi hanya mencakup satu detail kecil.",
    example:
      "Jika bacaan menjelaskan peminjaman alat, syarat, dan hasilnya, ide utamanya layanan peminjaman alat; bukan sekadar harga satu alat.",
  },
  "Supporting details": {
    rule: "Soal detail meminta informasi yang dinyatakan dalam teks. Jawaban dapat memakai kata berbeda dengan arti yang sama; tidak harus menyalin kalimat aslinya.",
    tip: "Tandai apa yang ditanya: siapa, apa, kapan, di mana, atau mengapa. Cari kalimat yang memuat informasi itu, lalu baca satu kalimat sebelum dan sesudahnya.",
    pitfall:
      "Informasi yang benar di dunia nyata belum tentu jawaban. Pilihan harus cocok dengan keterangan di bacaan ini.",
    example:
      "Every Friday dapat ditulis ulang sebagai once a week on Friday. Maknanya tetap setiap Jumat, bukan setiap hari.",
  },
  Inference: {
    rule: "Inference berarti kesimpulan yang masuk akal dari bukti dalam bacaan. Kesimpulan harus punya dasar, meskipun kalimat jawabannya tidak tertulis persis.",
    tip: "Sebutkan bukti lebih dahulu, baru tarik kesimpulan paling dekat. Jika perlu menambah banyak dugaan di luar teks, singkirkan pilihan itu.",
    pitfall:
      "Kata always, every, atau guarantees membuat klaim lebih kuat. Jangan memilih klaim mutlak jika bukti hanya menunjukkan kemungkinan atau hasil terbatas.",
    example:
      "Jika satu orang dapat muncul di kamera berkali-kali, jumlah rekaman belum tentu sama dengan jumlah orang. Kesimpulan ini mengikuti bukti, tanpa menebak jumlah pastinya.",
  },
  Exception: {
    rule: "Pada soal EXCEPT/NOT, cari satu pilihan yang tidak didukung atau bertentangan dengan teks. Pilihan lain justru dapat berisi informasi yang benar.",
    tip: "Lingkari EXCEPT/NOT sebelum membaca pilihan. Beri tanda cocok pada tiga pilihan yang didukung, lalu periksa pilihan yang tersisa.",
    pitfall:
      "Terburu-buru memilih pernyataan yang benar akan membalik tujuan pertanyaan ini.",
    example:
      "Teks: hanya satu dari tiga alat rusak. Pilihan “ketiganya rusak” dapat menjadi jawaban untuk pertanyaan EXCEPT.",
  },
  Reference: {
    rule: "Soal reference menanyakan kata benda yang dirujuk oleh kata ganti seperti it, they, atau them. Rujukan harus cocok jumlahnya dan masuk akal dalam kalimat.",
    tip: "Ganti kata ganti dengan kandidat kata bendanya, lalu baca ulang. Jika maknanya berubah atau jumlahnya tidak cocok, coba kandidat lain.",
    pitfall:
      "Kata benda yang paling dekat belum tentu rujukan yang benar. Periksa apa yang melakukan atau menerima tindakan.",
    example:
      "The books are wet. Put them inside. Them merujuk books karena buku itulah yang dipindahkan.",
  },
  "Vocabulary in context": {
    rule: "Makna kata ditentukan oleh pemakaiannya dalam kalimat ini. Satu kata dapat memiliki arti berbeda pada konteks lain.",
    tip: "Tutup kata yang ditanyakan, lalu uji setiap arti pengganti di kalimat asal. Baca satu kalimat di sekitarnya untuk mengecek hubungan makna.",
    pitfall:
      "Jangan memilih hanya karena bentuk katanya mirip atau karena itu arti pertama yang diingat.",
    example:
      "A light bag berarti tas yang ringan; a light room bisa berarti ruangan yang terang. Konteks menentukan arti light.",
  },
  Tone: {
    rule: "Tone adalah sikap penulis yang tampak dari pilihan kata dan cara menyampaikan informasi, misalnya berhati-hati, netral, marah, atau mengejek.",
    tip: "Cari kata yang membatasi klaim seperti may atau caution, serta apakah penulis menyajikan temuan beserta keterbatasannya.",
    pitfall:
      "Topik yang serius tidak otomatis berarti penulis marah. Tentukan sikap dari cara menulis, bukan dari topiknya saja.",
    example:
      "The method may help, but further tests are needed menunjukkan sikap berhati-hati, bukan kepastian mutlak.",
  },
  "Author’s purpose": {
    rule: "Tujuan penulis adalah tindakan yang dilakukan melalui teks: menjelaskan, membujuk, memberi petunjuk, atau menceritakan pengalaman.",
    tip: "Periksa bentuk isi: penjelasan proses dan temuan mengarah ke memberi informasi; ajakan membeli mengarah ke promosi; langkah perintah mengarah ke instruksi.",
    pitfall:
      "Judul/topik bukan otomatis tujuan. “Tentang museum” berbeda dengan “menjelaskan cara museum membuat replika”.",
    example:
      "Teks yang membahas alasan proyek, pelaksanaan, hasil, dan keterbatasannya biasanya bertujuan menjelaskan proyek tersebut.",
  },
};
function intent(prompt: string) {
  if (/^where/i.test(prompt)) return "lokasi atau tempat";
  if (/^when|what time|how often/i.test(prompt)) return "waktu atau frekuensi";
  if (/^how many|how much|how long/i.test(prompt))
    return "jumlah, biaya, atau durasi";
  if (/^why|what.*reason/i.test(prompt))
    return "alasan suatu tindakan atau keadaan";
  if (/imply|infer|suggest about|feel/i.test(prompt))
    return "makna tersirat atau sikap pembicara";
  return "informasi khusus yang diminta oleh pertanyaan";
}
const listeningNotes: Record<number, string[]> = {
  1: [
    "Room 204 memang disebut, tetapi sebagai lokasi lama yang dikoreksi oleh pembicara kedua.",
    "Perpustakaan tidak disebut sebagai tempat seminar.",
    "Laboratorium tidak disebut sebagai tempat seminar.",
  ],
  2: [
    "Pukul enam adalah perkiraan awal pembicara, bukan jam tutup khusus Jumat yang dijelaskan setelahnya.",
    "Pukul tujuh tidak disebut sebagai jam tutup Jumat.",
    "Pukul sembilan juga tidak disebut; pembicara mengatakan until eight.",
  ],
  3: [
    "Tidak ada keterangan bahwa batas pendaftaran sudah lewat. Ia masih menunggu surat referensi.",
    "Percakapan tidak mengatakan formulirnya hilang.",
    "Ia tidak menyebut pergantian jurusan sebagai penyebab penundaan.",
  ],
  4: [
    "Printer kehabisan kertas, bukan dinyatakan rusak. Perbaikan mesin bukan langkah pertama yang disebut.",
    "Tidak ada rencana mengirim halaman lewat email.",
    "Rapat tidak disebut akan dibatalkan.",
  ],
  5: [
    "Pembicara menilai kunjungan museum membuat perjalanan tetap layak; ia tidak meminta pembatalan.",
    "Completely disappointing terlalu negatif dibandingkan made it worthwhile.",
    "Masalah yang disebut adalah penundaan hujan, bukan perjalanan terlalu singkat.",
  ],
  6: [
    "Tidak ada saran membeli komputer. Masalahnya adalah tempat mencari artikel.",
    "Perempuan tidak meminta laki-laki menemui penulis artikel.",
    "Topik riset tidak diminta diganti; yang diganti adalah sumber pencarian.",
  ],
  7: [
    "Naik bus adalah kebiasaannya. Kata but today menunjukkan bahwa perjalanan hari ini berbeda.",
    "Ia tidak berjalan kaki; saudaranya akan mengantar.",
    "Kereta tidak disebut sebagai kendaraan hari ini.",
  ],
  9: [
    "Pukul dua adalah usulan pertama yang belum cocok dengan jadwal kelasnya.",
    "Pukul dua tiga puluh adalah jam kelas selesai, bukan jam pertemuan yang ia usulkan.",
    "Pukul empat tiga puluh tidak disebut dalam usulan.",
  ],
  11: [
    "Sewa justru dinilai affordable, artinya terjangkau.",
    "Ukuran dapur tidak disebut sebagai keberatan.",
    "Aturan pemilik rumah tidak dibicarakan.",
  ],
  12: [
    "Pembicara mengatakan only the electronic version, sehingga dua salinan cetak tidak diwajibkan.",
    "Naskah tulisan tangan tidak diminta.",
    "Rekaman audio tidak disebut sebagai bentuk pengumpulan.",
  ],
  17: [
    "Senin disebut sebagai hari tutup, bukan hari masuk gratis.",
    "Tidak ada informasi bahwa pameran berakhir pada Senin.",
    "Tidak ada pembatasan hanya untuk mahasiswa pada Senin.",
  ],
  21: [
    "Isi paket dinyatakan baik-baik saja, walaupun kotaknya rusak.",
    "Tidak ada instrumen laboratorium tertentu yang dikatakan rusak.",
    "Kendaraan pengiriman tidak dibahas.",
  ],
  23: [
    "Panjang buku bukan syarat yang disebut.",
    "Jam buka tidak dibicarakan sebagai penghalang perpanjangan.",
    "Jadwal kuliah pembaca tidak disebut; pengecualiannya adalah reservasi orang lain.",
  ],
  30: [
    "Pusat olahraga justru tidak disinggahi hari ini karena perbaikan jalan.",
    "Stasiun kereta tidak disebut dalam rute hari ini.",
    "Ada perbaikan jalan, tetapi itu tidak berarti shuttle menuju bengkel.",
  ],
};
export function improveExplanation(q: Question): Question {
  const correct = q.options.find((o) => o.id === q.correct)!;
  const wrong = q.options.filter((o) => o.id !== q.correct);
  if (q.section === "grammar") {
    const lesson = lessons[q.topic];
    if (!lesson) throw new Error(`Teaching guide missing: ${q.id}/${q.topic}`);
    const n = Number(q.id.split("-")[1]);
    const c = q.explanation.correction;
    if (q.type === "error" && !c)
      throw new Error(`Correction missing: ${q.id}`);
    const full = q.prompt.replace(/_{2,}/, correct.text);
    const reasons = completionReasons[n];
    if (q.type === "completion" && reasons?.length !== 3)
      throw new Error(`Three authored reasons required: ${q.id}`);
    const why =
      q.type === "error"
        ? `Jawaban ${q.correct} menunjuk bagian yang harus diperbaiki, yaitu “${c!.from}” → “${c!.to}”.\n\n${errorCorrections[n]}`
        : q.id === "grammar-1"
          ? "Jawaban B adalah “is kept”, artinya “disimpan”. Yang dibicarakan adalah satu collection (koleksi); of rare maps hanya menjelaskan isinya. Koleksi itu menerima tindakan penyimpanan, jadi gunakan bentuk pasif is + kept. Kept adalah bentuk ketiga dari keep."
          : q.id === "grammar-4"
            ? "Jawaban A adalah “using”. Kata avoids berarti menghindari. Dalam bahasa Inggris, kegiatan yang dihindari setelah avoid ditulis dengan bentuk -ing: avoids using, artinya menghindari penggunaan. Using di sini berfungsi sebagai nama kegiatan, yang disebut gerund."
            : q.explanation.why;
    if (
      q.type === "error" &&
      (!errorCorrections[n] || errorReasons[n]?.length !== 3)
    )
      throw new Error(`Three segment reasons required: ${q.id}`);
    const incorrect = Object.fromEntries(
      wrong.map((o, i) => [
        o.id,
        q.type === "completion" ? reasons[i] : errorReasons[n][i],
      ]),
    );
    return {
      ...q,
      version: 2,
      explanation: {
        ...q.explanation,
        why,
        incorrect,
        concept: lesson.name,
        rule:
          q.id === "grammar-50"
            ? "Be required to + kata kerja dasar berarti diwajibkan melakukan sesuatu. Sesudah are required, to display berarti untuk memperlihatkan."
            : lesson.rule,
        steps:
          q.type === "error"
            ? [
                `Baca kalimat utuh: ${q.segments!.map((s) => s.text).join(" ")}`,
                errorCorrections[n],
                `Baca ulang hasil perbaikannya: ${c!.sentence}`,
              ]
            : [
                `Temukan petunjuk pada kalimat: ${q.prompt}`,
                `Gunakan alasan khusus soal ini: ${q.explanation.why}`,
                `Masukkan pilihan ${q.correct} lalu baca kembali: ${full}`,
              ],
        tip: lesson.tip,
        pitfall: lesson.pitfall,
        example: lesson.example,
      },
    };
  }
  const n = Number(q.id.split("-")[1]);
  const meaning =
    q.section === "listening"
      ? listeningMeanings[n - 1]
      : readingMeanings.flat()[n - 1];
  if (!meaning) throw new Error(`Answer gloss missing: ${q.id}`);
  const raw = q.explanation.evidence ?? "";
  const source = q.passage?.text ?? q.audio?.transcript ?? "";
  const teachingTopic = q.id === "reading-335" ? "Supporting details" : q.topic;
  const isExcept =
    q.topic === "Exception" ||
    /poor assumption|unsupported conclusion/i.test(q.prompt);
  const reading = readingLessons[isExcept ? "Exception" : teachingTopic];
  let evidence = raw && source.includes(raw) ? raw : source;
  if (q.section === "reading") {
    const indexes = readingEvidenceSentences[n];
    if (indexes) {
      const sentences = source.split(/(?<=[.!?])\s+(?=[A-Z])/);
      // Preserve the original paragraph separator when the clue spans paragraphs.
      const start = source.indexOf(sentences[indexes[0]]);
      const last = sentences[indexes.at(-1)!];
      evidence = source.slice(start, source.indexOf(last, start) + last.length);
    } else if (
      teachingTopic === "Main idea" ||
      teachingTopic === "Author’s purpose"
    ) {
      evidence = source.split("\n\n")[0];
    }
  }
  if (q.section === "reading" && !reading)
    throw new Error(`Reading lesson missing: ${q.topic}`);
  const listening = {
    rule: `Pertanyaan ini meminta ${intent(q.prompt)}. Cocokkan isi percakapan dengan pertanyaan tersebut; kata yang terdengar sama belum tentu menjawabnya.`,
    tip: /where/i.test(q.prompt)
      ? "Catat tempat yang akhirnya disepakati. Jika ada no, but, atau instead, periksa apakah lokasi awal sedang dikoreksi."
      : /when|what time|how often/i.test(q.prompt)
        ? "Catat angka beserta fungsinya: jam selesai kelas, jam pertemuan, atau batas waktu. Jangan mengambil angka pertama yang terdengar."
        : /why/i.test(q.prompt)
          ? "Dengarkan alasan setelah because atau petunjuk masalah sebelum rencana tindakan. Bedakan penyebab dengan akibat."
          : /how many|how long|how much/i.test(q.prompt)
            ? "Catat satuan bersama angka. Orang, kelompok, menit, dan minggu tidak dapat dipertukarkan."
            : /imply|feel|suggest/i.test(q.prompt)
              ? "Perhatikan penilaian dan kalimat setelah but. Simpulkan sedekat mungkin dengan ucapan pembicara."
              : "Baca pertanyaannya dahulu, tentukan informasi yang dicari, lalu dengarkan kata kunci beserta kalimat di sekitarnya.",
    pitfall:
      "Nama tempat, angka, atau kegiatan bisa disebut sebagai rencana lama atau pilihan yang ditolak. Jangan memilih hanya karena kata itu terdengar dalam audio.",
    example:
      "“I usually take the bus, but today my sister is driving me.” Bus adalah kebiasaan; perjalanan hari ini menumpang kendaraan saudara.",
  };
  const guide = q.section === "reading" ? reading : listening;
  const authored =
    q.section === "listening"
      ? (listeningNotes[n] ?? additionalListeningNotes[n])
      : readingReasons[n];
  if (q.section === "listening" && authored?.length !== 3)
    throw new Error(`Three listening reasons required: ${q.id}`);
  const sourceWrongOrder = [1, 2, 3].map(
    (offset) =>
      q.options[(q.options.findIndex((o) => o.id === q.correct) + offset) % 4]
        .id,
  );
  const incorrect = Object.fromEntries(
    wrong.map((o) => {
      const note = authored
        ? authored[sourceWrongOrder.indexOf(o.id)]
        : undefined;
      if (note) return [o.id, note];
      if (teachingTopic === "Main idea")
        return [
          o.id,
          `“${o.text}” mengubah pokok bahasan menjadi hal yang tidak dikembangkan oleh teks. Dari paragraf pembuka, yang dilakukan adalah ${meaning.toLowerCase()}. Detail pelaksanaan dan hasil pada paragraf berikutnya juga menjelaskan kegiatan itu, bukan topik pada pilihan ini.`,
        ];
      if (teachingTopic === "Author’s purpose")
        return [
          o.id,
          [
            `To promote berarti mempromosikan. Teks tidak mengajak membeli atau mendukung “${o.text.replace(/^To promote /, "")}”; penulis memaparkan kegiatan, hasil, dan keterbatasan proyek.`,
            `To provide instructions berarti memberi langkah petunjuk. Bacaan bukan panduan melakukan “${o.text.replace(/^To provide instructions for /, "")}"; isinya laporan penjelasan suatu proyek.`,
            `To narrate a personal holiday berarti menceritakan liburan pribadi. Bacaan menyajikan kegiatan dan temuan proyek, tanpa rangkaian pengalaman liburan penulis.`,
          ][sourceWrongOrder.indexOf(o.id)],
        ];
      if (teachingTopic !== "Supporting details")
        throw new Error(`Reading reasons missing: ${q.id}`);
      return [
        o.id,
        `Kalimat yang menjawab pertanyaan adalah “${evidence}”. Informasi yang diberikan: ${meaning.toLowerCase()}. Pilihan “${o.text}” menggantinya dengan keterangan yang tidak dinyatakan oleh kalimat tersebut. Cocokkan pelaku, tindakan, waktu, dan batasannya; disebut di tempat lain pun belum tentu menjawab pertanyaan ini.`,
      ];
    }),
  );
  return {
    ...q,
    version: 2,
    explanation: {
      why: `${isExcept ? "Soal ini meminta pengecualian atau kesimpulan yang tidak didukung. " : ""}Jawaban ${q.correct}: “${correct.text}”. ${isExcept ? "Klaim yang perlu ditolak" : "Maksudnya"}: ${meaning.toLowerCase()}.\n\n${q.explanation.why}`,
      incorrect,
      concept:
        q.section === "listening"
          ? "Memahami informasi dalam percakapan"
          : isExcept
            ? "Mencari pernyataan yang tidak didukung"
            : teachingTopic,
      rule: guide.rule,
      steps: [
        `Tentukan yang dicari: ${q.prompt}`,
        q.section === "reading"
          ? isExcept
            ? "Tandai bahwa pertanyaan meminta pernyataan keliru/tidak didukung. Singkirkan tiga pilihan yang justru sesuai teks."
            : `Baca kalimat bukti dan tentukan informasi yang cocok: ${meaning.toLowerCase()}. Periksa konteks sebelum dan sesudah kalimat itu.`
          : `Dengarkan untuk menemukan ${intent(q.prompt)}, bukan sekadar kata yang sama dengan opsi.`,
        `Cocokkan maknanya: “${correct.text}” = ${meaning.toLowerCase()}. Lalu cek mengapa tiga pilihan lain tidak menjawab pertanyaan ini.`,
      ],
      tip: guide.tip,
      pitfall: guide.pitfall,
      example: guide.example,
      evidence,
    },
  };
}

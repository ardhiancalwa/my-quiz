# Operasi, konten, biaya, dan deployment

## Sumber format
https://lac.telkomuniversity.ac.id/layanan/tes-bahasa/eprt/ adalah acuan jumlah, durasi, dan urutan bagian. Contoh PDF LaC menjadi acuan bentuk soal dan pemutaran audio sekali. Artikel LinkedIn yang menyebut Reading 20–30 soal/30–40 menit tidak digunakan untuk timer. Contoh Grammar tahun 2025 memuat passive voice yang kurang `been`; sumber tetap perlu diperiksa, bukan diimpor tanpa review.

## Pipeline konten
1. Jalankan `npm run content:blueprint`. Blueprint mencatat target dan gate review; bukan generator massal dengan penggantian kata.
2. Tulis batch JSON menggunakan schema di src/lib/contracts.ts. Sertakan options A–D, jawaban, alasan benar, alasan setiap distractor, konsep, tip, bukti passage/transcript, sumber, lisensi, versi, dan status draft.
3. Jalankan `npx tsx scripts/content.ts check path/to/batch.json`. Validator mendeteksi exact normalized stem duplicates, bukan semua paraphrase. Review kemiripan semantik tetap diperlukan.
4. Review manusia untuk kunci, ambiguitas, distractors, grammar, kealamian bahasa, dan bukti. Untuk error recognition, pastikan tepat satu bagian salah. Untuk Listening, dengarkan seluruh file, verifikasi isi dan hak distribusi.
5. Setelah review nyata, isi reviewedBy, reviewedAt ISO, status validated/published, dan naikkan version. Jangan mengisi reviewer atas nama orang yang belum memeriksa.
6. Jalankan import privat. Tidak ada mutation endpoint publik. Import bank bawaan mengisi tiga paket dari content/packages.ts; batch JSON lengkap 50/40/50 juga dapat menjadi paket dengan ID dari nama file. Paket published hanya jika seluruh soal published. Pengguna memilih paket yang tersedia; produksi hanya menampilkan paket published.
7. Jalankan content report dan periksa jumlah published. Simpan laporan review dengan batch.

## Database
Di Vercel pilih Storage/Marketplace → Neon Postgres, periksa plan yang ditawarkan, hubungkan ke proyek, dan gunakan DATABASE_URL yang disediakan. Untuk Preview gunakan branch/database terpisah. Jangan menghubungkan secrets produksi ke preview tidak dipercaya.

Salin .env.example ke .env.local secara lokal dan isi DATABASE_URL. Buat SESSION_SECRET acak dengan setidaknya 32 karakter. Jangan commit .env.local atau menaruh secrets pada variabel NEXT_PUBLIC_.

```powershell
npm run db:migrate
npm run db:import
# Untuk batch yang sudah direview:
npx tsx --env-file=.env.local scripts/database.ts import content/batches/reviewed.json
```

Import dapat dijalankan ulang tanpa membuat baris ganda. Perubahan konten dengan ID sama memerlukan version lebih tinggi. Migrations dijalankan operator, bukan setiap cold start Function. Schema memakai foreign keys, pilihan terbatas A–D, constraints status/difficulty, dan metadata review wajib untuk konten non-draft.

Snapshot/backup: sebelum migrasi atau import published, gunakan fasilitas backup/branch Neon yang tersedia pada plan dan simpan export privat `pg_dump` pada penyimpanan operator yang aman. Uji restore ke branch terpisah. Ketersediaan restore window/branch perlu diperiksa pada dashboard Marketplace; tidak diasumsikan gratis tanpa batas.

## Audio
102 file MP3 demo berukuran total 11.17 MB. Mereka disajikan dari /public/audio, bukan Functions atau database. Pembuatan audio lokal: `npx tsx scripts/audio-manifest.ts`, lalu `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/audio.ps1`; membutuhkan Windows Speech dan ffmpeg. File yang sudah ada dilewati agar penambahan tidak mengubah rekaman lama. Untuk merevisi rekaman, lakukan melalui workflow operator dengan versi konten yang sesuai. Ini tidak dijalankan saat deploy.

Blob belum diperlukan untuk ukuran ini. Jika dipakai nanti, perluas validator URL audio ke allowlist hostname Blob milik proyek dan gunakan referensi yang disetujui. Tidak ada akses upload publik.

## Estimasi resource dan batas plan
Diperiksa 8 November 2026, dapat berubah. Penawaran Neon di Marketplace harus dikonfirmasi saat provisioning dan bisa berbeda dari halaman harga langsung.

- [Vercel Hobby](https://vercel.com/docs/plans/hobby): penggunaan personal nonkomersial; 100 GB fast data transfer, 10 GB fast origin transfer, 1 juta function invocations, 4 CPU-jam. Pilih plan yang sesuai jika penggunaan institusional/komersial tidak memenuhi ketentuannya.
- [Neon](https://neon.com/pricing): halaman langsung menyebut Free 100 CU-jam per proyek/bulan, 1 GB storage per proyek, dan hingga 100 proyek. Batas koneksi/branch/retensi dan billing penawaran Marketplace belum dikonfirmasi pada akun pengguna.
- [Vercel Blob](https://vercel.com/docs/vercel-blob/usage-and-pricing): Hobby 1 GB storage, 10 GB transfer, 10.000 simple operations, 2.000 advanced operations. Batas ini bukan alasan untuk menambah Blob sebelum dibutuhkan.

Ukuran artefak lokal terukur: 720 soal menghasilkan JSON sekitar 1.70 MB, termasuk bacaan/transcript yang muncul pada beberapa soal, dan 11.17 MB audio. Angka ini belum mencakup indeks database serta duplikasi kolom/tabel. Sebagai asumsi konservatif, alokasikan 8 KB dokumen per soal: sekitar 5.8 MB untuk 720 dan 16 MB untuk 2.000. Audio 2.000 soal diperkirakan sekitar 31 MB hanya bila proporsi Listening dan panjang rekaman tetap sama; ini bukan pengukuran beban produksi. Audio tiap paket simulasi terukur 3.70–3.75 MB. Tiga pemutaran total melipatgandakan transfer tiga kali. Sebanyak 10.000 sesi dengan 3.72 MB audio per sesi sekitar 37.2 GB transfer audio, belum termasuk halaman/font/API. Jika memakai Blob, angka itu melampaui 10 GB Hobby; static assets memakai kuota hosting. Compute Neon perlu diukur setelah traffic nyata, tidak bisa dipastikan dari jumlah soal.

## Deployment
1. Push source ke https://github.com/ardhiancalwa/my-quiz.
2. Import repository pada Vercel, framework Next.js, build `npm run build`, install `npm ci`, Node 22+.
3. Hubungkan Neon melalui Marketplace. Konfigurasi DATABASE_URL dan SESSION_SECRET; hapus CONTENT_MODE=demo untuk Production.
4. Jalankan migration dan import batch reviewed melalui environment operator yang aman. Jangan mengklaim 720 soal bila jumlah published belum mencukupi.
5. Konfigurasi Vercel Firewall rate limit untuk `/api/session` dan `/api/submit`. Ada fallback in-memory 60 request/menit per IP hash dan instance; itu bukan distributed rate limit. Identitas hash hanya ditahan selama window 60 detik, tanpa fingerprinting atau analytics tersembunyi.
6. Periksa Preview dengan database terpisah. Uji akses tanpa login, soal, audio, timer/refresh, submit, hasil, IndexedDB, export/import, mobile, dan runtime logs.
7. Deploy Production sesudah semua gate konten dan environment selesai. Lakukan smoke test pada URL asli; pantau penggunaan Vercel/Neon dan periksa peringatan kuota.

## Troubleshooting
- Bank kosong/layanan belum tersedia: periksa DATABASE_URL, migration, dan jumlah soal berstatus published; draft sengaja tidak disajikan di Production.
- Sesi tidak valid: SESSION_SECRET harus sama pada seluruh instance. Setelah rotasi key, sesi lama perlu dimulai ulang.
- Versi soal berubah: mulai sesi baru; jangan menilai jawaban terhadap versi konten berbeda.
- Autosave gagal: cek izin IndexedDB/ruang penyimpanan browser; ekspor data sebelum menghapus browser storage.
- File audio tidak ada: jalankan content check, cek URL yang disajikan dan hasil decode; jangan menganggap keberadaan transcript membuktikan audio bekerja.
- Build/test Windows gagal membuat berkas sementara: jalankan dari terminal dengan akses normal ke folder proyek, bukan memperlonggar konfigurasi aplikasi produksi.

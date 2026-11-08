# Rencana implementasi dan catatan riset

## Aturan terverifikasi, 8 November 2026
Sumber: https://lac.telkomuniversity.ac.id/layanan/tes-bahasa/eprt/
Listening 50 soal/45 menit; Grammar 40/25; Reading 50/55. Total pengerjaan 125 menit, sedangkan pelaksanaan resmi disebut sekitar 2–3 jam. Urutan bagian: Listening, Grammar, Reading. Persyaratan akun, Zoom, SEB, identitas, dan pengawasan di halaman tersebut berlaku untuk tes resmi, bukan fitur platform latihan independen tanpa akun ini.

PDF contoh: https://lac.telkomuniversity.ac.id/wp-content/uploads/2024/08/Contoh-Soal-EPrT%C2%AE.pdf
Blueprint: Listening 30 short dialogue + 10 long dialogue + 10 lecture; Grammar 15 completion + 25 error recognition. Audio satu kali pada simulasi; replay pada latihan. Blueprint dibedakan dari jumlah dan durasi yang ada pada halaman layanan.

## Desain
Adaptasi gambar pengguna: Ubuntu, putih #FFFFFF, tinta #020202, pink #E56399, lime #92CC34. Konten lebar sekitar 1160px (perkiraan), judul besar, sorotan pink, outline tipis dan bayangan hitam offset. Landing memakai grid tipis dan ilustrasi editorial asli; halaman soal lebih tenang agar mudah dibaca. Mobile satu kolom; reduced motion dihormati.

## Scope
Satu Next.js App Router; src/app halaman dan Route Handlers; src/components interaksi; src/lib kontrak, sesi bertanda tangan, scoring, IndexedDB, akses konten; content bank soal offline; migrations SQL; scripts pemeriksaan/import; tests unit/E2E. Tidak ada autentikasi, pengguna pusat, atau layanan AI runtime.

Dependensi: Next/React/TypeScript untuk aplikasi; Tailwind untuk styling; Lucide untuk ikon; idb untuk transaksi IndexedDB; Zod untuk validasi batas input/import; driver Neon untuk SQL serverless; font Ubuntu lokal agar build tidak memerlukan Google Fonts. Vitest/Playwright/ESLint untuk pemeriksaan.

## Skill
Ponytail, Context7 dan reverse-engineer-no-slop dibaca dan diterapkan. Pencarian pada katalog, .codex/skills, .agents/skills, dan cache plugin tidak menemukan ui-ux-pro-max atau skill bernama anti-slop. Jangan mengklaim keduanya dijalankan. Instalasi: pilih repository/URL skill resmi yang dikehendaki, lalu gunakan skill-installer dan verifikasi SKILL.md sebelum menjalankannya. Sumber instalasi belum diberikan; tidak memasang paket dengan nama mirip secara sembarang.

## Batas penyelesaian
Implementasi dapat diuji dengan bank draf lokal yang diberi label demo. Konten buatan agen belum melalui review pengajar. Target 720 soal MVP dan 2.000 ekspansi tetap acceptance gate, bukan angka yang boleh dipenuhi dengan duplikasi. Deployment publik memakai Neon dan hanya konten published dengan metadata reviewer. Kredensial Vercel/Neon/GitHub belum tersedia di environment awal.

## Acceptance
1. Build, typecheck, lint, unit dan E2E lulus.
2. Latihan: pilih soal, jawab, submit, penilaian server, pembahasan, retry.
3. Simulasi: 140 soal jika paket lengkap; deadline per bagian tidak reset saat refresh; audio satu kali; tidak ada jawaban benar pada payload awal; hasil setelah bagian terakhir.
4. Autosave, bookmarks, riwayat, rekomendasi rule-based, export/import tervalidasi, reset.
5. Pemeriksaan audio, layout desktop/mobile, keyboard dan error states.
6. Sebelum production: review manusia, 720 soal tervalidasi, Neon terhubung, rate limit Vercel diaktifkan, backup dan deployment smoke test.

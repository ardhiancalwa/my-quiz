# EPrT Practice

Platform latihan independen dengan Next.js App Router, TypeScript, Neon PostgreSQL, dan IndexedDB. UI memakai Ubuntu, pink #E56399, lime #92CC34, outline hitam, serta ilustrasi SVG asli yang mengadaptasi referensi pengguna.

## Menjalankan lokal

Node.js 22 atau lebih baru diperlukan.

```powershell
npm ci
npm run dev
```

Buka http://127.0.0.1:3000. Development otomatis menggunakan bank draf demo; tidak memerlukan akun atau database. Untuk menjalankan build lokal, salin template sekali ke `.env.local` di root proyek. Jika file tersebut sudah ada, cukup tambahkan `CONTENT_MODE=demo` tanpa menimpa pengaturan lain.

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run build
npm run start
```

Next.js membaca `.env.local` saat build dan saat `npm run start`, sehingga mode demo tetap aktif setelah terminal dibuka ulang. File `.env.example` sendiri tidak dibaca otomatis. Setelah mengubah `.env.local`, jalankan ulang server. Tanpa mode demo, hasil build memang memerlukan database Neon dengan soal published; jangan mengubahnya menjadi fallback draf otomatis di produksi.

## Yang tersedia

- Landing, pengaturan latihan, dashboard progres, hasil dan pembahasan.
- Pembahasan dengan aturan sederhana, langkah pengerjaan, alasan tiap pilihan, bukti bacaan/percakapan, serta tips, jebakan dan contoh. Hasil latihan lama dapat memuat pembahasan terbaru tanpa mengubah nilai. Lihat [panduan pembahasan](docs/EXPLANATIONS.md).
- Filter bagian, topik, kesulitan, soal baru, dan soal yang pernah salah.
- Tiga paket simulasi draf lengkap tanpa soal berulang antar paket: masing-masing Listening 50/45 menit, Grammar 40/25, Reading 50/55. Paket dapat dipilih sebelum mulai.
- Pilihan latihan diacak per kelompok bacaan/audio; 300 soal tambahan tersedia di luar tiga paket simulasi.
- Sesi ditandatangani server; kunci jawaban dan transcript tidak disertakan sebelum submit.
- Timer per bagian mempertahankan deadline saat refresh; waktu habis memicu submit otomatis. Saat offline, jawaban tetap lokal dan pengiriman dapat dicoba kembali.
- 102 rekaman audio demo MP3 lokal (mono, 24 kHz, 48 kbps), total 11.17 MB. Replay/kecepatan tersedia pada latihan; simulasi mencatat audio yang sudah dimulai.
- Autosave, resume, bookmarks, riwayat kesalahan, statistik, rekomendasi aturan sederhana, export/import JSON tervalidasi, reset progres.
- Migrations dan import idempotent dengan pemeriksaan versi konten dan metadata reviewer.

## Status konten

720 soal **draf**: 150 Listening, 220 Grammar, dan 350 Reading dalam 35 passage. Tiga paket memakai 420 soal berbeda dan latihan tambahan memakai 300 soal lainnya. Materi, opsi, kunci, passage, dan audio soal awal dipertahankan; pembahasan telah diperbarui.

0 soal tervalidasi manusia, 0 published. Struktur, kelengkapan, jumlah, referensi audio, dan duplikasi stem beserta konteks bacaan/transcript diperiksa otomatis; itu bukan validasi semantik atau review pengajar. Jumlah draf telah mencapai 720, tetapi target 720 soal tervalidasi MVP dan 2.000 ekspansi belum tercapai. Jangan menggandakan soal untuk memenuhi target.

Rekaman demo dibuat secara offline dengan Windows Speech (Microsoft Zira), menggunakan teks asli proyek. Pronunciation, intonasi, dan hak distribusi suara harus ditinjau operator sebelum publikasi materi pembelajaran. Tidak ada rekaman atau passage dari tautan contoh yang disalin ke bank ini.

## Pemeriksaan

```powershell
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run content:check
npm run content:report
npm run content:blueprint
```

Pengujian browser memakai Microsoft Edge lokal dalam mode headless, desktop dan emulasi ukuran Pixel 7. Ini bukan pengujian perangkat ponsel fisik. Untuk OS tanpa Edge, ubah `channel` pada playwright.config.ts ke browser terpasang yang sesuai. Screenshot di docs/screenshots; hasil E2E JSON di test-results (diabaikan Git).

## Produksi

Lihat [rencana dan riset](docs/PLAN.md), [panduan operasi](docs/OPERATIONS.md), [status pengerjaan](docs/STATUS.md), dan [laporan konten](docs/content-quality.json).

Deployment harus menggunakan GitHub → Vercel, dengan Neon dari Vercel Marketplace. Jangan memakai CONTENT_MODE=demo untuk deployment produksi. Database dan SESSION_SECRET harus dikonfigurasi; server hanya menggunakan konten published yang sudah memiliki metadata reviewer. Tidak ada autentikasi, data pengguna pusat, atau AI API runtime.

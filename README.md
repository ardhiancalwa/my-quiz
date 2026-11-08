# EPrT Practice

Platform latihan independen dengan Next.js App Router, TypeScript, Neon PostgreSQL, dan IndexedDB. UI memakai Ubuntu, pink #E56399, lime #92CC34, outline hitam, serta ilustrasi SVG asli yang mengadaptasi referensi pengguna.

## Menjalankan lokal

Node.js 22 atau lebih baru diperlukan.

```powershell
npm ci
npm run dev
```

Buka http://127.0.0.1:3000. Development otomatis menggunakan bank draf demo; tidak memerlukan akun atau database. Untuk menjalankan build lokal:

```powershell
$env:CONTENT_MODE='demo'
npm run build
npm run start
```

## Yang tersedia

- Landing, pengaturan latihan, dashboard progres, hasil dan pembahasan.
- Filter bagian, topik, kesulitan, soal baru, dan soal yang pernah salah.
- Satu paket simulasi draf lengkap: Listening 50/45 menit, Grammar 40/25, Reading 50/55.
- Sesi ditandatangani server; kunci jawaban dan transcript tidak disertakan sebelum submit.
- Timer per bagian mempertahankan deadline saat refresh; waktu habis memicu submit otomatis. Saat offline, jawaban tetap lokal dan pengiriman dapat dicoba kembali.
- 34 rekaman audio demo MP3 lokal (mono, 24 kHz, 48 kbps). Replay/kecepatan tersedia pada latihan; simulasi mencatat audio yang sudah dimulai.
- Autosave, resume, bookmarks, riwayat kesalahan, statistik, rekomendasi aturan sederhana, export/import JSON tervalidasi, reset progres.
- Migrations dan import idempotent dengan pemeriksaan versi konten dan metadata reviewer.

## Status konten

140 soal **draf**, 0 soal tervalidasi manusia, 0 published. Struktur, kelengkapan, jumlah, referensi audio, dan duplikasi stem diperiksa otomatis; itu bukan validasi semantik atau review pengajar. Target 720 soal MVP dan 2.000 ekspansi belum tercapai. Jangan menggandakan soal untuk memenuhi target.

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

# Status implementasi, 8 November 2026

## Selesai dan diperiksa
- Riset format resmi, analisis referensi visual, arsitektur, dan batas infrastruktur didokumentasikan di PLAN.md dan OPERATIONS.md.
- Next.js 16.4.5 + React 19.3.1, TypeScript, Tailwind, Ubuntu lokal, UI responsif dengan ilustrasi SVG asli.
- Alur latihan, filter, navigator, penilaian server, hasil dan pembahasan.
- Tiga simulasi draf lengkap masing-masing 140 soal tanpa soal berulang antar paket, pilihan paket, timer per bagian dengan deadline tersimpan, transisi berurutan, submit otomatis saat waktu habis, audio sekali per rekaman. Latihan diacak per kelompok bacaan/audio.
- IndexedDB autosave/resume, bookmarks, riwayat, review kesalahan, statistik, rekomendasi berdasarkan akurasi, export/import JSON tervalidasi dan reset.
- SQL migrations, constraints, paket soal, versi konten, status review, dan scripts import privat.
- 720 draf orisinal: 150 Listening, 220 Grammar (75 completion/145 error recognition), 350 Reading dalam 35 passage. 102 MP3 demo, total 11.17 MB. Penambahan 580 soal mempertahankan seluruh 140 record awal tanpa perubahan. Sebanyak 420 soal ditetapkan ke tiga paket dan 300 soal lain untuk latihan tambahan.

## Hasil pemeriksaan
- Production build: lulus, seluruh halaman dan Route Handlers terkompilasi.
- TypeScript dan ESLint: lulus.
- Vitest: 16 pengujian lulus, termasuk kelengkapan 720 soal, tiga paket yang saling lepas, pengacakan yang mempertahankan kelompok, duplikasi konteks meskipun ID diubah, token tamper, pemisahan jawaban server, penilaian masing-masing paket 140 soal, deadline, import JSON, request-size limit dan rate limit.
- Playwright: 10 pengujian lulus (8 alur inti + 2 pemeriksaan tambahan), pada Microsoft Edge headless desktop dan emulasi viewport ponsel. Mencakup latihan sampai hasil, autosave setelah refresh, bookmark, export dan penolakan import rusak, playback audio nyata, deadline dan konsumsi audio setelah refresh, urutan tiga bagian, dan penolakan input API. Pemeriksaan tambahan mencakup import cadangan valid, pembatalan dialog dengan Escape, reset dan pemulihan cadangan.
- PostgreSQL 18 lokal sementara: migration pertama dan kedua lulus; constraints foreign key, label opsi dan penolakan published tanpa reviewer lulus. Database tes dimatikan setelah pemeriksaan. Ini bukan pengujian koneksi Neon.
- FFmpeg: seluruh 102 MP3 berhasil didekode tanpa error. Mendekode tidak membuktikan kealamian intonasi atau kejelasan setiap pengucapan.
- npm audit setelah scoped override minimatch pada dependensi ESLint: 0 kerentanan yang dilaporkan saat instalasi terakhir. Override dapat dilepas jika upstream telah memakai versi aman.
- Screenshot desktop/mobile di docs/screenshots diperiksa visual untuk landing dan halaman soal. Tidak mengklaim pixel-perfect atau skor Lighthouse.

## Belum selesai
- Review manusia: 0 soal; published: 0. Jumlah draf telah mencapai 720, tetapi target 720 soal tervalidasi MVP dan ekspansi 2.000 belum tercapai.
- Audit semantik semua distractor/pembahasan, kealamian audio, dan hak distribusi suara sebelum materi dipublikasikan.
- Akun/proyek Vercel, integrasi Neon Marketplace, kredensial server, penerapan rate limit Firewall, backup/restore Neon, deployment publik dan smoke test URL produksi.
- Belum menguji perangkat ponsel fisik, Safari/WebKit, Core Web Vitals produksi, distributed load, atau pemulihan backup Neon.

## Langkah berikutnya
Hubungkan repository ke Vercel dan Neon, konfirmasi plan Marketplace pada akun pengguna, review 720 soal dan metadata reviewer, lalu lakukan Preview dan Production smoke test. Infrastruktur publik dan jumlah published tetap menjadi gate penyelesaian, bukan klaim yang dipenuhi oleh mode demo lokal.

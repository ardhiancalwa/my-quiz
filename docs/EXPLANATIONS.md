# Pembahasan untuk pembelajar

Revisi ini menambahkan penjelasan bertahap pada 720 soal draf. Materi latihan, opsi, kunci, passage, dan audio tetap sama. Pembahasan tidak memerlukan AI API saat digunakan.

- Jawaban benar dijelaskan melalui petunjuk kalimat/percakapan, makna dalam bahasa Indonesia, dan aturan yang dipakai. Istilah seperti subjek, gerund, dan V3 dijelaskan dalam panduan topik.
- Setiap opsi lain mendapat alasan. Grammar dan Listening memakai alasan yang ditulis per opsi. Reading memakai alasan per opsi untuk 50 soal awal serta kosakata, inferensi, dan rujukan; soal detail lainnya membandingkan opsi dengan kalimat sumber dan makna jawaban. Tujuan penulis dibedakan antara promosi, instruksi, dan cerita pribadi.
- Error Recognition menampilkan bagian yang perlu diganti serta kalimat hasil perbaikan. Tiga bagian lainnya dijelaskan sebagai bagian yang sudah benar.
- Tips berisi tindakan yang dapat diterapkan pada soal serupa, disertai jebakan dan contoh pembanding. Tips merupakan panduan, bukan jaminan jawaban tanpa membaca konteks.

## Penyimpanan dan versi

Field tambahan `rule`, `steps`, `pitfall`, `example`, dan `correction` bersifat opsional pada skema agar cadangan lama tetap dapat diimpor. Jawaban dan pembahasan tetap hanya dikirim setelah submit.

Hasil lama menyimpan salinan pembahasan di IndexedDB. Tombol **Perbarui pembahasan** mengambil penjelasan terbaru melalui endpoint sesi/submit yang sudah ada. Pembaruan hanya mengganti pembahasan setelah semua soal cocok dengan snapshot lama; nilai, pilihan pengguna, waktu, bookmarks, dan jumlah sesi dipertahankan. Jika jaringan gagal atau materi soal berubah, riwayat tidak ditimpa.

Versi soal menjadi 2. `compatibleVersions: [1]` hanya berlaku untuk revisi pembahasan ini: seluruh 720 prompt, opsi, kunci, passage, audio, dan segmen telah dibandingkan dengan versi sebelumnya. Jika materi atau kunci berubah pada revisi mendatang, naikkan versi dan hapus kompatibilitas versi yang tidak lagi setara.

## Penerapan

Mode demo memakai materi dari kode setelah build/deploy terbaru. Instalasi yang mengambil soal dari Neon perlu mengimpor revisi konten; redeploy sendiri tidak memperbarui dokumen database. Gunakan `npm run db:import` dengan kredensial server yang disimpan secara lokal/aman. Import bawaan berisi **draf**, bukan materi yang sudah ditinjau; jangan menimpa materi published hasil review dengan bank draf. Operator harus menerapkan pembahasan pada sumber konten yang ditinjau sebelum mengimpor sumber tersebut.

Pemeriksaan otomatis memverifikasi struktur, kelengkapan alasan, bukti yang benar-benar muncul pada sumber, kompatibilitas riwayat, dan perilaku UI. Ini belum menggantikan review semantik oleh pengajar.

## Rujukan aturan

Penjelasan ditulis ulang dalam bahasa Indonesia dengan contoh proyek sendiri. Rujukan untuk pola pasif dan pertanyaan tidak langsung:

- [British Council: Passives](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/passives)
- [Cambridge: Indirect speech, reporting questions](https://dictionary.cambridge.org/uk/grammar/british-grammar/indirect-speech-reporting-questions)


export type Lesson = {
  name: string;
  rule: string;
  tip: string;
  pitfall: string;
  example: string;
};
export const lessons: Record<string, Lesson> = {
  "Subject–verb agreement": {
    name: "Mencocokkan subjek dan kata kerja",
    rule: "Subjek adalah orang atau hal yang dibicarakan. Cari inti subjeknya terlebih dahulu. Dalam pola present pada soal ini, subjek tunggal cocok dengan is/has atau kata kerja berakhiran -s; subjek jamak cocok dengan are/have atau kata kerja dasar. Untuk waktu lampau, periksa juga was/were.",
    tip: "Lingkari inti subjek. Tutup sementara frasa of…, in…, atau on… yang hanya menjelaskan subjek, lalu cocokkan kata kerjanya.",
    pitfall:
      "Kata benda yang paling dekat dengan kata kerja belum tentu inti subjek. “The box of books” tetap membicarakan satu box.",
    example:
      "The box of books is heavy. Artinya: kotak berisi buku itu berat. Yang dihitung adalah box, bukan books.",
  },
  Tenses: {
    name: "Menentukan waktu dan urutan kejadian",
    rule: "Bentuk kata kerja membantu menunjukkan kapan kejadian berlangsung. Jika ada dua kejadian lampau, had + V3 dapat menunjukkan kejadian yang selesai lebih dahulu. V3 adalah bentuk ketiga kata kerja, misalnya prepared, written, atau left.",
    tip: "Tandai petunjuk waktu, lalu buat urutan kejadian: lebih dahulu → kemudian. Jangan memilih hanya karena sebuah pilihan “terdengar lampau”.",
    pitfall:
      "Kata yesterday berbeda fungsinya dari since January. Yang pertama menunjuk waktu lampau selesai; yang kedua dapat menghubungkan awal kejadian dengan saat ini.",
    example:
      "When I arrived, the bus had left. Artinya: ketika saya tiba, busnya sudah pergi. Bus pergi lebih dahulu.",
  },
  "Passive voice": {
    name: "Kalimat pasif: subjek menerima tindakan",
    rule: "Pada kalimat pasif, subjek dikenai tindakan. Pola dasarnya be + V3. Bentuk be menyesuaikan waktu dan subjek: is kept, were found, atau will be completed. V3 adalah bentuk ketiga, misalnya kept dari keep.",
    tip: "Tanyakan: subjek melakukan tindakan atau menerima tindakan? Jika menerima, cari bentuk be dan V3 yang lengkap, lalu periksa waktunya.",
    pitfall:
      "Have/has + V3 saja biasanya bentuk aktif perfect. Bentuk pasif perfect membutuhkan been: has been repaired.",
    example:
      "The door was repaired yesterday. Artinya: pintu itu diperbaiki kemarin. Pintu menerima tindakan perbaikan.",
  },
  "Gerund and infinitive": {
    name: "Memilih verb-ing atau to + kata kerja",
    rule: "Gerund adalah bentuk verb-ing yang dipakai seperti kata benda, misalnya reading. Infinitive biasanya berbentuk to + kata kerja dasar, misalnya to read. Pilihannya bergantung pada kata sebelumnya: avoid/enjoy diikuti -ing, sedangkan decide/agree diikuti to + kata kerja.",
    tip: "Lihat kata tepat sebelum bagian kosong. Pelajari pasangan seperti avoid doing, decide to do, dan prevent someone from doing, bukan hanya daftar bentuk kata kerjanya.",
    pitfall:
      "To tidak selalu penanda infinitive. Pada look forward to, to adalah preposisi dan diikuti -ing: look forward to meeting.",
    example:
      "She enjoys reading, but she decided to rest. Artinya: ia senang membaca, tetapi memutuskan untuk beristirahat.",
  },
  Comparatives: {
    name: "Membandingkan dua hal",
    rule: "Comparative menunjukkan perbandingan: shorter berarti lebih pendek, more reliable berarti lebih dapat diandalkan. Than sering memperkenalkan pembandingnya. Pola the farther…, the narrower… menyatakan dua perubahan yang berjalan bersama.",
    tip: "Cari pembanding atau kata than. Untuk kata pendek seperti short, uji shorter; untuk reliable, uji more reliable. Jangan menambahkan dua penanda perbandingan sekaligus.",
    pitfall:
      "More longer menggandakan penanda “lebih”. Gunakan longer. Bentuk adverb seperti shortly juga tidak berarti “lebih pendek”.",
    example:
      "This road is shorter than that road. Artinya: jalan ini lebih pendek daripada jalan itu.",
  },
  Superlatives: {
    name: "Memilih yang paling dalam satu kelompok",
    rule: "Superlative menunjuk tingkat paling tinggi dalam kelompok, misalnya the oldest atau the most reliable. Periksa apakah kalimat membandingkan seluruh kelompok, bukan sekadar dua pilihan.",
    tip: "Cari penanda kelompok seperti of all atau in the entire collection, lalu periksa the + -est atau the most + adjective.",
    pitfall: "Most cheapest memakai dua penanda “paling”. Cukup the cheapest.",
    example:
      "This is the oldest tree in the park. Artinya: ini pohon tertua di taman itu.",
  },
  "Parallel structure": {
    name: "Membuat unsur daftar sejajar",
    rule: "Unsur dalam satu daftar perlu memiliki bentuk dan fungsi yang sejajar. Jika daftar berisi kata benda, lanjutkan dengan kata benda; jika berisi kata kerja setelah to, lanjutkan dengan kata kerja dasar.",
    tip: "Tutup bagian kosong dan bandingkan dua unsur sebelumnya. Coba tulis polanya: noun + noun + noun, atau verb + verb + verb.",
    pitfall:
      "Makna yang berhubungan belum cukup. Accuracy dan creative masih tidak sejajar karena yang satu kata benda dan yang lain kata sifat.",
    example:
      "The role requires patience and accuracy. Artinya: peran itu membutuhkan kesabaran dan ketelitian. Keduanya kata benda.",
  },
  "Relative clauses": {
    name: "Menghubungkan kata benda dengan penjelasnya",
    rule: "Klausa relatif memberi keterangan tambahan tentang kata benda. Who dapat menjadi subjek untuk orang; whom menjadi objek untuk orang; whose menunjukkan kepemilikan; which merujuk benda; where menunjukkan tempat.",
    tip: "Cari kata yang dijelaskan, lalu tentukan hubungan yang dibutuhkan: orang, benda, tempat, atau kepemilikan. Periksa juga apakah klausa sesudahnya sudah memiliki subjek.",
    pitfall:
      "Jangan memilih where hanya karena kata sebelumnya tempat. Jika tempat itu menjadi subjek kata kerja dalam klausa, which/that bisa dibutuhkan.",
    example:
      "The woman whose bag is red is my teacher. Artinya: perempuan yang tasnya merah itu guru saya. Whose menghubungkan pemilik dengan bag.",
  },
  Conditionals: {
    name: "Menghubungkan syarat dan akibat",
    rule: "Kalimat bersyarat mengaitkan kondisi dengan hasilnya. Untuk kemungkinan masa depan, if + present dapat diikuti will/may. Untuk bayangan masa kini, gunakan pola if + past dan would/could. Untuk kejadian lampau yang sudah tidak dapat diubah, gunakan had + V3 dan would have + V3.",
    tip: "Tentukan dulu: kemungkinan nyata ke depan, bayangan sekarang, atau penyesalan masa lalu? Cocokkan kedua sisi kalimat, bukan satu kata saja.",
    pitfall:
      "Bentuk lampau pada if-clause kadang menunjukkan situasi khayalan, bukan kejadian kemarin. Baca maknanya juga.",
    example:
      "If I had left earlier, I would have arrived on time. Artinya: seandainya saya berangkat lebih awal, saya akan sudah tiba tepat waktu.",
  },
  Prepositions: {
    name: "Memilih kata depan yang tepat",
    rule: "Preposisi menghubungkan kata dengan informasi lain, misalnya waktu, tempat, atau kegiatan. Banyak pasangan perlu dipelajari bersama: responsible for, differ from, dan depend on. Setelah preposisi, kata kerja biasanya berubah menjadi -ing.",
    tip: "Baca satu frasa lengkap. Untuk waktu, bedakan at untuk jam, since untuk titik awal, for untuk durasi, dan by untuk batas paling lambat.",
    pitfall:
      "Terjemahan kata demi kata dari bahasa Indonesia sering menghasilkan pasangan yang keliru, misalnya responsible of.",
    example:
      "We have lived here for two years, since June 2024. Artinya: kami sudah tinggal di sini selama dua tahun, sejak Juni 2024.",
  },
  Conjunctions: {
    name: "Menghubungkan gagasan sesuai hubungan maknanya",
    rule: "Pilih penghubung berdasarkan hubungan antargagasan: so untuk akibat, although untuk pertentangan, dan until untuk batas waktu. Although/because diikuti klausa yang memiliki subjek dan kata kerja; despite/because of diikuti frasa benda atau -ing.",
    tip: "Ringkas dua sisi kalimat dalam bahasa Indonesia, lalu beri hubungan: sebab-akibat, pertentangan, syarat, atau waktu.",
    pitfall:
      "Although the rain tidak membentuk klausa lengkap. Pilih despite the rain atau although it rained, sesuai struktur yang tersedia.",
    example:
      "It rained, so we stayed inside. Artinya: hujan turun, jadi kami tetap di dalam.",
  },
  Inversion: {
    name: "Membalik posisi kata bantu dan subjek",
    rule: "Ungkapan pembatas atau negatif di awal, seperti rarely, not only, dan only after, dapat memicu inversi: kata bantu diletakkan sebelum subjek. Dalam simple past, bentuknya did + subjek + kata kerja dasar.",
    tip: "Jika kalimat dimulai rarely/not only/only after, periksa posisi kata bantu. Setelah did, kata kerja utama kembali ke bentuk dasar.",
    pitfall:
      "Did she collected salah karena bentuk lampau sudah ditandai did. Gunakan did she collect.",
    example:
      "Rarely have I seen this bird. Artinya: saya jarang sekali melihat burung ini. Have diletakkan sebelum I.",
  },
  Subjunctive: {
    name: "Bentuk dasar setelah tuntutan atau rekomendasi",
    rule: "Pada pola tuntutan atau keharusan seperti requested that dan it is essential that, bahasa Inggris formal dapat memakai kata kerja dasar tanpa -s, meskipun subjeknya tunggal. Untuk pasif, gunakan be + V3.",
    tip: "Kenali kata pemicu seperti essential, recommend, request, atau insist yang menyatakan tuntutan. Lalu uji that + subjek + kata kerja dasar.",
    pitfall:
      "Jangan otomatis menambahkan -s setelah every visitor jika kalimat memakai pola subjunctive ini.",
    example:
      "It is essential that she arrive on time. Artinya: penting agar ia tiba tepat waktu. Arrive tetap bentuk dasar.",
  },
  Articles: {
    name: "Memilih a atau an dari bunyi awal",
    rule: "A/an dipakai sebelum kata benda tunggal yang dapat dihitung. Pilihan a atau an mengikuti bunyi pertama kata sesudahnya, bukan semata huruf pertama.",
    tip: "Ucapkan awal katanya. University/useful mulai dengan bunyi /y/ seperti “yu”, jadi a; hour/honor mulai dengan bunyi vokal, jadi an.",
    pitfall:
      "Huruf u tidak selalu berarti bunyi vokal. Karena itu an university keliru.",
    example:
      "A useful tool and an old map. Artinya: sebuah alat yang berguna dan sebuah peta lama.",
  },
  Quantifiers: {
    name: "Membedakan benda terhitung dan tak terhitung",
    rule: "Few/a few/many digunakan dengan benda terhitung jamak, seperti participants. Little/a little/much digunakan dengan benda tak terhitung, seperti information atau water. Few/little menekankan kekurangan; a few/a little menyatakan ada sedikit.",
    tip: "Tanyakan apakah kata bendanya bisa langsung diberi angka: three participants bisa, three information tidak. Setelah itu pilih kelompok penandanya.",
    pitfall:
      "Information dan equipment tidak diberi -s untuk menyatakan jamak. Gunakan pieces of information/equipment jika perlu menghitung unit.",
    example:
      "A few books, but little information. Artinya: ada beberapa buku, tetapi informasinya sedikit.",
  },
  "Word form": {
    name: "Memilih jenis kata sesuai posisinya",
    rule: "Kata benda menyebut hal atau gagasan, kata sifat menjelaskan kata benda, dan kata keterangan menjelaskan tindakan/sifat. Contohnya clarity = kejelasan, clear = jelas, clearly = dengan jelas.",
    tip: "Lihat posisi kosongnya. Sebelum noun biasanya dibutuhkan adjective; setelah the … of sering dibutuhkan noun; untuk menjelaskan cara suatu tindakan dilakukan, uji adverb.",
    pitfall:
      "Akhiran seperti -ly membantu mengenali bentuk, tetapi tetap periksa fungsinya. Jangan memilih kata hanya karena akarnya sama.",
    example:
      "A careful check was done carefully. Artinya: pemeriksaan yang teliti dilakukan dengan teliti. Careful menjelaskan check; carefully menjelaskan caranya.",
  },
  "Noun clauses": {
    name: "Klausa yang menjadi isi informasi",
    rule: "Noun clause dapat menjadi isi pertanyaan atau pernyataan di dalam kalimat lain. Pertanyaan tidak langsung memakai urutan subjek lalu kata kerja, misalnya how the machine works.",
    tip: "Setelah explain/determine/ask, periksa apakah klausa itu bagian dari kalimat yang lebih besar. Jika ya, jangan otomatis memakai urutan pertanyaan langsung.",
    pitfall:
      "How does the machine work? benar sebagai pertanyaan langsung. Setelah explain, bentuknya explain how the machine works.",
    example:
      "Please explain how the lock works. Artinya: tolong jelaskan cara kerja kunci itu.",
  },
  Participles: {
    name: "Bentuk kata kerja yang menerangkan kata benda",
    rule: "Bentuk -ing biasanya menggambarkan pelaku atau penyebab; V3 dapat menggambarkan penerima tindakan atau perasaan yang dialami. Frasa di awal kalimat harus merujuk dengan jelas pada subjek sesudahnya.",
    tip: "Tanyakan hubungan kata benda dengan tindakannya. Workers repairing berarti pekerja yang memperbaiki; a road repaired berarti jalan yang diperbaiki.",
    pitfall:
      "Interesting berarti membuat tertarik; interested berarti merasa tertarik. Jangan menukarnya hanya karena keduanya berasal dari kata yang sama.",
    example:
      "Interested in the shell, the scientist looked closer. Artinya: karena tertarik pada cangkang itu, ilmuwan mengamatinya lebih dekat.",
  },
  Pronouns: {
    name: "Membedakan kata ganti dan kepemilikan",
    rule: "Their/our/its adalah penanda kepemilikan sebelum kata benda: their records. Theirs/ours menggantikan seluruh frasa benda: the records are ours. Them/us menjadi objek, sedangkan they/we menjadi subjek.",
    tip: "Periksa apakah masih ada noun sesudah bagian kosong. Jika ada, uji their/our; jika frasa kepemilikannya berdiri sendiri, uji theirs/ours.",
    pitfall:
      "Our tidak dapat berdiri sendiri pada “The books are our”. Gunakan ours.",
    example:
      "These are our notes. The notes are ours. Keduanya berarti catatan itu milik kami.",
  },
  Determiners: {
    name: "Menentukan jumlah atau cakupan kata benda",
    rule: "Each memandang anggota satu per satu dan diikuti noun tunggal. Both mencakup keduanya. Neither berarti tidak satu pun dari dua pilihan; either berarti salah satu dari dua.",
    tip: "Baca informasi setelah titik koma atau koma karena dapat menentukan apakah yang dimaksud keduanya atau tidak satu pun.",
    pitfall:
      "Neither berarti dua-duanya tidak. Jangan menafsirkannya sebagai “salah satu”.",
    example:
      "Neither door is open. Artinya: kedua pintu sama-sama tidak terbuka.",
  },
  "Adverb clauses": {
    name: "Klausa yang memberi syarat atau batas waktu",
    rule: "Klausa jenis ini menambahkan informasi seperti kapan tindakan boleh terjadi atau syarat apa yang harus terpenuhi. Until = sampai; provided that = asalkan.",
    tip: "Terjemahkan penghubungnya dahulu: sampai, asalkan, karena, atau meskipun. Lalu cocokkan dengan hubungan dua bagian kalimat.",
    pitfall:
      "During diikuti frasa benda, misalnya during the test; until dapat diikuti klausa, misalnya until the test ends.",
    example:
      "We can leave provided that the work is finished. Artinya: kita boleh pergi asalkan pekerjaannya selesai.",
  },
  "Infinitives of purpose": {
    name: "Menjelaskan tujuan dengan to + kata kerja",
    rule: "To + kata kerja dasar dapat menjawab pertanyaan “untuk apa?”. Misalnya to protect berarti untuk melindungi. Periksa juga pasangan yang memang memakai to, seperti too steep to walk.",
    tip: "Coba sisipkan arti “untuk” sebelum verba tujuan. Jika pola memakai too + adjective, uji to + kata kerja dasar.",
    pitfall:
      "For protect keliru karena for adalah preposisi. Untuk tujuan pada soal ini, gunakan to protect.",
    example:
      "We built a roof to protect the tools. Artinya: kami membangun atap untuk melindungi peralatan.",
  },
  "Reported speech": {
    name: "Menyampaikan kembali pertanyaan",
    rule: "Pertanyaan ya/tidak yang dilaporkan dapat diawali if/whether, artinya apakah. Klausa sesudahnya memakai urutan pernyataan: subjek lalu kata kerja.",
    tip: "Jika pertanyaan aslinya bisa dijawab yes/no, uji whether/if. Jika menanyakan lokasi atau cara, gunakan where/how dan periksa urutan kalimatnya.",
    pitfall:
      "Jangan membawa inversi pertanyaan langsung ke kalimat laporan: asked where we stored, bukan asked where did we store.",
    example:
      "She asked whether I was ready. Artinya: ia bertanya apakah saya sudah siap.",
  },
  Causatives: {
    name: "Menyuruh atau meminta pekerjaan dilakukan",
    rule: "Have + objek + V3 dapat berarti meminta orang lain mengerjakan sesuatu untuk kita. Subjek bukan selalu orang yang melakukan pekerjaan itu sendiri.",
    tip: "Cari benda yang dikenai tindakan setelah have/had. Jika pekerjaan dilakukan pada benda itu, uji V3 setelah objek.",
    pitfall:
      "Had the lens replace tidak lengkap untuk pola ini. Gunakan had the lens replaced.",
    example:
      "I had my bike repaired. Artinya: saya meminta sepeda saya diperbaiki.",
  },
  "Correlative conjunctions": {
    name: "Memasangkan kata penghubung",
    rule: "Beberapa penghubung dipakai berpasangan: both … and, either … or, neither … nor. Unsur yang dihubungkan perlu sejajar.",
    tip: "Temukan anggota pasangan yang sudah ada sebelum melihat pilihan jawaban. Both mengarahkan ke and; neither mengarahkan ke nor.",
    pitfall:
      "Neither … or mencampur dua pasangan. Bentuk pasangannya adalah neither … nor.",
    example:
      "Both the map and the notes are useful. Artinya: peta dan catatannya sama-sama berguna.",
  },
  "Agreement with fractions": {
    name: "Mencocokkan kata kerja pada pecahan",
    rule: "Pada pecahan seperti two-thirds of…, kata setelah of menentukan apakah yang dibicarakan benda tunggal/tak terhitung atau benda jamak. Land tidak terhitung, sedangkan trees jamak.",
    tip: "Pada soal pecahan, jangan berhenti pada angka two-thirds. Lanjutkan membaca sampai kata benda setelah of.",
    pitfall:
      "Angka pembilang lebih dari satu tidak otomatis membuat kata kerjanya jamak.",
    example:
      "Half of the water is gone. Half of the bottles are empty. Water memakai is; bottles memakai are.",
  },
  "Reduced clauses": {
    name: "Memahami klausa yang diringkas",
    rule: "Klausa dapat diringkas ketika subjeknya jelas. Once applied dapat diperluas menjadi once it is applied: setelah benda itu diaplikasikan. V3 menunjukkan bahwa benda menerima tindakan.",
    tip: "Kembalikan bentuk ringkas menjadi klausa lengkap untuk mengecek makna dan hubungan subjeknya.",
    pitfall:
      "Bentuk -ing akan mengarah ke pelaku tindakan. Jangan menggunakannya jika subjek justru menerima tindakan.",
    example:
      "Once installed, the device works automatically. Artinya: setelah dipasang, perangkat bekerja otomatis.",
  },
  "Noun number": {
    name: "Memilih bentuk kata benda tunggal atau jamak",
    rule: "Kata penentu seperti several/these membutuhkan noun terhitung jamak. Ada noun tak terhitung seperti equipment dan information yang tidak menjadi equipments/informations.",
    tip: "Periksa dua hal sekaligus: kata penentunya dan apakah noun itu terhitung. Gunakan several topics, tetapi some equipment.",
    pitfall:
      "Tidak semua makna “lebih dari satu” ditulis dengan -s. Equipment tetap equipment.",
    example:
      "Several instructions and some equipment. Artinya: beberapa instruksi dan sejumlah peralatan.",
  },
};
export const completionReasons: Record<number, string[]> = {
  1: [
    "Have kept adalah bentuk aktif dan have tidak cocok dengan inti subjek tunggal collection. Peta-petanya disimpan, bukan menyimpan sesuatu.",
    "Are dipakai untuk subjek jamak. Di sini inti subjeknya collection (satu koleksi); rare maps hanya menjelaskan isinya.",
    "Keep adalah kata kerja aktif. Kalimat memerlukan bentuk pasif karena koleksi itu disimpan di lemari.",
  ],
  2: [
    "Has preparing tidak membentuk present perfect. Sesudah has/had pada pola perfect dibutuhkan V3, bukan preparing.",
    "Prepare adalah bentuk dasar dan tidak menunjukkan bahwa memasak sudah selesai sebelum para tamu tiba.",
    "Prepares menunjukkan kebiasaan atau keadaan sekarang. Konteksnya dua kejadian lampau yang berurutan.",
  ],
  3: [
    "Has designing bukan bentuk pasif yang lengkap. Pola perfect pasif pun memerlukan has been designed, dan last year menunjuk waktu lampau selesai.",
    "Designs berarti merancang, seolah-olah jembatan menjadi pelakunya. Jembatan menerima tindakan perancangan.",
    "Is design memakai waktu sekarang dan design bukan V3. Untuk kalimat ini diperlukan was designed.",
  ],
  4: [
    "To use adalah infinitive; avoid pada pola ini meminta bentuk -ing, yaitu using.",
    "Use masih bentuk dasar. Setelah avoids langsung, bentuknya harus using.",
    "Used adalah bentuk lampau/V3, sedangkan setelah avoids dibutuhkan gerund using.",
  ],
  5: [
    "Conducts adalah bentuk kata kerja untuk subjek tunggal, bukan pelengkap pola allow students to….",
    "Conducting tidak mengikuti pola allow + objek + to-infinitive pada kalimat ini.",
    "Conducted adalah V3/lampau. Students akan melakukan riset, sehingga pelengkapnya to conduct.",
  ],
  6: [
    "Shortly biasanya berarti segera atau secara singkat. Kata ini tidak menyatakan bahwa rutenya lebih pendek.",
    "Bentuk perbandingan baku untuk short adalah shorter, bukan most short. Most juga mengarah ke tingkat “paling”.",
    "Shortest berarti paling pendek dalam kelompok. Kalimat ini membandingkan rute ini dengan satu rute lain memakai than.",
  ],
  7: [
    "Consistent adalah kata sifat. Daftar sebelumnya terdiri dari kata benda accuracy dan clarity.",
    "Consistently adalah kata keterangan, sehingga tidak sejajar dengan dua kata benda sebelumnya.",
    "Consist adalah kata kerja. Posisi ini membutuhkan kata benda consistency, yaitu konsistensi.",
  ],
  8: [
    "Whom merujuk orang sebagai objek. Yang diperlukan adalah hubungan kepemilikan antara researcher dan paper.",
    "Which dapat merujuk benda, tetapi tidak menghubungkan peneliti dengan makalah miliknya dalam struktur ini.",
    "Where menjelaskan tempat. Bagian kosong di sini menunjukkan siapa pemilik paper.",
  ],
  9: [
    "Had analyze tidak membentuk pola kata kerja yang tepat; setelah had untuk perfect diperlukan analyzed. Kalimat ini menyatakan kemampuan hipotetis sekarang.",
    "Setelah modal can seharusnya bentuk dasar analyze, bukan analyzed. Bentuk can juga tidak sejalan dengan kondisi hipotetis yang diberikan.",
    "Setelah will juga harus analyze, bukan analyzed. Untuk bayangan jika peralatannya lebih baik, could analyze paling sesuai.",
  ],
  10: [
    "Was tunggal dan lampau. Subjek terdekat pada neither…nor adalah assistants yang jamak, dengan konteks today.",
    "Has bukan penghubung langsung ke available pada pola ini; has available saja tidak membentuk predikat lengkap di sini.",
    "Is tunggal. Dalam pola ini, kata kerja mengikuti assistants, yaitu subjek jamak yang terdekat.",
  ],
  11: [
    "Although berarti meskipun dan menandai pertentangan. Maksud kalimat latihan ini adalah hasil mengejutkan mendorong pengulangan, yaitu hubungan akibat.",
    "Despite tidak langsung diikuti klausa the team repeated…. Gunakan despite + frasa benda/-ing untuk pola tersebut.",
    "Unless berarti kecuali jika. Kalimat ini tidak menyatakan syarat pengecualian.",
  ],
  12: [
    "Inspecting adalah bentuk -ing; must tidak langsung diikuti -ing dan equipment menerima tindakan pemeriksaan.",
    "Inspected adalah V3, tetapi bentuk pasif setelah must masih memerlukan be.",
    "Modal must langsung diikuti bentuk dasar, bukan to-infinitive. Selain itu, equipment memerlukan pola pasif.",
  ],
  13: [
    "Until menunjukkan batas akhir, sedangkan September di sini adalah awal masa bekerja.",
    "For menunjukkan durasi, misalnya for two months. September adalah titik awal, jadi gunakan since.",
    "During berarti selama suatu periode, tetapi tidak menandai awal durasi yang masih berlanjut pada pola have worked ini.",
  ],
  14: [
    "They leaving tidak memiliki kata bantu yang diperlukan dan tidak mengikuti inversi setelah only after.",
    "Had they leaving tidak membentuk past perfect: setelah had dibutuhkan V3. Kalimat ini memakai inversi simple past.",
    "They leave tetap urutan pernyataan biasa; setelah only after di awal kalimat ini dibutuhkan did they leave.",
  ],
  15: [
    "Reviews menambahkan -s, padahal pola requested that di sini meminta bentuk dasar review.",
    "Reviewed menunjukkan bentuk lampau. Kata requested sudah lampau, tetapi klausa tuntutannya tetap menggunakan bentuk dasar.",
    "Reviewing belum menjadi predikat lengkap pada pola that each member…. Dibutuhkan bentuk dasar review.",
  ],
  41: [
    "Were tidak cocok dengan inti number yang tunggal dan bukan kata bantu perfect untuk increased di sini.",
    "Have untuk subjek jamak; applicants bukan inti subjek. Yang bertambah adalah the number.",
    "Are tidak membentuk has increased. Kalimat ini membicarakan jumlah yang telah bertambah.",
  ],
  42: [
    "Has tidak langsung diikuti missing untuk menyatakan “hilang”. Subjek pieces juga jamak.",
    "Was adalah bentuk tunggal lampau; several pieces merupakan subjek jamak.",
    "Is tunggal, sedangkan yang dihitung adalah beberapa pieces, bukan equipment sebagai kata tersendiri.",
  ],
  43: [
    "Have tidak cocok dengan every window yang tunggal. Buildings hanya bagian penjelas lokasinya.",
    "Having saja tidak menjadi predikat lengkap setelah subjek.",
    "Are tidak menyatakan kepemilikan “memiliki kunci pengaman” dan tidak cocok dengan window tunggal.",
  ],
  44: [
    "Are being tidak cocok untuk deskripsi sifat suitable pada kalimat ini; pola formal yang dipakai adalah neither … is suitable.",
    "Have been memakai have yang jamak. Untuk neither pada gaya formal soal ini, bentuk perfect untuk subjek tunggal pun memakai has been.",
    "Were being mengarah ke jamak lampau dan proses berlangsung, bukan penilaian keadaan “tidak satu pun cocok” pada kalimat ini.",
  ],
  45: [
    "Did harus diikuti bentuk dasar leave, bukan left. Yang dibutuhkan di sini adalah had already left.",
    "Has menghubungkan dengan keadaan sekarang, padahal reached sudah menempatkan acuan ceritanya di masa lampau.",
    "Was left dapat berarti ditinggalkan dalam konteks lain; bukan pola “kereta sudah berangkat” sebelum kami tiba.",
  ],
  46: [
    "Have installed menunjukkan hasil sampai sekarang, bukan proses yang sedang terjadi pada jam tertentu kemarin.",
    "Are install tidak lengkap; continuous memerlukan -ing, dan acuan waktunya lampau.",
    "Install berbentuk present dasar. At this time yesterday meminta proses lampau: were installing.",
  ],
  47: [
    "Hosts menunjukkan kebiasaan sekarang, tanpa menyatakan total kegiatan sejak Januari sampai saat ini.",
    "Had hosting salah bentuk: perfect menggunakan V3 hosted, bukan hosting.",
    "Is host tidak membentuk present continuous atau perfect; kalimatnya memerlukan has hosted.",
  ],
  48: [
    "Will opening salah karena modal will harus diikuti bentuk dasar, bukan -ing.",
    "Has open tidak membentuk perfect; open di sini adalah sifat keadaan, sehingga dibutuhkan have been open.",
    "Was opening berarti sedang membuka pada waktu lampau. By next June memberi titik acuan di masa depan.",
  ],
  49: [
    "Are find bukan bentuk pasif yang lengkap: find harus menjadi found, dan yesterday meminta waktu lampau.",
    "Found tanpa be membuat pages seolah-olah menjadi pelaku yang menemukan sesuatu.",
    "Have finding salah bentuk perfect dan tidak sesuai untuk pages yang menerima tindakan ditemukan.",
  ],
  50: [
    "Displayed adalah V3/lampau; setelah are required pada pola ini perlu to display.",
    "Display tanpa to tidak melengkapi pola be required to do.",
    "Displaying tidak mengikuti pola be required to + kata kerja dasar.",
  ],
  51: [
    "Reviewing membuat proposal seolah menjadi pelaku yang meninjau. Yang dimaksud adalah proposal sedang ditinjau.",
    "Been review salah susunan; setelah is dalam pasif continuous dibutuhkan being reviewed.",
    "Be reviewed setelah is menghasilkan is be reviewed, yang bukan pola pasif continuous.",
  ],
  52: [
    "Storing adalah -ing. Setelah should pada pasif diperlukan be stored.",
    "To store adalah infinitive dengan to, sedangkan modal should diikuti bentuk dasar be.",
    "Stored menyediakan V3 saja. Kata be masih diperlukan agar documents menerima tindakan penyimpanan.",
  ],
  53: [
    "Visited adalah lampau/V3, bukan bentuk kegiatan yang mengikuti recommended pada struktur ini.",
    "To visit tidak dipakai langsung setelah recommended dalam pola kalimat ini; gunakan visiting atau klausa dengan subjek sendiri.",
    "Visit adalah bentuk dasar tanpa pelengkap yang sesuai setelah recommended.",
  ],
  54: [
    "Returned adalah lampau/V3. Setelah agreed, kegiatan yang disepakati dinyatakan dengan to return.",
    "Returns adalah bentuk present untuk subjek tunggal, bukan pelengkap agreed.",
    "Returning tidak mengikuti pasangan agree to do pada kalimat ini.",
  ],
  55: [
    "Arrive adalah bentuk dasar. From adalah preposisi sehingga kata kerja sesudahnya perlu menjadi arriving.",
    "To arrive menambahkan to setelah preposisi from; pola yang diminta adalah from arriving.",
    "Arrived adalah lampau/V3, bukan gerund setelah from.",
  ],
  56: [
    "Collecting tidak mengikuti pola remind + orang + to do.",
    "Collected menyatakan bentuk lampau/pasif, sedangkan tamu diminta melakukan tindakan mengambil.",
    "Collects adalah kata kerja present untuk subjek tunggal, bukan pelengkap reminded the guests.",
  ],
  57: [
    "Reliability adalah kata benda “keandalan”. Setelah is di sini dibutuhkan sifat yang dibandingkan.",
    "Most reliable berarti paling andal di suatu kelompok; konteksnya dua metode sehingga comparative lebih sesuai.",
    "Reliably adalah kata keterangan, bukan sifat untuk menjelaskan metode setelah is pada kalimat ini.",
  ],
  58: [
    "More narrowly adalah kata keterangan. Became di sini diikuti sifat path, yaitu narrower.",
    "The narrow belum berbentuk perbandingan. Pasangan the farther mengarahkan ke the narrower.",
    "Narrowest adalah superlative. Struktur ini memakai dua comparative yang saling berkaitan.",
  ],
  59: [
    "Older adalah comparative; kalimat menunjuk satu sampel tertua di seluruh koleksi.",
    "Oldest than mencampur superlative dengan penghubung comparative than.",
    "As old memerlukan pasangan as … as dan tidak menunjukkan yang paling tua dalam koleksi.",
  ],
  60: [
    "Interpreting tidak sejajar dengan observe dan record yang berupa kata kerja dasar setelah to.",
    "Interpretation adalah kata benda, sedangkan dua unsur sebelumnya kata kerja.",
    "Interpreted adalah lampau/V3, sehingga tidak sejajar dengan observe dan record.",
  ],
  61: [
    "Endure adalah kata kerja, sedangkan compact dan affordable adalah kata sifat.",
    "Durability adalah kata benda “daya tahan”. Yang diperlukan sifat durable.",
    "Durably adalah kata keterangan. Daftar ini menjelaskan sifat perangkat dengan kata sifat.",
  ],
  62: [
    "Which pada pola ini merujuk benda; engineer adalah orang yang kami konsultasikan.",
    "Where menjelaskan tempat, bukan orang sebagai objek consulted.",
    "Whose menunjukkan kepemilikan, biasanya diikuti noun. Klausa ini membutuhkan objek consulted, yaitu whom.",
  ],
  63: [
    "Which perlu preposisi seperti in untuk menyatakan “di lembah itu”. Tanpa in, where paling sesuai.",
    "Whose menunjukkan kepemilikan dan tidak melengkapi hubungan lokasi di sini.",
    "Whom merujuk orang sebagai objek, bukan lokasi penemuan fosil.",
  ],
  64: [
    "What tidak dipakai untuk menambahkan klausa relatif setelah kata benda instrument yang sudah disebut.",
    "Whose menunjukkan kepemilikan; di sini yang diperlukan adalah subjek untuk was built.",
    "Where menunjuk tempat. Instrument adalah benda yang dibuat, sehingga which tepat.",
  ],
  65: [
    "Were tidak dapat langsung diikuti freeze sebagai predikat lengkap pada struktur ini.",
    "Had memerlukan V3 frozen untuk perfect, dan tidak cocok dengan kemungkinan kejadian tonight yang dimaksud.",
    "Would have memerlukan V3 frozen dan mengarah ke hasil hipotetis lampau, bukan kemungkinan malam ini.",
  ],
  66: [
    "Postpone tidak menunjukkan hasil hipotetis lampau yang tidak terjadi.",
    "Had postponing salah bentuk; had untuk perfect perlu V3.",
    "Will postpone mengarah ke masa depan, sementara had checked menunjukkan kondisi lampau yang sudah tidak dapat diubah.",
  ],
  67: [
    "Will be mengarah ke masa depan, sedangkan last year menempatkan situasinya di masa lalu.",
    "Is being mengarah ke keadaan/proses sekarang dan tidak menyatakan akibat hipotetis masa lalu.",
    "Has been adalah perfect yang terkait sekarang; tanpa beasiswa di masa lalu, pola yang diminta adalah would have been.",
  ],
  68: [
    "Responsible dipasangkan dengan for untuk menyatakan tanggung jawab, bukan of.",
    "At tidak membentuk pasangan responsible for yang diperlukan di sini.",
    "With dapat memiliki fungsi lain, tetapi tidak melengkapi responsible … allocating pada kalimat ini.",
  ],
  69: [
    "Into menunjukkan gerak/perubahan ke dalam, bukan pembanding setelah differs.",
    "With tidak dipakai dalam pasangan baku differ from pada struktur ini.",
    "At tidak menghubungkan benda yang dibandingkan setelah differs.",
  ],
  70: [
    "During menunjukkan kejadian di dalam suatu periode, bukan batas paling lambat.",
    "For menyatakan durasi/tujuan dalam konteks lain; Friday di sini adalah deadline.",
    "Since berarti sejak sebagai titik awal. At the latest justru menandai batas akhir.",
  ],
  71: [
    "A tidak cocok dengan bunyi awal interpreter yang berupa vokal.",
    "The an menumpuk dua artikel pada posisi yang sama.",
    "Any an juga menumpuk penentu yang tidak membentuk frasa nomina yang benar di sini.",
  ],
  72: [
    "An tidak cocok dengan bunyi /y/ pada useful. Yang diperhatikan bunyinya, bukan huruf u.",
    "Any of memerlukan struktur kelompok yang berbeda, misalnya any of the examples, bukan useful example tunggal ini.",
    "Many harus diikuti noun jamak; example pada kalimat ini tunggal.",
  ],
  73: [
    "A few dipakai dengan noun terhitung jamak, sedangkan information tidak terhitung.",
    "Few juga untuk noun terhitung jamak. Very little cocok untuk jumlah informasi yang sedikit.",
    "Many untuk noun terhitung jamak, bukan information.",
  ],
  74: [
    "Much digunakan dengan noun tak terhitung, sedangkan participants dapat dihitung satu per satu.",
    "Less pada pola dasar ini untuk jumlah tak terhitung/perbandingan; kalimat meminta “hanya beberapa peserta”.",
    "A little untuk noun tak terhitung, bukan participants jamak.",
  ],
  75: [
    "Feasible adalah kata sifat “layak”. The … of di sini membutuhkan kata benda “kelayakan”.",
    "Feasibly adalah kata keterangan, bukan noun setelah the.",
    "Feasiblenessly bukan bentuk kata baku yang diperlukan. Nomina yang lazim digunakan adalah feasibility.",
  ],
  76: [
    "Clear adalah kata sifat. Bagian kosong menjelaskan bagaimana instruksi ditulis, sehingga diperlukan adverb clearly.",
    "Clarity adalah kata benda “kejelasan”, bukan keterangan cara written.",
    "Clearing adalah bentuk -ing dari clear dan tidak berarti “dengan jelas” dalam pola ini.",
  ],
  77: [
    "Systematize adalah kata kerja “menyusun secara sistematis”, bukan sifat untuk approach.",
    "Systematically adalah kata keterangan. Sebelum noun approach diperlukan sifat systematic.",
    "System adalah kata benda. Untuk menyatakan pendekatan yang sistematis, gunakan systematic approach.",
  ],
  78: [
    "Because of perlu frasa benda, sedangkan the results were promising adalah klausa lengkap.",
    "In spite belum lengkap tanpa of dan tidak langsung diikuti klausa ini.",
    "Despite perlu frasa benda/-ing; untuk klausa lengkap yang berlawanan, gunakan although.",
  ],
  79: [
    "Even though menyatakan pertentangan, sedangkan bagian kedua menjelaskan tujuan pelabelan.",
    "Unless berarti kecuali jika dan membentuk syarat pengecualian, bukan tujuan.",
    "Whereas membandingkan dua keadaan yang bertentangan, bukan “agar bisa diidentifikasi”.",
  ],
  80: [
    "During harus diikuti noun/frasa benda, bukan the analysis is complete yang berupa klausa.",
    "Despite menyatakan pertentangan dan membutuhkan frasa benda/-ing, bukan batas waktu dengan klausa ini.",
    "Because of berarti karena dan diikuti frasa benda; yang dibutuhkan adalah “sampai analisis selesai”.",
  ],
  81: [
    "Have seen we meletakkan subjek setelah kata kerja utama; inversi yang benar adalah have + we + seen.",
    "We have seen memakai urutan biasa, padahal rarely di awal memicu inversi.",
    "We seeing belum memiliki kata bantu dan tidak mengikuti pola inversi.",
  ],
  82: [
    "Collected she membalik kata kerja utama tanpa kata bantu. Simple past pada pola ini membutuhkan did she collect.",
    "She did collecting salah bentuk: setelah did harus collect, dan kata bantu harus mendahului subjek.",
    "She collected masih urutan biasa. Not only di awal klausa ini membutuhkan inversi did she collect.",
  ],
  83: [
    "Attends menambahkan -s, padahal essential that pada pola formal ini meminta bentuk dasar attend.",
    "Attending saja belum menjadi predikat lengkap pada klausa ini.",
    "Has attend salah bentuk perfect dan tidak mengikuti pola subjunctive yang diminta.",
  ],
  84: [
    "Remains memakai -s. Insisted that yang menyatakan tuntutan di sini memakai remain bentuk dasar.",
    "Remaining belum menjadi predikat lengkap setelah that the report.",
    "Has remains tidak membentuk perfect dan tidak sesuai pola tuntutan ini.",
  ],
  85: [
    "Because memperkenalkan alasan, bukan subjek untuk caused the outage.",
    "Which it menambahkan it sehingga subjek klausa menjadi bermasalah; what sudah dapat menjadi subjek caused.",
    "That what menumpuk penghubung. Cukup what untuk arti “apa yang menyebabkan”.",
  ],
  86: [
    "That how menumpuk dua penghubung yang tidak diperlukan.",
    "What does tidak diikuti struktur yang lengkap untuk makna “bagaimana scanner bekerja”.",
    "How does menghasilkan inversi pertanyaan langsung. Setelah explain, urutannya how the scanner works.",
  ],
  87: [
    "Intriguing berarti membuat orang lain tertarik. Di sini biologist yang merasa tertarik oleh markings.",
    "To intriguing bukan bentuk infinitive yang benar; setelah to infinitive digunakan kata kerja dasar.",
    "Has intrigued membentuk klausa aktif yang tidak sesuai dengan frasa pembuka diikuti by pada struktur ini.",
  ],
  88: [
    "Repaired menunjukkan bentuk pasif/lampau seolah pekerjanya diperbaiki. Di sini pekerja melakukan perbaikan.",
    "Were repaired juga pasif, sehingga membuat workers menjadi penerima tindakan repaired.",
    "Have repairing salah bentuk. Klausa relatif ringkas aktifnya adalah workers repairing the road.",
  ],
  89: [
    "Theirs berdiri sendiri sebagai possessive pronoun; sebelum budgets harus their.",
    "Its merujuk pemilik tunggal. Kalimat ini membicarakan dua departments.",
    "Them adalah kata ganti objek, bukan penanda kepemilikan sebelum budgets.",
  ],
  90: [
    "Us adalah kata ganti objek dan tidak menunjukkan “milik kami” pada posisi ini.",
    "We adalah subjek, bukan bentuk kepemilikan yang berdiri sendiri.",
    "Our harus diikuti noun, misalnya our decision. Tanpa noun sesudahnya, gunakan ours.",
  ],
  91: [
    "Either berarti salah satu dari dua, sedangkan kalimat menegaskan keduanya mengarah ke koridor, bukan courtyard.",
    "Each berarti masing-masing; berarti dua pintu menuju courtyard, bertentangan dengan informasi sesudah titik koma.",
    "Both mencakup keduanya dan umumnya meminta leads menjadi lead. Maknanya pun bertentangan dengan keterangan bahwa keduanya menuju koridor.",
  ],
  92: [
    "All biasanya diikuti visitors jamak pada makna “semua pengunjung”, bukan visitor tunggal ini.",
    "Many juga membutuhkan visitors jamak.",
    "Several berarti beberapa dan diikuti noun jamak visitors.",
  ],
  93: [
    "Because of menyatakan sebab dan perlu frasa benda, bukan klausa the voltage stabilizes.",
    "During perlu noun, sedangkan bagian sesudahnya klausa lengkap.",
    "Despite menyatakan pertentangan dan perlu frasa benda/-ing; di sini yang diperlukan batas waktu “sampai”.",
  ],
  94: [
    "Because of diikuti frasa benda, bukan klausa the weather permits.",
    "In spite of juga perlu frasa benda/-ing dan menyatakan pertentangan, bukan syarat.",
    "Despite tidak langsung diikuti klausa ini dan tidak berarti “asalkan”.",
  ],
  95: [
    "Protecting of bukan pola yang dapat menyatakan tujuan “untuk melindungi” pada posisi ini.",
    "Protected adalah V3/lampau dan tidak menghubungkan tindakan membangun dengan tujuannya.",
    "For adalah preposisi dan tidak diikuti protect bentuk dasar. Gunakan to protect untuk tujuan ini.",
  ],
  96: [
    "That memperkenalkan pernyataan; di sini isi pertanyaannya adalah “apakah sudah selesai?”.",
    "What did tidak cocok karena pertanyaan ini ya/tidak dan urutan klausanya bukan pertanyaan langsung.",
    "Which did meminta pilihan tertentu serta memakai inversi, bukan pola apakah + subjek + kata kerja.",
  ],
  97: [
    "To replaced salah bentuk karena to infinitive perlu replace, dan pola causative pasif ini meminta V3 tanpa to.",
    "Replace bentuk dasar tidak sesuai dengan had + objek + V3 yang berarti meminta benda itu diperbaiki/diganti.",
    "Replacing tidak menyatakan lens sebagai benda yang dikenai penggantian pada pola ini.",
  ],
  98: [
    "Nor berpasangan dengan neither, bukan both.",
    "But dapat menandai pertentangan, tetapi pasangan untuk both pada struktur ini adalah and.",
    "Or berpasangan dengan either untuk pilihan alternatif. Both di sini memasukkan kedua unsur.",
  ],
  99: [
    "Are jamak, sedangkan land tidak terhitung dan memerlukan is pada pernyataan ini.",
    "Have tidak cocok dengan land dan tidak langsung membentuk predikat pasif covered tanpa been.",
    "Were being adalah bentuk jamak lampau continuous, tidak cocok dengan land yang tak terhitung.",
  ],
  100: [
    "Applying menunjukkan pelaku yang mengaplikasikan sesuatu. Adhesive di sini justru diaplikasikan.",
    "Apply bentuk dasar tidak melengkapi klausa pasif yang diringkas setelah once.",
    "To applying tidak membentuk to-infinitive. Bentuk ringkas pasifnya adalah once applied.",
  ],
};

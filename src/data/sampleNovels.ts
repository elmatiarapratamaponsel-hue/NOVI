import { Novel } from '../types';

export const INITIAL_SAMPLE_NOVELS: Omit<Novel, 'userId'>[] = [
  {
    id: 'novel-1',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    genre: 'Drama',
    publicationYear: 2005,
    synopsis: 'Kisah sepuluh anak desa di Belitung yang berjuang meraih mimpi dan pendidikan di tengah keterbatasan ekonomi di bawah asuhan Ibu Muslimah dan Pak Harfan di SD Muhammadiyah Gantong.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    fileType: 'text',
    fileName: 'laskar_pelangi.epub',
    fileSize: '2.4 MB',
    totalPages: 529,
    currentPage: 142,
    readingStatus: 'reading',
    readingProgress: 27,
    rating: 5,
    lastReadAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    chapters: [
      {
        id: 'c1',
        title: 'Bab 1: Sepuluh Murid Baru',
        content: `Pagi itu, waktu aku masih kecil, aku duduk di bangku panjang di depan sebuah kelas. Sebatang pohon filicium tua yang rindang meneduhiku. Ayahku duduk di sampingku, memeluk pundakku dengan kedua lengannya dan tersenyum mengangguk-angguk pada setiap orang tua dan anak-anaknya yang duduk berderet-deret di bangku panjang lain di depan kami.

Hari itu adalah hari yang agak penting: hari pertama masuk SD.

Di ujung bangku-bangku panjang tadi ada sebuah pintu terbuka. Kusen pintu itu miring karena salah satu engselnya lepas. Di dalamnya ada sebuah ruangan gelap gulita, dindingnya terbuat dari papan sengon yang sudah lapuk, beratap sirap yang berlubang-lubang.

Sekolah ini adalah SD Muhammadiyah Gantong, sekolah termiskin di Belitung. Bagi orang tua kami yang berpenghasilan pas-pasan dari tambang timah atau melaut, sekolah ini adalah tumpuan satu-satunya harapan agar anak-anak mereka tidak buta huruf seperti nenek moyang mereka.

Pak Harfan, sang kepala sekolah, dan Bu Muslimah, guru muda berusia lima belas tahun dengan kerudung sederhana, berdiri di depan pintu cemas menanti jumlah murid mencapai syarat minimal: sepuluh anak. Jika kurang dari sepuluh, sekolah akan dibubarkan oleh Pengawas Pendidikan.`
      },
      {
        id: 'c2',
        title: 'Bab 2: Harapan yang Menyelamatkan',
        content: `Waktu terus merayap hingga pukul sebelas siang. Sembilan anak sudah terdaftar, namun belum ada tanda-tanda kehadiran anak kesepuluh. Pak Harfan telah bersiap mengucapkan pidato pembubaran dengan mata yang berkaca-kaca.

Tiba-tiba, dari kejauhan melintasi padang ilalang, tampak seorang ibu menggandeng anak laki-lakinya yang berjalan tertatih-tatih. Dia adalah Harun, seorang anak berusia lima belas tahun dengan keterbelakangan mental yang bercita-cita ingin mengenakan seragam sekolah.

"Harun! Harun menyelamatkan kita!" seru Bu Muslimah gembira.

Dengan sepuluh anak genap, sekolah resmi dibuka. Kami bersepuluh kelak dipanggil dengan julukan "Laskar Pelangi" oleh Bu Muslimah, karena kecintaan kami memandangi lengkung pelangi di langit Belitung sesudah badai reda.`
      },
      {
        id: 'c3',
        title: 'Bab 3: Jenius dari Pesisir Pantai',
        content: `Di antara kami, ada satu sosok yang paling menggetarkan hati: Lintang. Anak pesisir dari Tanjong Enai yang setiap pagi harus mengayuh sepeda tua berkarat sejauh empat puluh kilometer pulang pergi.

Ia harus melewati rawa-rawa buaya, jalan berlumpur, dan terik khatulistiwa demi sampai di sekolah kami. Kancing kemejanya sering tak lengkap, telapak kakinya kapalan tanpa alas sepatu, namun matanya memancarkan kecerdasan matematika luar biasa yang mampu menaklukkan soal-soal tersulit dalam sekejap mata.

Bagi Lintang, kemiskinan bukanlah alasan untuk menyerah pada kebodohan.`
      }
    ]
  },
  {
    id: 'novel-2',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    genre: 'Sejarah',
    publicationYear: 1980,
    synopsis: 'Kisah cinta Minke, seorang pribumi terpelajar di HBS Surabaya pada akhir abad ke-19, dengan Annelies Mellema, seorang gadis Indo-Belanda putri dari Nyai Ontosoroh yang tangguh.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    fileType: 'text',
    fileName: 'bumi_manusia.epub',
    fileSize: '3.1 MB',
    totalPages: 535,
    currentPage: 310,
    readingStatus: 'reading',
    readingProgress: 58,
    rating: 5,
    lastReadAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    chapters: [
      {
        id: 'c1',
        title: 'Bab 1: Seorang Pribumi di HBS',
        content: `Orang memanggilku Minke. Namaku sendiri... sementara tak usah kusebutkan. Bukan karena gila misteri, melainkan karena belum kurasa perlu menyombongkan nama yang diberikan oleh orang tuaku.

Aku seorang pribumi, anak bupati, namun satu-satunya yang beruntung bisa menuntut ilmu di Hogere Burgerschool (HBS) di Surabaya. Sekolah menengah tinggi untuk kaum Belanda, keturunan Eropa, dan segelintir anak ningrat Jawa terpilih.

Duniaku kala itu dipenuhi kekaguman pada peradaban Eropa. Ilmu pengetahuan, mesin uap, telegraf, dan percetakan modern telah membuka cakrawala baru yang menggetarkan jiwa mudaku.`
      },
      {
        id: 'c2',
        title: 'Bab 2: Pesona Wonokromo',
        content: `Suatu sore temanku, Robert Suurhof, mengajakku mengunjungi sebuah rumah besar bergaya Hindia di Wonokromo. Itu adalah kediaman Herman Mellema, seorang pengusaha Belanda kaya, bersama nyai pribuminya: Nyai Ontosoroh.

Saat kakiku melangkah memasuki serambi rumah kayu jati itu, seorang gadis muncul dari balik tirai sutra. Namanya Annelies Mellema. Kecantikannya yang memadukan keanggunan wanita Jawa dan ketegasan garis wajah Eropa membuat lidahku kelu.

Namun bukan hanya Annelies yang mencengangkanku. Sosok ibunya, Nyai Ontosoroh, dengan bahasa Belanda yang fasih, pemikiran bisnis yang tajam, dan harga diri setinggi langit, mematahkan semua prasangka rendahan masyarakat kolonial terhadap kaum "nyai".`
      }
    ]
  },
  {
    id: 'novel-3',
    title: 'Negeri 5 Menara',
    author: 'A. Fuadi',
    genre: 'Petualangan',
    publicationYear: 2009,
    synopsis: 'Enam santri dari berbagai pelosok Nusantara di Pondok Madani Ponorogo yang disatukan oleh mantra sakti "Man Jadda Wajada" dan bermimpi menaklukkan dunia di bawah menara masjid.',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    fileType: 'text',
    fileName: 'negeri_5_menara.epub',
    fileSize: '1.9 MB',
    totalPages: 423,
    currentPage: 423,
    readingStatus: 'completed',
    readingProgress: 100,
    rating: 5,
    lastReadAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    chapters: [
      {
        id: 'c1',
        title: 'Bab 1: Setengah Hati ke Jawa Timur',
        content: `Kereta api Matarmaja berderak-derak membelah malam melintasi Jawa Tengah menuju Jawa Timur. Hati kecilku meronta. Aku ingin masuk SMA negeri favorit di Bukittinggi dan melanjutkan ke ITB seperti idolaku B.J. Habibie, tetapi Amak memintaku mendalami agama di pesantren.

Dengan setengah hati dan mata sembap menahan kecewa, aku duduk di samping Ayah yang setia menemani perjalananku menuju sebuah tempat asing bernama Pondok Madani di pedalaman Ponorogo.`
      },
      {
        id: 'c2',
        title: 'Bab 2: Mantra Ajaib yang Membakar Jiwa',
        content: `Di hari pertama orientasi, Kyai Rais berdiri gagah di hadapan ribuan santri baru. Beliau memegang sebuah parang berkarat yang sudah tumpul. Lalu sebuah kayu keras dipotong dengan mengulang tebasan berulang kali hingga terbelah dua.

Suara beliau menggelegar ke seisi aula:
"Man jadda wajada! Siapa yang bersungguh-sungguh, ia akan berhasil!"

Mantra itu seketika meresap ke dalam sumsum tulangku. Kekecewaanku sirna, digantikan oleh kobaran api semangat yang belum pernah kurasakan sebelumnya.`
      }
    ]
  },
  {
    id: 'novel-4',
    title: 'Gadis Kretek',
    author: 'Ratih Kumala',
    genre: 'Misteri',
    publicationYear: 2012,
    synopsis: 'Pencarian jejak perempuan misterius bernama Jeng Yah di balik sejarah industri kretek lokal Kudus dan romansa yang terputus di masa lalu.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    fileType: 'text',
    fileName: 'gadis_kretek.pdf',
    fileSize: '1.8 MB',
    totalPages: 288,
    currentPage: 0,
    readingStatus: 'not_started',
    readingProgress: 0,
    rating: 4,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    chapters: [
      {
        id: 'c1',
        title: 'Bab 1: Wasiat Terakhir Romo',
        content: `Pak Soeraja terbaring sekarat di ranjang rumah sakit. Di tengah igauannya di ambang sakratulmaut, ia tidak memanggil nama istrinya, melainkan sebuah nama asing: "Jeng Yah... Jeng Yah..."

Ketiga anak lelakinya — Tegar, Karim, dan Lebas — saling berpandangan cemas. Siapakah perempuan yang mampu membakar sisa hidup ayah mereka, sang taipan rokok Kretek Djagad Raja?

Demi memenuhi permintaan terakhir ayah mereka sebelum terlambat, ketiga bersaudara ini memulai penelusuran ke kota-kota tua di Jawa Tengah.`
      }
    ]
  },
  {
    id: 'novel-5',
    title: 'Filosofi Kopi',
    author: 'Dee Lestari',
    genre: 'Fiksi Ilmiah',
    publicationYear: 2006,
    synopsis: 'Dua sahabat, Ben sang barista idealis dan Jody sang pengelola keuangan, mendirikan kedai kopi legendaris sambil mencari racikan kopi paling sempurna di dunia.',
    coverUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    fileType: 'text',
    fileName: 'filosofi_kopi.epub',
    fileSize: '1.5 MB',
    totalPages: 160,
    currentPage: 75,
    readingStatus: 'reading',
    readingProgress: 47,
    rating: 5,
    lastReadAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    chapters: [
      {
        id: 'c1',
        title: 'Bab 1: Secangkir Kesempurnaan',
        content: `Ben tidak pernah sekadar menyeduh kopi; ia mendongengkan kisah lewat aroma biji yang digerus halus. Di kedai kopi kami yang sederhana di bilangan Jakarta Selatan, setiap cangkir yang keluar dari tangannya adalah karya seni.

"Kopi itu seperti kehidupan, Jody," kata Ben sambil memperhatikan tetesan air panas menembus kertas saring. "Rasa pahitnya mengajarkan kita untuk tidak gampang tertipu oleh rasa manis buatan."

Hingga suatu hari, seorang pengusaha kaya menantang Ben untuk membuat secangkir kopi terenak yang bisa meruntuhkan keangkuhannya.`
      }
    ]
  }
];

export const GENRE_LIST = [
  'Semua Genre',
  'Drama',
  'Sejarah',
  'Petualangan',
  'Misteri',
  'Fiksi Ilmiah',
  'Romance',
  'Fantasi',
  'Horor',
  'Pengembangan Diri',
  'Sastra'
];

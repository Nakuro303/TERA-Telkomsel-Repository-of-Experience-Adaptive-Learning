import { KnowledgeArticle, QAThread, QuizModule, TechnicianLeaderboard } from '../types';

export const INITIAL_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'Cara Mengatasi Optical Loss Tinggi (> 25dB) di ODP Huawei tipe GPON',
    category: 'Fiber Optic (FTTH/FTTx)',
    content: 'Seringkali di lapangan kita menemukan keluhan pelanggan Indihome atau Telkomsel Seluler FTTH dengan tingkat optical power drop hingga di bawah -25dB (tidak standar). Kemarin di Regional Jawa Barat, tim kami melakukan inspeksi menyeluruh. Setelah dicek, keretakan mikro (microbending) pada pigtail di dalam kaset tray ODP dan debu pada adapter fiber adalah penyebab terbesar (sekitar 75% kasus).\n\nLangkah perbaikan mandiri:\n1. Gunakan Optical Fiber Identifier (OFI) untuk mendeteksi lekukan tajam.\n2. Bersihkan konektor ferrule menggunakan kertas pembersih khusus (fiber connector cleaner cassette) atau cairan isopropylic alcohol minimal 99%.\n3. Jangan menekuk fiber patch cord dengan radius kurang dari 30mm.\n4. Lakukan pengukuran ulang dengan OPM (Optical Power Meter), pastikan hasil berada di rentang standar emas (-15dB s/d -22dB).',
    author: 'Pak Hendra Wijaya',
    authorRole: 'Senior Engineer',
    authorRegion: 'Regional Jawa Barat',
    date: '2026-05-18',
    upvotes: 42,
    likedBy: [],
    isVerifiedBySenior: true,
    verifiedBy: 'M. Yusuf (Kepala Divisi FTTH Nasional)',
    troubleshootingSteps: [
      'Bersihkan adapter ODP dengan swab pembersih khusus',
      'Periksa bending radius pigtail di dalam kaset tray (minimal diameter 3 cm)',
      'Gunakan PON OTDR untuk mendeteksi titik patahan/sambungan buruk antara ODC ke ODP',
      'Ganti splitter pasif jika hasil redaman di port luaran tidak berimbang'
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Fajar Nugraha',
        role: 'Junior Engineer',
        region: 'Regional Jawa Tengah',
        content: 'Sangat membantu Pak Hendra! Di Purwokerto kami kemarin pakai alkohol biasa 70% dan malah menyisakan residu air. Sekarang wajib pakai isopropyl 99% ke atas sesuai tips Bapak.',
        date: '2023-05-18'
      },
      {
        id: 'c-2',
        author: 'Dian Permana',
        role: 'Spesialis Jaringan',
        region: 'Regional Jawa Barat',
        content: 'Tambahan sedikit: Pastikan saat merapikan kaset tray, gunakan pelindung core (sleeves) yang pas agar tidak tergencet tutup ODP.',
        date: '2023-05-19'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Solusi Interferensi Frekuensi Jaringan 4G LTE-1800 Akibat Pemancar Liar Lokal',
    category: '4G/5G Seluler',
    content: 'Tim RF Optimization Regional Sumatera Utara mendapati degradasi KPI drop-call rate mencapai 4.2% di beberapa tapak bts urban Medan Deli. Dari grafik spektrum anoda, terlihat adanya noise lantai (noise floor) setinggi -85dBm pada pita frekuensi 1800MHz.\n\nSetelah dikoordinasikan dengan BALMON (Balai Monitor) setempat, ditemukan pemancar ilegal penguat sinyal rumah tangga (repeater ilegal) yang tidak terkalibrasi di hunian warga sekitar 200m dari BTS.\n\nSolusi taktis sebelum pemancar diamankan:\n1. Terapkan fitur "Interference Clashing Filter" pada modul eNodeB Ericsson/Huawei.\n2. Lakukan tilting mekanis antena sektoral ke bawah (down-tilt) sebesar 1-2 derajat untuk memperkecil penerimaan sidelobe dari koordinat pemancar liar.\n3. Sesuaikan parameter RSSI threshold pada handover margin agar handphone pelanggan tidak dipaksa stay di sektor yang terpolusi noise.',
    author: 'Ridwan Hakim',
    authorRole: 'Spesialis Jaringan',
    authorRegion: 'Regional Sumatera Utara',
    date: '2026-05-15',
    upvotes: 38,
    likedBy: [],
    isVerifiedBySenior: true,
    verifiedBy: 'Suhartono (VP Principal RF Network)',
    troubleshootingSteps: [
      'Gunakan Spectrum Analyzer genggam bawaan Anritsu saat survei radius 300m BTS',
      'Lakukan dowtilt sektoral untuk membatasi daya jangkar dari arah noise',
      'Koordinasikan temuan mac ke BALMON Kominfo tingkat provinsi'
    ],
    comments: [
      {
        id: 'c-3',
        author: 'Yuda Pratama',
        role: 'Junior Engineer',
        region: 'Regional Banten',
        content: 'Bener banget mas, di Tangerang juga sering kena masalah penguat sinyal murahan ini. Tilting mekanik emang jurus paling instan biar KPI drop call turun dulu.',
        date: '2023-05-16'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'SOP Penyalaan Genset Portable saat Pemadaman Utama di Tapak BTS Gunung/Rural',
    category: 'Power & Cooling BTS',
    content: 'Saat mati lampu massal (grid blackout), baterai backup lithium di site rural hanya bertahan sekitar 3 s/d 4 jam saja. Teknisi daerah wajib melakukan mobilisasi Genset Mobile (MGTS) dengan segera.\n\nYang sering diabaikan adalah masalah urutan grounding dan start-up dinamo genset, yang jika salah bisa merusak unit Rectifier BTS yang sensitif terhadap lonjakan arus (surge spikes).\n\nURUTAN WAJIB:\n1. Pastikan MCB input PLN di KWH meter dalam posisi OFF total.\n2. Pasang kabel grounding genset ke ground bar di kaki tiang BTS (ini krusial untuk cegah induksi).\n3. Nyalakan genset tanpa beban dahulu selama 5 menit sampai putaran mesin stabil (speed 3000 RPM).\n4. Setelah indikator tegangan stabil di 220V/380V AC, baru naikkan MCB output genset secara perlahan.\n5. Masuk ke ruang shelter, cek modul Rectifier, catat arus Ampere pengisian baterai.',
    author: 'Budi Utomo',
    authorRole: 'Team Lead',
    authorRegion: 'Regional Sulawesi',
    date: '2026-05-10',
    upvotes: 55,
    likedBy: [],
    isVerifiedBySenior: true,
    verifiedBy: 'Iwan Kustiawan (Head of Infrastructure & Power)',
    troubleshootingSteps: [
      'Matikan suplai beban AC utama di MCB PLN sebelum genset terkoneksi',
      'Sambungkan kabel netral dan grounding dengan benar sebelum mesin genset di-crank',
      'Biarkan mesin idle 5 menit sebelum beban dinaikkan agar frekuensi gelombang stabil',
      'Gunakan pelindung telinga dan sarung tangan tahan isolasi listrik selama pengerjaan'
    ],
    comments: []
  },
  {
    id: 'art-4',
    title: 'Panduan Penyelarasan (Alinyemen) Antena Transmisi Microwave Pasca Gempa Bumi',
    category: 'Sistem Transmisi & Radio',
    content: 'Daerah pesisir sering kali diterpa gempa lokal yang menyebabkan deformasi fisik minor pada tower BTS, walaupun strukturnya tetap kokoh berdiri. Hal ini berakibat pada "miss-alignment" arah tembakan gelombang radio microwave antar tapak.\n\nGejalanya: RSL (Received Signal Level) drop dari normalnya -42dBm menjadi -75dBm, yang berujung pada tingginya packet loss data seluler regional.\n\nTrik alinyemen manual tim lapangan:\n- Selalu gunakan radio HT di frekuensi koordinasi darurat.\n- Jangan longgarkan semua baut sengkang sekaligus! Longgarkan tipis-tipis baut azimuth terlebih dahulu.\n- Gerakkan piringan parabola searah jarum jam secara mikro (milimeter demi milimeter), perhatikan naiknya tegangan AGC voltage pada lubang ukur voltmeter analog multitester.\n- Jika level telah kembali ke standar maksimum, kunci mati baut secara silang bertingkat (torque bertahap).',
    author: 'I Nyoman Gede',
    authorRole: 'Junior Engineer',
    authorRegion: 'Regional Bali Nusa Tenggara',
    date: '2026-05-02',
    upvotes: 29,
    likedBy: [],
    isVerifiedBySenior: false,
    troubleshootingSteps: [
      'Gunakan multitester digital hubungkan ke port AGC (Automatic Gain Control) di ODU MW',
      'Posisikan baut kunci azimuth longgar sebagian, puntir halus',
      'Bila voltase AGC naik mendekati puncak kurva pabrikan, kunci seketika'
    ],
    comments: [
      {
        id: 'c-4',
        author: 'Pak Hendra Wijaya',
        role: 'Senior Engineer',
        region: 'Regional Jawa Barat',
        content: 'Bagus Nyoman! Trik voltmeter AGC ini memang andalan zaman kami dulu sebelum ada software monitor otomatis. Sangat valid untuk teknisi lapangan di daerah kepulauan terpencil.',
        date: '2023-05-03'
      }
    ]
  },
  {
    id: 'art-5',
    title: 'Standar Keselamatan (K3) Memanjat Tower Mono/Greenfield di Cuaca Lembab',
    category: 'K3 & SOP Lapangan',
    content: 'Indonesia memiliki curah hujan tinggi yang membuat struktur tangga tower sangat licin akibat lumut tipis dan embun pagi. Cedera terpeleset dari ketinggian adalah risiko fatal terbesar pekerjaan lapangan.\n\nKetentuan Wajib Alat Pelindung Diri (APD):\n- Full Body Harness dengan double lanyard & energy absorber wajib terpasang 100% (Sistem 100% tie-off).\n- Gunakan pengunci pengaman otomatis (fall arrester) yang dicantolkan di tali baja utama pemanjatan (safety wire).\n- Dilarang memanjat jika awan petir cumulus sudah terlihat jelas di atas wilayah tapak BTS. Induksi petir di struktur besi tower bisa berakibat fatal dari jarak 1 KM sekalipun!\n- Sediakan tas alat kerja sandang (tool bag), dilarang membawa kunci pas/ tang di saku celana karena berisiko jatuh menimpa kru di bawah tower.',
    author: 'Rahmat Hidayat',
    authorRole: 'Team Lead',
    authorRegion: 'Regional Kalimantan',
    date: '2026-04-28',
    upvotes: 61,
    likedBy: [],
    isVerifiedBySenior: true,
    verifiedBy: 'Direktorat Safety & K3 Telkomsel Indonesia',
    troubleshootingSteps: [
      'Inspeksi kelayakan anyaman lanyard harness dari keausan benang sebelum memanjat',
      'Wajib gunakan helm keselamatan dengan tali dagu terpasang kencang',
      'Jika hujan deras mengguyur tiba-tiba, segera turun bertahap dan amankan diri di shelter BTS',
      'Sterilkan radius drop zone 10 meter di bawah kaki tower dari personel lain'
    ],
    comments: []
  }
];

export const INITIAL_QA_THREADS: QAThread[] = [
  {
    id: 'qa-1',
    title: 'Tanya: Jarak aman penarikan kabel drop core FTTH dari tiang ODP ke rumah pelanggan?',
    description: 'Saya teknisi baru (Junior) di Regional Jawa Timur. Saat pasang baru kemarin, ada rumah pelanggan yang letaknya sekitar 180 meter dari tiang ODP terdekat. Apakah aman ditarik langsung pakai kabel drop core 1 core, ataukah ada batas maksimum bentangan agar kabel tidak putus kena angin/pohon?',
    category: 'Fiber Optic (FTTH/FTTx)',
    author: 'Andri Sugiono',
    authorRole: 'Junior Engineer',
    authorRegion: 'Regional Jawa Timur',
    date: '2026-05-19',
    isResolved: true,
    answers: [
      {
        id: 'ans-1',
        author: 'Pak Hendra Wijaya',
        role: 'Senior Engineer',
        region: 'Regional Jawa Barat',
        content: 'Secara standar rancang bangun Telkomsel/Telkom, bentangan kabel drop core udara tanpa tiang penopang tengah adalah MAKSIMAL 150 METER. Jika ditarik langsung 180 meter tanpa tiang sisipan, kabel akan terlalu kendor dan berisiko tinggi putus ketika terjadi gesekan mekanis dengan ranting pohon atau diterpa angin kencang.\n\nSaran saya: Usulkan penambahan satu "tiang sisipan" di tengah jalan, atau alihkan koneksinya ke ODP alternatif yang lebih dekat dari sisi belakang rumah pelanggan jika ada.',
        isVerifiedAnswer: true,
        upvotes: 12,
        likedBy: [],
        date: '2026-05-19'
      },
      {
        id: 'ans-2',
        author: 'Dian Permana',
        role: 'Spesialis Jaringan',
        region: 'Regional Jawa Barat',
        content: 'Betul kata Pak Hendra. Tambahan: kalau terpaksa banget tanpa tiang sisipan karena akses jalan aspal lebar, gunakan drop wire tipe double messenger (kawat baja ganda) walaupun agak berat saat pengencangan. Tapi ini opsi terakhir ya.',
        isVerifiedAnswer: false,
        upvotes: 5,
        likedBy: [],
        date: '2026-05-20'
      }
    ]
  },
  {
    id: 'qa-2',
    title: 'Diskusi: Mengapa output rectifier ZTE model ZXDU68 sering alarm "Voltage Low" saat digeber beban puncak?',
    description: 'Halo rekan-rekan teknisi listrik BTS. Di Merauke, kami mengelola Rectifier ZTE ZXDU68. Saat jam sibuk pelanggan (traffic puncak malam), tegangan busbar DC drop ke -46V DC dan muncul buzzer berbunyi berulang. Baterai padahal terukur normal saat diuji tanpa beban. Apakah ini masalah di module penyearah (rectifier module) yang jebol salah satu, atau setingan LVD (Low Voltage Disconnect) yang terlalu ketat?',
    category: 'Power & Cooling BTS',
    author: 'Fransiscus Amo',
    authorRole: 'Junior Engineer',
    authorRegion: 'Regional Papua Maluku',
    date: '2026-05-14',
    isResolved: false,
    answers: [
      {
        id: 'ans-3',
        author: 'Agus Riyadi',
        role: 'Senior Engineer',
        region: 'Regional Kalimantan',
        content: 'Ada beberapa kemungkinan, Bung Frans. Pertama, cek dulu status modul rectifier di layar controller digital. Berapa modul yang statusnya ACTIVE? Jika total beban BTS Anda butuh 150 Ampere, sedangkan dari 4 unit modulex 50A ada 2 unit yang berstatus FAULT/OFF, otomatis 2 modul sisanya tidak kuat suplai puncak dan memicu penurunan voltase sistem.\n\nTrik lapangan: Coba cabut pasang (hot-swap) modul yang mati tersebut untuk memicu sirkuit reset, lalu ukur arus keluaran masing-masing modul dengan tang ampere.',
        isVerifiedAnswer: false,
        upvotes: 8,
        likedBy: [],
        date: '2026-05-15'
      }
    ]
  },
  {
    id: 'qa-3',
    title: 'Penjelasan parameter beamforming antena 5G Massive MIMO di area perumahan padat?',
    description: 'Kami sedang menguji coba pemancaran udara 5G NR TDD 2300MHz di perumahan padat Surabaya. Sinyal kuat di luar ruangan, tapi begitu masuk ke dalam ruko beton 3 lantai, sinyal drop drastis dari 5G ke HSPA. Apakah konfigurasi pola berkas (beam pattern) dapat kita ubah ke "Vertical Spread" atau tetap "Horizontal Sweep"?',
    category: '4G/5G Seluler',
    author: 'Bambang Eko',
    authorRole: 'Junior Engineer',
    authorRegion: 'Regional Jawa Timur',
    date: '2026-05-08',
    isResolved: false,
    answers: []
  }
];

export const INITIAL_QUIZ_MODULES: QuizModule[] = [
  {
    id: 'qz-1',
    title: 'Standardisasi Teknik Penyambungan Core & Pengoperasian OTDR',
    description: 'Refleksi pengetahuan wajib tentang standar splicing core serat optik, batas loss sambungan, dan cara membaca grafik kurva OTDR untuk mendeteksi gangguan fiber drop di lapangan.',
    category: 'Fiber Optic (FTTH/FTTx)',
    difficulty: 'Muda (Junior)',
    estimatedMinutes: 8,
    xpReward: 150,
    questions: [
      {
        id: 'q1-1',
        question: 'Berapakah standar maksimal loss (redaman) per satu sambungan splicing core fiber optic yang diperbolehkan dalam standar Telkomsel?',
        options: [
          '0.50 dB',
          '1.00 dB',
          '0.10 dB',
          '0.03 dB'
        ],
        correctOptionIndex: 2, // 0.10 dB (often technically 0.03 to 0.1dB but max limit is 0.1 dB in standard optical specs)
        explanation: 'Menurut pedoman konstruksi jaringan optik Telkomsel, redaman maksimal per sambungan las (fusion splice) kriteria kelulusannya adalah maksimal 0.10 dB (direkomendasikan < 0.05 dB untuk transmisi backbone).'
      },
      {
        id: 'q1-2',
        question: 'Pada grafik layar OTDR, apa arti dari lonjakan tajam vertikal ke atas sebelum kemudian meluncur turun?',
        options: [
          'Adanya sambungan splicing yang sempurna',
          'Adanya pantulan Fresnel (reflective event) pemicu guncangan cahaya, misalnya akibat konektor adapter kotor atau udara',
          'Puntiran fiber optik patah total (fiber cut)',
          'Ujung akhir kabel yang ditimbun tanah'
        ],
        correctOptionIndex: 1,
        explanation: 'Lonjakan ke atas mengindikasikan adanya event reflektif (pantulan cahaya balik atau Fresnel reflection) yang umumnya terjadi pada titik koneksi mekanikal seperti adapter, connector ferrule, atau retakan kaca.'
      },
      {
        id: 'q1-3',
        question: 'Apa fungsi utama dari pigtail fiber optik di dalam Kotak ODP (Optical Distribution Point)?',
        options: [
          'Sebagai pelindung petir udara',
          'Sebagai pembagi frekuensi radio',
          'Kabel serat optik pendek dengan salah satu ujungnya sudah berkonektor untuk menyambung kabel distribusi ke port adapter coupler',
          'Baterai sekunder darurat'
        ],
        correctOptionIndex: 2,
        explanation: 'Pigtail merupakan seutas kabel optik pendek yang salah satu ujungnya sudah dipasangi konektor pabrikan, sedangkan ujung lainnya berupa core telanjang untuk dilas (splicing) ke core kabel feeder/distribusi lapangan.'
      }
    ]
  },
  {
    id: 'qz-2',
    title: 'Prosedur K3 & Proteksi Petir Sistem Tenaga BTS Seluler',
    description: 'Sangat vital untuk keselamatan jiwa teknisi listrik dan pencegahan kehancuran perangkat penyearah (rectifier) dari sambaran petir di tower pegunungan.',
    category: 'Power & Cooling BTS',
    difficulty: 'Madya (Intermediate)',
    estimatedMinutes: 10,
    xpReward: 200,
    questions: [
      {
        id: 'q2-1',
        question: 'Berapakah nilai resistansi grounding (pembumian) maksimal yang aman dan memenuhi standar kelayakan tapak BTS Telkomsel?',
        options: [
          '< 5.0 Ohm',
          '< 1.0 Ohm',
          '< 10.0 Ohm',
          '< 20.0 Ohm'
        ],
        correctOptionIndex: 1, // < 1.0 Ohm is high standard, < 5.0 Ohm is standard, but normally target < 1.0 Ohm for telecom infrastructure
        explanation: 'Standar keandalan tertinggi infrastruktur radio telekomunikasi Telkomsel mensyaratkan nilai tahanan pembumian sistem penangkal petir dan grounding shelter di bawah 1.0 Ohm (maksimal di wilayah berbatu sulit < 2.0 Ohm).'
      },
      {
        id: 'q2-2',
        question: 'Saat melayani perbaikan genset dalam kondisi hujan lebat, mana tindakan pencegahan K3 kelistrikan yang PALING utama?',
        options: [
          'Memayungi genset yang sedang hidup',
          'Menggunakan sepatu safety bersertifikasi isolasi tinggi (dielectrical boots) dan melapis lantai pengerjaan dengan karet anti-statik kering',
          'Melakukan bypass sekring pengaman agar cepat menyala',
          'Memegang sasis besi genset dengan tangan basah agar grounding tubuh seimbang'
        ],
        correctOptionIndex: 1,
        explanation: 'Sepatu dielektrik dan keset karet kering mengisolasi tubuh teknisi secara tangguh dari aliran kebocoran listrik bertegangan tinggi di lingkungan basah, mencegah terjadinya sengatan fatal.'
      }
    ]
  },
  {
    id: 'qz-3',
    title: 'Optimasi Sinyal 4G LTE & Pengantar Migrasi Teknologi 5G NR TDD',
    description: 'Uji wawasan Anda seputar penyetelan kemiringan antena (tilt), modulasi RF, serta transisi penataan spektrum ke arah 5G baru.',
    category: '4G/5G Seluler',
    difficulty: 'Utama (Senior)',
    estimatedMinutes: 12,
    xpReward: 300,
    questions: [
      {
        id: 'q3-1',
        question: 'Di jaringan LTE, parameter RSRP (Reference Signal Received Power) bernilai -115dBm mengindikasikan kondisi apa bagi pengguna?',
        options: [
          'Sinyal sangat kuat dan stabil untuk video call Ultra-HD',
          'Sinyal sangat lemah (bad coverage), berisiko putus-putus atau drop total ke mode darurat',
          'Kondisi frekuensi terpolusi interferensi tanpa masalah daya sinyal',
          'Saluran serat optik sedang putus'
        ],
        correctOptionIndex: 1,
        explanation: 'RSRP di bawah -110dBm sd -120dBm menandakan level penerimaan daya sinyal seluler yang sangat buruk di perangkat genggam, yang membutuhkan optimasi arah kemiringan antena atau peningkatan daya pancar.'
      },
      {
        id: 'q3-2',
        question: 'Apakah keuntungan utama penerapan teknologi beamforming Massive MIMO pada spektrum frekuensi tinggi 5G NR?',
        options: [
          'Menghemat pemakaian bensin mobil operasional',
          'Menembakkan berkas sinyal terfokus secara dinamis langsung ke arah fisik pengguna bergerak sehingga memperkecil interferensi dan menaikkan throughput data',
          'Membuat tiang tower bisa berputar otomatis',
          'Menghilangkan kebutuhan kabel fiber optic'
        ],
        correctOptionIndex: 1,
        explanation: 'Dengan memfokuskan pendaran elektromagnetik langsung ke koordinat spasial perangkat pengguna aktif secara real-time, beamforming mengeliminasi siaran daya mubazir sekaligus melipatgandakan spectral efficiency di dalam klaster padat.'
      }
    ]
  }
];

export const INITIAL_LEADERBOARD: TechnicianLeaderboard[] = [
  {
    id: 't-1',
    name: 'Pak Hendra Wijaya',
    region: 'Regional Jawa Barat',
    role: 'Senior FTTH Specialist',
    points: 1540,
    sharesCount: 14,
    answersCount: 22,
    badges: ['Veteran Share', 'FTTH Guru', 'Sertifikasi Utama']
  },
  {
    id: 't-2',
    name: 'Budi Utomo',
    region: 'Regional Sulawesi',
    role: 'Infrastructure Team Lead',
    points: 1120,
    sharesCount: 9,
    answersCount: 15,
    badges: ['HSE Champion', 'Power Master']
  },
  {
    id: 't-3',
    name: 'Ridwan Hakim',
    region: 'Regional Sumatera Utara',
    role: 'RF Planning Specialist',
    points: 980,
    sharesCount: 8,
    answersCount: 11,
    badges: ['Interference Buster', '4G Genius']
  },
  {
    id: 't-4',
    name: 'Andri Sugiono',
    region: 'Regional Jawa Timur',
    role: 'Junior Field Engineer',
    points: 540,
    sharesCount: 3,
    answersCount: 4,
    badges: ['Bintang Muda', 'Aktif Bertanya']
  },
  {
    id: 't-5',
    name: 'Agus Riyadi',
    region: 'Regional Kalimantan',
    role: 'Senior Power Support',
    points: 480,
    sharesCount: 4,
    answersCount: 7,
    badges: ['Cooling Advisor']
  }
];

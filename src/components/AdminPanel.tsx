import React, { useState } from 'react';
import { 
  Shield, 
  Trash2, 
  CheckCircle, 
  Award, 
  FileText, 
  HelpCircle, 
  PlusSquare, 
  Users, 
  Star, 
  BarChart3, 
  AlertCircle, 
  Edit3, 
  Search, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Filter, 
  MapPin, 
  UserPlus, 
  Ban, 
  MessageSquare, 
  TrendingUp, 
  BookOpen,
  FolderMinus,
  CheckCircle2,
  ListPlus
} from 'lucide-react';
import { KnowledgeArticle, QAThread, QuizModule, TechCategory, TechnicianLeaderboard } from '../types';

interface AdminPanelProps {
  articles: KnowledgeArticle[];
  setArticles: React.Dispatch<React.SetStateAction<KnowledgeArticle[]>>;
  threads: QAThread[];
  setThreads: React.Dispatch<React.SetStateAction<QAThread[]>>;
  quizzes: QuizModule[];
  setQuizzes: React.Dispatch<React.SetStateAction<QuizModule[]>>;
  leaderboard: TechnicianLeaderboard[];
  setLeaderboard: React.Dispatch<React.SetStateAction<TechnicianLeaderboard[]>>;
  currentUser: {
    name: string;
    role: string;
    region: string;
    points: number;
  };
  activeAdminTab?: 'analytics' | 'articles' | 'forum' | 'quizzes' | 'technicians';
  setActiveAdminTab?: (tab: 'analytics' | 'articles' | 'forum' | 'quizzes' | 'technicians') => void;
}

export default function AdminPanel({
  articles,
  setArticles,
  threads,
  setThreads,
  quizzes,
  setQuizzes,
  leaderboard,
  setLeaderboard,
  currentUser,
  activeAdminTab: propActiveAdminTab,
  setActiveAdminTab: propSetActiveAdminTab
}: AdminPanelProps) {
  const [localActiveAdminTab, setLocalActiveAdminTab] = useState<'analytics' | 'articles' | 'forum' | 'quizzes' | 'technicians'>('analytics');
  
  const activeAdminTab = propActiveAdminTab !== undefined ? propActiveAdminTab : localActiveAdminTab;
  const setActiveAdminTab = propSetActiveAdminTab !== undefined ? propSetActiveAdminTab : setLocalActiveAdminTab;
  
  // Search query states
  const [articleSearch, setArticleSearch] = useState('');
  const [forumSearch, setForumSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [techSearch, setTechSearch] = useState('');

  // Filtering states
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>('Semua');

  // Logs simulation for audit trail
  const [adminLogs, setAdminLogs] = useState<Array<{ id: string; user: string; action: string; time: string; type: string }>>([
    { id: 'log-1', user: 'Administrator Utama', action: 'Memverifikasi artikel optik Regional Jabar', time: '10:15 WIB', type: 'Artikel' },
    { id: 'log-2', user: 'Administrator Utama', action: 'Memberikan lencana FTTH Guru ke Pak Hendra Wijaya', time: '09:44 WIB', type: 'Aksesoris' },
    { id: 'log-3', user: 'System Auto-Guard', action: 'Membersihkan 3 antrean spam ralat ODP', time: '07:30 WIB', type: 'Sistem' },
  ]);

  const addAdminLog = (action: string, type: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      action: action,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      type: type
    };
    setAdminLogs(prev => [newLog, ...prev]);
  };

  // State to create a custom Quiz from the admin form
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');
  const [newQuizCategory, setNewQuizCategory] = useState<TechCategory>('4G/5G Seluler');
  const [newQuizDifficulty, setNewQuizDifficulty] = useState<QuizModule['difficulty']>('Muda (Junior)');
  const [newQuizMinutes, setNewQuizMinutes] = useState(10);
  const [newQuizXpReward, setNewQuizXpReward] = useState(150);
  
  // Storing draft questions in progress
  const [draftQuestions, setDraftQuestions] = useState<QuizModule['questions']>([
    {
      id: 'dq-1',
      question: 'Apa langkah awal pencegahan interferensi spektrum frekuensi seluler?',
      options: ['Matikan BTS', 'Gunakan Filter Bandpass', 'Pindahkan tiang tower', 'Biarkan saja'],
      correctOptionIndex: 1,
      explanation: 'Pemasangan Filter Bandpass eksternal merupakan perangkat penapis paling andal di lapangan untuk meredam frekuensi parasit sebelum masuk ke sistem penyearah RF.'
    }
  ]);

  // Draft question inputs
  const [draftQText, setDraftQText] = useState('');
  const [draftOpt1, setDraftOpt1] = useState('');
  const [draftOpt2, setDraftOpt2] = useState('');
  const [draftOpt3, setDraftOpt3] = useState('');
  const [draftOpt4, setDraftOpt4] = useState('');
  const [draftCorrectIdx, setDraftCorrectIdx] = useState(0);
  const [draftExplText, setDraftExplText] = useState('');

  const [quizCreationMessage, setQuizCreationMessage] = useState<string | null>(null);

  // Stats for Overview Cards
  const totalVerifiedArticles = articles.filter(a => a.isVerifiedBySenior).length;
  const ratioVerified = articles.length > 0 ? Math.round((totalVerifiedArticles / articles.length) * 100) : 0;
  const totalClosedThreads = threads.filter(t => t.isResolved).length;
  const totalActiveQuizzes = quizzes.length;
  const totalTechnicians = leaderboard.length;
  const totalAdminVerificationPending = articles.filter(a => !a.isVerifiedBySenior).length;

  // Handler: Verify/Unverify Article
  const toggleVerifyArticle = (articleId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id !== articleId) return art;
      
      const nextVerifyValue = !art.isVerifiedBySenior;
      const act = nextVerifyValue 
        ? `Memverifikasi artikel "${art.title}"` 
        : `Mencabut verifikasi artikel "${art.title}"`;
      
      addAdminLog(act, 'Artikel');
      
      return {
        ...art,
        isVerifiedBySenior: nextVerifyValue,
        verifiedBy: nextVerifyValue ? currentUser.name : undefined
      };
    }));
  };

  // Handler: Delete Article
  const deleteArticle = (articleId: string, titleStr: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel pengetahuan "${titleStr}"?`)) {
      setArticles(prev => prev.filter(art => art.id !== articleId));
      addAdminLog(`Menghapus artikel "${titleStr}"`, 'Artikel');
    }
  };

  // Handler: Toggle Forum Issue Resolved / Active
  const toggleThreadResolved = (threadId: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      const nextVal = !t.isResolved;
      addAdminLog(`Mengubah status masalah "${t.title}" menjadi ${nextVal ? 'Terselesaikan (Resolved)' : 'Aktif (Unresolved)'}`, 'Forum');
      return {
        ...t,
        isResolved: nextVal
      };
    }));
  };

  // Handler: Delete Discussion Thread
  const deleteThread = (threadId: string, titleStr: string) => {
    if (confirm(`Hapus utas diskusi "${titleStr}" dari pangkalan forum?`)) {
      setThreads(prev => prev.filter(t => t.id !== threadId));
      addAdminLog(`Menghapus forum diskusi "${titleStr}"`, 'Forum');
    }
  };

  // Handler: Delete Quiz Module
  const deleteQuizModule = (quizId: string, titleStr: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus modul sertifikasi "${titleStr}"?`)) {
      setQuizzes(prev => prev.filter(qz => qz.id !== quizId));
      addAdminLog(`Menghapus kuis sertifikasi "${titleStr}"`, 'Kuis');
    }
  };

  // Handler: Add draft question
  const handleAddDraftQuestion = () => {
    if (!draftQText.trim() || !draftOpt1.trim() || !draftOpt2.trim() || !draftOpt3.trim() || !draftOpt4.trim()) {
      alert('Sila lengkapi teks pertanyaan beserta keempat pilihan jawaban.');
      return;
    }

    const newQ = {
      id: `dq-${Date.now()}`,
      question: draftQText.trim(),
      options: [draftOpt1.trim(), draftOpt2.trim(), draftOpt3.trim(), draftOpt4.trim()],
      correctOptionIndex: draftCorrectIdx,
      explanation: draftExplText.trim() || 'Rujukan sesuai SOP buku saku pemeliharaan jaringan regional PT Telkomsel.'
    };

    setDraftQuestions(prev => [...prev, newQ]);
    
    // Clear draft fields
    setDraftQText('');
    setDraftOpt1('');
    setDraftOpt2('');
    setDraftOpt3('');
    setDraftOpt4('');
    setDraftCorrectIdx(0);
    setDraftExplText('');
  };

  // Handler: Create & Add actual new Quiz to App State
  const handlePublishQuiz = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuizTitle.trim() || !newQuizDesc.trim()) {
      alert('Mohon isi judul dan deskripsi modul kuis terlebih dahulu.');
      return;
    }

    if (draftQuestions.length === 0) {
      alert('Minimal harus memiliki 1 pertanyaan terdaftar dalam kuis draft.');
      return;
    }

    const newModule: QuizModule = {
      id: `qz-${Date.now()}`,
      title: newQuizTitle.trim(),
      description: newQuizDesc.trim(),
      category: newQuizCategory,
      difficulty: newQuizDifficulty,
      estimatedMinutes: Number(newQuizMinutes) || 10,
      questions: draftQuestions,
      xpReward: Number(newQuizXpReward) || 150
    };

    setQuizzes(prev => [...prev, newModule]);
    addAdminLog(`Membuat Kuis Baru: "${newQuizTitle}" (${draftQuestions.length} soal)`, 'Kuis');

    setQuizCreationMessage(`Modul sertifikasi "${newQuizTitle}" berhasil diterbitkan ke Pustaka Kuis Mandiri Teknisi!`);
    
    // Reset Form
    setNewQuizTitle('');
    setNewQuizDesc('');
    setDraftQuestions([
      {
        id: 'dq-temp',
        question: 'Apakah warna standar kabel serat optik patchcord outdoor?',
        options: ['Hitam / Gelap berperekat', 'Kuning mencolok', 'Hijau / Tosca', 'Biru Laut'],
        correctOptionIndex: 0,
        explanation: 'Kabel dropcore / patchcord outdoor dirancang dengan pembungkus luar (jacket) polyethylene berwarna hitam tebal untuk menangkis sinar UV matahari.'
      }
    ]);

    setTimeout(() => {
      setQuizCreationMessage(null);
    }, 4000);
  };

  // Handlers for Technicians Management:
  const adjustTechXP = (techId: string, amount: number, name: string) => {
    setLeaderboard(prev => prev.map(t => {
      if (t.id !== techId) return t;
      const nextPts = Math.max(0, t.points + amount);
      return {
        ...t,
        points: nextPts
      };
    }));
    addAdminLog(`Menyesuaikan poin XP ${name}: ${amount > 0 ? '+' : ''}${amount} XP`, 'Teknisi');
  };

  const addBadgeToTech = (techId: string, badgeName: string, name: string) => {
    if (!badgeName.trim()) return;
    setLeaderboard(prev => prev.map(t => {
      if (t.id !== techId) return t;
      if (t.badges.includes(badgeName.trim())) return t;
      return {
        ...t,
        badges: [...t.badges, badgeName.trim()]
      };
    }));
    addAdminLog(`Menganugerahkan XP Badge [${badgeName}] kepada ${name}`, 'Teknisi');
  };

  const deleteTechAccount = (techId: string, name: string) => {
    if (confirm(`Keluarkan ${name} dari direktori kontributor regional?`)) {
      setLeaderboard(prev => prev.filter(t => t.id !== techId));
      addAdminLog(`Mengeluarkan akun teknisi ${name}`, 'Teknisi');
    }
  };

  // Filter systems
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(articleSearch.toLowerCase()) || 
                          art.author.toLowerCase().includes(articleSearch.toLowerCase()) ||
                          art.content.toLowerCase().includes(articleSearch.toLowerCase());
    const matchesCategory = articleCategoryFilter === 'Semua' || art.category === articleCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredThreads = threads.filter(thr => {
    return thr.title.toLowerCase().includes(forumSearch.toLowerCase()) || 
           thr.description.toLowerCase().includes(forumSearch.toLowerCase()) ||
           thr.author.toLowerCase().includes(forumSearch.toLowerCase());
  });

  const filteredQuizzesList = quizzes.filter(q => {
    return q.title.toLowerCase().includes(quizSearch.toLowerCase()) ||
           q.description.toLowerCase().includes(quizSearch.toLowerCase()) ||
           q.category.toLowerCase().includes(quizSearch.toLowerCase());
  });

  const filteredTechs = leaderboard.filter(t => {
    return t.name.toLowerCase().includes(techSearch.toLowerCase()) ||
           t.region.toLowerCase().includes(techSearch.toLowerCase()) ||
           t.role.toLowerCase().includes(techSearch.toLowerCase());
  });

  // Unique category counts for Simple HTML Bar Charts
  const articleCategoryCounts = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const themeCategories: TechCategory[] = [
    '4G/5G Seluler',
    'Fiber Optic (FTTH/FTTx)',
    'Sistem Transmisi & Radio',
    'Power & Cooling BTS',
    'Core Network',
    'K3 & SOP Lapangan'
  ];

  return (
    <div id="tera-admin-panel" className="space-y-6">
      
      {/* Admin Title Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-red-600/20 text-brand-red border border-red-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
              ★ PANEL ADMINISTRATOR UTAMA
            </span>
            <h2 className="text-xl md:text-2xl font-display font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-red" /> TERA Admin Control Room
            </h2>
            <p className="text-xs text-slate-400">
              Kelola repositori ilmu, moderasi diskusi forum, buat modul sertifikasi, dan pantau performansi kontribusi teknisi telkomsel seluruh wilayah operasional.
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-800 rounded-xl px-4 py-2 border border-slate-700 font-mono text-xs shrink-0 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-300">Level Hak Akses: <strong className="text-white">Admin Utama</strong></span>
          </div>
        </div>
      </div>

      {/* Tab Area Output */}
      <div>
        {activeAdminTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Real Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Draf Perlu Verifikasi', value: totalAdminVerificationPending, desc: 'Laporan teknis masuk', color: 'bg-amber-500/10 text-amber-700 border-amber-305' },
                { title: 'Tingkat Standarisasi', value: `${ratioVerified}%`, desc: 'Modul berverifikasi senior', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                { title: 'Masalah Teratasi', value: totalClosedThreads, desc: 'Terselesaikan di forum', color: 'bg-sky-50 text-sky-700 border-sky-100' },
                { title: 'Total Partner Teknisi', value: totalTechnicians, desc: 'Terdaftar di sistem regional', color: 'bg-rose-50 text-rose-700 border-rose-100' }
              ].map((c, i) => (
                <div key={i} className={`p-4 rounded-xl border bg-white shadow-3xs hover:shadow-xs transition-all`}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{c.title}</div>
                  <div className="text-2.5xl font-extrabold font-mono text-slate-900 mt-1.5">{c.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{c.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Distribution Charts */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-3xs space-y-4 lg:col-span-2">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-brand-red" /> Komposisi Topik Repositori TERA
                  </h4>
                  <p className="text-[10px] text-slate-550">Distribusi modul yang ditulis mandiri oleh teknisi lapangan</p>
                </div>

                <div className="space-y-4 pt-1">
                  {themeCategories.map(cat => {
                    const count = articleCategoryCounts[cat] || 0;
                    const maxPossible = Math.max(...Object.values(articleCategoryCounts), 1);
                    const percentage = Math.round((count / maxPossible) * 100);
                    
                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-medium">
                          <span className="text-slate-700 font-sans">{cat}</span>
                          <span className="font-mono text-slate-900 font-bold">{count} Modul</span>
                        </div>
                        {/* Dynamic custom bar */}
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${percentage}%` }} 
                            className={`h-full rounded-full transition-all duration-500 ${
                              cat.includes('Fiber') ? 'bg-sky-500' :
                              cat.includes('Seluler') ? 'bg-rose-500' :
                              cat.includes('Transmisi') ? 'bg-amber-500' :
                              cat.includes('Power') ? 'bg-emerald-500' :
                              cat.includes('Core') ? 'bg-purple-500' : 'bg-slate-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* simulated Audit logs stream */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-3xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-brand-blue animate-spin" /> Log Aktivitas Admin
                    </h4>
                    <span className="text-[9px] text-slate-400 font-mono">Realtime</span>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-3 pt-2 max-h-[220px] overflow-y-auto pr-1">
                    {adminLogs.map(log => (
                      <div key={log.id} className="pt-2.5 text-xs flex gap-2 items-start">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase font-bold shrink-0 mt-0.5 ${
                          log.type === 'Artikel' ? 'bg-amber-100 text-amber-800' :
                          log.type === 'Forum' ? 'bg-sky-100 text-sky-800' :
                          log.type === 'Kuis' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {log.type}
                        </span>
                        <div className="flex-1 font-sans">
                          <p className="text-slate-700 font-medium leading-tight">{log.action}</p>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{log.user} • {log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-mono block">ID Token Sesi Aktif: admin_tera_session_5561a</span>
                </div>
              </div>

            </div>

            {/* Admin Checklist Guide */}
            <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-amber-950 font-medium">
                <span className="font-bold flex items-center gap-1">📋 Tanggung Jawab Operasional Admin TERA:</span>
                <p className="leading-relaxed">
                  1. Segera lakukan review draf modul baru yang diketik teknisi junior lapangan. Verifikasi keabsahan data agar aman menjadi rujukan resmi.<br />
                  2. Tutup utas forum yang pertanyaannya telah dijawab tuntas oleh spesialis senior.<br />
                  3. Berikan penghargaan lencana atau sesuaikan poin kontribusi teknisi yang konsisten aktif membagikan pengalaman sengketa bts daerah terpencil.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Articles Management */}
        {activeAdminTab === 'articles' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-3xs">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari artikel, penulis, isi rujukan..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red focus:bg-white"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                {['Semua', 'Sudah Verifikasi', 'Butuh Verifikasi'].map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      if (f === 'Semua') setArticleCategoryFilter('Semua');
                      else setArticleCategoryFilter(f);
                    }}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap cursor-pointer ${
                      articleCategoryFilter === f
                        ? 'bg-slate-800 text-white shadow-3xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* List and Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="p-4">Detail Modul / Penulis</th>
                    <th className="p-4">Kategori Teknis</th>
                    <th className="p-4">Status Layak Rujukan</th>
                    <th className="p-4 text-right">Aksi Moderasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 italic font-sans">
                        Tidak ada dokumen modul rujukan ditemukan yang cocok dengan kueri Anda.
                      </td>
                    </tr>
                  ) : (
                    filteredArticles
                      .filter(art => {
                        if (articleCategoryFilter === 'Sudah Verifikasi') return art.isVerifiedBySenior;
                        if (articleCategoryFilter === 'Butuh Verifikasi') return !art.isVerifiedBySenior;
                        return true;
                      })
                      .map(art => (
                        <tr key={art.id} className="hover:bg-slate-50/50 duration-150 transition-colors">
                          <td className="p-4 max-w-sm">
                            <span className="font-bold text-brand-blue block text-sm leading-snug line-clamp-1">{art.title}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono">
                              <span>Oleh: <strong>{art.author}</strong> ({art.authorRole})</span>
                              <span>•</span>
                              <span>{art.authorRegion}</span>
                              <span>•</span>
                              <span>{art.date}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-4">
                            {art.isVerifiedBySenior ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> TERVERIFIKASI
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-bounce" /> BUTUH REVIEW
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleVerifyArticle(art.id)}
                                title={art.isVerifiedBySenior ? "Ubah status ke Butuh Verifikasi" : "Verifikasi Artikel Sesuai Standard"}
                                className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  art.isVerifiedBySenior
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-250'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-550 shadow-3xs'
                                }`}
                              >
                                {art.isVerifiedBySenior ? (
                                  <><span>Batalkan Sah</span></>
                                ) : (
                                  <><Check className="w-3.5 h-3.5" /> <span>Sahkan Rujukan</span></>
                                )}
                              </button>
                              <button
                                onClick={() => deleteArticle(art.id, art.title)}
                                className="p-1.5 text-brand-red bg-rose-50 border border-rose-100 hover:bg-brand-red hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Hapus Artikel Permanen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab: Forum Moderation */}
        {activeAdminTab === 'forum' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Search Input */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-3xs">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari bahasan forum, penanya, konten..."
                  value={forumSearch}
                  onChange={(e) => setForumSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red focus:bg-white"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Daftar Utas Pertanyaan Terdaftar</span>
            </div>

            {/* Questions Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="p-4">Pertanyaan / Penulis</th>
                    <th className="p-4">Kategori Jaringan</th>
                    <th className="p-4">Jawaban (Saran)</th>
                    <th className="p-4">Resolusi Isu</th>
                    <th className="p-4 text-right">Aksi Moderasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredThreads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic font-sans">
                        Tidak ada bahasan forum yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  ) : (
                    filteredThreads.map(thr => (
                      <tr key={thr.id} className="hover:bg-slate-50/50 duration-150 transition-colors">
                        <td className="p-4 max-w-sm">
                          <span className="font-bold text-slate-900 block leading-snug text-xs line-clamp-1">{thr.title}</span>
                          <span className="text-[11px] text-slate-500 block truncate mt-1">{thr.description}</span>
                          <div className="text-[10px] text-slate-400 font-mono mt-1.5">
                            Oleh: <strong className="text-slate-600">{thr.author}</strong> ({thr.authorRole}) • {thr.authorRegion}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-mono text-[9px] font-bold">
                            {thr.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-600 text-center">
                          {thr.answers.length} Balasan
                        </td>
                        <td className="p-4">
                          {thr.isResolved ? (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              TERSELESAIKAN
                            </span>
                          ) : (
                            <span className="text-[10px] bg-rose-50 text-brand-red border border-rose-200 font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                              AKTIF / OPEN
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleThreadResolved(thr.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                                thr.isResolved
                                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                              }`}
                              title={thr.isResolved ? "Buka Kembali Masalah" : "Tandai Masalah Selesai"}
                            >
                              {thr.isResolved ? 'Re-open' : 'Close Isu'}
                            </button>
                            <button
                              onClick={() => deleteThread(thr.id, thr.title)}
                              className="p-1.5 text-brand-red bg-rose-50 border border-rose-100 hover:bg-brand-red hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Hapus Utas Forum"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab: Quizzes / Certification Creator */}
        {activeAdminTab === 'quizzes' && (
          <div className="space-y-6 animate-fadeIn">
            
            {quizCreationMessage && (
              <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 p-4 rounded-xl shadow-xs flex items-center gap-2 animate-bounce">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold text-xs">{quizCreationMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Creator Form Form */}
              <form onSubmit={handlePublishQuiz} className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-display font-bold text-slate-800 text-sm uppercase flex items-center gap-1.5">
                    <PlusSquare className="w-4.5 h-4.5 text-brand-red" /> Bikin Kuis Sertifikasi Baru
                  </h3>
                  <p className="text-[10px] text-slate-500">Form pembuatan kuis pelatihan mandiri otomatis masuk ke list instan teknisi.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-505 uppercase">Judul Modul Kuis *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemeringkatan Standard Grounding BTS Greenfield"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-red"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-505 uppercase">Kategori Kompetensi</label>
                    <select
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:outline-none"
                      value={newQuizCategory}
                      onChange={(e) => setNewQuizCategory(e.target.value as TechCategory)}
                    >
                      {themeCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-505 uppercase">Tingkat Kesulitan</label>
                    <select
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:outline-none"
                      value={newQuizDifficulty}
                      onChange={(e) => setNewQuizDifficulty(e.target.value as any)}
                    >
                      <option value="Muda (Junior)">Muda (Junior)</option>
                      <option value="Madya (Intermediate)">Madya (Intermediate)</option>
                      <option value="Utama (Senior)">Utama (Senior)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-505 uppercase">Estimasi Pengerjaan (Menit)</label>
                    <input
                      type="number"
                      required
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:outline-none"
                      value={newQuizMinutes}
                      onChange={(e) => setNewQuizMinutes(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-505 uppercase">XP Poin Hadiah Keberhasilan</label>
                    <input
                      type="number"
                      required
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:outline-none"
                      value={newQuizXpReward}
                      onChange={(e) => setNewQuizXpReward(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-550 uppercase">Deskripsi Modul Pelatihan</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Mempelajari ketentuan teknis sengketa transmisi..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:outline-none focus:bg-white"
                    value={newQuizDesc}
                    onChange={(e) => setNewQuizDesc(e.target.value)}
                  />
                </div>

                {/* Sub questions wizard */}
                <div className="p-3 bg-red-50/20 border border-dashed border-brand-red/10 rounded-xl space-y-3">
                  <h4 className="text-[11px] font-bold text-brand-red uppercase flex items-center gap-1 leading-none">
                    <ListPlus className="w-4.5 h-4.5" /> 1. Tambah Soal Kuis ke Modul Ini
                  </h4>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Tulis Pertanyaan (misal: Batas maksimal dbi antena grid outdoor?)"
                      className="w-full text-xs bg-white border border-slate-200 rounded p-2 focus:outline-none"
                      value={draftQText}
                      onChange={(e) => setDraftQText(e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Opsi A"
                        className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                        value={draftOpt1}
                        onChange={(e) => setDraftOpt1(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Opsi B"
                        className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                        value={draftOpt2}
                        onChange={(e) => setDraftOpt2(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Opsi C"
                        className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                        value={draftOpt3}
                        onChange={(e) => setDraftOpt3(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Opsi D"
                        className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                        value={draftOpt4}
                        onChange={(e) => setDraftOpt4(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 block uppercase">Indeks Pilihan Benar (A=0, B=1, ...)</label>
                        <select
                          className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                          value={draftCorrectIdx}
                          onChange={(e) => setDraftCorrectIdx(Number(e.target.value))}
                        >
                          <option value={0}>Opsi A (Mendasar)</option>
                          <option value={1}>Opsi B (Mendasar)</option>
                          <option value={2}>Opsi C (Mendasar)</option>
                          <option value={3}>Opsi D (Mendasar)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 block uppercase">Penjelasan Pembahasan Kuis</label>
                        <input
                          type="text"
                          placeholder="Penjelasan ringkas bagi yang salah..."
                          className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                          value={draftExplText}
                          onChange={(e) => setDraftExplText(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddDraftQuestion}
                      className="w-full py-1.5 bg-brand-blue text-white rounded text-xs font-bold hover:bg-brand-dark transition-colors cursor-pointer"
                    >
                      + Slip Pertanyaan Ini ke dalam Kuis Draft
                    </button>
                  </div>
                </div>

                {/* Published Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-red text-white hover:bg-brand-hover-red font-bold text-xs tracking-wider uppercase rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Terbitkan Pustaka Kuis Baru ({draftQuestions.length} Soal Berisi)
                </button>
              </form>

              {/* Quiz list management right side */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Draft questions display preview */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center justify-between border-b pb-1">
                    <span>Preview Draft Soal Baru</span>
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded text-brand-red font-bold border border-slate-200">{draftQuestions.length} Soal</span>
                  </h4>

                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                    {draftQuestions.map((q, qidx) => (
                      <div key={q.id || qidx} className="bg-white p-2.5 rounded border border-slate-200 text-xs">
                        <div className="font-bold flex justify-between gap-1 items-start">
                          <span className="line-clamp-2">{qidx+1}. {q.question}</span>
                          <button
                            type="button"
                            onClick={() => setDraftQuestions(prev => prev.filter((_, i) => i !== qidx))}
                            className="text-[10px] text-brand-red hover:underline shrink-0"
                          >
                            Hapus
                          </button>
                        </div>
                        <ul className="list-disc pl-4 text-[10px] text-slate-505 grid grid-cols-2 gap-1 mt-1.5">
                          {q.options.map((opt, oidx) => (
                            <li key={oidx} className={oidx === q.correctOptionIndex ? 'text-emerald-600 font-bold' : ''}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active and Registered Quizzes List */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3 shadow-3xs">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">Pelatihan / Kuis Aktif TERA</h4>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {filteredQuizzesList.map(qz => (
                      <div key={qz.id} className="p-2.5 bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 text-xs duration-150 transition-colors flex justify-between items-center">
                        <div className="truncate pr-2">
                          <span className="font-bold text-slate-900 block truncate leading-none mb-1">{qz.title}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {qz.category} • {qz.questions.length} Soal • {qz.xpReward} XP
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteQuizModule(qz.id, qz.title)}
                          className="p-1 px-2 rounded-md bg-rose-50 hover:bg-brand-red text-brand-red hover:text-white border border-rose-100 font-bold duration-150 cursor-pointer text-[10px]"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab: Technicians / Point management */}
        {activeAdminTab === 'technicians' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Search Input */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-3xs">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari partner teknisi, wilayah, instansi..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red focus:bg-white"
                />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Total terdeteksi: <strong>{filteredTechs.length}</strong> teknisi berprestasi</span>
            </div>

            {/* Technicians List Database */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="p-4">Identitas Mitra Jaringan</th>
                    <th className="p-4">Unit Wilayah</th>
                    <th className="p-4">Poin Kontribusi</th>
                    <th className="p-4">Lencana Kompetensi (Badges)</th>
                    <th className="p-4 text-right">Moderasi Partner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredTechs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic font-sans">
                        Akun teknisi rujukan tidak terdaftar.
                      </td>
                    </tr>
                  ) : (
                    filteredTechs.map(tech => (
                      <tr key={tech.id} className="hover:bg-slate-50/50 duration-150 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-105 border border-slate-200 text-brand-blue font-black flex items-center justify-center text-xs shadow-3xs shrink-0 select-none">
                              {tech.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs leading-none">{tech.name}</span>
                              <span className="text-[10px] text-slate-400 block font-mono mt-1">{tech.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-500 text-[10px] font-medium">
                          {tech.region}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-800">{tech.points} XP</span>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => adjustTechXP(tech.id, 50, tech.name)}
                                className="px-1 text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 rounded hover:bg-emerald-100 leading-none py-0.5 transition-all"
                                title="Tambahkan +50 XP"
                              >
                                +50
                              </button>
                              <button
                                onClick={() => adjustTechXP(tech.id, -50, tech.name)}
                                className="px-1 text-[9px] font-bold bg-rose-50 text-brand-red border border-rose-100 rounded hover:bg-brand-red hover:text-white leading-none py-0.5 transition-all"
                                title="Kurangi -50 XP"
                              >
                                -50
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 items-center max-w-sm">
                            {tech.badges?.map((bg, idx) => (
                              <span key={idx} className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded leading-none">
                                {bg}
                              </span>
                            ))}
                            
                            {/* Simple Award badge trigger */}
                            <select
                              value=""
                              onChange={(e) => {
                                addBadgeToTech(tech.id, e.target.value, tech.name);
                                e.target.value = ''; // Reset select
                              }}
                              className="text-[9px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-350 rounded px-1.5 py-0.5 outline-none font-sans font-bold cursor-pointer"
                            >
                              <option value="" disabled>Anugerah Lencana</option>
                              <option value="Backbone Master">Backbone Master</option>
                              <option value="K3 Guard">K3 Guard</option>
                              <option value="Splicing Guru">Splicing Guru</option>
                              <option value="Interferensi Buster">Interferensi Buster</option>
                              <option value="Super Senior">Super Senior</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteTechAccount(tech.id, tech.name)}
                            className="p-1 px-2 hover:bg-brand-red text-slate-400 hover:text-white border border-transparent hover:border-brand-red rounded duration-150 inline-flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                            title="Keluarkan Anggota"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Keluarkan</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Search, HelpCircle, ThumbsUp, Send, CheckCircle2, ArrowLeft, MessageCircle, AlertTriangle, Filter, Plus, ShieldCheck } from 'lucide-react';
import { QAThread, TechCategory, QAAnswer } from '../types';

interface ForumQAProps {
  threads: QAThread[];
  currentUser: {
    name: string;
    role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
    region: string;
    points: number;
  };
  onAddNewThread: (thread: Omit<QAThread, 'id' | 'date' | 'isResolved' | 'answers'>) => void;
  onAddAnswer: (threadId: string, answerContent: string) => void;
  onVerifyAnswer: (threadId: string, answerId: string) => void;
  onUpvoteAnswer: (threadId: string, answerId: string) => void;
}

export default function ForumQA({
  threads,
  currentUser,
  onAddNewThread,
  onAddAnswer,
  onVerifyAnswer,
  onUpvoteAnswer
}: ForumQAProps) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [filterResolved, setFilterResolved] = useState<'Semua' | 'Selesai' | 'Butuh Jawaban'>('Semua');
  
  // New thread form states
  const [isAsking, setIsAsking] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<TechCategory>('4G/5G Seluler');

  // Submit Answer state
  const [answerInput, setAnswerInput] = useState('');

  const categories = [
    'Semua',
    '4G/5G Seluler',
    'Fiber Optic (FTTH/FTTx)',
    'Sistem Transmisi & Radio',
    'Power & Cooling BTS',
    'Core Network',
    'K3 & SOP Lapangan'
  ];

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    onAddNewThread({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCat,
      author: currentUser.name,
      authorRole: currentUser.role,
      authorRegion: currentUser.region
    });

    // Clear and redirect
    setNewTitle('');
    setNewDesc('');
    setIsAsking(false);
  };

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || !activeThreadId) return;

    onAddAnswer(activeThreadId, answerInput.trim());
    setAnswerInput('');
  };

  // Find selected active thread
  const activeThread = threads.find(t => t.id === activeThreadId);

  // Filters
  const filteredThreads = threads.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Semua' || t.category === selectedCategory;

    const matchesStatus = 
      filterResolved === 'Semua' ||
      (filterResolved === 'Selesai' && t.isResolved) ||
      (filterResolved === 'Butuh Jawaban' && !t.isResolved);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (cat: TechCategory) => {
    switch (cat) {
      case '4G/5G Seluler': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Fiber Optic (FTTH/FTTx)': return 'bg-sky-50 text-sky-700 border-sky-00';
      case 'Sistem Transmisi & Radio': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Power & Cooling BTS': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Core Network': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="forum-qa-view" className="space-y-6">
      
      {!activeThreadId ? (
        // BOARD LIST
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-brand-blue">
                Forum Diskusi & Tanya Jawab Teknisi
              </h2>
              <p className="text-xs text-slate-500">
                Punya kendala aneh saat di pucuk tower atau gorong-gorong optik? Hubungi sesama teknisi untuk solusi instan.
              </p>
            </div>
            
            {!isAsking && (
              <button
                onClick={() => setIsAsking(true)}
                className="bg-brand-red text-white font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-brand-hover-red transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tanya Sesuatu
              </button>
            )}
          </div>

          {isAsking ? (
            // ASK QUESTION FORM
            <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-brand-blue text-md">Buat Pertanyaan Kendala Jaringan Baru</h3>
                <button
                  type="button"
                  onClick={() => setIsAsking(false)}
                  className="text-xs font-bold text-slate-500 hover:text-brand-red cursor-pointer"
                >
                  Batal
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-blue">MASALAH YANG DIHADAPI *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mengapa modul microwave Ericsson di site Gowa sering drop saat hujan rintik-rintik?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-blue">KUMPULAN KATEGORI DIVISI *</label>
                    <select
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value as TechCategory)}
                      className="w-full text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red focus:bg-white"
                    >
                      {categories.filter(c => c !== 'Semua').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-blue">NAMA & REGIONAL BERTANYA</label>
                    <div className="p-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-lg text-xs font-mono text-brand-blue font-bold">
                      {currentUser.name} ({currentUser.region})
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-blue">DESKRIPSILKAN KONDISI FISIK SITE SECARA DETIL *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Jelaskan detail: tipe perangkat, kronologi kejadian, nilai RSL, kode log error jika ada, dan perbaikan sementara yang gagal."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:bg-white font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-hover-red text-white py-2.5 px-4 rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Kirim Pertanyaan Ke Papan Utama Forum
                </button>
              </form>
            </div>
          ) : (
            // BOARD FILTERS & THREADS LIST
            <div className="space-y-4">
              
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-3xs flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="relative w-full md:max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari kendala forum..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red focus:bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs justify-end">
                  {/* Category dropdown filter */}
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3 h-3 text-slate-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-705 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'Semua' ? 'Semua Bidang' : cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status buttons */}
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-100 p-0.5">
                    {(['Semua', 'Selesai', 'Butuh Jawaban'] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFilterResolved(opt)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded cursor-pointer transition-all ${
                          filterResolved === opt 
                            ? 'bg-white text-brand-blue shadow-3xs' 
                            : 'text-slate-500 hover:text-slate-805'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Threads list output */}
              {filteredThreads.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <HelpCircle className="w-12 h-12 text-slate-350 mx-auto mb-2" />
                  <p className="text-slate-605 font-semibold text-sm">Tidak ditemukan utas pertanyaan yang cocok.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredThreads.map(thread => (
                    <div
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className="bg-white rounded-xl p-5 border border-slate-200 hover:border-brand-red/30 transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getCategoryColor(thread.category)}`}>
                              {thread.category}
                            </span>
                            {thread.isResolved ? (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                                <CheckCircle2 className="w-3" /> Selesai
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                                <AlertTriangle className="w-3" /> Butuh Jawaban
                              </span>
                            )}
                          </div>

                          <h3 className="font-display font-bold text-slate-900 md:text-md group-hover:text-brand-red transition-colors">
                            {thread.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-sans">
                            {thread.description}
                          </p>
                        </div>

                        <div className="text-right text-xs text-slate-400 font-mono shrink-0">
                          <div className="font-bold text-brand-blue">Tanggapan: {thread.answers.length}</div>
                          <span className="text-[10px] block mt-1">{thread.date}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-sans">
                          Ditanyakan oleh: <strong className="text-slate-800 font-bold">{thread.author}</strong> ({thread.authorRole} - {thread.authorRegion})
                        </span>
                        
                        <span className="text-brand-red group-hover:underline font-bold block text-[11px] transition-all">
                          Buka Diskusi Lengkap →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        // THREAD DETAILS & ANSWERS
        <div className="space-y-6">
          <button
            onClick={() => setActiveThreadId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-red transition-colors bg-white hover:bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Papan Forum
          </button>

          {activeThread && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Question & Answers Stack */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Original Question Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 border rounded-full ${getCategoryColor(activeThread.category)}`}>
                      {activeThread.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">{activeThread.date}</span>
                  </div>

                  <h1 className="text-lg md:text-xl font-display font-bold text-brand-blue">
                    {activeThread.title}
                  </h1>

                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line p-4 rounded-xl bg-slate-50 border border-slate-150 font-sans">
                    {activeThread.description}
                  </p>

                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-bold flex items-center justify-center uppercase">
                      {activeThread.author.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold block text-slate-800 leading-none">{activeThread.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{activeThread.authorRole} • {activeThread.authorRegion}</span>
                    </div>
                  </div>
                </div>

                {/* Answers Stack */}
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-xs text-brand-blue uppercase tracking-wider pl-1">
                    Tanggapan / Alternatif Solusi ({activeThread.answers.length})
                  </h3>

                  {activeThread.answers.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-white border border-slate-150 rounded-xl">
                      Belum ada tanggapan teknis. Apakah Anda punya solusi? Silakan tulis tanggapan Anda di bawah!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeThread.answers.map((ans) => (
                        <div
                          key={ans.id}
                          className={`bg-white rounded-xl p-5 border transition-all ${
                            ans.isVerifiedAnswer 
                              ? 'border-emerald-300 bg-emerald-50/20' 
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-bold text-slate-800">{ans.author}</span>
                              <span className="bg-slate-105 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                {ans.role} • {ans.region}
                              </span>
                            </div>

                            {ans.isVerifiedAnswer ? (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-250 px-2.5 py-0.5 rounded uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Solusi Teruji Ahli</span>
                              </div>
                            ) : (
                              // Allow Senior/Lead to endorse this answer as working solution
                              (currentUser.role === 'Senior Engineer' || currentUser.role === 'Team Lead') && (
                                <button
                                  onClick={() => onVerifyAnswer(activeThread.id, ans.id)}
                                  className="text-[10px] font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-250 px-2 py-1 rounded transition-colors cursor-pointer"
                                >
                                  Sahkan Solusi
                                </button>
                              )
                            )}
                          </div>

                          <p className="text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-line pl-1 mb-4 font-sans">
                            {ans.content}
                          </p>

                          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-mono">{ans.date}</span>

                            <button
                              onClick={() => onUpvoteAnswer(activeThread.id, ans.id)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded transition-all cursor-pointer font-bold ${
                                ans.likedBy?.includes(currentUser.name)
                                  ? 'bg-brand-red/10 border-brand-red text-brand-red'
                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Bermanfaat ({ans.upvotes})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submitting reply */}
                <form onSubmit={handlePostAnswer} className="bg-white rounded-xl p-4 border border-slate-200 shadow-3xs space-y-3">
                  <div className="text-xs font-bold text-brand-blue uppercase font-sans">Input Solusi Berdasarkan Pengalaman Anda:</div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Masukkan solusi Anda secara jelas (alat apa yang harus digunakan, setingan parameter, dsb)..."
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    className="w-full text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-brand-red focus:bg-white font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-brand-red text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-brand-hover-red duration-150 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors font-sans"
                    >
                      <Send className="w-3.5 h-3.5" /> Kirim Tanggapan
                    </button>
                  </div>
                </form>

              </div>

              {/* Informative Side Rules */}
              <div className="space-y-6">
                
                <div className="bg-brand-blue text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <h4 className="font-display font-bold text-slate-200 border-b border-slate-805 pb-2 text-xs uppercase tracking-wide">
                    Aturan Tanya Jawab
                  </h4>
                  <ul className="text-[11px] text-slate-300 space-y-2.5 list-none pl-0 font-sans">
                    <li className="flex gap-1.5"><strong className="text-brand-red font-bold">•</strong> Selalu cantumkan merek / vendor perangkat (Huawei, ZTE, Ericsson, EXFO).</li>
                    <li className="flex gap-1.5"><strong className="text-brand-red font-bold">•</strong> Larang keras mengunggah sandi root internal router (ikuti rahasia keamanan data perusahaan).</li>
                    <li className="flex gap-1.5"><strong className="text-brand-red font-bold">•</strong> Jika masalah selesai, Senior akan mencentang "Sahkan Solusi" sehingga peringkat kontributor Anda naik drastis.</li>
                  </ul>
                </div>

                <div className="bg-bold-red/5 border border-brand-red/10 text-brand-blue bg-brand-red/5 rounded-xl p-4 text-xs font-semibold">
                  <p className="font-bold flex items-center gap-1 mb-1.5 text-brand-red">
                    🚨 Tahukah Anda?
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Lebih dari 40% permasalahan lapangan diselesaikan rekan kerja di regional yang berbeda dalam waktu kurang dari 2 jam melalui forum tanya-jawab peer-to-peer digital semacam ini.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

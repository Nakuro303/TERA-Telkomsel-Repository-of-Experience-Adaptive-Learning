import React, { useState } from 'react';
import { Search, ThumbsUp, CheckSquare, MessageSquare, ShieldCheck, Filter, User, ArrowLeft, Send, Sparkles, MapPin, CheckCircle, Square } from 'lucide-react';
import { KnowledgeArticle, TechCategory, Comment } from '../types';

interface KnowledgeBaseProps {
  articles: KnowledgeArticle[];
  currentUser: {
    name: string;
    role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
    region: string;
    points: number;
  };
  onUpvoteArticle: (id: string) => void;
  onVerifyArticle: (id: string, verifierName: string) => void;
  onAddComment: (articleId: string, commentContent: string) => void;
  activeArticle: KnowledgeArticle | null;
  onSetActiveArticle: (article: KnowledgeArticle | null) => void;
}

export default function KnowledgeBase({
  articles,
  currentUser,
  onUpvoteArticle,
  onVerifyArticle,
  onAddComment,
  activeArticle,
  onSetActiveArticle
}: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const categories: string[] = [
    'Semua',
    '4G/5G Seluler',
    'Fiber Optic (FTTH/FTTx)',
    'Sistem Transmisi & Radio',
    'Power & Cooling BTS',
    'Core Network',
    'K3 & SOP Lapangan'
  ];

  const regions: string[] = [
    'Semua',
    'Jawa',
    'Sumatera',
    'Sulawesi',
    'Kalimantan',
    'Bali',
    'Papua'
  ];

  // Helper helper to filter
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    
    const matchesRegion = selectedRegion === 'Semua' || 
      article.authorRegion.toLowerCase().includes(selectedRegion.toLowerCase());

    const matchesVerified = !showOnlyVerified || article.isVerifiedBySenior;

    return matchesSearch && matchesCategory && matchesRegion && matchesVerified;
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeArticle) return;
    onAddComment(activeArticle.id, commentInput.trim());
    setCommentInput('');
  };

  const toggleStep = (stepIdx: number) => {
    if (!activeArticle) return;
    const key = `${activeArticle.id}-${stepIdx}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getCategoryColor = (cat: TechCategory) => {
    switch (cat) {
      case '4G/5G Seluler': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Fiber Optic (FTTH/FTTx)': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Sistem Transmisi & Radio': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Power & Cooling BTS': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Core Network': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div id="knowledge-base-view" className="space-y-6">
      
      {!activeArticle ? (
        // LIST VIEW
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-brand-blue">
                Pustaka Ilmu Teknisi Lapangan (Knowledge Base)
              </h2>
              <p className="text-xs text-slate-500">
                Lumbung modular untuk menyimpan trik rujukan, SOP darurat, dan solusi penanganan kerusakan jaringan.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-brand-blue flex items-center gap-2 cursor-pointer bg-brand-blue/5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-brand-blue/10 transition-colors">
                <input
                  type="checkbox"
                  checked={showOnlyVerified}
                  onChange={(e) => setShowOnlyVerified(e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Terverifikasi Senior</span>
              </label>
            </div>
          </div>

          {/* Search and Filters panel */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari kata kunci: ODP Huawei, Drop-call, Redaman optik, Genset, atau nama teknisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-bold font-mono">DIVISI:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-750 focus:outline-none focus:ring-1 focus:ring-brand-red font-bold"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-bold font-mono">WILAYAH TIM:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-750 focus:outline-none focus:ring-1 focus:ring-brand-red font-bold"
                >
                  {regions.map(reg => (
                    <option key={reg} value={reg}>{reg === 'Semua' ? 'Semua Regional' : `Regional ${reg}`}</option>
                  ))}
                </select>
              </div>

              {/* Clear filters trigger */}
              {(selectedCategory !== 'Semua' || selectedRegion !== 'Semua' || searchQuery || showOnlyVerified) && (
                <button
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSelectedRegion('Semua');
                    setSearchQuery('');
                    setShowOnlyVerified(false);
                  }}
                  className="text-brand-red hover:text-brand-hover-red hover:underline font-bold transition-all cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Articles grid */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-xs">
              <ShieldCheck className="w-12 h-12 text-slate-350 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold text-sm">Tidak menemukan kecocokan panduan teknis.</p>
              <p className="text-xs text-slate-400 mt-1">Coba kurangi saringan filter atau ganti kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  onClick={() => onSetActiveArticle(article)}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-brand-red/30 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      {article.isVerifiedBySenior && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verifikasi Ahli</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-base md:text-md group-hover:text-brand-red transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                        {article.content}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-red/10 text-brand-red font-bold flex items-center justify-center text-xs uppercase">
                        {article.author.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold block text-slate-800 leading-none">{article.author}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{article.authorRole} • {article.authorRegion}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 font-mono">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{article.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{article.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        // DETAIL VIEW
        <div className="space-y-6">
          <button
            onClick={() => onSetActiveArticle(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-red transition-colors bg-white hover:bg-slate-50 px-3 py-2 rounded-lg border border-slate-250 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Galeri Pustaka
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main content pane */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                
                {/* Header detail */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${getCategoryColor(activeArticle.category)}`}>
                      {activeArticle.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">Diterbitkan: {activeArticle.date}</span>
                  </div>

                  <h1 className="text-xl md:text-2.5xl font-display font-extrabold text-brand-blue leading-tight">
                    {activeArticle.title}
                  </h1>

                  {activeArticle.isVerifiedBySenior && (
                    <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg text-xs font-semibold">
                      <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-800">Materi Terverifikasi Ahli Jaringan Telkomsel</p>
                        <p className="text-slate-600 text-[11px]">Divalidasi oleh: {activeArticle.verifiedBy || 'Tim Standardisasi Coach Nasional'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Author Card */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-red to-rose-500 text-white font-extrabold flex items-center justify-center text-sm shadow-xs select-none">
                    {activeArticle.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">{activeArticle.author}</span>
                      <span className="bg-brand-red/10 text-brand-red text-[10px] font-bold font-mono px-1.5 py-0.2 rounded border border-brand-red/20">
                        {activeArticle.authorRole}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-red" /> {activeArticle.authorRegion}
                    </div>
                  </div>
                </div>

                {/* Main Text Content */}
                <div className="prose prose-sm max-w-none text-slate-705 leading-relaxed space-y-4 text-sm whitespace-pre-line border-b border-slate-100 pb-6 font-sans">
                  {activeArticle.content}
                </div>

                {/* Upvotes bar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpvoteArticle(activeArticle.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        activeArticle.likedBy?.includes(currentUser.name)
                          ? 'bg-brand-red/10 border-brand-red text-brand-red font-bold'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${activeArticle.likedBy?.includes(currentUser.name) ? 'fill-brand-red text-brand-red' : ''}`} />
                      <span>{activeArticle.likedBy?.includes(currentUser.name) ? 'Tersimpan (Disukai)' : 'Rekomendasikan Panduan Ini'}</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border text-slate-500 font-bold">{activeArticle.upvotes}</span>
                    </button>
                  </div>

                  {/* Verification action widget for seniors */}
                  {!activeArticle.isVerifiedBySenior && (currentUser.role === 'Senior Engineer' || currentUser.role === 'Team Lead') && (
                    <button
                      onClick={() => onVerifyArticle(activeArticle.id, `${currentUser.name} (${currentUser.role})`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sahkan Sebagai Panduan Valid</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 text-base">
                  <MessageSquare className="w-5 h-5 text-brand-red" /> Diskusi & Catatan Tambahan Teknisi ({activeArticle.comments.length})
                </h3>

                {activeArticle.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">Belum ada diskusi terbuka untuk panduan ini. Jadilah yang pertama berkomentar!</p>
                ) : (
                  <div className="space-y-4">
                    {activeArticle.comments.map((comment) => (
                      <div key={comment.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{comment.author}</span>
                            <span className="bg-slate-200/80 text-slate-650 px-1.5 py-0.5 rounded text-[10px] font-mono">
                              {comment.role} • {comment.region}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{comment.date}</span>
                        </div>
                        <p className="text-slate-600 text-xs md:text-sm pl-1 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Submission form */}
                <form onSubmit={handlePostComment} className="flex gap-2.5 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Tulis masukan, laporan kesuksesan, atau koreksi di posko Anda..."
                    className="flex-1 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red focus:bg-white"
                    required
                  />
                  <button
                    type="submit"
                    className="p-3 bg-brand-red text-white rounded-lg hover:bg-brand-hover-red transition-colors shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

            {/* Right Interactive Sidebar: Checklists and Tips */}
            <div className="space-y-6">

              {/* Troubleshooting Interactive Checklist - Premium dark blue corporate format */}
              <div className="bg-brand-blue text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
                <div>
                  <h3 className="font-display font-bold text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <CheckSquare className="w-4 h-4 text-brand-red" /> Checklist Langkah Lapangan
                  </h3>
                  <p className="text-[11px] text-slate-300">Centang instruksi perbaikan ini jika Anda sedang mensimulasikan bekerja di lokasi tower BTS.</p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {activeArticle.troubleshootingSteps.map((step, idx) => {
                    const isChecked = !!completedSteps[`${activeArticle.id}-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex gap-2.5 items-start select-none ${
                          isChecked 
                            ? 'bg-brand-red/15 border-brand-red/30 text-slate-300' 
                            : 'bg-brand-dark/50 border-slate-700/50 hover:bg-brand-dark text-white'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-slate-500 hover:border-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs leading-relaxed font-sans">{step}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar info */}
                <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-[11px] font-mono text-slate-400">
                  <span>Progres Simulasi Perbaikan</span>
                  <span className="text-brand-red font-bold">
                    {Object.keys(completedSteps).filter(k => k.startsWith(activeArticle.id) && completedSteps[k]).length} dari {activeArticle.troubleshootingSteps.length} Selesai
                  </span>
                </div>
              </div>

              {/* Quick Knowledge Warning */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-250 text-xs text-amber-900 space-y-2">
                <h4 className="font-bold text-amber-950 flex items-center gap-1">
                  ⚠️ Peringatan Regulasi Telkomsel:
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                  Semua instruksi di atas adalah rujukan teknis lapangan berdasarkan penemuan nyata pekerja. Utamakan keselamatan K3 Anda dan pastikan mematikan transmisi radio jika mendekati corong microwave active untuk mencegah penembakan radiasi gelombang mikro tinggi.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

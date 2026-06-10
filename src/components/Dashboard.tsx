import React, { useState } from 'react';
import { BookOpen, Users, HelpCircle, Award, CheckCircle, ShieldAlert, Sparkles, MapPin, ArrowRight, UserCheck } from 'lucide-react';
import { KnowledgeArticle, QAThread, TechCategory } from '../types';

interface DashboardProps {
  articles: KnowledgeArticle[];
  threads: QAThread[];
  currentUser: {
    name: string;
    role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
    region: string;
    points: number;
    completedQuizzes: string[];
  };
  onChangeUser: (newRole: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead', region: string, name: string) => void;
  onNavigateTo: (tab: string) => void;
  onSelectArticle: (article: KnowledgeArticle) => void;
}

export default function Dashboard({
  articles,
  threads,
  currentUser,
  onChangeUser,
  onNavigateTo,
  onSelectArticle
}: DashboardProps) {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string | null>(null);
  const [profileNameInput, setProfileNameInput] = useState(currentUser.name);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Stats calculation
  const totalArticles = articles.length;
  const activeTechniciansCount = 4281; // Hardcoded simulation representing active technicians nationwide
  const resolvedAnswers = threads.filter(t => t.isResolved).length;
  const unresolvedQuestions = threads.filter(t => !t.isResolved).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeUser(currentUser.role, currentUser.region, profileNameInput);
    setIsEditingProfile(false);
  };

  const regions = [
    { name: 'Sumatera', code: 'REG-1', color: 'bg-brand-red/[0.03] text-brand-red border-brand-red/10 hover:bg-brand-red/[0.08]', count: 824 },
    { name: 'Jawa-Jabotabek', code: 'REG-2', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100/60', count: 1420 },
    { name: 'Kalimantan', code: 'REG-3', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/60', count: 541 },
    { name: 'Sulawesi', code: 'REG-4', color: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100/60', count: 688 },
    { name: 'Bali-Nusra', code: 'REG-5', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/60', count: 322 },
    { name: 'Papua-Maluku', code: 'REG-6', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/60', count: 486 }
  ];

  // Latest 2 articles
  const latestArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);

  // Cat tags for color coding
  const getCategoryTheme = (category: TechCategory) => {
    switch (category) {
      case '4G/5G Seluler': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'Fiber Optic (FTTH/FTTx)': return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'Sistem Transmisi & Radio': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Power & Cooling BTS': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Core Network': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Welcome Banner - Premium Telkomsel Deep Blue & Red theme */}
      <div className="bg-gradient-to-br from-brand-blue via-brand-dark to-slate-950 text-white rounded-2xl p-6 shadow-md border border-brand-red/20 relative overflow-hidden">
        {/* Decorative glow circles */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-brand-red/10 blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-36 h-36 rounded-full bg-brand-red/5 blur-2xl"></div>

        <div className="relative z-10 md:flex md:items-center md:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-red text-white tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3 h-3 animate-pulse" /> E-Learning & Knowledge Management Telkomsel
            </div>
            <h1 className="text-2xl md:text-3.5xl font-display font-medium tracking-tight">
              Selamat Datang, <span className="text-red-400 font-bold">{currentUser.name}</span>!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Platform kolaborasi praktis untuk ribuan teknisi Telkomsel se-Indonesia. Disini Anda bisa mengambil modul belajar mandiri, melihat tips troubleshooting dari para ahli senior, atau meletakkan pengalaman lapangan Anda sendiri demi membantu rekan lain.
            </p>
          </div>

          <div className="mt-4 md:mt-0 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-4 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-brand-red/20 rounded text-brand-red">
                <Award className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono uppercase">Dashboard Anda</div>
                <div className="text-sm font-bold text-white">{currentUser.role}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center mt-3 pt-2 border-t border-white/10">
              <div>
                <div className="text-xs text-slate-400">Poin Belajar</div>
                <div className="text-lg font-bold text-amber-400 font-mono">{currentUser.points} XP</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Sertifikat Belajar</div>
                <div className="text-lg font-bold text-brand-red font-mono">{currentUser.completedQuizzes.length} Kuis</div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Modul Pengetahuan Bersama', value: totalArticles, icon: BookOpen, sub: 'Pemberitahuan & tips lapangan', color: 'text-brand-red bg-brand-red/5 border-brand-red/10' },
          { label: 'Teknisi Handal Terdaftar', value: activeTechniciansCount, icon: Users, sub: 'Tersebar Sabang-Merauke', color: 'text-brand-blue bg-brand-blue/5 border-brand-blue/10' },
          { label: 'Solusi Terkonfirmasi Forum', value: resolvedAnswers, icon: CheckCircle, sub: 'Terselesaikan oleh senior', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Belum Terjawab', value: unresolvedQuestions, icon: HelpCircle, sub: 'Butuh panduan teknis', color: 'text-amber-600 bg-amber-50 border-amber-105' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className={`p-3 rounded-xl ${item.color.split(' ')[1]} ${item.color.split(' ')[0]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <dt className="text-xs text-slate-500 font-bold leading-none mb-1.5">{item.label}</dt>
                <dd className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{item.value}</dd>
                <span className="text-[10px] text-slate-400 block mt-1">{item.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Quick Regions Map List and Daily Tips */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Indonesia Regions Grid */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-red animate-pulse" /> Sebaran Pengetahuan Teknisi Daerah
                </h3>
                <p className="text-xs text-slate-500">Klik wilayah untuk memfilter materi rujukan daerah bersangkutan</p>
              </div>
              <button
                onClick={() => {
                  setSelectedRegionFilter(null);
                  onNavigateTo('materi');
                }}
                className="text-xs font-bold text-brand-red hover:text-brand-hover-red bg-brand-red/5 hover:bg-brand-red/10 px-2.5 py-1.5 rounded transition-all cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            {/* Simple Visual Indonesia map simulation with text grids */}
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-3 sm:p-5 mb-4 text-center">
              <span className="text-[11px] font-mono text-slate-450 uppercase tracking-widest block mb-4">Peta Pembagian Wilayah Operasional Telkomsel</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {regions.map((region) => {
                  const regionArticles = articles.filter(a => a.authorRegion.toLowerCase().includes(region.name.toLowerCase()));
                  return (
                    <button
                      key={region.code}
                      onClick={() => {
                        setSelectedRegionFilter(region.name);
                        alert(`Membuka galeri ilmu berfilter: Regional ${region.name} (${regionArticles.length} modul aktif)`);
                        onNavigateTo('materi');
                      }}
                      className={`text-left p-3 rounded-lg border transition-all text-sm group ${region.color} hover:-translate-y-0.5 hover:shadow-xs cursor-pointer`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold block truncate pr-1 text-xs md:text-sm">{region.name}</span>
                        <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded shadow-xs border border-inherit shrink-0">{region.code}</span>
                      </div>
                      <div className="text-xs flex items-center justify-between text-slate-600 mt-2">
                        <span>{region.count} Teknisi</span>
                        <span className="font-bold font-mono text-slate-800">{regionArticles.length} Modul</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 text-xs text-red-950 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-brand-red mt-0.5 grow-0 shrink-0" />
              <div>
                <span className="font-bold">E-Learning Mandiri:</span> Setiap hari puluhan teknisi meletakkan catatan lapangan baru. Ini mempercepat penyelesaian isu jaringan tanpa perlu mendatangkan pelatih ahli ke daerah terpencil di Indonesia Timur atau pelosok Sumatera.
              </div>
            </div>
          </div>

          {/* Daily Technical Tips of the Day */}
          <div className="bg-brand-blue text-slate-100 rounded-xl p-5 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-brand-red/25 text-red-300 p-1 rounded">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold tracking-wide uppercase font-mono text-yellow-400">Rekomendasi Hari Ini: Penyelaras Splicing Serat Optik</h4>
            </div>
            <blockquote className="text-sm text-slate-200 border-l-2 border-brand-red pl-4 py-1 italic mb-3">
              "Teknisi junior sering mengeluhkan splice loss meleset di ujung sambungan meski setingan mesin fusion splicer sudah AUTO. Tips jitu: Bersihkan cermin lensa sirkuit V-Groove dengan cotton-bud alkohol 99%, dan lakukan ARC CALIBRATION ulang setiap kali ketinggian lokasi kerja berubah di atas 1000 mdpl (misalnya dari pantai naik ke area pegunungan)."
            </blockquote>
            <p className="text-xs text-slate-400 text-right font-mono">— Pak Hendra Wijaya, Jabar (Regional Coach)</p>
          </div>
          
        </div>

        {/* Right column: Recent Contributions and Action Guides */}
        <div className="space-y-6">
          
          {/* Quick Actions Card - Styled after hot discussions but dark blue accent */}
          <div className="bg-gradient-to-br from-brand-blue to-brand-dark text-white rounded-xl p-5 shadow-lg space-y-4 relative overflow-hidden border border-slate-700">
            <div>
              <p className="text-xs text-red-400 font-bold uppercase mb-1">Aksi Cepat Menu</p>
              <h3 className="font-display font-bold text-base">Portal Akses Cepat</h3>
              <p className="text-xs text-slate-300">Bantu sesama teknisi atau tingkatkan keahlian Anda hari ini.</p>
            </div>
            <div className="space-y-2 pt-1 z-10 relative">
              <button
                onClick={() => onNavigateTo('tulis')}
                className="w-full text-left bg-white text-brand-blue py-3 px-3.5 rounded-lg font-bold text-xs transition-transform hover:translate-x-1 flex items-center justify-between cursor-pointer"
              >
                <span>Tulis Modul Lapangan Baru</span>
                <ArrowRight className="w-4 h-4 text-brand-red" />
              </button>
              <button
                onClick={() => onNavigateTo('kuis')}
                className="w-full text-left bg-brand-red text-white hover:bg-brand-hover-red py-3 px-3.5 rounded-lg font-bold text-xs transition-transform hover:translate-x-1 flex items-center justify-between cursor-pointer"
              >
                <span>Buka Sertifikasi Kuis Mandiri</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTo('forum')}
                className="w-full text-left bg-brand-blue/60 text-slate-100 hover:bg-white/10 py-3 px-3.5 rounded-lg font-bold text-xs transition-transform hover:translate-x-1 flex items-center justify-between cursor-pointer border border-white/10"
              >
                <span>Tanya Jawab Kendala Lapangan</span>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>

          {/* Latest Shared Knowledge */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm uppercase tracking-wide">
              Materi Baru Diunggah
            </h3>
            
            <div className="space-y-3">
              {latestArticles.map(article => (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="group hover:bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:border-brand-red/30 cursor-pointer transition-all"
                >
                  <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-sm font-bold border mb-1.5 uppercase ${getCategoryTheme(article.category)}`}>
                    {article.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-brand-red transition-colors line-clamp-1 mb-1">
                    {article.title}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-550">
                    <span>{article.author}</span>
                    <span className="font-mono">{article.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTo('materi')}
              className="w-full text-center text-xs font-bold text-brand-red hover:text-brand-hover-red hover:underline pt-2 block cursor-pointer"
            >
              Lihat Seluruh Galeri Ilmu →
            </button>
          </div>

          {/* Tips for Senior Uploaders */}
          <div className="bg-amber-50/50 border border-amber-250 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <h5 className="font-bold text-amber-950 flex items-center gap-1">
              💡 Panduan Berbagi untuk Pekerja:
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li>Punya tips cara perbaikan cepat genset, fiber, atau transmisi yang tidak ada di buku manual resmi?</li>
              <li>Tuliskan dengan gaya penulisan santai dan mudah dimengerti adik-adik junior lapangan.</li>
              <li>Lampirkan poin-poin troubleshooting agar mudah dibaca cepat saat panjat tower.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}

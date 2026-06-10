import React, { useState } from 'react';
import { Award, Users, Trophy, Star, Filter, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { TechnicianLeaderboard } from '../types';

interface LeaderboardProps {
  leaderboard: TechnicianLeaderboard[];
  currentUser: {
    name: string;
    role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
    region: string;
    points: number;
  };
  articlesCountByAuthor: Record<string, number>;
  answersCountByAuthor: Record<string, number>;
}

export default function Leaderboard({
  leaderboard,
  currentUser,
  articlesCountByAuthor,
  answersCountByAuthor
}: LeaderboardProps) {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('Nasional');

  const regionsList = [
    'Nasional',
    'Jawa',
    'Sumatera',
    'Sulawesi',
    'Kalimantan',
    'Bali',
    'Papua'
  ];

  // We should merge the current simulated user's stats dynamically so that when the user does quizzes or contributes materials, they live update on the leaderboard! This is a legendary attention to detail!
  // Calculate current user's articles and answers
  const userArticlesCount = articlesCountByAuthor[currentUser.name] || 0;
  const userAnswersCount = answersCountByAuthor[currentUser.name] || 0;

  // Let's create a virtual technician object for current user
  const virtualCurrentUserRecord: TechnicianLeaderboard = {
    id: 't-current',
    name: `${currentUser.name} (Anda)`,
    region: currentUser.region.startsWith('Regional') ? currentUser.region : `Regional ${currentUser.region}`,
    role: currentUser.role,
    points: currentUser.points,
    sharesCount: userArticlesCount,
    answersCount: userAnswersCount,
    badges: currentUser.points > 1000 
      ? ['Senior Expert', 'Aktif Membantu'] 
      : currentUser.points > 400 
        ? ['Inovator Muda', 'Aktif Bertanya'] 
        : ['Calon Ahli']
  };

  // Merge leaderboard and ensure no duplicate names
  const baseLeaderboardList = leaderboard.filter(t => !t.name.includes(currentUser.name));
  const fullLeaderboardList = [virtualCurrentUserRecord, ...baseLeaderboardList];

  // Sort by points descending
  const sortedLeaderboard = [...fullLeaderboardList].sort((a, b) => b.points - a.points);

  // Filter based on region
  const filteredLeaderboard = sortedLeaderboard.filter(t => {
    if (selectedRegionFilter === 'Nasional') return true;
    return t.region.toLowerCase().includes(selectedRegionFilter.toLowerCase());
  });

  const getTrophyColor = (index: number) => {
    if (selectedRegionFilter !== 'Nasional') {
      switch (index) {
        case 0: return 'text-amber-500 fill-amber-300';
        default: return 'text-slate-400';
      }
    }
    switch (index) {
      case 0: return 'text-yellow-500 fill-yellow-200 w-6 h-6';
      case 1: return 'text-slate-400 fill-slate-100 w-5.5 h-5.5';
      case 2: return 'text-amber-600 fill-orange-100 w-5 h-5';
      default: return 'text-slate-400 w-4.5 h-4.5';
    }
  };

  return (
    <div id="leaderboard-view" className="space-y-6 font-sans">
      
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-brand-blue">
          Papan Juara Kontributor Pengetahuan (Leaderboard)
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          Mengapresiasi ribuan pahlawan sinyal daerah yang rajin meletakkan panduan taktis lapangan guna membina rekan-rekan se-Nusantara.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-205 shadow-3xs flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
          <Filter className="w-4 h-4 text-brand-red font-bold" /> Urutkan Berdasarkan Wilayah
        </span>

        <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          {regionsList.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegionFilter(r)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                selectedRegionFilter === r 
                  ? 'bg-brand-red text-white shadow-xs' 
                  : 'text-slate-500 hover:text-brand-blue hover:bg-slate-100'
              }`}
            >
              {r === 'Nasional' ? 'Nasional' : `Reg. ${r}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium if looking at Nasional filter */}
      {selectedRegionFilter === 'Nasional' && filteredLeaderboard.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
          
          {/* Rank 2 Podium */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 p-5 rounded-2xl border border-slate-200 text-center space-y-3 shadow-3xs sm:order-1 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold bg-slate-100 text-slate-750 px-2 py-0.5 rounded-full border border-slate-200 tracking-wider">Perak #2</span>
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-black flex items-center justify-center text-sm mx-auto shadow-sm mt-2 relative">
                {filteredLeaderboard[1].name.charAt(0)}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-[10px] font-bold text-white border border-white">2</div>
              </div>
              <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm pt-1.5 line-clamp-1">{filteredLeaderboard[1].name}</h4>
              <p className="text-[10px] text-slate-400 font-mono leading-none">{filteredLeaderboard[1].region}</p>
            </div>
            
            <div className="pt-2">
              <span className="text-sm font-black text-slate-800 font-mono tracking-tight">{filteredLeaderboard[1].points} XP</span>
              <span className="text-[10px] text-slate-400 block mt-1">{filteredLeaderboard[1].sharesCount} Bagian • {filteredLeaderboard[1].answersCount} Jawaban</span>
            </div>
          </div>

          {/* Rank 1 Podium - Center prominent */}
          <div className="bg-gradient-to-b from-amber-50/20 to-amber-50/5 p-6 rounded-2xl border-2 border-amber-300 text-center space-y-3 shadow-sm sm:order-2 relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-colors">
            <div className="absolute top-0 right-0 p-1.5 bg-amber-450 text-[8px] font-extrabold text-amber-950 font-mono tracking-widest rounded-bl select-none uppercase">Raja Guard</div>
            
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold bg-amber-100 text-amber-850 px-2.5 py-0.5 rounded-full border border-amber-250 tracking-wider">Emas #1</span>
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-805 font-black flex items-center justify-center text-lg mx-auto shadow-sm mt-2 relative">
                {filteredLeaderboard[0].name.charAt(0)}
                <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white">1</div>
              </div>
              <h4 className="font-display font-black text-amber-950 text-sm pt-1.5 line-clamp-1">{filteredLeaderboard[0].name}</h4>
              <p className="text-[10px] text-amber-800/80 font-mono leading-none">{filteredLeaderboard[0].region}</p>
            </div>

            <div className="pt-2">
              <span className="text-lg font-black text-amber-800 font-mono tracking-tight">{filteredLeaderboard[0].points} XP</span>
              <span className="text-[10px] text-slate-500 block mt-1">{filteredLeaderboard[0].sharesCount} Bagian • {filteredLeaderboard[0].answersCount} Jawaban</span>
            </div>
          </div>

          {/* Rank 3 Podium */}
          <div className="bg-gradient-to-b from-white to-orange-50/10 p-5 rounded-2xl border border-slate-200 text-center space-y-3 shadow-3xs sm:order-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold bg-orange-50 text-orange-755 px-2 py-0.5 rounded-full border border-orange-100 tracking-wider">Perunggu #3</span>
              <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 text-orange-850 font-black flex items-center justify-center text-sm mx-auto shadow-2xs mt-2 relative">
                {filteredLeaderboard[2].name.charAt(0)}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white border border-white">3</div>
              </div>
              <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm pt-1.5 line-clamp-1">{filteredLeaderboard[2].name}</h4>
              <p className="text-[10px] text-slate-400 font-mono leading-none">{filteredLeaderboard[2].region}</p>
            </div>

            <div className="pt-2">
              <span className="text-sm font-black text-slate-800 font-mono tracking-tight">{filteredLeaderboard[2].points} XP</span>
              <span className="text-[10px] text-slate-400 block mt-1">{filteredLeaderboard[2].sharesCount} Bagian • {filteredLeaderboard[2].answersCount} Jawaban</span>
            </div>
          </div>

        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden">
        
        {/* Table Headings */}
        <div className="grid grid-cols-12 gap-2 p-4 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider border-b border-slate-150">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-4 pl-2">Teknisi Lapangan</div>
          <div className="col-span-3">Unit Regional</div>
          <div className="col-span-3 md:col-span-2 text-center">Modul / Solusi</div>
          <div className="hidden md:block md:col-span-2 text-right pr-2">Kompetensi (XP)</div>
        </div>

        {/* Table Rows Output */}
        <div className="divide-y divide-slate-100">
          {filteredLeaderboard.map((tech, index) => {
            const isUser = tech.id === 't-current';
            return (
              <div
                key={tech.id}
                className={`grid grid-cols-12 gap-2 p-4 items-center text-xs duration-150 transition-all ${
                  isUser 
                    ? 'bg-brand-red/[0.04] text-slate-900 border-l-4 border-l-brand-red border-y border-red-200/20' 
                    : 'hover:bg-slate-50/50 text-slate-700'
                }`}
              >
                {/* Ranking number */}
                <div className="col-span-2 md:col-span-1 text-center font-bold font-mono text-slate-950 flex justify-center">
                  {index < 3 && selectedRegionFilter === 'Nasional' ? (
                    <Trophy className={getTrophyColor(index)} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Name / Avatar / Role */}
                <div className="col-span-4 flex items-center gap-3 pl-1">
                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                    isUser 
                      ? 'bg-brand-red text-white font-extrabold shadow-3xs' 
                      : 'bg-slate-150 text-slate-750 border border-slate-205'
                  }`}>
                    {tech.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <span className={`block truncate ${isUser ? 'font-bold text-brand-blue' : 'font-medium text-slate-900'}`}>{tech.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">{tech.role}</span>
                  </div>
                </div>

                {/* Regional department */}
                <div className="col-span-3 text-slate-500 font-mono text-[10px] flex items-center gap-1 truncate font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{tech.region}</span>
                </div>

                {/* Score contributions */}
                <div className="col-span-3 md:col-span-2 text-center font-mono text-slate-505 text-[10px]">
                  <span className="text-slate-800 font-bold block md:inline md:mr-1.5">{tech.sharesCount} Modul</span>
                  <span className="text-slate-400 block md:inline">{tech.answersCount} Solusi</span>
                </div>

                {/* XP Reps (mobile optimized layout) */}
                <div className="col-span-12 md:col-span-2 text-right md:pr-2 pt-2 md:pt-0 border-t border-slate-50 md:border-t-0 flex md:block justify-between items-center bg-slate-50/20 md:bg-transparent -mx-4 -mb-4 p-3 md:p-0">
                  <span className="text-[10px] md:hidden font-bold text-slate-400 tracking-wide uppercase">XP Kompetensi</span>
                  <div>
                    <span className={`font-mono font-bold text-sm ${isUser ? 'text-brand-red font-extrabold' : 'text-slate-900'}`}>
                      {tech.points}
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans block leading-none">XP Poin</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50/40 p-5 border border-amber-200 rounded-xl text-xs text-slate-700 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-slate-900 font-sans">Program Apresiasi Lapangan:</span> Telkomsel memberikan penghargaan merchandise berkala dan sertifikat apresiasi bagi teknisi berperingkat tinggi di regional masing-masing di akhir kuartal operasional. Letakkan ilmu Anda hari ini untuk naik tingkat!
        </div>
      </div>

    </div>
  );
}

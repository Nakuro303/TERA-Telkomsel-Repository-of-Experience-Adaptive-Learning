import React, { useState } from 'react';
import { Save, Plus, Trash2, BookOpen, AlertCircle, Sparkles, CheckSquare, ListPlus } from 'lucide-react';
import { KnowledgeArticle, TechCategory } from '../types';

interface UploadKnowledgeProps {
  currentUser: {
    name: string;
    role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead';
    region: string;
    points: number;
  };
  onAddNewArticle: (article: Omit<KnowledgeArticle, 'id' | 'date' | 'upvotes' | 'comments' | 'likedBy'>) => void;
  onNavigateTo: (tab: string) => void;
}

export default function UploadKnowledge({
  currentUser,
  onAddNewArticle,
  onNavigateTo
}: UploadKnowledgeProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TechCategory>('4G/5G Seluler');
  const [content, setContent] = useState('');
  
  // Custom troubleshooting steps list
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStepText, setCurrentStepText] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const categories: TechCategory[] = [
    '4G/5G Seluler',
    'Fiber Optic (FTTH/FTTx)',
    'Sistem Transmisi & Radio',
    'Power & Cooling BTS',
    'Core Network',
    'K3 & SOP Lapangan'
  ];

  const handleAddStep = () => {
    if (!currentStepText.trim()) return;
    setSteps(prev => [...prev, currentStepText.trim()]);
    setCurrentStepText('');
  };

  const handleRemoveStep = (indexToRemove: number) => {
    setSteps(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Mohon isi judul dan konten penjelasan taktis terlebih dahulu.');
      return;
    }

    // Prepare steps
    const finalizedSteps = steps.length > 0 ? steps : ['Periksa jalur konektivitas fisik perangkat kualitatif', 'Tindak lanjuti dengan tes visual laser OPM/voltmeter', 'Koordinasikan dengan unit helpdesk Regional'];

    onAddNewArticle({
      title: title.trim(),
      category: category,
      content: content.trim(),
      author: currentUser.name,
      authorRole: currentUser.role,
      authorRegion: currentUser.region,
      isVerifiedBySenior: currentUser.role === 'Senior Engineer' || currentUser.role === 'Team Lead',
      verifiedBy: currentUser.role === 'Senior Engineer' || currentUser.role === 'Team Lead' ? currentUser.name : undefined,
      troubleshootingSteps: finalizedSteps
    });

    // Provide a rewarding notification
    setNotification(`Berhasil membagikan ilmu Anda! Tim Anda mendapatkan peningkatan reputasi dan Anda memperoleh bonus +100 XP.`);
    
    // Clear form
    setTitle('');
    setContent('');
    setSteps([]);
    setCurrentStepText('');

    // Smooth redirect after timeout
    setTimeout(() => {
      setNotification(null);
      onNavigateTo('materi');
    }, 3500);
  };

  return (
    <div id="upload-knowledge-view" className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-brand-blue">
          Bagikan Pengetahuan Lapangan Baru (Letakkan Ilmu)
        </h2>
        <p className="text-xs text-slate-500">
          Apakah Anda baru saja menyelesaikan masalah rumit di tiang ODP atau genset shelter BTS? Sampaikan disini agar rekan teknisi di Kendari, Medan, atau Merauke tidak usah mencari rujukan dari nol!
        </p>
      </div>

      {notification && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 p-4 rounded-xl shadow-xs space-y-2 animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="font-bold">Sukses Menyimpan Panduan!</span>
          </div>
          <p className="text-xs text-slate-750">{notification}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Form Form */}
        <form onSubmit={handleFormSubmit} className="md:col-span-2 bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-blue uppercase block">Judul Solusi Lapangan Anda *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Mengatasi Alarm Redaman Tinggi ODP Huawei pigtail tertekuk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:bg-white transition-colors"
            />
            <span className="text-[10px] text-slate-400 block">Gunakan bahasa yang sederhana, langsung, dan sesuai kata pencarian di lokasi sengketa bts.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-blue uppercase block">Kategori Teknis / Divisi *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TechCategory)}
                className="w-full text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:bg-white text-slate-700 font-bold transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-blue uppercase block">Unit Pengunggah (Otomatis)</label>
              <div className="p-2.5 bg-brand-blue/5 border border-slate-200 rounded-lg text-xs font-mono text-brand-blue font-bold">
                {currentUser.name} ({currentUser.role})
                <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{currentUser.region}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-blue uppercase block">Konten Penjelasan Taktis *</label>
            <textarea
              required
              rows={8}
              placeholder="Tuliskan di sini dengan gaya mengajari:&#13;1. Kasus apa yang Anda temukan (misal: BTS padam tiba-tiba padahal aki masih penuh)&#13;2. Penyebab aslinya (misal: tikus menggigit kabel kontrol thermistor)&#13;3. Dan apa solusi cepat yang Anda terapkan di lapangan."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:bg-white font-sans leading-relaxed"
            />
          </div>

          {/* Interactive Steps Builder */}
          <div className="space-y-3 bg-brand-blue/5 p-4 rounded-xl border border-dashed border-brand-blue/20">
            <div>
              <h4 className="text-xs font-bold text-brand-blue uppercase flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-brand-blue" /> Bikin Langkah Cepat Troubleshooting (Opsional)
              </h4>
              <p className="text-[10px] text-slate-500">Buat instruksi praktis ringkas untuk dicentang oleh rekan-rekan baru saat di atas tower.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tulis langkah per-langkah (misal: Bersihkan ferrule, ukur OPM...)"
                value={currentStepText}
                onChange={(e) => setCurrentStepText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                className="flex-1 text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="bg-brand-blue text-white rounded px-3 py-1.5 text-xs font-bold hover:bg-brand-dark transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>

            {steps.length > 0 ? (
              <div className="space-y-1.5 pt-1.5">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200 shadow-3xs">
                    <span className="truncate pr-2 font-mono text-slate-700"><span className="text-brand-red font-bold font-sans">Langkah {idx+1}:</span> {step}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="text-brand-red hover:text-brand-hover-red hover:bg-brand-red/5 p-1 rounded shrink-0 duration-150 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">Belum ada langkah khusus ditambahkan. Jika dikosongkan, langkah standar otomatis akan digenerasikan sebagai rujukan dasar.</p>
            )}
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-red text-white py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-brand-hover-red transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Simpan dan Publikasikan Sekarang</span>
            </button>
          </div>

        </form>

        {/* Informative Helper on the right */}
        <div className="space-y-6">
          
          <div className="bg-brand-blue text-slate-100 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div>
              <h4 className="font-display font-bold text-sm uppercase text-brand-red">💡 Mengapa Ini Penting?</h4>
              <p className="text-xs text-slate-300 mt-1">E-Learning mandiri bertumpu penuh pada andil pekerja yang terjun langsung menghadapi masalah lapangan.</p>
            </div>

            <div className="text-xs space-y-3 text-slate-300 font-sans">
              <div className="flex gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-brand-red/20 text-brand-red font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">1</div>
                <p><strong>Efisiensi Masif:</strong> Ribuan teknisi tidak perlu menunggu pelatihan berbulan-bulan dari Jakarta untuk isu-isu taktis lokal.</p>
              </div>

              <div className="flex gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-brand-red/20 text-brand-red font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">2</div>
                <p><strong>Arsip Abadi:</strong> Saat senior pension, ilmunya yang berpuluh tahun tetap tersimpan aman di portal Knowledge Management ini.</p>
              </div>

              <div className="flex gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-brand-red/20 text-brand-red font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">3</div>
                <p><strong>Kenaikan Tingkat:</strong> Pengunggah materi bermanfaat mendapatkan poin XP yang tercatat di papan reputasi e-learning.</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-220 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Catatan Kredibilitas:</strong> Jika akun Anda disimulasikan sebagai <span className="font-bold text-amber-950">Junior Engineer</span>, materi Anda akan masuk dengan status "Draf Pembagi Lapangan" sampai divalidasi/disahkan oleh mentor senior.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Signal, 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Briefcase, 
  ArrowRight,
  UserCheck, 
  AlertCircle
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: {
    name: string;
    role: 'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead' | 'Admin Utama';
    region: string;
    points: number;
    email: string;
  }, targetPortal: 'teknisi' | 'admin') => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  // Navigation tabs for Login vs Registration
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Regional Jabotabek');
  const [role, setRole] = useState<'Junior Engineer' | 'Senior Engineer' | 'Spesialis Jaringan' | 'Team Lead'>('Junior Engineer');
  
  // Feedback states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const regions = [
    'Regional Sumatera',
    'Regional Jabotabek',
    'Regional Jawa Barat',
    'Regional Jawa Tengah',
    'Regional Jawa Timur',
    'Regional Bali Nusa Tenggara',
    'Regional Kalimantan',
    'Regional Sulawesi',
    'Regional Papua Maluku'
  ];

  const roles = [
    { value: 'Junior Engineer', label: 'Junior Engineer (FF)' },
    { value: 'Senior Engineer', label: 'Senior Engineer (SOP)' },
    { value: 'Spesialis Jaringan', label: 'Network Specialist' },
    { value: 'Team Lead', label: 'Team Leader' }
  ];

  const executeLogin = (loginEmail: string, loginPass: string) => {
    const cleanEmail = loginEmail.trim().toLowerCase();
    
    if (!cleanEmail || !loginPass) {
      setError('Silakan masukkan email dan kata sandi Anda.');
      return;
    }

    // 1. Admin Verification
    if (cleanEmail === 'admin@tera.com') {
      if (loginPass === 'admin' || loginPass === 'admin123') {
        onLoginSuccess({
          name: 'Super Administrator',
          role: 'Admin Utama',
          region: 'Kantor Pusat HQ',
          points: 9999,
          email: 'admin@tera.com'
        }, 'admin');
        return;
      } else {
        setError('Kata sandi administrator salah.');
        return;
      }
    }

    // 2. Technician Logins
    if (cleanEmail === 'sutan@tera.com') {
      onLoginSuccess({
        name: 'Sutan Mahesa',
        role: 'Junior Engineer',
        region: 'Regional Papua Maluku',
        points: 250,
        email: 'sutan@tera.com'
      }, 'teknisi');
      return;
    }

    // Checking if they made a custom account earlier and saved it
    const storedAccounts = localStorage.getItem('tera_registered_users_v1');
    if (storedAccounts) {
      try {
        const users = JSON.parse(storedAccounts);
        const match = users.find((u: any) => u.email.toLowerCase() === cleanEmail);
        if (match) {
          if (loginPass === match.password) {
            onLoginSuccess({
              name: match.name,
              role: match.role,
              region: match.region,
              points: match.points || 150,
              email: match.email
            }, 'teknisi');
            return;
          } else {
            setError('Kata sandi tidak sesuai.');
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default simulation for any other clean email to keep UX friendly
    onLoginSuccess({
      name: cleanEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role: 'Junior Engineer',
      region: 'Regional Jabotabek',
      points: 150,
      email: cleanEmail
    }, 'teknisi');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) {
      setError('Nama Lengkap tidak boleh kosong.');
      return;
    }
    if (!cleanEmail) {
      setError('Alamat email TERA tidak boleh kosong.');
      return;
    }
    if (cleanEmail === 'admin@tera.com' || cleanEmail === 'sutan@tera.com') {
      setError('Alamat email ini sudah terdaftar sebagai akun default.');
      return;
    }
    if (password.length < 4) {
      setError('Sandi rahasia minimal berukuran 4 karakter.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Structure new technician profile
      const newTech = {
        name: name.trim(),
        email: cleanEmail,
        password: password,
        role: role,
        region: region,
        points: 150, // Initial signup bonus XP
        completedQuizzes: [] as string[]
      };

      // Store globally for login verify in this session
      let existingUsers = [];
      const saved = localStorage.getItem('tera_registered_users_v1');
      if (saved) {
        try {
          existingUsers = JSON.parse(saved);
        } catch (e) {
          existingUsers = [];
        }
      }
      
      // Append if email not exist
      if (existingUsers.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
        setError('Alamat email ini sudah digunakan oleh teknisi lain.');
        setIsLoading(false);
        return;
      }

      existingUsers.push(newTech);
      localStorage.setItem('tera_registered_users_v1', JSON.stringify(existingUsers));

      // Append to local leaderboard simulation so they show up under training metrics
      const savedLeaderboard = localStorage.getItem('tinsel_km_leaderboard_v1');
      if (savedLeaderboard) {
        try {
          const lboard = JSON.parse(savedLeaderboard);
          lboard.push({
            id: `usr_${Date.now()}`,
            name: newTech.name,
            region: newTech.region,
            role: newTech.role,
            points: newTech.points,
            sharesCount: 0,
            answersCount: 0,
            badges: ['Pramuda Baru']
          });
          localStorage.setItem('tinsel_km_leaderboard_v1', JSON.stringify(lboard));
        } catch (e) {
          console.error(e);
        }
      }

      setIsLoading(false);
      // Log in automatically as standard field force
      onLoginSuccess({
        name: newTech.name,
        role: newTech.role as any,
        region: newTech.region,
        points: newTech.points,
        email: newTech.email
      }, 'teknisi');
    }, 800);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 select-none relative">
      {/* Background neon style highlights for futuristic, elegant Telkomsel theme */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-brand-red/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-red/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm z-10">
        {/* Sleek Brand Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-brand-red px-3.5 py-1 rounded-full font-black text-xs italic tracking-tight shadow-md text-white mb-2 animate-pulse">
            <Signal className="w-4 h-4 text-white animate-spin-slow" />
            <span>TERA SYSTEM</span>
          </div>
          <h2 className="text-sm font-bold text-slate-100 tracking-tight">
            Sistem Inkubasi Pengalaman & SOP
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">
            Sistem Evaluasi Mandiri SOP Lapangan TERA
          </p>
        </div>

        {/* Real Dynamic Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Crimson Red Top Border */}
          <div className="h-1 bg-gradient-to-r from-brand-red via-red-500 to-brand-red w-full"></div>

          {/* Tab Switcher - Highlight active style */}
          <div className="flex border-b border-slate-800 bg-slate-950/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-black transition-all tracking-wider uppercase border-b-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'border-brand-red text-slate-100 bg-slate-900/30'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              Masuk (Log In)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-black transition-all tracking-wider uppercase border-b-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-brand-red text-slate-100 bg-slate-900/30'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              Daftar (Sign Up)
            </button>
          </div>

          <div className="p-5.5 space-y-4">
            {error && (
              <div id="login-error-alert" className="bg-red-500/10 border border-red-500/30 text-red-200 p-2.5 rounded-xl text-xs flex items-start gap-2 animate-bounce-short">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium text-[10px]">{error}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                    Alamat Email TERA
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4.5 w-4.5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Masukkan email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4.5 w-4.5 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-red hover:bg-brand-hover-red text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-5 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Memproses Masuk...' : 'Masuk Dashboard'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                    Alamat Email TERA
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Masukkan email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Kata sandi minimal 4 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-0.5 animate-fade-in">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                    Wilayah Kerja
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-slate-500" />
                    </div>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="block w-full pl-9 pr-6 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-red appearance-none cursor-pointer"
                    >
                      {regions.map((reg) => (
                        <option key={reg} value={reg} className="bg-slate-900 text-xs">
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-red hover:bg-brand-hover-red text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg mt-3 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Mendaftarkan...' : 'Daftar & Masuk'}</span>
                  {!isLoading && <UserCheck className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

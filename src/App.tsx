import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Award, 
  Trophy, 
  PlusSquare, 
  LayoutDashboard, 
  Signal, 
  MapPin, 
  Menu, 
  X, 
  Sparkles,
  Info,
  Shield,
  BarChart3,
  FileText,
  Users,
  LogOut
} from 'lucide-react';
import { INITIAL_ARTICLES, INITIAL_QA_THREADS, INITIAL_QUIZ_MODULES, INITIAL_LEADERBOARD } from './data/mockData';
import { KnowledgeArticle, QAThread, TechCategory, Comment, QAAnswer, QuizModule, TechnicianLeaderboard } from './types';

// Importing our modular subcomponents
import Dashboard from './components/Dashboard';
import KnowledgeBase from './components/KnowledgeBase';
import UploadKnowledge from './components/UploadKnowledge';
import ForumQA from './components/ForumQA';
import TrainingQuizzes from './components/TrainingQuizzes';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('tera_is_logged_in_v1') === 'true';
  });
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeArticleForDetail, setActiveArticleForDetail] = useState<KnowledgeArticle | null>(null);

  // Portal Management: Separate pages/portals for Technician vs Admin Mode
  const [activePortal, setActivePortal] = useState<'teknisi' | 'admin'>(() => {
    const saved = localStorage.getItem('tera_active_portal_v1');
    return saved === 'admin' ? 'admin' : 'teknisi';
  });

  // State to manage the active admin tab selection
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'articles' | 'forum' | 'quizzes' | 'technicians'>('analytics');

  // Mobil navbar toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States with Local Persistency
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => {
    const saved = localStorage.getItem('tinsel_km_articles_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse articles from localStorage', e);
      }
    }
    return INITIAL_ARTICLES;
  });

  const [threads, setThreads] = useState<QAThread[]>(() => {
    const saved = localStorage.getItem('tinsel_km_threads_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse threads from localStorage', e);
      }
    }
    return INITIAL_QA_THREADS;
  });

  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tinsel_km_completed_quizzes_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse completed quizzes', e);
      }
    }
    return [];
  });

  const [quizzes, setQuizzes] = useState<QuizModule[]>(() => {
    const saved = localStorage.getItem('tinsel_km_quizzes_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse quizzes', e);
      }
    }
    return INITIAL_QUIZ_MODULES;
  });

  const [leaderboard, setLeaderboard] = useState<TechnicianLeaderboard[]>(() => {
    const saved = localStorage.getItem('tinsel_km_leaderboard_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse leaderboard', e);
      }
    }
    return INITIAL_LEADERBOARD;
  });

  // Current simulated persona
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tinsel_km_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: 'Sutan Mahesa',
      role: 'Junior Engineer' as const,
      region: 'Regional Papua Maluku',
      points: 250,
      completedQuizzes: [] as string[]
    };
  });

  // Automatically sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('tinsel_km_articles_v1', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('tinsel_km_threads_v1', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('tinsel_km_completed_quizzes_v1', JSON.stringify(completedQuizIds));
  }, [completedQuizIds]);

  useEffect(() => {
    localStorage.setItem('tinsel_km_quizzes_v1', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('tinsel_km_leaderboard_v1', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('tinsel_km_user_v1', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tera_active_portal_v1', activePortal);
  }, [activePortal]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('tera_is_logged_in_v1');
    localStorage.removeItem('tinsel_km_user_v1');
    setActivePortal('teknisi');
    setCurrentTab('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={(user, targetPortal) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          localStorage.setItem('tera_is_logged_in_v1', 'true');
          setActivePortal(targetPortal);
          if (targetPortal === 'admin') {
            setActiveAdminTab('analytics');
          } else {
            setCurrentTab('dashboard');
          }
        }}
      />
    );
  }

  // Handle active article selection across subcomponents
  const handleSelectArticleDetail = (article: KnowledgeArticle) => {
    setActiveArticleForDetail(article);
    setCurrentTab('materi');
  };

  // Helper counters to feed Leaderboard live data
  const articlesCountByAuthor = articles.reduce((acc, current) => {
    acc[current.author] = (acc[current.author] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const answersCountByAuthor = threads.reduce((acc, thread) => {
    thread.answers.forEach(ans => {
      acc[ans.author] = (acc[ans.author] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // ACTIONS HANDLERS

  // User details switcher
  const handleChangeUserSimulate = (newRole: typeof currentUser.role, region: string, name: string) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
      region: region,
      name: name
    }));
  };

  // 1. Upvote Article
  const handleUpvoteArticle = (articleId: string) => {
    setArticles(prevArticles => 
      prevArticles.map(art => {
        if (art.id !== articleId) return art;

        const hasLiked = art.likedBy?.includes(currentUser.name);
        let updatedLikedBy = art.likedBy ? [...art.likedBy] : [];
        let updatedUpvotes = art.upvotes;

        if (hasLiked) {
          // Unlike
          updatedLikedBy = updatedLikedBy.filter(item => item !== currentUser.name);
          updatedUpvotes = Math.max(0, updatedUpvotes - 1);
        } else {
          // Like
          updatedLikedBy.push(currentUser.name);
          updatedUpvotes += 1;
        }

        const updatedArticle = {
          ...art,
          upvotes: updatedUpvotes,
          likedBy: updatedLikedBy
        };

        // If the active detail article is this one, update it too
        if (activeArticleForDetail && activeArticleForDetail.id === articleId) {
          setActiveArticleForDetail(updatedArticle);
        }

        return updatedArticle;
      })
    );
  };

  // 2. Validate/Verify Article (Privileged)
  const handleVerifyArticle = (articleId: string, verifierName: string) => {
    setArticles(prevArticles => 
      prevArticles.map(art => {
        if (art.id !== articleId) return art;

        const updatedArticle = {
          ...art,
          isVerifiedBySenior: true,
          verifiedBy: verifierName
        };

        if (activeArticleForDetail && activeArticleForDetail.id === articleId) {
          setActiveArticleForDetail(updatedArticle);
        }

        return updatedArticle;
      })
    );
  };

  // 3. Comment on Article
  const handleAddComment = (articleId: string, commentContent: string) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      region: currentUser.region,
      content: commentContent,
      date: new Date().toISOString().split('T')[0]
    };

    setArticles(prevArticles => 
      prevArticles.map(art => {
        if (art.id !== articleId) return art;

        const updatedArticle = {
          ...art,
          comments: [...art.comments, newComment]
        };

        if (activeArticleForDetail && activeArticleForDetail.id === articleId) {
          setActiveArticleForDetail(updatedArticle);
        }

        return updatedArticle;
      })
    );

    // Give some contribution points
    setCurrentUser(prevUser => ({
      ...prevUser,
      points: prevUser.points + 10
    }));
  };

  // 4. Create New Article
  const handleAddNewArticle = (newArticleData: Omit<KnowledgeArticle, 'id' | 'date' | 'upvotes' | 'comments' | 'likedBy'>) => {
    const freshArticle: KnowledgeArticle = {
      ...newArticleData,
      id: `art-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      upvotes: 1,
      likedBy: [currentUser.name],
      comments: []
    };

    setArticles(prev => [freshArticle, ...prev]);

    // Reward points
    setCurrentUser(prevUser => ({
      ...prevUser,
      points: prevUser.points + 100 // Large points for sharing
    }));
  };

  // 5. Ask Question in Forum
  const handleAddNewThread = (newThreadData: Omit<QAThread, 'id' | 'date' | 'isResolved' | 'answers'>) => {
    const freshThread: QAThread = {
      ...newThreadData,
      id: `qa-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isResolved: false,
      answers: []
    };

    setThreads(prev => [freshThread, ...prev]);

    // Ask point reward
    setCurrentUser(prevUser => ({
      ...prevUser,
      points: prevUser.points + 20
    }));
  };

  // 6. Answer Question in Forum
  const handleAddAnswer = (threadId: string, answerContent: string) => {
    const freshAnswer: QAAnswer = {
      id: `ans-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      region: currentUser.region,
      content: answerContent,
      isVerifiedAnswer: false,
      upvotes: 0,
      likedBy: [],
      date: new Date().toISOString().split('T')[0]
    };

    setThreads(prevThreads => 
      prevThreads.map(t => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          answers: [...t.answers, freshAnswer]
        };
      })
    );

    // Reward active feedback points
    setCurrentUser(prevUser => ({
      ...prevUser,
      points: prevUser.points + 30
    }));
  };

  // 7. Verify Answer in Forum
  const handleVerifyAnswer = (threadId: string, answerId: string) => {
    setThreads(prevThreads => 
      prevThreads.map(t => {
        if (t.id !== threadId) return t;

        const updatedAnswers = t.answers.map(ans => {
          if (ans.id !== answerId) return ans;
          return {
            ...ans,
            isVerifiedAnswer: true
          };
        });

        return {
          ...t,
          isResolved: true,
          answers: updatedAnswers
        };
      })
    );

    // Reward verifier
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + 15
    }));
  };

  // 8. Upvote Answer in Forum
  const handleUpvoteAnswer = (threadId: string, answerId: string) => {
    setThreads(prevThreads => 
      prevThreads.map(t => {
        if (t.id !== threadId) return t;

        const updatedAnswers = t.answers.map(ans => {
          if (ans.id !== answerId) return ans;

          const hasLiked = ans.likedBy?.includes(currentUser.name);
          let updatedLikedBy = ans.likedBy ? [...ans.likedBy] : [];
          let updatedUpvotes = ans.upvotes;

          if (hasLiked) {
            updatedLikedBy = updatedLikedBy.filter(item => item !== currentUser.name);
            updatedUpvotes = Math.max(0, updatedUpvotes - 1);
          } else {
            updatedLikedBy.push(currentUser.name);
            updatedUpvotes += 1;
          }

          return {
            ...ans,
            upvotes: updatedUpvotes,
            likedBy: updatedLikedBy
          };
        });

        return {
          ...t,
          answers: updatedAnswers
        };
      })
    );
  };

  // 9. Complete Quiz Module
  const handleCompleteQuiz = (quizId: string, earnedXp: number) => {
    if (!completedQuizIds.includes(quizId)) {
      setCompletedQuizIds(prev => [...prev, quizId]);
    }
    
    // Earn XP reward
    setCurrentUser(prevUser => {
      const updatedQuizList = prevUser.completedQuizzes?.includes(quizId)
        ? prevUser.completedQuizzes
        : [...(prevUser.completedQuizzes || []), quizId];

      return {
        ...prevUser,
        points: prevUser.points + earnedXp,
        completedQuizzes: updatedQuizList
      };
    });
  };

  // Switch menus
  const handleTabNavigation = (tabKey: string) => {
    setCurrentTab(tabKey);
    setIsMobileMenuOpen(false);
    if (tabKey !== 'materi') {
      setActiveArticleForDetail(null);
    }
  };

  // Sidebar Menu elements depending on selected portal
  const sidebarMenuItems = activePortal === 'teknisi'
    ? [
        { key: 'dashboard', label: 'Monitor Dashboard', icon: LayoutDashboard },
        { key: 'materi', label: 'Pustaka Ilmu (E-Book)', icon: BookOpen },
        { key: 'tulis', label: 'Letakkan Ilmu Baru', icon: PlusSquare },
        { key: 'forum', label: 'Forum Tanya Jawab', icon: HelpCircle },
        { key: 'kuis', label: 'Kuis & Sertifikasi', icon: Award },
        { key: 'leaderboard', label: 'Papan Juara Daerah', icon: Trophy }
      ]
    : [
        { key: 'analytics', label: 'Ringkasan & KPI', icon: BarChart3 },
        { key: 'articles', label: 'Verifikasi & Pustaka Ilmu', icon: FileText },
        { key: 'forum', label: 'Moderasi Forum Q&A', icon: HelpCircle },
        { key: 'quizzes', label: 'Buat & Kelola Kuis', icon: PlusSquare },
        { key: 'technicians', label: 'Direktori Partner & XP', icon: Users }
      ];

  const handleMenuItemClick = (itemKey: string) => {
    if (activePortal === 'teknisi') {
      handleTabNavigation(itemKey);
    } else {
      setActiveAdminTab(itemKey as any);
      setIsMobileMenuOpen(false);
    }
  };

  const isItemActive = (itemKey: string) => {
    return activePortal === 'teknisi' 
      ? currentTab === itemKey 
      : activeAdminTab === itemKey;
  };

  return (
    <div id="full-app-container" className="min-h-screen bg-brand-light flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-red selection:text-white">
      
      {/* Visual top accent bar (Telkomsel Red and White banner style) */}
      <div className="h-1 bg-gradient-to-r from-brand-red via-[#ff434a] to-brand-hover-red w-full"></div>

      {/* Corporate Global Header header with Telkomsel High-Contrast Branding */}
      <header className="sticky top-0 z-40 bg-brand-blue text-white px-4 md:px-8 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Menu button for mobile view */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded hover:bg-white/10 text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>

          {/* Telkomsel Theme Brand Logotype */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-red px-3 py-1 rounded font-black text-lg italic tracking-tighter flex items-center gap-1.5 shadow-sm text-white select-none">
              <Signal className="w-4 h-4 animate-pulse text-white" />
              <span>TERA</span>
            </div>
            <div className="h-8 w-px bg-slate-600 hidden md:block mx-1"></div>
            <div>
              <h1 className="text-xs md:text-sm font-bold leading-tight leading-none tracking-wider text-white uppercase flex items-center gap-1.5">
                <span>TERA</span>
                <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-mono font-bold leading-none ${
                  activePortal === 'admin' ? 'bg-[#ffcc00] text-slate-900 border border-yellow-400' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {activePortal === 'admin' ? 'HQ Admin' : 'Field Force'}
                </span>
              </h1>
              <span className="text-[9px] md:text-[10px] text-slate-300 block leading-none font-medium mt-0.5">Telkomsel Repository of Experience & Adaptive Learning</span>
            </div>
          </div>
        </div>

        {/* Global profile and logout bar */}
        <div className="flex items-center gap-3 md:gap-4 font-sans select-none">

          {/* User Meta (only block on medium/large) */}
          <div className="hidden lg:block text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-bold text-white leading-none">
                {activePortal === 'admin' ? 'Super Administrator' : currentUser.name}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${activePortal === 'admin' ? 'bg-amber-400 animate-ping' : 'bg-brand-red'}`}></span>
            </div>
            <span className="text-[10px] text-slate-300 block leading-none mt-1 font-mono">
              {activePortal === 'admin' ? 'Level: Admin Utama' : `${currentUser.role} • ${currentUser.region}`}
            </span>
          </div>

          {/* XP point counter action - Only shown inside technician portal */}
          {activePortal !== 'admin' && (
            <div 
              onClick={() => {
                handleTabNavigation('leaderboard');
              }}
              className="bg-brand-blue/60 hover:bg-white/10 border border-white/20 cursor-pointer rounded-lg px-2 md:px-2.5 py-1.5 flex items-center gap-1 duration-150 transition-colors shrink-0"
              title="Klik untuk melihat papan kompetensi poin"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold font-mono text-white">{currentUser.points} XP</span>
            </div>
          )}

          {/* Logout button in header for fast connections */}
          <button
            onClick={handleLogout}
            className="p-1.5 md:p-2 bg-slate-900/40 hover:bg-red-500/10 hover:text-red-400 text-slate-300 rounded-lg border border-slate-800 hover:border-red-500/20 transition-all cursor-pointer flex items-center gap-1 shrink-0 font-sans"
            title="Keluar dari Sesi TERA"
            id="header-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5 text-brand-red" />
            <span className="hidden sm:inline text-[10px] text-slate-200 font-bold">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main viewport pane with Sidebar on large screens */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Dynamic Mobile Sliding Menu bar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-brand-blue/70 transition-opacity backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full flex flex-col p-4 shadow-xl border-r border-slate-200" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                <span className="font-sans font-extrabold text-xs uppercase tracking-wider text-brand-blue">
                  {activePortal === 'admin' ? 'Navigasi Portal Admin' : 'Navigasi Portal Teknisi'}
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded hover:bg-slate-100 text-slate-600"><X className="w-4.5 h-4.5" /></button>
              </div>

              <div className="space-y-1.5 flex-1">
                {sidebarMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleMenuItemClick(item.key)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        active
                          ? 'bg-brand-red/10 text-brand-red font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-brand-blue'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Sidebar Region Info */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-[10px] text-slate-500 font-mono space-y-1 pl-1">
                  <div className="flex items-center gap-1 text-slate-700"><MapPin className="w-3.5 h-3.5 text-brand-red" /> {currentUser.region}</div>
                  <div>Status: Online Aktif (Terproteksi SSL)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4 space-y-5 shrink-0 shadow-3xs">
          
          {/* Profile Card based on context */}
          {activePortal === 'admin' ? (
            <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">ADMINISTRASI HQ</h5>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-100 block leading-tight truncate">Administrator Utama</span>
                <span className="text-[10px] text-brand-red block leading-none font-bold uppercase tracking-wider font-mono">Level Hak Akses: Super</span>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono pt-1">
                  <Shield className="w-3.5 h-3.5 text-brand-red shrink-0" /> <span>Seluruh Indonesia</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-light border border-slate-200 rounded-xl p-3.5 space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">Profil Pekerja Anda</h5>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-brand-blue block leading-tight truncate">{currentUser.name}</span>
                <span className="text-[10px] text-brand-red block leading-none font-semibold uppercase tracking-wider">{currentUser.role}</span>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono pt-1">
                  <MapPin className="w-3 h-3 text-brand-red shrink-0" /> <span className="truncate">{currentUser.region}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation link choices */}
          <div className="space-y-1.5 flex-1">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 font-mono">
              {activePortal === 'admin' ? 'OPERASIONAL ADMIN' : 'MENU BELAJAR TEKNISI'}
            </div>
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.key);
              return (
                <button
                  key={item.key}
                  onClick={() => handleMenuItemClick(item.key)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-150 cursor-pointer ${
                    active
                      ? activePortal === 'admin'
                        ? 'bg-slate-900 border-l-4 border-yellow-500 text-amber-400 shadow-md pl-3'
                        : 'bg-brand-red text-white shadow-md'
                      : 'text-slate-650 hover:bg-slate-100 hover:text-brand-blue'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sticky info panel */}
          <div className="bg-brand-light p-3.5 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-500 leading-relaxed font-sans">
            <h6 className="font-bold text-brand-blue uppercase text-[10px] flex items-center gap-1 font-mono">
              <Info className="w-3.5 h-3.5 text-brand-red" /> 
              {activePortal === 'admin' ? 'HQ Audit Guard' : 'Portal Mandiri'}
            </h6>
            <p className="text-[10px] text-slate-500">
              {activePortal === 'admin' 
                ? 'Layar pantau pemeringkatan, sertifikasi, verifikasi serta validasi dokumen rujukan SOP lapangan Telkomsel.'
                : 'Saluran inkubasi ilmu kompetensi mandiri. Bagikan tips lapangan, selesaikan sertifikasi, & bantu penanganan gangguan regional.'
              }
            </p>
          </div>
        </aside>

        {/* Content Pane Output */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-60px)] bg-[#fbfbfd]">
          {activePortal === 'admin' ? (
            <AdminPanel
              articles={articles}
              setArticles={setArticles}
              threads={threads}
              setThreads={setThreads}
              quizzes={quizzes}
              setQuizzes={setQuizzes}
              leaderboard={leaderboard}
              setLeaderboard={setLeaderboard}
              currentUser={currentUser}
              activeAdminTab={activeAdminTab}
              setActiveAdminTab={setActiveAdminTab}
            />
          ) : (
            (() => {
              switch (currentTab) {
                case 'dashboard':
                  return (
                    <Dashboard
                      articles={articles}
                      threads={threads}
                      currentUser={{
                        ...currentUser,
                        completedQuizzes: completedQuizIds
                      }}
                      onChangeUser={handleChangeUserSimulate}
                      onNavigateTo={handleTabNavigation}
                      onSelectArticle={handleSelectArticleDetail}
                    />
                  );
                case 'materi':
                  return (
                    <KnowledgeBase
                      articles={articles}
                      currentUser={currentUser}
                      onUpvoteArticle={handleUpvoteArticle}
                      onVerifyArticle={handleVerifyArticle}
                      onAddComment={handleAddComment}
                      activeArticle={activeArticleForDetail}
                      onSetActiveArticle={setActiveArticleForDetail}
                    />
                  );
                case 'tulis':
                  return (
                    <UploadKnowledge
                      currentUser={currentUser}
                      onAddNewArticle={handleAddNewArticle}
                      onNavigateTo={handleTabNavigation}
                    />
                  );
                case 'forum':
                  return (
                    <ForumQA
                      threads={threads}
                      currentUser={currentUser}
                      onAddNewThread={handleAddNewThread}
                      onAddAnswer={handleAddAnswer}
                      onVerifyAnswer={handleVerifyAnswer}
                      onUpvoteAnswer={handleUpvoteAnswer}
                    />
                  );
                case 'kuis':
                  return (
                    <TrainingQuizzes
                      quizzes={quizzes}
                      completedQuizIds={completedQuizIds}
                      onCompleteQuiz={handleCompleteQuiz}
                    />
                  );
                case 'leaderboard':
                  return (
                    <Leaderboard
                      leaderboard={leaderboard}
                      currentUser={currentUser}
                      articlesCountByAuthor={articlesCountByAuthor}
                      answersCountByAuthor={answersCountByAuthor}
                    />
                  );
                default:
                  return (
                    <div className="text-center py-12">
                      <p className="text-sm text-slate-500">Divisi menu dalam perbaikan.</p>
                    </div>
                  );
              }
            })()
          )}
        </main>

      </div>

      {/* Global Footer info bar */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 md:px-8 text-center text-[10px] text-slate-500 font-mono flex flex-col md:flex-row justify-between items-center gap-1">
        <span className="text-slate-400">© 2026 PT Telekomunikasi Selular Tbk (Telkomsel) — Divisi Indonesia Timur & Barat Joint Operation</span>
        <div className="flex gap-4 text-slate-405">
          <span>Skema E-Learning & KM</span>
          <span>Akses Internal Teknisi</span>
        </div>
      </footer>

    </div>
  );
}

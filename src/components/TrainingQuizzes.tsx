import React, { useState } from 'react';
import { Award, BookOpen, Clock, CheckCircle2, ChevronRight, XCircle, ArrowLeft, RotateCcw, AlertTriangle, PlayCircle } from 'lucide-react';
import { QuizModule, QuizQuestion, TechCategory } from '../types';

interface TrainingQuizzesProps {
  quizzes: QuizModule[];
  completedQuizIds: string[];
  onCompleteQuiz: (quizId: string, earnedXp: number) => void;
}

export default function TrainingQuizzes({
  quizzes,
  completedQuizIds,
  onCompleteQuiz
}: TrainingQuizzesProps) {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const startQuiz = (id: string) => {
    setActiveQuizId(id);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(idx);
  };

  const activeQuiz = quizzes.find(q => q.id === activeQuizId);
  const currentQuestion: QuizQuestion | undefined = activeQuiz?.questions[currentQuestionIndex];

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || !currentQuestion) return;
    
    const isCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    
    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      // Quiz finished!
      setIsQuizCompleted(true);
      // Determine if at least 50% correct to award full XP
      const passRatio = score / activeQuiz.questions.length;
      if (passRatio >= 0.5) {
        onCompleteQuiz(activeQuiz.id, activeQuiz.xpReward);
      }
    }
  };

  const getDifficultyBadge = (diff: QuizModule['difficulty']) => {
    switch (diff) {
      case 'Muda (Junior)': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Madya (Intermediate)': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Utama (Senior)': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="training-quizzes-view" className="space-y-6">
      
      {!activeQuizId ? (
        // QUIZ DIRECTORY LISTING
        <div className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-brand-blue">
              Modul Pelatihan Mandiri & Sertifikasi Digital
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Standar keahlian digital nasional. Selesaikan kuis berbobot di bawah ini untuk menguji kepatuhan Anda pada SOP Telkomsel yang mutakhir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz) => {
              const isCertified = completedQuizIds.includes(quiz.id);
              return (
                <div
                  key={quiz.id}
                  className={`bg-white rounded-xl p-5 border transition-all flex flex-col justify-between ${
                    isCertified 
                      ? 'border-emerald-350 ring-2 ring-emerald-50 bg-emerald-50/5' 
                      : 'border-slate-205 hover:border-brand-red/35 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] uppercase font-extrabold tracking-wide px-2 py-0.5 rounded border ${getDifficultyBadge(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                      {isCertified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lulus
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-slate-950 text-sm md:text-base line-clamp-1">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed font-sans">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {quiz.estimatedMinutes} Menit</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {quiz.questions.length} Soal</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-mono">Penghargaan Lulus</span>
                      <span className="text-xs font-extrabold text-amber-600 font-mono">+{quiz.xpReward} XP Reputasi</span>
                    </div>

                    <button
                      onClick={() => startQuiz(quiz.id)}
                      className={`text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                        isCertified
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-brand-red text-white hover:bg-brand-hover-red shadow-xs'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isCertified ? 'Kuis Ulang' : 'Mulai Belajar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-brand-blue text-slate-300 p-5 rounded-2xl border border-brand-blue/15 flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1">
                <span className="text-brand-red">●</span> Kriteria Pelatihan Elektronik Mandiri
              </h4>
              <p className="text-xs text-slate-305 leading-relaxed font-sans">Teknisi di pelosok daerah yang lulus kuis berhak mendapatkan sertifikat digital serta peningkatan reputasi poin kontribusi yang terpantau tim pusat.</p>
            </div>
            <div className="flex gap-2 shrink-0 font-sans">
              <span className="bg-white/10 text-white border border-white/15 px-3 py-1.5 rounded-lg text-xs font-bold">Min: 50% Benar</span>
              <span className="bg-brand-red text-white px-3 py-1.5 rounded-lg text-xs font-bold">Ujian Mandiri</span>
            </div>
          </div>

        </div>
      ) : (
        // ACTIVE QUIZ RUNNER
        <div className="max-w-2xl mx-auto">
          
          {activeQuiz && currentQuestion && (
            <div className="space-y-6">
              
              {/* Quiz Header */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between shadow-3xs">
                <div>
                  <button
                    onClick={() => setActiveQuizId(null)}
                    className="text-xs font-semibold text-slate-505 hover:text-brand-red flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Keluar Kuis
                  </button>
                  <h3 className="font-display font-bold text-brand-blue text-xs mt-1.5 truncate max-w-sm">
                    {activeQuiz.title}
                  </h3>
                </div>

                <div className="text-right text-xs font-mono text-slate-500">
                  Pertanyaan {currentQuestionIndex + 1} dari {activeQuiz.questions.length}
                </div>
              </div>

              {!isQuizCompleted ? (
                // ACTIVE QUESTION VIEW
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                  
                  {/* Question Box */}
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded bg-brand-red/10 text-brand-red font-mono font-bold text-[10px] tracking-widest uppercase">
                      Soal {currentQuestionIndex + 1}
                    </span>
                    <h2 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      let optionBg = 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300';
                      
                      if (isSelected) {
                        optionBg = 'bg-brand-red/5 border-brand-red/40 text-brand-blue ring-2 ring-brand-red/10 font-bold';
                      }

                      if (isAnswered) {
                        const isCorrectOption = idx === currentQuestion.correctOptionIndex;
                        if (isCorrectOption) {
                          optionBg = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-100';
                        } else if (isSelected) {
                          optionBg = 'bg-brand-red/5 border-brand-red/40 text-brand-red font-medium line-through';
                        } else {
                          optionBg = 'opacity-60 bg-slate-50 border-slate-100';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-slate-800 text-xs md:text-sm duration-150 flex items-start gap-3 justify-between cursor-pointer ${optionBg}`}
                        >
                          <span className="flex-1 font-sans">{option}</span>
                          <span className="text-[11px] font-mono font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded shadow-3xs">
                            {['A', 'B', 'C', 'D'][idx]}
                          </span>
                        </button>
                      );
                    })}
                  </div>                  {/* Explanation panel post answer */}
                  {isAnswered && (
                    <div className={`p-4 rounded-xl text-xs flex gap-2.5 leading-relaxed border ${
                      selectedOptionIndex === currentQuestion.correctOptionIndex
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-brand-red/5 border-brand-red/10 text-slate-800'
                    }`}>
                      <div className="shrink-0 mt-0.5">
                        {selectedOptionIndex === currentQuestion.correctOptionIndex ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-605 font-bold" />
                        ) : (
                          <XCircle className="w-5 h-5 text-brand-red font-bold" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold mb-1">
                          {selectedOptionIndex === currentQuestion.correctOptionIndex 
                            ? 'Jawaban Anda BENAR sesuai SOP!' 
                            : 'Jawaban kurang tepat. Sifat kerja lapangan memerlukan standar berikut:'}
                        </p>
                        <p className="text-slate-600 font-sans">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit state actions */}
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400 font-mono">
                      * Evaluasi instan e-learning
                    </span>

                    {!isAnswered ? (
                      <button
                        type="button"
                        onClick={handleSubmitAnswer}
                        disabled={selectedOptionIndex === null}
                        className={`font-bold text-xs py-2 px-5 rounded-lg transition-colors cursor-pointer ${
                          selectedOptionIndex === null
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-brand-red text-white hover:bg-brand-hover-red shadow-3xs'
                        }`}
                      >
                        Kunci Jawaban Saya
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="bg-brand-blue text-white hover:bg-brand-dark font-bold text-xs py-2 px-5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                      >
                        <span>{currentQuestionIndex + 1 === activeQuiz.questions.length ? 'Analisis Selesai' : 'Pertanyaan Selanjutnya'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                // CERTIFICATE RESULT VIEW
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-6 shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center border-2 border-yellow-250 shadow-xs">
                    <Award className="w-9 h-9 animate-pulse text-yellow-600" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg md:text-xl font-display font-extrabold text-brand-blue">
                      Sesi Pelatihan Mandiri Selesai!
                    </h2>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Kuis untuk divisi <strong className="text-slate-800">{activeQuiz.category}</strong> telah Anda tuntaskan dari regional mana pun Anda bertugas.
                    </p>
                  </div>

                  {/* Score breakdown metrics */}
                  <div className="max-w-xs mx-auto bg-slate-50 p-4 rounded-xl border border-slate-150 grid grid-cols-2 gap-3 text-center">
                    <div className="border-r border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Nilai Ujian</span>
                      <span className="text-xl font-extrabold text-slate-900 font-mono">
                        {Math.round((score / activeQuiz.questions.length) * 100)} / 100
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Hasil</span>
                      <span className={`text-xs font-bold font-mono block mt-1 ${score / activeQuiz.questions.length >= 0.5 ? 'text-emerald-600' : 'text-brand-red'}`}>
                        {score / activeQuiz.questions.length >= 0.5 ? 'LULUS SERTIFIKAT' : 'KURANG DARI TARGET'}
                      </span>
                    </div>
                  </div>

                  {score / activeQuiz.questions.length >= 0.5 ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-950 text-left max-w-sm mx-auto">
                      <p className="font-bold text-center mb-1 text-emerald-800">🎉 Selamat! Kredential Anda valid.</p>
                      <p className="text-slate-600 text-center leading-relaxed">Reputasi kompetensi Anda bertambah <span className="font-extrabold text-slate-930 font-mono">+{activeQuiz.xpReward} XP</span> di unit divisi regional Anda.</p>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-brand-red/5 border border-brand-red/10 rounded-lg text-[11px] text-brand-blue text-left max-w-sm mx-auto flex gap-2 font-medium">
                      <AlertTriangle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-brand-red">Passing score kurang dari 50%:</p>
                        <p className="text-slate-600 leading-relaxed font-normal">Skor Anda belum memenuhi batas uji mandiri. Silakan kuis ulang untuk mempelajari kesalahan rujukan standard kelayakan.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => startQuiz(activeQuiz.id)}
                      className="bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi Kuis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveQuizId(null)}
                      className="bg-brand-red text-white font-bold text-xs py-2 px-5 rounded-lg hover:bg-brand-hover-red transition-colors cursor-pointer shadow-xs"
                    >
                      Simpan & Selesai
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

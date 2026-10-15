'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Trophy, 
  Play, 
  RotateCcw 
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { getTechniqueBySlug, ACADEMY_TECHNIQUES } from '@/lib/academy-data';
import { generateQuestionSet } from '@/lib/math-generator';
import { QuestionData } from '@/types/game';
import { Keypad } from '@/components/game/Keypad';
import { OptionsGrid } from '@/components/game/OptionsGrid';
import { TimerBar } from '@/components/game/TimerBar';
import { sounds } from '@/lib/sound';

export default function AcademyLessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const technique = getTechniqueBySlug(slug);

  // Mode: 'LESSON' | 'DRILL' | 'DRILL_SUMMARY'
  const [mode, setMode] = useState<'LESSON' | 'DRILL' | 'DRILL_SUMMARY'>('LESSON');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Drill State
  const [drillQuestions, setDrillQuestions] = useState<QuestionData[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [drillScore, setDrillScore] = useState<number>(0);
  const [drillStreak, setDrillStreak] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [drillTimeRemaining, setDrillTimeRemaining] = useState<number>(10);
  const [drillTimeTotal, setDrillTimeTotal] = useState<number>(10);
  const [feedbackState, setFeedbackState] = useState<{ isCorrect: boolean; points: number } | null>(null);

  useEffect(() => {
    if (!technique) return;
  }, [technique]);

  // Start Solo Drill Mode
  const handleStartDrill = () => {
    if (!technique) return;
    const questions = generateQuestionSet(
      technique.drillPreset.questionCount,
      technique.drillPreset.operations,
      technique.difficulty,
      technique.drillPreset.timePerQuestion
    );
    setDrillQuestions(questions);
    setCurrentQIndex(0);
    setDrillScore(0);
    setDrillStreak(0);
    setCorrectAnswersCount(0);
    setDrillTimeRemaining(technique.drillPreset.timePerQuestion);
    setDrillTimeTotal(technique.drillPreset.timePerQuestion);
    setFeedbackState(null);
    setMode('DRILL');
  };

  // Authoritative Drill Timer Tick
  useEffect(() => {
    if (mode !== 'DRILL' || drillQuestions.length === 0 || feedbackState !== null) return;

    const interval = setInterval(() => {
      setDrillTimeRemaining((prev) => {
        if (prev <= 1) {
          handleDrillSubmit(-999999); // Time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, drillQuestions, currentQIndex, feedbackState]);

  // Handle Drill Submit
  const handleDrillSubmit = (answer: number) => {
    if (mode !== 'DRILL' || !drillQuestions[currentQIndex]) return;

    const currentQ = drillQuestions[currentQIndex];
    const isCorrect = answer === currentQ.correctAnswer;

    let points = 0;
    if (isCorrect) {
      const timeRatio = Math.max(0, drillTimeRemaining / drillTimeTotal);
      const basePoints = Math.round(1000 * (1 - (1 - timeRatio) * 0.5));
      const streakBonus = Math.min(200, drillStreak * 40);
      points = basePoints + streakBonus;

      setDrillScore((prev) => prev + points);
      setDrillStreak((prev) => prev + 1);
      setCorrectAnswersCount((prev) => prev + 1);
      sounds.playCorrect(drillStreak + 1);
    } else {
      setDrillStreak(0);
      sounds.playIncorrect();
    }

    setFeedbackState({ isCorrect, points });

    // Move to next question after 800ms
    setTimeout(() => {
      if (currentQIndex + 1 < drillQuestions.length) {
        setCurrentQIndex((prev) => prev + 1);
        setDrillTimeRemaining(technique!.drillPreset.timePerQuestion);
        setDrillTimeTotal(technique!.drillPreset.timePerQuestion);
        setFeedbackState(null);
      } else {
        // Finish drill
        finishDrill(drillScore + points, correctAnswersCount + (isCorrect ? 1 : 0));
      }
    }, 800);
  };

  // Save Drill Result and Calculate Stars
  const finishDrill = (finalScore: number, correctCount: number) => {
    if (!technique) return;
    const total = technique.drillPreset.questionCount;
    const accuracy = Math.round((correctCount / total) * 100);

    let stars = 1;
    if (accuracy >= 80) stars = 3;
    else if (accuracy >= 50) stars = 2;

    const record = {
      stars,
      bestScore: finalScore,
      accuracy,
      correctCount,
      total,
      completedAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(`drill_record_${technique.slug}`);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (finalScore > parsed.bestScore) {
            localStorage.setItem(`drill_record_${technique.slug}`, JSON.stringify(record));
          }
        } catch {
          localStorage.setItem(`drill_record_${technique.slug}`, JSON.stringify(record));
        }
      } else {
        localStorage.setItem(`drill_record_${technique.slug}`, JSON.stringify(record));
      }
    }

    setMode('DRILL_SUMMARY');
  };

  if (!technique) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-heading font-black text-[#1C1D1F] mb-3">Técnica no encontrada</h1>
          <button
            onClick={() => router.push('/academy')}
            className="px-6 py-3 rounded-full bg-[#FEE77B] border-2 border-[#1C1D1F] text-[#1C1D1F] font-bold shadow-[0_3px_0_0_#1C1D1F]"
          >
            Volver a la Academia
          </button>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 1. LESSON BREAKDOWN MODE (Precious Plastic Blueprint / Workshop Guide)
  // ----------------------------------------------------------------
  if (mode === 'LESSON') {
    const step = technique.steps[currentStepIndex];

    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-between">
          {/* Top Back link & header */}
          <div>
            <button
              onClick={() => router.push('/academy')}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#595B5F] hover:text-[#1C1D1F] px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-[#EDE8E1] shadow-sm mb-5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Academia</span>
            </button>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#BFDEBA] border-2 border-[#1C1D1F] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]">
                {technique.category}
              </span>
              <span className="text-xs font-bold text-[#595B5F] px-3 py-1 rounded-full bg-[#EDE8E1] border border-[#1C1D1F]">
                Paso {currentStepIndex + 1} de {technique.steps.length}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1C1D1F] mb-2">
              {technique.title}
            </h1>
          </div>

          {/* Interactive Step Card - Precious Plastic Step Guide */}
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="my-6 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F] relative"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FEE77B] border-2 border-[#1C1D1F] text-[#1C1D1F] text-xs font-heading font-black mb-4 shadow-[0_2px_0_0_#1C1D1F]">
              <span>PASO #{step.stepNumber}</span>
            </div>

            <h2 className="text-2xl font-heading font-black text-[#1C1D1F] mb-3">{step.title}</h2>
            <p className="text-[#595B5F] text-base leading-relaxed mb-4 font-medium whitespace-pre-line">{step.explanation}</p>

            {step.referenceLinks && step.referenceLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-[#EDE8E1]/60 border border-[#1C1D1F]">
                <span className="text-xs font-bold text-[#1C1D1F] flex items-center space-x-1">
                  <span>🔗</span>
                  <span>Lecciones recomendadas:</span>
                </span>
                {step.referenceLinks.map((rLink, rIdx) => (
                  <Link
                    key={rIdx}
                    href={rLink.url}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FEE77B] text-[#1C1D1F] border border-[#1C1D1F] text-xs font-bold shadow-[0_2px_0_0_#1C1D1F] hover:-translate-y-0.5 transition-all"
                  >
                    <span>{rLink.text}</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </Link>
                ))}
              </div>
            )}

            {/* Visual Step Breakdown Blocks */}
            <div className="p-6 rounded-2xl bg-[#EDE8E1] border-2 border-[#1C1D1F] flex flex-col items-center justify-center text-center shadow-[0_2px_0_0_#1C1D1F]">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#595B5F] mb-3">
                Demostración Visual
              </span>

              {step.exampleFormula && (
                <div className="text-xl sm:text-2xl font-mono font-black text-[#1C1D1F] mb-4 bg-white px-5 py-2.5 rounded-2xl border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F] tracking-wide">
                  {step.exampleFormula}
                </div>
              )}

              <div className="text-2xl sm:text-4xl font-heading font-black text-[#1C1D1F] tracking-wider my-2 flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5">
                {step.breakdown.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span
                      className={`px-3.5 py-1.5 rounded-2xl border-2 border-[#1C1D1F] ${
                        item.highlight
                          ? item.color === 'emerald'
                            ? 'bg-[#BFDEBA] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                            : item.color === 'rose'
                            ? 'bg-[#FF7A59] text-white shadow-[0_3px_0_0_#1C1D1F]'
                            : item.color === 'amber'
                            ? 'bg-[#FEE77B] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                            : 'bg-[#ABD3DF] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                          : 'bg-white text-[#1C1D1F]'
                      }`}
                    >
                      {item.text}
                    </span>
                    {item.note && (
                      <span className="text-[11px] font-bold text-[#595B5F] mt-1.5 text-center leading-tight max-w-[130px]">
                        {item.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {step.visualHint && (
                <div className="text-xs font-bold text-[#1C1D1F] mt-4 bg-white px-4 py-2 rounded-xl border border-[#1C1D1F] shadow-sm">
                  💡 {step.visualHint}
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation and Launch Drill Bar */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-[#EDE8E1]">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="h-12 px-5 rounded-full bg-white border-2 border-[#1C1D1F] text-[#1C1D1F] font-bold text-sm disabled:opacity-30 flex items-center space-x-1.5 shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStepIndex < technique.steps.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                className="h-12 px-6 rounded-full bg-[#ABD3DF] hover:bg-[#95CBD8] border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-sm flex items-center space-x-2 shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                onClick={handleStartDrill}
                className="h-13 px-7 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-base shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center space-x-2"
              >
                <Zap className="w-5 h-5 fill-[#1C1D1F]" />
                <span>¡Entrenar Modo Drill!</span>
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. SOLO DRILL SPEED TRIAL MODE (Precious Plastic Workshop Drill)
  // ----------------------------------------------------------------
  if (mode === 'DRILL') {
    const currentQ = drillQuestions[currentQIndex];

    if (!currentQ) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
          <div className="w-10 h-10 border-4 border-[#1C1D1F] border-t-[#FEE77B] rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#FBF9F5] text-[#1C1D1F] select-none overflow-hidden">
        {/* Top Status */}
        <div className="shrink-0 w-full max-w-md mx-auto px-4 pt-2.5 pb-1 sm:pt-3 sm:pb-2 flex flex-col space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="px-3 py-1 rounded-full bg-[#EDE8E1] border border-[#1C1D1F]">
              Pregunta <strong className="text-[#1C1D1F]">{currentQIndex + 1}</strong> de {drillQuestions.length}
            </span>

            <div className="flex items-center space-x-2">
              {drillStreak > 1 && (
                <div className="flex items-center space-x-1 text-[#1C1D1F] bg-[#FEE77B] px-2.5 py-0.5 rounded-full border border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]">
                  <Flame className="w-3.5 h-3.5 fill-[#FF7A59] text-[#FF7A59]" />
                  <span>x{drillStreak} Racha</span>
                </div>
              )}
              <span className="px-3 py-1 rounded-full bg-white border border-[#1C1D1F] text-[#1C1D1F] font-black shadow-sm">
                {drillScore} pts
              </span>
            </div>
          </div>

          <TimerBar remainingSec={drillTimeRemaining} totalSec={drillTimeTotal} />
        </div>

        {/* Calculation Screen & Keypad Container */}
        <div className="flex-1 max-w-md w-full mx-auto px-3 sm:px-4 flex flex-col justify-center items-center gap-2 sm:gap-3.5 min-h-0 py-1 sm:py-2">
          {/* Calculation Box */}
          <div className="w-full relative">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className={`w-full py-3 sm:py-5 px-4 rounded-2xl sm:rounded-3xl border-2 border-[#1C1D1F] text-center shadow-[0_4px_0_0_#1C1D1F] sm:shadow-[0_6px_0_0_#1C1D1F] transition-colors relative overflow-hidden ${
                feedbackState
                  ? feedbackState.isCorrect
                    ? 'bg-[#BFDEBA]'
                    : 'bg-[#FF7A59] text-white'
                  : 'bg-white'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#595B5F] mb-0.5 block">
                {technique.title}
              </span>

              <div className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-[#1C1D1F] my-0.5 sm:my-1">
                {currentQ.expression}
              </div>
            </motion.div>
          </div>

          {/* Keypad or Options Grid */}
          <div className="w-full shrink-0">
            {currentQ.options && currentQ.options.length > 0 ? (
              <OptionsGrid
                key={currentQ.id}
                options={currentQ.options}
                onSubmit={handleDrillSubmit}
                disabled={feedbackState !== null || drillTimeRemaining <= 0}
              />
            ) : (
              <Keypad
                key={currentQ.id}
                onSubmit={handleDrillSubmit}
                disabled={feedbackState !== null || drillTimeRemaining <= 0}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 3. DRILL SUMMARY / STARS RATING
  // ----------------------------------------------------------------
  if (mode === 'DRILL_SUMMARY') {
    const accuracy = Math.round((correctAnswersCount / technique.drillPreset.questionCount) * 100);
    let stars = 1;
    if (accuracy >= 80) stars = 3;
    else if (accuracy >= 50) stars = 2;

    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] text-center shadow-[0_6px_0_0_#1C1D1F]"
          >
            {/* Stars Award */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: star * 0.15 }}
                >
                  <Star
                    className={`w-10 h-10 ${
                      stars >= star
                        ? 'text-[#1C1D1F] fill-[#FEE77B]'
                        : 'text-slate-300'
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            <h2 className="text-3xl font-heading font-black text-[#1C1D1F] mb-1">¡Drill Completado!</h2>
            <p className="text-xs font-bold text-[#595B5F] mb-6">{technique.title}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-[#EDE8E1] border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]">
                <span className="text-[10px] font-black uppercase text-[#595B5F] block mb-1">
                  Puntaje Total
                </span>
                <span className="text-2xl font-heading font-black text-[#1C1D1F]">
                  {drillScore.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#BFDEBA] border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]">
                <span className="text-[10px] font-black uppercase text-[#1C1D1F] block mb-1">
                  Precisión
                </span>
                <span className="text-2xl font-heading font-black text-[#1C1D1F]">
                  {accuracy}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartDrill}
                className="w-full h-14 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-base shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5 stroke-[2.5]" />
                <span>Reintentar Drill</span>
              </button>

              <button
                onClick={() => setMode('LESSON')}
                className="w-full h-12 rounded-full bg-white border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-bold text-sm shadow-[0_3px_0_0_#1C1D1F] hover:bg-[#EDE8E1] transition-all"
              >
                Repasar Pasos
              </button>

              <button
                onClick={() => router.push('/academy')}
                className="w-full h-11 rounded-full text-[#595B5F] hover:text-[#1C1D1F] font-bold text-xs"
              >
                Volver a la Academia
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return null;
}

'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trophy, 
  Users, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { PlayerRoundResult, QuestionData } from '@/types/game';
import { useGameSocket } from '@/hooks/useGameSocket';
import { generateQuestionSet } from '@/lib/math-generator';
import { sounds } from '@/lib/sound';
import { Keypad } from '@/components/game/Keypad';
import { TimerBar } from '@/components/game/TimerBar';
import { Podium } from '@/components/game/Podium';
import { Navbar } from '@/components/layout/Navbar';

function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlPin = searchParams.get('pin') || '';
  const urlNick = searchParams.get('nick') || '';
  const isSoloModeParam = searchParams.get('mode') === 'solo';

  // ----------------------------------------------------
  // Multiplayer Socket State
  // ----------------------------------------------------
  const {
    isConnected,
    gameStatus,
    player,
    playersList,
    currentPin,
    currentQuestion,
    timeRemaining,
    timeTotal,
    hasAnsweredCurrentRound,
    submittedAnswer,
    roundResults,
    gameOverData,
    countdown,
    error: socketError,
    joinRoom,
    submitAnswer,
    leaveRoom,
    reconnectExistingSession,
    storedSession,
    clearSession,
    returnToLobbyWaiting
  } = useGameSocket();

  const [inputPin, setInputPin] = useState(urlPin);
  const [inputNick, setInputNick] = useState(urlNick);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [autoAdvanceRemaining, setAutoAdvanceRemaining] = useState<number>(4);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleReconnectSession = async () => {
    try {
      const ok = await reconnectExistingSession();
      if (!ok) {
        setLocalError('La sala ya no existe o ha expirado en el servidor.');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setLocalError(e.message || 'Error al reconectar.');
    }
  };

  // Auto-advance countdown timer for player
  useEffect(() => {
    if (gameStatus === 'ROUND_FEEDBACK' && roundResults && roundResults.autoAdvance && !roundResults.isLastQuestion) {
      const delay = roundResults.autoAdvanceDelaySec || 4;
      setAutoAdvanceRemaining(delay);
      const interval = setInterval(() => {
        setAutoAdvanceRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStatus, roundResults]);

  const DisconnectBanner = () => {
    if (isConnected || !player) return null;
    return (
      <div className="bg-[#FF7A59] text-white px-4 py-2 text-xs font-black text-center flex items-center justify-center space-x-2 border-b-2 border-[#1C1D1F] sticky top-0 z-50">
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        <span>⚠️ Conexión perdida con la sala.</span>
        <button
          onClick={() => reconnectExistingSession()}
          className="ml-3 px-3 py-1 rounded-full bg-white text-[#1C1D1F] font-black text-xs border border-[#1C1D1F] hover:bg-[#FEE77B] transition-colors"
        >
          Reconectar ⚡
        </button>
      </div>
    );
  };

  // ----------------------------------------------------
  // Solo Practice State (For individual players without a host)
  // ----------------------------------------------------
  const [isSoloActive, setIsSoloActive] = useState<boolean>(isSoloModeParam);
  const [soloQuestions, setSoloQuestions] = useState<QuestionData[]>([]);
  const [soloQIndex, setSoloQIndex] = useState<number>(0);
  const [soloScore, setSoloScore] = useState<number>(0);
  const [soloStreak, setSoloStreak] = useState<number>(0);
  const [soloCorrectCount, setSoloCorrectCount] = useState<number>(0);
  const [soloTimeRemaining, setSoloTimeRemaining] = useState<number>(10);
  const [soloTimeTotal, setSoloTimeTotal] = useState<number>(10);
  const [soloFeedback, setSoloFeedback] = useState<{ isCorrect: boolean; points: number } | null>(null);
  const [soloIsGameOver, setSoloIsGameOver] = useState<boolean>(false);

  // Initialize Solo Mode
  const startSoloGame = useCallback(() => {
    const qs = generateQuestionSet(
      10,
      ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION_11', 'COMPLEMENT_100', 'SQUARE_5'],
      'MEDIUM',
      10
    );
    setSoloQuestions(qs);
    setSoloQIndex(0);
    setSoloScore(0);
    setSoloStreak(0);
    setSoloCorrectCount(0);
    setSoloTimeRemaining(10);
    setSoloTimeTotal(10);
    setSoloFeedback(null);
    setSoloIsGameOver(false);
    setIsSoloActive(true);
  }, []);

  useEffect(() => {
    if (isSoloModeParam && soloQuestions.length === 0) {
      startSoloGame();
    }
  }, [isSoloModeParam, soloQuestions.length, startSoloGame]);

  // Handle Solo Answer Submission
  const handleSoloSubmit = useCallback((answer: number) => {
    if (!isSoloActive || !soloQuestions[soloQIndex] || soloFeedback !== null) return;

    const currentQ = soloQuestions[soloQIndex];
    const isCorrect = answer === currentQ.correctAnswer;

    let points = 0;
    if (isCorrect) {
      const timeRatio = Math.max(0, soloTimeRemaining / soloTimeTotal);
      const basePoints = Math.round(1000 * (1 - (1 - timeRatio) * 0.5));
      const streakBonus = Math.min(200, soloStreak * 40);
      points = basePoints + streakBonus;

      setSoloScore((prev) => prev + points);
      setSoloStreak((prev) => prev + 1);
      setSoloCorrectCount((prev) => prev + 1);
      sounds.playCorrect(soloStreak + 1);
    } else {
      setSoloStreak(0);
      sounds.playIncorrect();
    }

    setSoloFeedback({ isCorrect, points });

    setTimeout(() => {
      if (soloQIndex + 1 < soloQuestions.length) {
        setSoloQIndex((prev) => prev + 1);
        setSoloTimeRemaining(10);
        setSoloTimeTotal(10);
        setSoloFeedback(null);
      } else {
        setSoloIsGameOver(true);
      }
    }, 800);
  }, [isSoloActive, soloQuestions, soloQIndex, soloFeedback, soloTimeRemaining, soloTimeTotal, soloStreak]);

  // Solo Timer Countdown
  useEffect(() => {
    if (!isSoloActive || soloIsGameOver || soloQuestions.length === 0 || soloFeedback !== null) return;

    if (soloTimeRemaining <= 0) {
      handleSoloSubmit(-999999); // Timeout
      return;
    }

    const timer = setTimeout(() => {
      setSoloTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSoloActive, soloIsGameOver, soloQuestions.length, soloFeedback, soloTimeRemaining, handleSoloSubmit]);

  // Auto-join multiplayer if url parameters are provided
  useEffect(() => {
    if (isConnected && urlPin && urlNick && !player && !isJoining && !isSoloActive) {
      setIsJoining(true);
      joinRoom(urlPin, urlNick)
        .catch((err) => {
          setLocalError(err.message || 'No se pudo conectar a la sala');
        })
        .finally(() => setIsJoining(false));
    }
  }, [isConnected, urlPin, urlNick, player, isJoining, joinRoom, isSoloActive]);

  const handleManualJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPin.trim() || !inputNick.trim()) {
      setLocalError('Por favor ingresa el PIN y tu apodo.');
      return;
    }
    setLocalError(null);
    setIsJoining(true);
    try {
      await joinRoom(inputPin.trim(), inputNick.trim());
    } catch (err: unknown) {
      const error = err as Error;
      setLocalError(error.message || 'Error al unirse a la sala');
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmitKeypad = async (answer: number) => {
    try {
      await submitAnswer(answer);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // ----------------------------------------------------------------
  // SOLO MODE ACTIVE VIEW
  // ----------------------------------------------------------------
  if (isSoloActive) {
    if (soloIsGameOver) {
      const soloPodiumEntry = {
        rank: 1,
        playerId: 'solo_player',
        nickname: inputNick || 'Jugador Solitario',
        score: soloScore,
        correctAnswers: soloCorrectCount,
        streak: soloStreak
      };

      return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
          <Navbar />
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
            <Podium
              podium={[soloPodiumEntry]}
              fullLeaderboard={[soloPodiumEntry]}
              totalQuestions={soloQuestions.length}
            />

            <div className="max-w-md mx-auto mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startSoloGame}
                className="w-full sm:flex-1 h-14 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
              >
                Jugar Otra Vez
              </button>
              <button
                onClick={() => {
                  setIsSoloActive(false);
                  router.push('/');
                }}
                className="w-full sm:flex-1 h-14 rounded-full bg-white hover:bg-[#EDE8E1] text-[#1C1D1F] font-heading font-bold text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          </main>
        </div>
      );
    }

    const currentSoloQ = soloQuestions[soloQIndex];
    if (!currentSoloQ) {
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
              Pregunta <strong className="text-[#1C1D1F]">{soloQIndex + 1}</strong> de {soloQuestions.length}
            </span>

            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {soloStreak > 1 && (
                  <motion.div
                    key={soloStreak}
                    initial={{ scale: 0.7, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 18 }}
                    className="flex items-center space-x-1 text-[#1C1D1F] bg-[#FEE77B] px-2.5 py-0.5 rounded-full border border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]"
                  >
                    <Flame className="w-3.5 h-3.5 fill-[#FF7A59] text-[#FF7A59] animate-bounce" />
                    <span>x{soloStreak} Racha</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.span
                key={soloScore}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 rounded-full bg-white border border-[#1C1D1F] text-[#1C1D1F] font-black shadow-sm"
              >
                {soloScore} pts
              </motion.span>
            </div>
          </div>

          <TimerBar remainingSec={soloTimeRemaining} totalSec={soloTimeTotal} />
        </div>

        {/* Calculation Screen & Keypad Container */}
        <div className="flex-1 max-w-md w-full mx-auto px-3 sm:px-4 flex flex-col justify-center items-center gap-2 sm:gap-3.5 min-h-0 py-1 sm:py-2">
          {/* Floating Points & Calculation Box */}
          <div className="w-full relative">
            <AnimatePresence>
              {soloFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -24, scale: 1.1 }}
                  exit={{ opacity: 0, y: -35, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 450, damping: 18 }}
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full border-2 border-[#1C1D1F] font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_0_#1C1D1F] flex items-center space-x-1.5 ${
                    soloFeedback.isCorrect
                      ? 'bg-[#FEE77B] text-[#1C1D1F]'
                      : 'bg-[#FF7A59] text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{soloFeedback.isCorrect ? `+${soloFeedback.points} pts!` : '¡Falló!'}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key={currentSoloQ.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className={`w-full py-3 sm:py-5 px-4 rounded-2xl sm:rounded-3xl border-2 border-[#1C1D1F] text-center shadow-[0_4px_0_0_#1C1D1F] sm:shadow-[0_6px_0_0_#1C1D1F] transition-colors relative overflow-hidden ${
                soloFeedback
                  ? soloFeedback.isCorrect
                    ? 'bg-[#BFDEBA]'
                    : 'bg-[#FF7A59] text-white'
                  : 'bg-white'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#595B5F] mb-0.5 block">
                Práctica Rápida
              </span>

              <div className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-[#1C1D1F] my-0.5 sm:my-1">
                {currentSoloQ.expression}
              </div>
            </motion.div>
          </div>

          <div className="w-full shrink-0">
            <Keypad
              key={currentSoloQ.id}
              onSubmit={handleSoloSubmit}
              disabled={soloFeedback !== null || soloTimeRemaining <= 0}
            />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 1. Initial State: Join Form (if no player or room)
  // ----------------------------------------------------------------
  if (!player) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-10 flex flex-col justify-center">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F] text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#BFDEBA] border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] mx-auto mb-4 shadow-[0_3px_0_0_#1C1D1F]">
              <Zap className="w-8 h-8 fill-[#1C1D1F]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#1C1D1F] mb-1">
              Unirse a la Partida
            </h1>
            <p className="text-xs font-bold text-[#595B5F] mb-6">
              Ingresa el código PIN proyectado por el anfitrión
            </p>

            {(localError || socketError) && (
              <div className="mb-5 p-4 rounded-2xl bg-[#FF7A59]/15 border-2 border-[#FF7A59] text-[#1C1D1F] text-xs font-bold text-center">
                <p className="mb-2 font-black">{localError || socketError}</p>
                <button
                  onClick={startSoloGame}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] border border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-xs shadow-sm transition-all"
                >
                  <Zap className="w-3.5 h-3.5 fill-[#1C1D1F]" />
                  <span>Jugar Partida en Solitario</span>
                </button>
              </div>
            )}

            {/* Active Session Recovery Card */}
            {hasMounted && storedSession && !storedSession.isHost && (
              <div className="mb-6 p-4 rounded-2xl bg-[#FEE77B] border-2 border-[#1C1D1F] text-left shadow-[0_4px_0_0_#1C1D1F]">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#1C1D1F] mb-1">
                  <RotateCcw className="w-4 h-4" />
                  <span>Partida activa detectada</span>
                </div>
                <p className="text-xs font-bold text-[#1C1D1F] mb-3">
                  Estabas en la sala <strong>PIN {storedSession.pin}</strong> con el apodo <strong>{storedSession.nickname}</strong>.
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleReconnectSession}
                    className="flex-1 h-11 rounded-full bg-[#BFDEBA] hover:bg-[#A6D49F] text-[#1C1D1F] font-heading font-black text-xs sm:text-sm border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F] active:translate-y-0.5 transition-all flex items-center justify-center space-x-1"
                  >
                    <span>⚡ Reincorporarme a la Sala</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => clearSession()}
                    className="h-11 px-3 rounded-full bg-white text-[#595B5F] hover:text-[#1C1D1F] font-bold text-xs border border-[#1C1D1F]"
                  >
                    Olvidar
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleManualJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#1C1D1F] uppercase tracking-wider mb-1.5 text-left">
                  1. PIN de la Sala
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  placeholder="Ej: 849201"
                  maxLength={6}
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 sm:h-14 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BFDEBA] px-4 text-2xl font-heading font-black tracking-widest text-center text-[#1C1D1F] placeholder-slate-400 uppercase shadow-[0_2px_0_0_#1C1D1F] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1C1D1F] uppercase tracking-wider mb-1.5 text-left">
                  2. Tu Apodo / Nickname
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre en la partida"
                  maxLength={16}
                  value={inputNick}
                  onChange={(e) => setInputNick(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BFDEBA] px-4 text-lg font-bold text-[#1C1D1F] placeholder-slate-400 shadow-[0_2px_0_0_#1C1D1F] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isJoining || !isConnected}
                className="w-full h-14 rounded-full bg-[#BFDEBA] hover:bg-[#A6D49F] text-[#1C1D1F] font-heading font-black text-lg border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{isJoining ? 'Conectando...' : 'Entrar a la Sala'}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>

            {/* Solo option divider */}
            <div className="mt-6 pt-5 border-t-2 border-[#EDE8E1]">
              <span className="text-xs font-medium text-[#595B5F] block mb-2.5">
                ¿No tienes PIN o estás solo?
              </span>
              <button
                onClick={startSoloGame}
                className="w-full h-12 rounded-full bg-[#EDE8E1] hover:bg-[#FEE77B] text-[#1C1D1F] font-heading font-black text-xs sm:text-sm border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-[#1C1D1F]" />
                <span>⚡ Jugar Práctica Rápida (1 Jugador)</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. Countdown State (3, 2, 1...)
  // ----------------------------------------------------------------
  if (gameStatus === 'STARTING' && countdown !== null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF9F5] text-[#1C1D1F] px-4 select-none">
        <motion.div
          key={countdown}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm font-heading font-black uppercase tracking-widest text-[#595B5F] mb-3 px-4 py-1.5 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F]">
            ¡Prepárate!
          </span>
          <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#FEE77B] border-4 border-[#1C1D1F] shadow-[0_8px_0_0_#1C1D1F] flex items-center justify-center">
            <span className="text-7xl sm:text-8xl font-heading font-black text-[#1C1D1F]">
              {countdown > 0 ? countdown : '¡YA!'}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 3. Lobby State: Waiting for Host to start
  // ----------------------------------------------------------------
  if (gameStatus === 'LOBBY') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <DisconnectBanner />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F]"
          >
            {/* Player Avatar & Status */}
            <div className="w-20 h-20 rounded-3xl bg-[#FEE77B] border-2 border-[#1C1D1F] flex items-center justify-center mx-auto mb-4 shadow-[0_4px_0_0_#1C1D1F]">
              <Zap className="w-10 h-10 fill-[#1C1D1F] text-[#1C1D1F]" />
            </div>

            <div className="inline-block px-3.5 py-1 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-[#1C1D1F] text-xs font-black mb-3">
              PIN: <span className="tracking-widest font-black text-[#1C1D1F]">{currentPin}</span>
            </div>

            <h2 className="text-2xl font-heading font-black text-[#1C1D1F] mb-1">
              ¡Estás dentro, {player.nickname}!
            </h2>

            <p className="text-xs font-medium text-[#595B5F] mb-6">
              Mira la pantalla del anfitrión. La ronda comenzará cuando el anfitrión pulse Iniciar.
            </p>

            {/* Waiting Pulse */}
            <div className="flex items-center justify-center space-x-2 py-4 bg-[#FBF9F5] rounded-2xl border border-[#1C1D1F] mb-4">
              <span className="w-3 h-3 bg-[#56B870] rounded-full animate-ping" />
              <span className="text-xs font-bold text-[#1C1D1F]">
                Esperando al Anfitrión
              </span>
            </div>

            <div className="pt-4 border-t-2 border-[#EDE8E1] flex items-center justify-between text-xs text-[#595B5F] font-bold">
              <div className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-[#1C1D1F]" />
                <span>{playersList.length} Jugadores</span>
              </div>
              <button
                onClick={leaveRoom}
                className="text-[#FF7A59] hover:underline font-black"
              >
                Salir de la Sala
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 4. Question Active State (Calculation + Keypad)
  // ----------------------------------------------------------------
  if (gameStatus === 'QUESTION_ACTIVE' && currentQuestion) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#FBF9F5] text-[#1C1D1F] select-none overflow-hidden">
        <DisconnectBanner />
        {/* Top Synchronized Status Bar */}
        <div className="shrink-0 w-full max-w-md mx-auto px-4 pt-2.5 pb-1 sm:pt-3 sm:pb-2 flex flex-col space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-[#EDE8E1] border border-[#1C1D1F]">
                Pregunta <strong className="text-[#1C1D1F]">{currentQuestion.questionNumber}</strong> / {currentQuestion.totalQuestions}
              </span>
              <button
                onClick={leaveRoom}
                className="text-[11px] text-[#8C8D90] hover:text-[#FF7A59] font-bold px-2 py-0.5 rounded-full border border-dashed border-[#8C8D90]/50 hover:border-[#FF7A59] transition-colors"
                title="Salir de la sala"
              >
                Salir
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {player.streak > 1 && (
                  <motion.div
                    key={player.streak}
                    initial={{ scale: 0.7, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 18 }}
                    className="flex items-center space-x-1 text-[#1C1D1F] bg-[#FEE77B] px-2.5 py-0.5 rounded-full border border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]"
                  >
                    <Flame className="w-3.5 h-3.5 fill-[#FF7A59] text-[#FF7A59] animate-bounce" />
                    <span>x{player.streak} Racha</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.span
                key={player.score}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 rounded-full bg-white border border-[#1C1D1F] text-[#1C1D1F] font-black shadow-sm"
              >
                {player.score.toLocaleString()} pts
              </motion.span>
            </div>
          </div>

          <TimerBar remainingSec={timeRemaining} totalSec={timeTotal} />
        </div>

        {/* Calculation Screen & Keypad Container */}
        <div className="flex-1 max-w-md w-full mx-auto px-3 sm:px-4 flex flex-col justify-center items-center gap-2 sm:gap-3.5 min-h-0 py-1 sm:py-2">
          {/* Calculation Box */}
          <div className="w-full relative">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className="w-full py-3 sm:py-5 px-4 rounded-2xl sm:rounded-3xl bg-white border-2 border-[#1C1D1F] text-center shadow-[0_4px_0_0_#1C1D1F] sm:shadow-[0_6px_0_0_#1C1D1F] relative overflow-hidden"
            >
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#595B5F] mb-0.5 block">
                Calcula Mentalmente
              </span>

              <div className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-[#1C1D1F] my-0.5 sm:my-1">
                {currentQuestion.expression}
              </div>
            </motion.div>
          </div>

          {/* Keypad or Answer Submitted State */}
          <div className="w-full shrink-0">
            {hasAnsweredCurrentRound ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#BFDEBA] border-2 border-[#1C1D1F] text-center shadow-[0_4px_0_0_#1C1D1F] mb-2"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] mx-auto mb-2 shadow-[0_2px_0_0_#1C1D1F]">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-[#1C1D1F] mb-0.5">
                  Respuesta Enviada: <span className="underline decoration-2">{submittedAnswer}</span>
                </h3>
                <p className="text-xs font-bold text-[#1C1D1F]/80">
                  Esperando a que termine el tiempo de la ronda...
                </p>
              </motion.div>
            ) : (
              <Keypad
                key={currentQuestion.id}
                onSubmit={handleSubmitKeypad}
                disabled={timeRemaining <= 0}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 5. Round Feedback State (Instant Result & Explanation)
  // ----------------------------------------------------------------
  if (gameStatus === 'ROUND_FEEDBACK' && roundResults) {
    const myResult = roundResults.playerResults.find((r: PlayerRoundResult) => r.playerId === player.id);
    const isCorrect = myResult?.isCorrect ?? false;
    const pointsEarned = myResult?.pointsEarned ?? 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#FBF9F5] select-none">
        <DisconnectBanner />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-md w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F] text-center ${
            isCorrect ? 'bg-[#BFDEBA]' : 'bg-[#FF7A59] text-white'
          }`}
        >
          {/* Result Icon */}
          <div
            className={`w-20 h-20 rounded-3xl border-2 border-[#1C1D1F] flex items-center justify-center mx-auto mb-4 shadow-[0_4px_0_0_#1C1D1F] ${
              isCorrect ? 'bg-white text-[#1C1D1F]' : 'bg-white text-[#FF7A59]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-10 h-10 stroke-[3]" />
            ) : (
              <XCircle className="w-10 h-10 stroke-[3]" />
            )}
          </div>

          <h2 className="text-3xl font-heading font-black mb-1">
            {isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
          </h2>

          <div className="my-4 p-4 rounded-2xl bg-white border-2 border-[#1C1D1F] text-[#1C1D1F]">
            <span className="text-xs font-bold text-[#595B5F] block mb-1">Operación:</span>
            <span className="text-2xl font-heading font-black block mb-2">
              {roundResults.expression} ={' '}
              <strong className="underline decoration-2">
                {roundResults.correctAnswer}
              </strong>
            </span>

            {roundResults.explanation && (
              <div className="text-xs font-bold text-[#1C1D1F] bg-[#EDE8E1] p-3 rounded-xl border border-[#1C1D1F] mt-2 text-left">
                💡 {roundResults.explanation}
              </div>
            )}
          </div>

          {/* Points summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#1C1D1F] text-[#1C1D1F]">
              <span className="text-[10px] uppercase font-black text-[#595B5F] block">
                Puntos Ganados
              </span>
              <span className="text-xl font-heading font-black">
                +{pointsEarned}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#1C1D1F] text-[#1C1D1F]">
              <span className="text-[10px] uppercase font-black text-[#595B5F] block">
                Total Acumulado
              </span>
              <span className="text-xl font-heading font-black">
                {player.score.toLocaleString()} pts
              </span>
            </div>
          </div>

          <div className="text-xs font-black uppercase tracking-wider opacity-90">
            {roundResults.autoAdvance && !roundResults.isLastQuestion ? (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white text-[#1C1D1F] border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]">
                <Clock className="w-4 h-4 animate-spin text-[#1C1D1F]" />
                <span>
                  Siguiente cálculo en <strong className="font-mono text-sm underline">{autoAdvanceRemaining}s</strong>
                </span>
              </div>
            ) : (
              <span>Mira la pantalla del anfitrión para continuar...</span>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-black/10">
            <button
              onClick={leaveRoom}
              className="text-xs font-bold text-[#8C8D90] hover:text-[#FF7A59] underline transition-colors"
            >
              Salir de la sala
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 6. Game Over / Podium State
  // ----------------------------------------------------------------
  if (gameStatus === 'GAME_OVER' && gameOverData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <DisconnectBanner />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          <Podium
            podium={gameOverData.podium}
            fullLeaderboard={gameOverData.fullLeaderboard}
            totalQuestions={gameOverData.totalQuestions}
          />

          <div className="max-w-md mx-auto mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => returnToLobbyWaiting()}
              className="w-full sm:flex-1 h-14 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-sm sm:text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Jugar Otra Vez (Esperar Sala)</span>
            </button>
            <button
              onClick={leaveRoom}
              className="w-full sm:flex-1 h-14 rounded-full bg-white hover:bg-[#EDE8E1] text-[#FF7A59] hover:text-[#FF6640] font-heading font-bold text-sm sm:text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Salir de la Sala
            </button>
            <button
              onClick={() => router.push('/academy')}
              className="w-full sm:flex-1 h-14 rounded-full bg-white hover:bg-[#EDE8E1] text-[#1C1D1F] font-heading font-bold text-sm sm:text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Academia
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Fallback: If player is connected to a room, show lobby waiting screen instead of infinite spinner
  if (player) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <DisconnectBanner />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F]">
            <div className="w-20 h-20 rounded-3xl bg-[#FEE77B] border-2 border-[#1C1D1F] flex items-center justify-center mx-auto mb-4 shadow-[0_4px_0_0_#1C1D1F]">
              <Zap className="w-10 h-10 fill-[#1C1D1F] text-[#1C1D1F]" />
            </div>

            <div className="inline-block px-3.5 py-1 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-[#1C1D1F] text-xs font-black mb-3">
              PIN: <span className="tracking-widest font-black text-[#1C1D1F]">{currentPin}</span>
            </div>

            <h2 className="text-2xl font-heading font-black text-[#1C1D1F] mb-1">
              ¡Estás dentro, {player.nickname}!
            </h2>

            <p className="text-xs font-medium text-[#595B5F] mb-6">
              Mira la pantalla del anfitrión. La ronda comenzará cuando el anfitrión pulse Iniciar.
            </p>

            <div className="flex items-center justify-center space-x-2 py-4 bg-[#FBF9F5] rounded-2xl border border-[#1C1D1F] mb-4">
              <span className="w-3 h-3 bg-[#56B870] rounded-full animate-ping" />
              <span className="text-xs font-bold text-[#1C1D1F]">
                Esperando al Anfitrión
              </span>
            </div>

            <div className="pt-4 border-t-2 border-[#EDE8E1] flex items-center justify-between text-xs text-[#595B5F] font-bold">
              <div className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-[#1C1D1F]" />
                <span>{playersList.length} Jugadores</span>
              </div>
              <button
                onClick={leaveRoom}
                className="text-[#FF7A59] hover:underline font-black"
              >
                Salir de la Sala
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
      <div className="w-10 h-10 border-4 border-[#1C1D1F] border-t-[#FEE77B] rounded-full animate-spin" />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#1C1D1F] border-t-[#FEE77B] rounded-full animate-spin" /></div>}>
      <PlayContent />
    </Suspense>
  );
}

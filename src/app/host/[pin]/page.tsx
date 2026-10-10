'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  Users, 
  Play, 
  ArrowRight, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  QrCode,
  RotateCcw,
  Clock,
  WifiOff,
  Copy,
  ExternalLink,
  Maximize2,
  Check
} from 'lucide-react';
import { useGameSocket } from '@/hooks/useGameSocket';
import { TimerBar } from '@/components/game/TimerBar';
import { Podium } from '@/components/game/Podium';
import { Navbar } from '@/components/layout/Navbar';
import { Keypad } from '@/components/game/Keypad';

function HostRoomContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pin = params?.pin as string;
  const isProjectorMode = searchParams.get('projector') === 'true';

  const [copiedToast, setCopiedToast] = useState(false);

  const {
    socket,
    isConnected,
    gameStatus,
    player,
    playersList,
    roomSettings,
    currentQuestion,
    timeRemaining,
    timeTotal,
    hasAnsweredCurrentRound,
    submittedAnswer,
    roundResults,
    gameOverData,
    leaderboard,
    countdown,
    startGame,
    nextQuestion,
    submitAnswer,
    reconnectHost,
    resetRoom,
    closeRoom
  } = useGameSocket();

  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [autoAdvanceRemaining, setAutoAdvanceRemaining] = useState<number>(4);
  const [roomNotFound, setRoomNotFound] = useState<boolean>(false);

  // Auto-advance countdown timer during round feedback
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

  // Host reconnect handshake on load
  useEffect(() => {
    if (isConnected && pin) {
      reconnectHost(pin, isProjectorMode).then((success) => {
        if (!success) {
          setRoomNotFound(true);
        }
      });
    }
  }, [isConnected, pin, reconnectHost, isProjectorMode]);

  // Track live player answers
  useEffect(() => {
    if (!socket) return;
    const handlePlayerAnswered = (data: { answeredCount: number }) => {
      setAnsweredCount(data.answeredCount);
    };

    socket.on('player_answered', handlePlayerAnswered);
    return () => {
      socket.off('player_answered', handlePlayerAnswered);
    };
  }, [socket]);

  // Reset answered count on new question
  useEffect(() => {
    if (gameStatus === 'QUESTION_ACTIVE') {
      setAnsweredCount(0);
    }
  }, [gameStatus, currentQuestion]);

  const handleCopyProjectorLink = () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/host/${pin}?projector=true`;
    navigator.clipboard.writeText(url);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleOpenProjectorTab = () => {
    window.open(`/host/${pin}?projector=true`, '_blank');
  };

  const handlePlayAgain = async () => {
    try {
      await resetRoom(pin);
    } catch (err: unknown) {
      console.error('Error al reiniciar sala:', err);
    }
  };

  const handleCloseRoom = async () => {
    try {
      await closeRoom(pin);
      router.push('/host/create');
    } catch (err: unknown) {
      console.error('Error al cerrar sala:', err);
      router.push('/host/create');
    }
  };

  const DisconnectBanner = () => {
    if (isConnected) return null;
    return (
      <div className="bg-[#FF7A59] text-white px-4 py-2.5 text-xs font-black text-center flex items-center justify-center space-x-2 border-b-2 border-[#1C1D1F] sticky top-18 z-40">
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        <span>⚠️ Conexión perdida con el servidor. Los jugadores siguen conectados en la sala. Reconectando...</span>
        <button
          onClick={() => reconnectHost(pin, isProjectorMode)}
          className="ml-3 px-3 py-1 rounded-full bg-white text-[#1C1D1F] font-black text-xs border border-[#1C1D1F] hover:bg-[#FEE77B] transition-colors"
        >
          Reconectar ahora ⚡
        </button>
      </div>
    );
  };

  const ProjectorToolbar = () => (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#ABD3DF]/30 border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ABD3DF] border border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] shrink-0">
            <Tv className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-heading font-black text-[#1C1D1F] block">
              {isProjectorMode ? 'Modo Proyector de Pantalla Gigante' : '📺 Enlace para Proyectar en Pantalla / TV'}
            </span>
            <span className="text-[11px] font-bold text-[#595B5F]">
              {isProjectorMode
                ? 'Vista limpia para cañón o proyector (sin teclado personal).'
                : 'Abre este enlace en la TV o cañón mientras juegas o controlas desde este dispositivo.'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyProjectorLink}
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#FEE77B] text-[#1C1D1F] text-xs font-black border border-[#1C1D1F] shadow-sm flex items-center space-x-1.5 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
            title="Copiar enlace directo de proyección"
          >
            {copiedToast ? <Check className="w-3.5 h-3.5 text-[#56B870]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedToast ? '¡Copiado!' : 'Copiar Enlace'}</span>
          </button>

          {!isProjectorMode && (
            <>
              <button
                type="button"
                onClick={handleOpenProjectorTab}
                className="h-9 px-3.5 rounded-xl bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] text-xs font-black border border-[#1C1D1F] shadow-sm flex items-center space-x-1.5 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
                title="Abrir vista de proyector en nueva pestaña"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Proyector ↗</span>
              </button>

              <button
                type="button"
                onClick={handleCloseRoom}
                className="h-9 px-3.5 rounded-xl bg-white hover:bg-[#FF7A59] hover:text-white text-[#FF7A59] text-xs font-black border border-[#1C1D1F] shadow-sm flex items-center space-x-1 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
                title="Cerrar la sala y finalizar para todos los jugadores"
              >
                <span>Cerrar Sala</span>
              </button>
            </>
          )}

          {isProjectorMode && (
            <button
              type="button"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="h-9 px-3.5 rounded-xl bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] text-xs font-black border border-[#1C1D1F] shadow-sm flex items-center space-x-1.5 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Pantalla Completa</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------------------
  // 0. Room Not Found State (Notification if room no longer exists)
  // ----------------------------------------------------------------
  if (roomNotFound) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-full p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F]">
            <div className="w-16 h-16 rounded-2xl bg-[#FF7A59]/20 border-2 border-[#FF7A59] text-[#FF7A59] flex items-center justify-center mx-auto mb-4">
              <WifiOff className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-heading font-black text-[#1C1D1F] mb-2">
              Sala No Encontrada
            </h2>
            <p className="text-sm font-bold text-[#595B5F] mb-6">
              La sala con PIN <strong className="text-[#1C1D1F] underline">{pin}</strong> ya no existe o ha caducado en el servidor.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/host/create')}
                className="w-full h-13 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-sm border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
              >
                Crear una Nueva Sala ⚡
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full h-13 rounded-full bg-white hover:bg-[#EDE8E1] text-[#1C1D1F] font-heading font-bold text-sm border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 1. Host Lobby View (Big Screen / Classroom Projector Presentation)
  // ----------------------------------------------------------------
  if (gameStatus === 'LOBBY') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <DisconnectBanner />
        <ProjectorToolbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between">
          {/* Top Host Header - Precious Plastic Workshop Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F] mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ABD3DF] border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]">
                <Tv className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#595B5F]">
                  Entra desde tu móvil o computadora:
                </span>
                <div className="text-xl sm:text-2xl font-heading font-black text-[#1C1D1F]">
                  mentalmath.app/play
                </div>
              </div>
            </div>

            {/* Giant PIN Badge - Precious Plastic Yellow Highlight */}
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-xs font-black text-[#595B5F] uppercase tracking-widest mb-1">
                PIN de la Sala
              </span>
              <div className="px-6 py-2 rounded-2xl bg-[#FEE77B] border-2 border-[#1C1D1F] text-4xl sm:text-6xl font-heading font-black tracking-widest text-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F]">
                {pin}
              </div>
            </div>
          </div>

          {/* Connected Players Grid */}
          <div className="flex-1 flex flex-col justify-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-[#1C1D1F] font-heading font-black text-lg">
                <Users className="w-5 h-5 text-[#1C1D1F]" />
                <span>Jugadores en la Sala ({playersList.length})</span>
              </div>
              {playersList.length === 0 && (
                <span className="text-xs font-bold text-[#595B5F] animate-pulse">
                  Esperando a que los participantes ingresen el PIN...
                </span>
              )}
            </div>

            <div className="min-h-[220px] p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] flex flex-wrap gap-3.5 items-center justify-center content-center">
              <AnimatePresence>
                {playersList.map((p, idx) => {
                  const tagColors = ['bg-[#BFDEBA]', 'bg-[#ABD3DF]', 'bg-[#FEE77B]', 'bg-[#D7C7F4]'];
                  const tagColor = tagColors[idx % tagColors.length];

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`px-5 py-2.5 rounded-2xl ${tagColor} border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-base sm:text-lg shadow-[0_3px_0_0_#1C1D1F] flex items-center space-x-2`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1C1D1F]" />
                      <span>{p.nickname}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {playersList.length === 0 && (
                <div className="text-center text-[#595B5F] text-sm font-medium">
                  Proyecta esta pantalla en clase o comparte el PIN con tu equipo.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-[#EDE8E1]">
            <span className="text-xs text-[#595B5F] font-bold">
              Las preguntas y el temporizador correrán sincronizados en vivo.
            </span>

            <button
              onClick={() => startGame(pin)}
              disabled={playersList.length === 0}
              className="h-14 px-8 rounded-full bg-[#BFDEBA] hover:bg-[#A6D49F] text-[#1C1D1F] font-heading font-black text-lg border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 flex items-center space-x-2"
            >
              <Play className="w-5 h-5 fill-[#1C1D1F]" />
              <span>Iniciar Partida</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. Countdown State (3, 2, 1)
  // ----------------------------------------------------------------
  if (gameStatus === 'STARTING' && countdown !== null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF9F5] text-[#1C1D1F] select-none">
        <motion.div
          key={countdown}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm sm:text-base font-heading font-black uppercase tracking-widest text-[#595B5F] mb-4 px-4 py-1.5 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F]">
            ¡La ronda comienza en!
          </span>
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#FEE77B] border-4 border-[#1C1D1F] shadow-[0_8px_0_0_#1C1D1F] flex items-center justify-center">
            <span className="text-7xl sm:text-9xl font-heading font-black text-[#1C1D1F]">
              {countdown > 0 ? countdown : '¡YA!'}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 3. Question Active View (Projector Big Formula)
  // ----------------------------------------------------------------
  if (gameStatus === 'QUESTION_ACTIVE' && currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F] select-none">
        <DisconnectBanner />
        <ProjectorToolbar />

        {/* Top Synchronized Progress Header */}
        <div className="max-w-6xl w-full mx-auto px-6 pt-4 pb-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-heading font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-[#1C1D1F]">
              Ronda {currentQuestion.questionNumber} de {currentQuestion.totalQuestions}
            </span>

            {/* Answered counter badge */}
            <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#BFDEBA] border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-sm shadow-[0_2px_0_0_#1C1D1F]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>
                {answeredCount} / {playersList.length} Respuestas
              </span>
            </div>
          </div>

          <TimerBar remainingSec={timeRemaining} totalSec={timeTotal} />
        </div>

        {/* Big Screen Central Calculation Display & Optional Host Playing Keypad */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 flex flex-col items-center justify-center py-6">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full rounded-3xl bg-white border-4 border-[#1C1D1F] text-center shadow-[0_10px_0_0_#1C1D1F] relative overflow-hidden ${
              roomSettings?.hostPlays && player && !isProjectorMode ? 'p-6 sm:p-10 mb-6' : 'p-10 sm:p-20'
            }`}
          >
            <div className={`${roomSettings?.hostPlays && player && !isProjectorMode ? 'text-5xl sm:text-7xl md:text-8xl' : 'text-6xl sm:text-8xl md:text-9xl'} font-heading font-black text-[#1C1D1F] tracking-tight my-2 sm:my-4`}>
              {currentQuestion.expression}
            </div>

            <span className="inline-block mt-2 sm:mt-4 px-4 py-1.5 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-xs sm:text-sm font-heading font-black text-[#1C1D1F] uppercase tracking-widest">
              {roomSettings?.hostPlays && player && !isProjectorMode ? '¡Calcula y responde abajo!' : 'Responde en tu pantalla'}
            </span>
          </motion.div>

          {/* Interactive Playing Area for Host if hostPlays is enabled AND not in projector view */}
          {roomSettings?.hostPlays && player && !isProjectorMode && (
            <div className="w-full max-w-md mx-auto flex flex-col items-center">
              <div className="flex items-center space-x-2 text-xs font-black mb-3">
                <span className="px-3 py-1 rounded-full bg-[#EDE8E1] border border-[#1C1D1F]">
                  Jugando como: <strong className="text-[#1C1D1F]">{player.nickname}</strong>
                </span>
                {player.streak > 1 && (
                  <span className="flex items-center space-x-1 text-[#1C1D1F] bg-[#FEE77B] px-2.5 py-0.5 rounded-full border border-[#1C1D1F] shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-[#FF7A59] text-[#FF7A59]" />
                    <span>x{player.streak}</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white border border-[#1C1D1F] text-[#1C1D1F]">
                  {player.score.toLocaleString()} pts
                </span>
              </div>

              {hasAnsweredCurrentRound ? (
                <div className="w-full p-5 rounded-2xl bg-[#BFDEBA] border-2 border-[#1C1D1F] text-center shadow-[0_4px_0_0_#1C1D1F]">
                  <p className="font-heading font-black text-lg text-[#1C1D1F]">
                    Tu respuesta: <span className="underline">{submittedAnswer}</span>
                  </p>
                  <p className="text-xs font-bold text-[#1C1D1F]/80">
                    Respuesta registrada. Esperando cierre del cálculo...
                  </p>
                </div>
              ) : (
                <Keypad
                  key={currentQuestion.id}
                  onSubmit={async (ans) => {
                    try {
                      await submitAnswer(ans);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  disabled={timeRemaining <= 0}
                />
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 4. Round Feedback & Leaderboard Summary
  // ----------------------------------------------------------------
  if (gameStatus === 'ROUND_FEEDBACK' && roundResults) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F] select-none">
        <Navbar />
        <DisconnectBanner />
        <ProjectorToolbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-between">
          {/* Solution Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] text-center shadow-[0_6px_0_0_#1C1D1F] mb-6"
          >
            <span className="text-xs font-black uppercase tracking-wider text-[#595B5F] block mb-1">
              Resultado Correcto
            </span>
            <div className="text-4xl sm:text-6xl font-heading font-black text-[#1C1D1F] mb-3">
              {roundResults.expression} ={' '}
              <span className="pp-highlight pp-highlight-green">{roundResults.correctAnswer}</span>
            </div>

            {roundResults.explanation && (
              <p className="text-sm text-[#1C1D1F] font-bold max-w-2xl mx-auto bg-[#EDE8E1] py-2 px-4 rounded-xl border border-[#1C1D1F]">
                💡 {roundResults.explanation}
              </p>
            )}

            {/* Host personal result if host was playing and not in projector mode */}
            {roomSettings?.hostPlays && player && !isProjectorMode && (() => {
              const myRes = roundResults.playerResults.find(r => r.playerId === player.id);
              if (!myRes) return null;
              return (
                <div className={`mt-4 p-3 rounded-2xl border-2 border-[#1C1D1F] max-w-lg mx-auto flex items-center justify-between text-xs font-black shadow-[0_2px_0_0_#1C1D1F] ${
                  myRes.isCorrect ? 'bg-[#BFDEBA] text-[#1C1D1F]' : 'bg-[#FF7A59] text-white'
                }`}>
                  <span>🎮 Tu Resultado ({player.nickname}): {myRes.isCorrect ? '¡Correcto!' : '¡Incorrecto!'}</span>
                  <span>+{myRes.pointsEarned} pts (Total: {myRes.totalScore} pts)</span>
                </div>
              );
            })()}
          </motion.div>

          {/* Top 5 Leaderboard */}
          <div className="flex-1 rounded-3xl bg-white border-2 border-[#1C1D1F] p-6 shadow-[0_6px_0_0_#1C1D1F] mb-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1C1D1F] mb-4 flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Clasificación Parcial</span>
            </h3>

            <div className="space-y-2.5">
              {leaderboard.slice(0, 5).map((entry) => (
                <div
                  key={entry.playerId}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]"
                >
                  <div className="flex items-center space-x-3.5">
                    <span
                      className={`w-7 h-7 rounded-full border-2 border-[#1C1D1F] flex items-center justify-center font-black text-xs ${
                        entry.rank === 1
                          ? 'bg-[#FEE77B] text-[#1C1D1F]'
                          : entry.rank === 2
                          ? 'bg-[#ABD3DF] text-[#1C1D1F]'
                          : entry.rank === 3
                          ? 'bg-[#BFDEBA] text-[#1C1D1F]'
                          : 'bg-[#EDE8E1] text-[#595B5F]'
                      }`}
                    >
                      #{entry.rank}
                    </span>
                    <span className="font-heading font-bold text-base text-[#1C1D1F]">{entry.nickname}</span>
                    {entry.streak > 1 && (
                      <div className="flex items-center space-x-1 text-xs text-[#1C1D1F] font-black bg-[#FEE77B] px-2 py-0.5 rounded-full border border-[#1C1D1F]">
                        <Flame className="w-3.5 h-3.5 fill-[#FF7A59] text-[#FF7A59]" />
                        <span>x{entry.streak}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-lg font-heading font-black text-[#1C1D1F]">
                    {entry.score.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Question / Finish Button & Auto Advance Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {roundResults.autoAdvance && !roundResults.isLastQuestion ? (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#ABD3DF] border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-sm shadow-[0_3px_0_0_#1C1D1F]">
                <Clock className="w-4 h-4 animate-spin" />
                <span>
                  Siguiente pregunta automáticamente en <span className="font-mono text-base font-black px-1.5 py-0.5 bg-white rounded-md border border-[#1C1D1F]">{autoAdvanceRemaining}s</span>
                </span>
              </div>
            ) : (
              <div className="text-xs text-[#595B5F] font-bold">
                {roundResults.isLastQuestion ? '¡Ronda final completada!' : 'Avance manual activo'}
              </div>
            )}

            <button
              onClick={() => nextQuestion(pin)}
              className="h-14 px-8 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-lg border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center space-x-2"
            >
              <span>
                {roundResults.isLastQuestion 
                  ? 'Ver Podio Final' 
                  : roundResults.autoAdvance 
                    ? 'Avanzar Ahora' 
                    : 'Siguiente Pregunta'}
              </span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 5. Grand Podium View
  // ----------------------------------------------------------------
  if (gameStatus === 'GAME_OVER' && gameOverData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
        <Navbar />
        <DisconnectBanner />
        <ProjectorToolbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          <Podium
            podium={gameOverData.podium}
            fullLeaderboard={gameOverData.fullLeaderboard}
            totalQuestions={gameOverData.totalQuestions}
          />

          <div className="max-w-md mx-auto mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePlayAgain}
              className="w-full sm:flex-1 h-14 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Jugar Otra Vez (Misma Sala)</span>
            </button>
            <button
              onClick={handleCloseRoom}
              className="w-full sm:flex-1 h-14 rounded-full bg-white hover:bg-[#EDE8E1] text-[#FF7A59] hover:text-[#FF6640] font-heading font-bold text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Cerrar Sala
            </button>
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

export default function HostRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
        <div className="w-10 h-10 border-4 border-[#1C1D1F] border-t-[#FEE77B] rounded-full animate-spin" />
      </div>
    }>
      <HostRoomContent />
    </Suspense>
  );
}

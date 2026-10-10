'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Tv, 
  Sparkles, 
  Settings2, 
  BrainCircuit, 
  Sliders, 
  Check, 
  ArrowRight, 
  Clock, 
  Layers, 
  Trash2, 
  Plus,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { OperationType, GameDifficulty, QuestionData, RoomSettings } from '@/types/game';
import { useGameSocket, getActiveGameSession, clearActiveGameSession, StoredSession } from '@/hooks/useGameSocket';
import { Zap } from 'lucide-react';

export default function HostCreatePage() {
  const router = useRouter();
  const { createRoom, isConnected, error: socketError } = useGameSocket();

  // Mode Selection: 'PROCEDURAL' | 'AI' | 'MANUAL'
  const [activeTab, setActiveTab] = useState<'PROCEDURAL' | 'AI' | 'MANUAL'>('PROCEDURAL');

  // Common Settings
  const [totalRounds, setTotalRounds] = useState<number>(10);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('MEDIUM');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [autoAdvanceDelaySec, setAutoAdvanceDelaySec] = useState<number>(4);
  const [hostPlays, setHostPlays] = useState<boolean>(false);
  const [hostNickname, setHostNickname] = useState<string>('Anfitrión');
  const [activeSession, setActiveSession] = useState<StoredSession | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    setActiveSession(getActiveGameSession());
  }, []);

  // Procedural Settings
  const [selectedOperations, setSelectedOperations] = useState<OperationType[]>([
    'ADDITION',
    'MULTIPLICATION_11',
    'COMPLEMENT_100',
    'SQUARE_5'
  ]);

  // AI Prompt Settings
  const [aiPrompt, setAiPrompt] = useState<string>(
    '10 cálculos de cálculo rápido usando complementos a 100 y truco del 11 para nivel intermedio'
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<QuestionData[]>([]);

  // Manual Questions List
  const [manualQuestions, setManualQuestions] = useState<QuestionData[]>([]);
  const [manualExpression, setManualExpression] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');
  const [manualExplanation, setManualExplanation] = useState('');

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const availableOps: { type: OperationType; label: string; iconDesc: string }[] = [
    { type: 'ADDITION', label: 'Sumas Mentales', iconDesc: '47 + 38' },
    { type: 'SUBTRACTION', label: 'Restas con Llevada', iconDesc: '83 - 47' },
    { type: 'MULTIPLICATION', label: 'Multiplicación Estándar', iconDesc: '14 × 7' },
    { type: 'MULTIPLICATION_11', label: 'Regla del 11', iconDesc: '65 × 11' },
    { type: 'COMPLEMENT_100', label: 'Complementos a 100', iconDesc: '100 - 64' },
    { type: 'SQUARE_5', label: 'Cuadrados en 5', iconDesc: '45²' },
    { type: 'DISTRIBUTIVE', label: 'Distributiva', iconDesc: '18 × 6' },
    { type: 'DOUBLE_HALF', label: 'Doble y Mitad', iconDesc: '25 × 16' },
    { type: 'DIVISION', label: 'Divisiones Exactas', iconDesc: '144 ÷ 12' }
  ];

  const toggleOp = (op: OperationType) => {
    setSelectedOperations((prev) =>
      prev.includes(op) ? prev.filter((o) => o !== op) : [...prev, op]
    );
  };

  // Trigger AI generation
  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          count: totalRounds,
          difficulty,
          timeLimitSec: timePerQuestion
        })
      });
      const data = await res.json();
      if (data.success && data.questions) {
        setAiGeneratedQuestions(data.questions);
      } else {
        setError(data.error || 'Error al generar preguntas con IA');
      }
    } catch {
      setError('Error de conexión con el servicio de IA');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Add Manual Question
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualExpression.trim() || !manualAnswer.trim()) return;

    const numAns = parseInt(manualAnswer, 10);
    if (isNaN(numAns)) {
      setError('El resultado debe ser un número entero');
      return;
    }

    const newQ: QuestionData = {
      id: `man_${Date.now()}`,
      order: manualQuestions.length + 1,
      expression: manualExpression.trim(),
      correctAnswer: numAns,
      explanation: manualExplanation.trim() || undefined,
      timeLimitSec: timePerQuestion,
      operationType: 'MIXED',
      difficulty
    };

    setManualQuestions([...manualQuestions, newQ]);
    setManualExpression('');
    setManualAnswer('');
    setManualExplanation('');
    setError(null);
  };

  // Launch Room
  const handleCreateRoom = async () => {
    setError(null);
    setIsCreating(true);

    const settings: RoomSettings = {
      title: 'Batalla de Cálculo Mental',
      totalRounds: activeTab === 'MANUAL' ? manualQuestions.length : totalRounds,
      timePerQuestion,
      difficulty,
      operations: selectedOperations.length > 0 ? selectedOperations : ['MIXED'],
      allowLateJoin: true,
      autoAdvance,
      autoAdvanceDelaySec,
      hostPlays,
      hostNickname: hostPlays ? (hostNickname.trim() || 'Anfitrión') : undefined
    };

    let customQs: QuestionData[] | undefined = undefined;

    if (activeTab === 'AI') {
      if (aiGeneratedQuestions.length === 0) {
        try {
          const res = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: aiPrompt,
              count: totalRounds,
              difficulty,
              timeLimitSec: timePerQuestion
            })
          });
          const data = await res.json();
          if (data.success) customQs = data.questions;
        } catch {
          // fallback
        }
      } else {
        customQs = aiGeneratedQuestions;
      }
    } else if (activeTab === 'MANUAL') {
      if (manualQuestions.length === 0) {
        setError('Debes agregar al menos 1 pregunta manual o usar el generador.');
        setIsCreating(false);
        return;
      }
      customQs = manualQuestions;
    }

    try {
      const pin = await createRoom(settings, customQs);
      router.push(`/host/${pin}`);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Error al iniciar la sala');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header - Workshop Controller */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-[#1C1D1F] text-xs font-black shadow-[0_2px_0_0_#1C1D1F] mb-2">
              <Tv className="w-3.5 h-3.5" />
              <span>Panel de Control de Aula / Anfitrión</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#1C1D1F]">
              Configurar <span className="pp-highlight pp-highlight-yellow">Partida</span>
            </h1>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isCreating || !isConnected}
            className="h-14 px-8 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-base border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{isCreating ? 'Iniciando...' : !isConnected ? 'Conectando al servidor...' : 'Lanzar Sala en Vivo'}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Real-time Connection Status Notice */}
        {hasMounted && !isConnected && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FF7A59]/15 border-2 border-[#FF7A59] flex items-center space-x-3 text-xs font-bold text-[#1C1D1F]">
            <span className="w-3 h-3 rounded-full bg-[#FF7A59] animate-ping shrink-0" />
            <span>
              {socketError || 'Conectando con el motor de juego en tiempo real... Si estás probando con Cloudflare Tunnel, verifica que el túnel continúe ejecutándose en la consola.'}
            </span>
          </div>
        )}

        {/* Active Room Recovery Banner */}
        {hasMounted && activeSession && activeSession.isHost && activeSession.pin && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#FEE77B]/40 border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#56B870] border border-[#1C1D1F] animate-ping mt-1 sm:mt-0 shrink-0" />
              <div>
                <p className="font-heading font-black text-base text-[#1C1D1F]">
                  Tienes una sala activa como Anfitrión (PIN: <span className="underline tracking-widest">{activeSession.pin}</span>)
                </p>
                <p className="text-xs text-[#595B5F] font-bold">
                  La sesión continúa abierta en el servidor. Puedes volver a controlarla o proyectarla.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => router.push(`/host/${activeSession.pin}`)}
                className="px-5 py-2.5 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-xs sm:text-sm border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 transition-all"
              >
                Volver a la Sala ↗
              </button>
              <button
                onClick={() => {
                  clearActiveGameSession();
                  setActiveSession(null);
                }}
                className="px-3.5 py-2.5 rounded-full bg-white hover:bg-red-50 text-[#FF7A59] font-black text-xs border-2 border-[#1C1D1F]"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FF7A59]/15 border-2 border-[#FF7A59] text-[#1C1D1F] text-sm font-bold">
            {error}
          </div>
        )}

        {/* Global Settings (Rounds, Time, Difficulty) - Precious Plastic tactile dials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Total Rounds */}
          <div className="p-5 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F]">
            <span className="text-xs font-black text-[#1C1D1F] uppercase tracking-wider block mb-3">
              Número de Rondas
            </span>
            <div className="flex items-center space-x-2">
              {[5, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => setTotalRounds(count)}
                  className={`flex-1 h-11 rounded-2xl font-heading font-black text-sm border-2 border-[#1C1D1F] transition-all ${
                    totalRounds === count
                      ? 'bg-[#FEE77B] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]'
                      : 'bg-[#FBF9F5] text-[#595B5F] hover:bg-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit per Question */}
          <div className="p-5 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F]">
            <span className="text-xs font-black text-[#1C1D1F] uppercase tracking-wider block mb-3">
              Tiempo por Cálculo
            </span>
            <div className="flex items-center space-x-2">
              {[7, 10, 15, 20].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTimePerQuestion(sec)}
                  className={`flex-1 h-11 rounded-2xl font-heading font-black text-sm border-2 border-[#1C1D1F] transition-all ${
                    timePerQuestion === sec
                      ? 'bg-[#ABD3DF] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]'
                      : 'bg-[#FBF9F5] text-[#595B5F] hover:bg-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="p-5 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F]">
            <span className="text-xs font-black text-[#1C1D1F] uppercase tracking-wider block mb-3">
              Nivel de Dificultad
            </span>
            <div className="flex items-center space-x-2">
              {(['BEGINNER', 'MEDIUM', 'ADVANCED'] as GameDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 h-11 rounded-2xl font-heading font-black text-xs border-2 border-[#1C1D1F] transition-all ${
                    difficulty === diff
                      ? 'bg-[#BFDEBA] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]'
                      : 'bg-[#FBF9F5] text-[#595B5F] hover:bg-white'
                  }`}
                >
                  {diff === 'BEGINNER' ? 'Fácil' : diff === 'MEDIUM' ? 'Medio' : 'Pro'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Auto Advance Setting (Pase automático de cálculos) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FEE77B] border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F] shrink-0">
              <Zap className="w-6 h-6 fill-[#1C1D1F]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-black text-base text-[#1C1D1F]">
                  Pase Automático de Preguntas
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#BFDEBA] border border-[#1C1D1F] text-[#1C1D1F]">
                  Uno tras otro
                </span>
              </div>
              <p className="text-xs font-medium text-[#595B5F] mt-0.5 max-w-xl">
                Avanza automáticamente al siguiente cálculo sin que el anfitrión tenga que pulsar manualmente cada vez.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-auto">
            {autoAdvance && (
              <div className="flex items-center space-x-1.5 bg-[#EDE8E1] p-1 rounded-2xl border-2 border-[#1C1D1F]">
                <span className="text-[11px] font-black text-[#595B5F] pl-2">Pausa:</span>
                {[3, 4, 5].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setAutoAdvanceDelaySec(sec)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black border border-[#1C1D1F] transition-all ${
                      autoAdvanceDelaySec === sec
                        ? 'bg-[#FEE77B] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]'
                        : 'bg-white text-[#595B5F]'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`h-11 px-5 rounded-2xl font-heading font-black text-xs border-2 border-[#1C1D1F] transition-all flex items-center space-x-1.5 ${
                autoAdvance
                  ? 'bg-[#BFDEBA] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                  : 'bg-[#EDE8E1] text-[#595B5F] shadow-none'
              }`}
            >
              <span>{autoAdvance ? 'Activado ✓' : 'Manual'}</span>
            </button>
          </div>
        </div>

        {/* Host Plays Setting (El que crea la sala también juega) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ABD3DF] border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F] shrink-0">
              <BrainCircuit className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-black text-base text-[#1C1D1F]">
                  ¿Quieres jugar tú también en la sala?
                </h3>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#1C1D1F] ${
                  hostPlays ? 'bg-[#BFDEBA] text-[#1C1D1F]' : 'bg-[#EDE8E1] text-[#595B5F]'
                }`}>
                  {hostPlays ? 'Anfitrión Jugador' : 'Solo Anfitrión'}
                </span>
              </div>
              <p className="text-xs font-medium text-[#595B5F] mt-0.5 max-w-xl">
                Permite al creador responder los cálculos y competir en el podio desde su propia pantalla con teclado numérico interactivo.
              </p>
              <div className="mt-2.5 flex items-center space-x-2 text-[11px] font-bold text-[#1C1D1F] bg-[#FEE77B]/40 px-3 py-1.5 rounded-xl border border-[#1C1D1F]/20">
                <Tv className="w-3.5 h-3.5 text-[#1C1D1F] shrink-0" />
                <span>
                  <strong>Enlace para proyectar siempre disponible:</strong> Tendrás siempre un enlace directo para abrir la vista limpia en pantalla gigante o TV mientras juegas en tu pantalla.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 self-end md:self-auto">
            {hostPlays && (
              <div className="flex items-center space-x-2 bg-[#FBF9F5] p-1.5 rounded-2xl border-2 border-[#1C1D1F]">
                <label className="text-[11px] font-black text-[#595B5F] pl-2">Tu Apodo:</label>
                <input
                  type="text"
                  maxLength={14}
                  value={hostNickname}
                  onChange={(e) => setHostNickname(e.target.value)}
                  placeholder="Apodo Anfitrión"
                  className="w-32 h-9 px-3 rounded-xl bg-white border border-[#1C1D1F] text-xs font-bold text-[#1C1D1F] focus:outline-none focus:ring-1 focus:ring-[#BFDEBA]"
                />
              </div>
            )}

            <button
              onClick={() => setHostPlays(!hostPlays)}
              className={`h-11 px-5 rounded-2xl font-heading font-black text-xs border-2 border-[#1C1D1F] transition-all flex items-center space-x-1.5 ${
                hostPlays
                  ? 'bg-[#BFDEBA] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                  : 'bg-[#EDE8E1] text-[#595B5F]'
              }`}
            >
              <span>{hostPlays ? 'Participar y Jugar ✓' : 'Solo Proyectar'}</span>
            </button>
          </div>
        </div>

        {/* 3 Generator Mode Tabs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F]">
          <div className="flex flex-wrap items-center gap-2 border-b-2 border-[#EDE8E1] pb-4 mb-6">
            <button
              onClick={() => setActiveTab('PROCEDURAL')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full font-heading font-bold text-xs sm:text-sm border-2 border-[#1C1D1F] transition-all ${
                activeTab === 'PROCEDURAL'
                  ? 'bg-[#FEE77B] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                  : 'bg-white text-[#595B5F] hover:bg-[#EDE8E1]'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#1C1D1F]" />
              <span>1. Generador Modular</span>
            </button>

            <button
              onClick={() => setActiveTab('AI')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full font-heading font-bold text-xs sm:text-sm border-2 border-[#1C1D1F] transition-all ${
                activeTab === 'AI'
                  ? 'bg-[#ABD3DF] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                  : 'bg-white text-[#595B5F] hover:bg-[#EDE8E1]'
              }`}
            >
              <Wand2 className="w-4 h-4 text-[#1C1D1F]" />
              <span>2. Asistencia por IA</span>
            </button>

            <button
              onClick={() => setActiveTab('MANUAL')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full font-heading font-bold text-xs sm:text-sm border-2 border-[#1C1D1F] transition-all ${
                activeTab === 'MANUAL'
                  ? 'bg-[#BFDEBA] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]'
                  : 'bg-white text-[#595B5F] hover:bg-[#EDE8E1]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#1C1D1F]" />
              <span>3. Preguntas Manuales</span>
            </button>
          </div>

          {/* TAB 1: PROCEDURAL */}
          {activeTab === 'PROCEDURAL' && (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-heading font-black text-[#1C1D1F] mb-1">
                  Selecciona las Técnicas y Operaciones
                </h3>
                <p className="text-xs font-medium text-[#595B5F]">
                  El generador creará aleatoriamente {totalRounds} cálculos matemáticos basados en las categorías marcadas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {availableOps.map((op) => {
                  const isSelected = selectedOperations.includes(op.type);
                  return (
                    <button
                      key={op.type}
                      onClick={() => toggleOp(op.type)}
                      className={`p-4 rounded-2xl text-left border-2 border-[#1C1D1F] transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-[#BFDEBA] shadow-[0_3px_0_0_#1C1D1F] -translate-y-0.5'
                          : 'bg-[#FBF9F5] hover:bg-white text-[#595B5F] opacity-75'
                      }`}
                    >
                      <div>
                        <span className="font-heading font-black text-sm text-[#1C1D1F] block">
                          {op.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#1C1D1F] mt-1 block">
                          {op.iconDesc}
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg border-2 border-[#1C1D1F] flex items-center justify-center ${
                          isSelected ? 'bg-white text-[#1C1D1F]' : 'bg-[#EDE8E1] text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AI GENERATOR */}
          {activeTab === 'AI' && (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-heading font-black text-[#1C1D1F] mb-1">
                  Generador con Inteligencia Artificial
                </h3>
                <p className="text-xs font-medium text-[#595B5F]">
                  Escribe un prompt en lenguaje natural para generar los cálculos con respuestas verificadas al 100%.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ej: 10 cálculos de cálculo rápido usando complementos a 100 y restas con llevada para nivel intermedio"
                  className="w-full p-4 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ABD3DF] text-sm text-[#1C1D1F] font-medium shadow-[0_2px_0_0_#1C1D1F]"
                />

                <button
                  onClick={handleGenerateAi}
                  disabled={isGeneratingAi}
                  className="h-12 px-6 rounded-full bg-[#ABD3DF] hover:bg-[#95CBD8] border-2 border-[#1C1D1F] text-[#1C1D1F] font-heading font-black text-sm shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 stroke-[2.5] ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAi ? 'Generando preguntas...' : 'Generar Preguntas con IA'}</span>
                </button>

                {aiGeneratedQuestions.length > 0 && (
                  <div className="mt-6 pt-4 border-t-2 border-[#EDE8E1]">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1C1D1F] block mb-3">
                      Vista previa de {aiGeneratedQuestions.length} preguntas generadas:
                    </span>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {aiGeneratedQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-3 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-slate-400">#{idx + 1}</span>
                            <span className="text-base font-heading font-black text-[#1C1D1F]">{q.expression}</span>
                          </div>
                          <span className="font-black text-sm px-2.5 py-0.5 rounded-full bg-[#BFDEBA] border border-[#1C1D1F] text-[#1C1D1F]">
                            = {q.correctAnswer}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL QUESTIONS */}
          {activeTab === 'MANUAL' && (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-heading font-black text-[#1C1D1F] mb-1">
                  Crear Lista de Preguntas Manuales
                </h3>
                <p className="text-xs font-medium text-[#595B5F]">
                  Define manualmente cada cálculo matemático y su respuesta.
                </p>
              </div>

              <form onSubmit={handleAddManual} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div>
                  <label className="block text-[11px] font-black text-[#1C1D1F] uppercase mb-1">
                    Operación
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 35 × 11"
                    value={manualExpression}
                    onChange={(e) => setManualExpression(e.target.value)}
                    className="w-full h-12 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] px-3.5 text-sm font-bold text-[#1C1D1F] focus:outline-none focus:bg-white shadow-[0_2px_0_0_#1C1D1F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#1C1D1F] uppercase mb-1">
                    Resultado
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 385"
                    value={manualAnswer}
                    onChange={(e) => setManualAnswer(e.target.value)}
                    className="w-full h-12 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] px-3.5 text-sm font-bold text-[#1C1D1F] focus:outline-none focus:bg-white shadow-[0_2px_0_0_#1C1D1F]"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full h-12 rounded-full bg-[#BFDEBA] hover:bg-[#A6D49F] text-[#1C1D1F] font-heading font-black text-sm border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Añadir Pregunta</span>
                  </button>
                </div>
              </form>

              {manualQuestions.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {manualQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-400">#{idx + 1}</span>
                        <span className="text-sm font-heading font-black text-[#1C1D1F]">{q.expression}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#BFDEBA] border border-[#1C1D1F] text-[#1C1D1F]">
                          = {q.correctAnswer}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setManualQuestions(manualQuestions.filter((_, i) => i !== idx))
                        }
                        className="text-slate-400 hover:text-[#FF7A59] p-1.5 rounded-full hover:bg-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Tv, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Users, 
  Flame, 
  Play,
  CheckCircle2,
  Cpu,
  Globe2,
  Clock,
  Compass,
  RotateCcw
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ACADEMY_TECHNIQUES } from '@/lib/academy-data';
import { DiceLogo } from '@/components/common/DiceLogo';
import { getActiveGameSession, clearActiveGameSession, StoredSession } from '@/hooks/useGameSocket';

export default function HomePage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [activeSession, setActiveSession] = useState<StoredSession | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [sessionAlert, setSessionAlert] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
    setActiveSession(getActiveGameSession());
  }, []);

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Por favor ingresa un código PIN válido.');
      return;
    }
    if (!nickname.trim()) {
      setError('Por favor escribe tu apodo o nickname.');
      return;
    }
    router.push(`/play?pin=${encodeURIComponent(pin.trim())}&nick=${encodeURIComponent(nickname.trim())}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F] selection:bg-[#FEE77B] selection:text-[#1C1D1F] relative overflow-x-hidden">
      <Navbar />

      {/* Floating Decorative Math Tokens (Background Parallax Micro-animation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 max-w-6xl mx-auto">
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-28 left-6 hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FEE77B] border-2 border-[#1C1D1F] text-xl font-heading font-black shadow-[0_3px_0_0_#1C1D1F] opacity-75"
        >
          +
        </motion.div>
        <motion.div
          animate={{ y: [0, 16, 0], rotate: [8, -8, 8] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-44 right-8 hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ABD3DF] border-2 border-[#1C1D1F] text-xl font-heading font-black shadow-[0_3px_0_0_#1C1D1F] opacity-75"
        >
          ×
        </motion.div>
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-96 left-10 hidden lg:flex items-center justify-center w-11 h-11 rounded-2xl bg-[#BFDEBA] border-2 border-[#1C1D1F] text-lg font-heading font-black shadow-[0_3px_0_0_#1C1D1F] opacity-70"
        >
          ÷
        </motion.div>
        <motion.div
          animate={{ y: [0, 14, 0], rotate: [6, -6, 6] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut" }}
          className="absolute top-[480px] right-14 hidden lg:flex items-center justify-center w-11 h-11 rounded-2xl bg-[#D7C7F4] border-2 border-[#1C1D1F] text-lg font-heading font-black shadow-[0_3px_0_0_#1C1D1F] opacity-70"
        >
          %
        </motion.div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {sessionAlert && (
          <div className="w-full max-w-xl mx-auto mb-6 p-4 rounded-2xl bg-[#FF7A59]/20 border-2 border-[#FF7A59] text-[#1C1D1F] text-xs font-bold text-center flex items-center justify-between">
            <span>⚠️ {sessionAlert}</span>
            <button onClick={() => setSessionAlert(null)} className="ml-2 font-black text-sm hover:underline">✕</button>
          </div>
        )}

        {/* Active Session Recovery Banner */}
        {hasMounted && activeSession && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto mb-8 p-4 rounded-3xl bg-[#FEE77B] border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] shadow-sm flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1C1D1F] block">
                  {activeSession.isHost ? '🎮 Eres Anfitrión de una Sala' : '⚡ Tienes una Partida en Curso'}
                </span>
                <span className="text-sm font-heading font-black text-[#1C1D1F]">
                  PIN {activeSession.pin} {activeSession.nickname ? `• ${activeSession.nickname}` : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (activeSession.isHost) {
                    router.push(`/host/${activeSession.pin}`);
                  } else {
                    router.push('/play');
                  }
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#BFDEBA] hover:bg-[#A6D49F] text-[#1C1D1F] font-heading font-black text-xs border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Reanudar Partida ⚡
              </button>
              <button
                onClick={() => {
                  clearActiveGameSession();
                  setActiveSession(null);
                }}
                className="px-3 py-2 rounded-full bg-white text-[#595B5F] hover:text-[#1C1D1F] font-bold text-xs border border-[#1C1D1F] transition-all"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        )}

        {/* Hero Section - Precious Plastic Headline */}
        <motion.div
          initial={{ opacity: 0.9, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-4xl mb-10 sm:mb-16"
        >
          {/* Tag badge with Animated 3D Dice Logo */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-[#1C1D1F] text-xs sm:text-sm font-black shadow-[0_2px_0_0_#1C1D1F] mb-5 hover:scale-105 transition-transform">
            <DiceLogo size={24} autoRotate={true} />
            <span>Plataforma Abierta de Cálculo Mental</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight text-[#1C1D1F] mb-5 leading-tight">
            Entrena y compite en{' '}
            <span className="pp-highlight pp-highlight-yellow">Tiempo Real</span>
            <br className="hidden sm:inline" /> con{' '}
            <span className="pp-highlight pp-highlight-blue">Cálculo Mental</span>
          </h1>

          <p className="text-[#595B5F] text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Un gimnasio colaborativo de agilidad numérica: desafía a tus compañeros, proyecta en el aula o domina atajos matemáticos paso a paso.
          </p>
        </motion.div>

        {/* Action Grid: Player Join vs Host Room (Precious Plastic Modular Cards) */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0.9, y: 24 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20"
        >
          {/* Player Quick Join Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F] relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#BFDEBA] border-2 border-[#1C1D1F] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]">
                  Paso a Paso
                </span>
                <span className="text-xs font-bold text-[#595B5F]">Multijugador</span>
              </div>

              <div className="flex items-center space-x-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#BFDEBA] border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]">
                  <Play className="w-6 h-6 fill-[#1C1D1F]" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-black text-[#1C1D1F]">Unirse a Partida</h2>
                  <p className="text-xs font-medium text-[#595B5F]">Ingresa el código PIN proyectado en pantalla</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-[#FF7A59]/15 border-2 border-[#FF7A59] text-[#1C1D1F] text-xs font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleJoinGame} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#1C1D1F] uppercase tracking-wider mb-1.5">
                    1. Código PIN de la Sala
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    placeholder="Ej: 849201"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-12 sm:h-14 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FEE77B] px-4 text-2xl font-heading font-black tracking-widest text-center text-[#1C1D1F] placeholder-slate-400 shadow-[0_2px_0_0_#1C1D1F] transition-all uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1C1D1F] uppercase tracking-wider mb-1.5">
                    2. Tu Apodo o Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre en la partida"
                    maxLength={16}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full h-14 rounded-2xl bg-[#FBF9F5] border-2 border-[#1C1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FEE77B] px-4 text-lg font-bold text-[#1C1D1F] placeholder-slate-400 shadow-[0_2px_0_0_#1C1D1F] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-14 rounded-full bg-[#BFDEBA] hover:bg-[#A6D49F] text-[#1C1D1F] font-heading font-black text-lg border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2"
                >
                  <span>¡Entrar al Juego!</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </form>

              {/* Direct Solo Practice Shortcut */}
              <div className="mt-5 pt-4 border-t-2 border-[#EDE8E1] text-center">
                <span className="text-xs font-bold text-[#595B5F] block mb-2">
                  ¿Estás solo o quieres probar tu agilidad sin PIN?
                </span>
                <Link
                  href="/play?mode=solo"
                  className="w-full h-12 rounded-full bg-[#EDE8E1] hover:bg-[#FEE77B] text-[#1C1D1F] font-heading font-black text-xs sm:text-sm border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 fill-[#1C1D1F]" />
                  <span>⚡ Modo Práctica Rápida (1 Jugador)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Host / Create Game Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#EDE8E1] border-2 border-[#1C1D1F] shadow-[0_6px_0_0_#1C1D1F] relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FEE77B] border-2 border-[#1C1D1F] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]">
                  Anfitrión & Aula
                </span>
                <span className="text-xs font-bold text-[#595B5F]">Pantalla Grande</span>
              </div>

              <div className="flex items-center space-x-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FEE77B] border-2 border-[#1C1D1F] flex items-center justify-center text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F]">
                  <Tv className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-black text-[#1C1D1F]">Crear Sala</h2>
                  <p className="text-xs font-medium text-[#595B5F]">Proyecta preguntas en TV, cañón o proyector</p>
                </div>
              </div>

              <p className="text-[#595B5F] text-sm mb-6 leading-relaxed font-medium">
                Configura tu sala a medida: elige operaciones (sumas, restas, trucos del 11, cuadrados), tiempos por pregunta o genera desafíos dinámicos con nuestro{' '}
                <strong className="text-[#1C1D1F] underline decoration-[#FF7A59] decoration-2">Asistente IA</strong>.
              </p>

              <div className="space-y-3 mb-6 bg-white/70 p-4 rounded-2xl border-2 border-[#1C1D1F]">
                <div className="flex items-center space-x-2.5 text-xs text-[#1C1D1F] font-bold">
                  <Users className="w-4 h-4 text-[#1C1D1F]" />
                  <span>Soporta decenas de jugadores en simultáneo</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-[#1C1D1F] font-bold">
                  <Flame className="w-4 h-4 text-[#FF7A59]" />
                  <span>Rachas de aciertos y puntuación por milisegundos</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-[#1C1D1F] font-bold">
                  <Trophy className="w-4 h-4 text-[#1C1D1F]" />
                  <span>Podio 3D interactivo con confeti al final</span>
                </div>
              </div>
            </div>

            <Link
              href="/host/create"
              className="w-full h-14 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-lg border-2 border-[#1C1D1F] shadow-[0_4px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2 text-center"
            >
              <span>Configurar Nueva Sala</span>
              <Tv className="w-5 h-5 stroke-[2.5]" />
            </Link>
          </div>
        </motion.div>

        {/* Precious Plastic Signature: "How Does It Work?" (section-hosdoesitwork) */}
        <motion.section
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0.9, y: 24 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#1C1D1F] mb-3">
              <span className="pp-highlight pp-highlight-bluelight">¿Cómo Funciona?</span>
            </h2>
            <p className="text-[#595B5F] font-medium text-sm sm:text-base max-w-xl mx-auto">
              Diseñado con la filosofía abierta de Precious Plastic: sencillo de usar, sin registros obligatorios y accesible para todos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0.9, y: 15 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FEE77B] border-2 border-[#1C1D1F] font-heading font-black text-lg flex items-center justify-center mb-4 shadow-[0_2px_0_0_#1C1D1F]">
                  1
                </div>
                <h3 className="text-lg font-heading font-black text-[#1C1D1F] mb-2">
                  Entra con tu PIN
                </h3>
                <p className="text-xs font-medium text-[#595B5F] leading-relaxed">
                  El anfitrión proyecta el PIN de 6 dígitos. Cada jugador entra desde su celular en segundos.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-[#EDE8E1] text-[11px] font-bold text-[#1C1D1F]">
                Cero registros previos
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0.9, y: 15 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#ABD3DF] border-2 border-[#1C1D1F] font-heading font-black text-lg flex items-center justify-center mb-4 shadow-[0_2px_0_0_#1C1D1F]">
                  2
                </div>
                <h3 className="text-lg font-heading font-black text-[#1C1D1F] mb-2">
                  Cálculo & Teclado
                </h3>
                <p className="text-xs font-medium text-[#595B5F] leading-relaxed">
                  Resuelve la operación en mente y teclea el resultado en un teclado numérico táctil de alta velocidad.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-[#EDE8E1] text-[11px] font-bold text-[#1C1D1F]">
                Contrarreloj en vivo
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0.9, y: 15 }}
              viewport={{ once: true }}
              transition={{ delay: 0.19, duration: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#BFDEBA] border-2 border-[#1C1D1F] font-heading font-black text-lg flex items-center justify-center mb-4 shadow-[0_2px_0_0_#1C1D1F]">
                  3
                </div>
                <h3 className="text-lg font-heading font-black text-[#1C1D1F] mb-2">
                  Rachas y Multiplicadores
                </h3>
                <p className="text-xs font-medium text-[#595B5F] leading-relaxed">
                  Cuanto más rápido y preciso respondas, mayor tu racha de fuego y más puntos acumularás.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-[#EDE8E1] text-[11px] font-bold text-[#1C1D1F]">
                Multiplicador de Velocidad
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0.9, y: 15 }}
              viewport={{ once: true }}
              transition={{ delay: 0.26, duration: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FF7A59] text-white border-2 border-[#1C1D1F] font-heading font-black text-lg flex items-center justify-center mb-4 shadow-[0_2px_0_0_#1C1D1F]">
                  4
                </div>
                <h3 className="text-lg font-heading font-black text-[#1C1D1F] mb-2">
                  Podio y Retroalimentación
                </h3>
                <p className="text-xs font-medium text-[#595B5F] leading-relaxed">
                  Al finalizar, el aula o grupo corona a los campeones con un podio 3D y análisis de errores comunes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-[#EDE8E1] text-[11px] font-bold text-[#1C1D1F]">
                Celebración colectiva
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Precious Plastic Signature: "Results & Impact Data" (section-map style) */}
        <motion.section
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0.9, scale: 0.98 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mb-20"
        >
          <div className="rounded-3xl bg-[#EDE8E1] border-2 border-[#1C1D1F] p-8 sm:p-10 shadow-[0_6px_0_0_#1C1D1F]">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#1C1D1F] mb-2">
                <span className="pp-highlight pp-highlight-white">Nuestros Resultados</span>
              </h2>
              <p className="text-sm font-medium text-[#595B5F]">
                Herramientas creadas por y para estudiantes, docentes y mentes curiosas.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-white border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] text-center"
              >
                <p className="text-3xl sm:text-4xl font-heading font-black text-[#1C1D1F] mb-1">100%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#595B5F]">Código Abierto</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-[#BFDEBA] border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] text-center"
              >
                <p className="text-3xl sm:text-4xl font-heading font-black text-[#1C1D1F] mb-1">9+</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1C1D1F]">Técnicas Mentales</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-white border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] text-center"
              >
                <p className="text-3xl sm:text-4xl font-heading font-black text-[#1C1D1F] mb-1">&lt; 50ms</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#595B5F]">Latencia en Vivo</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-[#FEE77B] border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] text-center"
              >
                <p className="text-3xl sm:text-4xl font-heading font-black text-[#1C1D1F] mb-1">0€</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1C1D1F]">Siempre Libre</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Academy Preview Section (Precious Plastic Solution Cards) */}
        <motion.section
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0.9, y: 24 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-[#1C1D1F] font-black text-xs uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4 text-[#1C1D1F]" />
                <span>Planos de Aprendizaje Abiertos</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-[#1C1D1F]">
                Academia: <span className="pp-highlight pp-highlight-green">Atajos & Técnicas</span>
              </h2>
            </div>

            <Link
              href="/academy"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-[#1C1D1F] bg-white hover:bg-[#FEE77B] text-[#1C1D1F] text-xs sm:text-sm font-black shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>Ver todas las técnicas</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACADEMY_TECHNIQUES.slice(0, 3).map((tech, idx) => {
              const bgColors = ['bg-[#FEE77B]', 'bg-[#ABD3DF]', 'bg-[#BFDEBA]'];
              const accentColor = bgColors[idx % bgColors.length];

              return (
                <motion.div
                  key={tech.id}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0.9, y: 15 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="flex"
                >
                  <Link
                    href={`/academy/${tech.slug}`}
                    className="w-full p-6 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] hover:shadow-[0_8px_0_0_#1C1D1F] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${accentColor} border-2 border-[#1C1D1F] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]`}>
                          {tech.category}
                        </span>
                        <span className="text-xs font-bold text-[#595B5F]">
                          {tech.difficulty}
                        </span>
                      </div>

                      <h3 className="text-xl font-heading font-black text-[#1C1D1F] group-hover:text-black mb-2">
                        {tech.title}
                      </h3>

                      <p className="text-xs font-medium text-[#595B5F] line-clamp-3 leading-relaxed mb-4">
                        {tech.shortDesc}
                      </p>
                    </div>

                    <div className="pt-3 border-t-2 border-[#EDE8E1] flex items-center justify-between text-xs font-black text-[#1C1D1F]">
                      <span>Practicar técnica</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </main>

      {/* Footer - Precious Plastic Community Style */}
      <footer className="w-full border-t-2 border-[#1C1D1F] bg-[#EDE8E1] py-8 text-center text-xs font-bold text-[#595B5F] mt-20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#56B870] border border-[#1C1D1F]" />
            <span className="text-[#1C1D1F]">MentalMath — Plataforma de Cálculo Mental en Tiempo Real</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://link.mercadopago.com.ar/emanuelpontoni"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border-2 border-[#1C1D1F] bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] text-xs font-black shadow-[0_2px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
            >
              <span>☕ Apoyar en Mercado Pago</span>
            </a>
            <Link href="/academy" className="hover:underline text-[#1C1D1F]">Academia</Link>
            <span className="text-slate-400">•</span>
            <span>100% Libre & Abierto</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

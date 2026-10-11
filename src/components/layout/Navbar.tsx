'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Volume2, VolumeX, BookOpen, Tv, Zap, Home, Heart } from 'lucide-react';
import { sounds } from '@/lib/sound';
import { DiceLogo } from '@/components/common/DiceLogo';

export const Navbar: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setIsMuted(sounds.getMuted());
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    sounds.setMuted(next);
    setIsMuted(next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#1C1D1F] bg-[#FBF9F5]/95 backdrop-blur-md transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo - Precious Plastic animated 3D dice */}
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
          <DiceLogo size={36} className="sm:w-11 sm:h-11 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="font-heading font-black text-lg sm:text-2xl tracking-tight text-[#1C1D1F]">
                MentalMath
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#BFDEBA] border border-[#1C1D1F] text-[#1C1D1F]">
                Open
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#595B5F] -mt-0.5 hidden md:block">
              Gimnasio de Cálculo en Vivo
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1.5 sm:space-x-3">
          <Link
            href="/academy"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border-2 border-[#1C1D1F] bg-[#FFFFFF] hover:bg-[#D5E9EF] text-[#1C1D1F] text-xs sm:text-sm font-bold shadow-[0_2px_0_0_#1C1D1F] sm:shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            title="Academia de atajos matemáticos"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1C1D1F]" />
            <span className="hidden sm:inline">Academia</span>
          </Link>

          <Link
            href="/host/create"
            className="flex items-center space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-[#1C1D1F] bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] text-xs sm:text-sm font-black shadow-[0_2px_0_0_#1C1D1F] sm:shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0"
            title="Crear sala para proyectar"
          >
            <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1C1D1F]" />
            <span className="whitespace-nowrap">Crear Sala</span>
          </Link>

          {/* Donation Button (Mercado Pago) */}
          <a
            href="https://link.mercadopago.com.ar/emanuelpontoni"
            target="_blank"
            rel="noopener noreferrer"
            title="Apoyar el proyecto libre en Mercado Pago"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border-2 border-[#1C1D1F] bg-[#ABD3DF] hover:bg-[#8EC5D6] text-[#1C1D1F] text-xs sm:text-sm font-black shadow-[0_2px_0_0_#1C1D1F] sm:shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-[#FF7A59] text-[#1C1D1F]" />
            <span className="hidden sm:inline">Donar</span>
          </a>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            aria-label={hasMounted && isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#1C1D1F] bg-[#FFFFFF] hover:bg-[#EDE8E1] flex items-center justify-center text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F] sm:shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            suppressHydrationWarning
          >
            {hasMounted && isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF7A59]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1C1D1F]" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

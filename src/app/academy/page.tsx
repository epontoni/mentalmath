'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Star, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Award,
  Compass
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ACADEMY_TECHNIQUES } from '@/lib/academy-data';

export default function AcademyPage() {
  const [drillRecords, setDrillRecords] = useState<Record<string, { stars: number; bestScore: number }>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const records: Record<string, { stars: number; bestScore: number }> = {};
      ACADEMY_TECHNIQUES.forEach((t) => {
        const stored = localStorage.getItem(`drill_record_${t.slug}`);
        if (stored) {
          try {
            records[t.slug] = JSON.parse(stored);
          } catch {}
        }
      });
      setDrillRecords(records);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1D1F]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header - Precious Plastic Workshop Starterkit Vibe */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-[#1C1D1F] text-xs font-black shadow-[0_2px_0_0_#1C1D1F] mb-4">
            <Compass className="w-4 h-4 text-[#1C1D1F]" />
            <span>Guías & Planos de Aprendizaje Abiertos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#1C1D1F] mb-4 tracking-tight leading-tight">
            Academia de <span className="pp-highlight pp-highlight-yellow">Cálculo Mental</span>
          </h1>

          <p className="text-[#595B5F] text-sm sm:text-base leading-relaxed font-medium">
            Desarmamos las matemáticas como quien construye una máquina abierta: aprende atajos mentales, técnicas de cálculo rápido y ponlas a prueba en el modo Drill individual.
          </p>
        </div>

        {/* Techniques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ACADEMY_TECHNIQUES.map((tech, idx) => {
            const record = drillRecords[tech.slug];
            const pillColors = ['bg-[#FEE77B]', 'bg-[#ABD3DF]', 'bg-[#BFDEBA]', 'bg-[#D7C7F4]'];
            const pillColor = pillColors[idx % pillColors.length];

            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#1C1D1F] shadow-[0_5px_0_0_#1C1D1F] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#1C1D1F] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full ${pillColor} border-2 border-[#1C1D1F] text-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F]`}>
                      {tech.category}
                    </span>

                    {/* Star Rating Badge */}
                    <div className="flex items-center space-x-1 bg-[#EDE8E1] px-2.5 py-1 rounded-full border border-[#1C1D1F]">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            record && record.stars >= star
                              ? 'text-[#1C1D1F] fill-[#FEE77B]'
                              : 'text-slate-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="text-2xl font-heading font-black text-[#1C1D1F] group-hover:text-black transition-colors mb-2">
                    {tech.title}
                  </h2>

                  <p className="text-sm font-medium text-[#595B5F] mb-6 leading-relaxed">
                    {tech.shortDesc}
                  </p>

                  {/* Highlights / Steps Counter */}
                  <div className="flex items-center space-x-4 text-xs font-bold text-[#1C1D1F] mb-6">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#FBF9F5] border border-[#1C1D1F]">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{tech.steps.length} Pasos guiados</span>
                    </div>
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#FBF9F5] border border-[#1C1D1F]">
                      <Zap className="w-3.5 h-3.5 text-[#FF7A59]" />
                      <span>{tech.drillPreset.questionCount} Ejercicios Drill</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t-2 border-[#EDE8E1] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#595B5F]">
                    {record ? `Récord: ${record.bestScore} pts` : 'Aún sin practicar'}
                  </span>

                  <Link
                    href={`/academy/${tech.slug}`}
                    className="h-11 px-5 rounded-full bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] font-heading font-black text-xs uppercase tracking-wider flex items-center space-x-2 border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <span>Abrir Guía</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

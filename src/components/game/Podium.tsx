'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Medal, Award, Flame, CheckCircle2, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '@/types/game';

interface PodiumProps {
  podium: LeaderboardEntry[];
  fullLeaderboard?: LeaderboardEntry[];
  totalQuestions: number;
}

export const Podium: React.FC<PodiumProps> = ({
  podium,
  fullLeaderboard = [],
  totalQuestions
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount - Precious Plastic palette
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FEE77B', '#ABD3DF', '#BFDEBA', '#FF7A59', '#D7C7F4']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FEE77B', '#ABD3DF', '#BFDEBA', '#FF7A59', '#D7C7F4']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-6 px-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EDE8E1] border-2 border-[#1C1D1F] text-[#1C1D1F] text-xs font-black shadow-[0_2px_0_0_#1C1D1F] mb-3">
          <Trophy className="w-4 h-4 text-[#1C1D1F]" />
          <span>¡Partida Concluida con Éxito!</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-[#1C1D1F]">
          Podio de <span className="pp-highlight pp-highlight-yellow">Campeones</span>
        </h2>
      </motion.div>

      {/* Recycled Plastic Podium Slabs */}
      <div className="w-full max-w-2xl grid grid-cols-3 gap-3 sm:gap-4 items-end mb-12 pt-10">
        {/* 2nd Place (Plastic Blue) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {second ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#ABD3DF] border-2 border-[#1C1D1F] flex items-center justify-center mb-2 shadow-[0_3px_0_0_#1C1D1F]">
                <Medal className="w-7 h-7 sm:w-8 sm:h-8 text-[#1C1D1F]" />
              </div>
              <span className="font-heading font-black text-sm sm:text-base text-[#1C1D1F] text-center truncate max-w-[95px] sm:max-w-[130px]">
                {second.nickname}
              </span>
              <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full bg-white border border-[#1C1D1F] text-[#1C1D1F] mb-2 shadow-[0_2px_0_0_#1C1D1F]">
                {second.score.toLocaleString()} pts
              </span>
              <div className="w-full h-32 sm:h-44 bg-[#ABD3DF] rounded-t-2xl border-t-2 border-x-2 border-[#1C1D1F] flex flex-col items-center justify-center shadow-[0_5px_0_0_#1C1D1F]">
                <span className="text-3xl sm:text-5xl font-heading font-black text-[#1C1D1F]">2</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1C1D1F]/80">Plata</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-32 bg-[#EDE8E1] rounded-t-2xl border-2 border-dashed border-slate-400" />
          )}
        </motion.div>

        {/* 1st Place (Plastic Sunny Yellow) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="flex flex-col items-center"
        >
          {first ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FEE77B] border-2 border-[#1C1D1F] flex items-center justify-center mb-2 shadow-[0_4px_0_0_#1C1D1F]">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#1C1D1F]" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-3 -right-2 bg-[#FF7A59] border-2 border-[#1C1D1F] text-white rounded-full p-1.5 shadow-[0_2px_0_0_#1C1D1F]"
                >
                  <Flame className="w-4 h-4 fill-white" />
                </motion.div>
              </div>
              <span className="font-heading font-black text-base sm:text-lg text-[#1C1D1F] text-center truncate max-w-[105px] sm:max-w-[150px]">
                {first.nickname}
              </span>
              <span className="text-xs sm:text-sm font-black px-3 py-0.5 rounded-full bg-[#FEE77B] border-2 border-[#1C1D1F] text-[#1C1D1F] mb-2 shadow-[0_2px_0_0_#1C1D1F]">
                {first.score.toLocaleString()} pts
              </span>
              <div className="w-full h-44 sm:h-60 bg-[#FEE77B] rounded-t-2xl border-t-2 border-x-2 border-[#1C1D1F] flex flex-col items-center justify-center shadow-[0_6px_0_0_#1C1D1F]">
                <span className="text-4xl sm:text-6xl font-heading font-black text-[#1C1D1F]">1</span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#1C1D1F] mt-1 px-2 py-0.5 rounded-full bg-white border border-[#1C1D1F]">
                  Ganador
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-44 bg-[#EDE8E1] rounded-t-2xl border-2 border-dashed border-slate-400" />
          )}
        </motion.div>

        {/* 3rd Place (Plastic Mint Green) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {third ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#BFDEBA] border-2 border-[#1C1D1F] flex items-center justify-center mb-2 shadow-[0_3px_0_0_#1C1D1F]">
                <Award className="w-7 h-7 sm:w-8 sm:h-8 text-[#1C1D1F]" />
              </div>
              <span className="font-heading font-black text-sm sm:text-base text-[#1C1D1F] text-center truncate max-w-[95px] sm:max-w-[130px]">
                {third.nickname}
              </span>
              <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full bg-white border border-[#1C1D1F] text-[#1C1D1F] mb-2 shadow-[0_2px_0_0_#1C1D1F]">
                {third.score.toLocaleString()} pts
              </span>
              <div className="w-full h-24 sm:h-32 bg-[#BFDEBA] rounded-t-2xl border-t-2 border-x-2 border-[#1C1D1F] flex flex-col items-center justify-center shadow-[0_5px_0_0_#1C1D1F]">
                <span className="text-2xl sm:text-4xl font-heading font-black text-[#1C1D1F]">3</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1C1D1F]/80">Bronce</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-24 bg-[#EDE8E1] rounded-t-2xl border-2 border-dashed border-slate-400" />
          )}
        </motion.div>
      </div>

      {/* Full Leaderboard Table - Precious Plastic Card */}
      {fullLeaderboard.length > 0 && (
        <div className="w-full max-w-xl rounded-3xl bg-white border-2 border-[#1C1D1F] p-5 shadow-[0_5px_0_0_#1C1D1F]">
          <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-[#EDE8E1]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1C1D1F]">
              Clasificación Completa ({fullLeaderboard.length} Jugadores)
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8E1] text-[#1C1D1F]">
              {totalQuestions} rondas
            </span>
          </div>

          <div className="divide-y divide-[#EDE8E1]">
            {fullLeaderboard.map((entry) => (
              <div
                key={entry.playerId}
                className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-[#FBF9F5] transition-colors"
              >
                <div className="flex items-center space-x-3">
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
                    {entry.rank}
                  </span>
                  <span className="font-heading font-bold text-sm text-[#1C1D1F]">{entry.nickname}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-xs text-[#595B5F]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#56B870]" />
                    <span>
                      {entry.correctAnswers}/{totalQuestions}
                    </span>
                  </div>
                  <span className="font-black text-sm text-[#1C1D1F] min-w-[75px] text-right">
                    {entry.score.toLocaleString()} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

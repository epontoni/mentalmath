'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TimerBarProps {
  remainingSec: number;
  totalSec: number;
  showNumeric?: boolean;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  remainingSec,
  totalSec,
  showNumeric = true
}) => {
  const percentage = Math.max(0, Math.min(100, (remainingSec / totalSec) * 100));

  // Determine color based on remaining time - Precious Plastic Palette
  const getColor = () => {
    if (percentage > 50) return 'bg-[#BFDEBA]'; // Plastic mint
    if (percentage > 25) return 'bg-[#FEE77B]'; // Plastic yellow
    return 'bg-[#FF7A59]'; // Plastic coral
  };

  const getTextColor = () => {
    if (percentage > 50) return 'text-[#1C1D1F] bg-[#BFDEBA]';
    if (percentage > 25) return 'text-[#1C1D1F] bg-[#FEE77B]';
    return 'text-white bg-[#FF7A59]';
  };

  const isLowTime = remainingSec <= 3 && remainingSec > 0;

  return (
    <div className={`w-full flex items-center space-x-3 transition-transform ${isLowTime ? 'animate-pulse' : ''}`}>
      {/* Horizontal Bar - Precious Plastic Workshop Pill */}
      <div className={`flex-1 h-5 bg-[#EDE8E1] rounded-full overflow-hidden p-0.5 border-2 border-[#1C1D1F] shadow-[0_2px_0_0_#1C1D1F] ${isLowTime ? 'ring-2 ring-[#FF7A59]/60' : ''}`}>
        <motion.div
          className={`h-full rounded-full ${getColor()} border-r border-[#1C1D1F] transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Numeric Indicator - Tactile Pill */}
      {showNumeric && (
        <motion.span
          animate={isLowTime ? { scale: [1, 1.15, 1], rotate: [-2, 2, -2] } : { scale: 1, rotate: 0 }}
          transition={isLowTime ? { repeat: Infinity, duration: 0.5 } : { duration: 0.2 }}
          className={`px-2.5 py-0.5 rounded-full border-2 border-[#1C1D1F] text-xs font-black tabular-nums min-w-[38px] text-center shadow-[0_2px_0_0_#1C1D1F] ${getTextColor()}`}
        >
          {Math.ceil(remainingSec)}s
        </motion.span>
      )}
    </div>
  );
};

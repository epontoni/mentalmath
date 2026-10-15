'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionOption } from '@/types/game';
import { sounds } from '@/lib/sound';

interface OptionsGridProps {
  options: QuestionOption[];
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export const OptionsGrid: React.FC<OptionsGridProps> = ({
  options,
  onSubmit,
  disabled = false,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleSelect = useCallback(
    (opt: QuestionOption, idx: number) => {
      if (disabled) return;
      setSelectedIdx(idx);
      sounds.playKeypad(idx + 1);
      onSubmit(opt.value);
    },
    [disabled, onSubmit]
  );

  // Keyboard shortcut listener: keys 1..9 select the option by index
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= options.length) {
        e.preventDefault();
        handleSelect(options[num - 1], num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, options, handleSelect]);

  const optionColors = [
    { badge: 'bg-[#FEE77B]', border: 'border-[#1C1D1F]', hover: 'hover:bg-[#FFF6B3]' },
    { badge: 'bg-[#ABD3DF]', border: 'border-[#1C1D1F]', hover: 'hover:bg-[#CEE9F2]' },
    { badge: 'bg-[#BFDEBA]', border: 'border-[#1C1D1F]', hover: 'hover:bg-[#DCF1D8]' },
    { badge: 'bg-[#D7C7F4]', border: 'border-[#1C1D1F]', hover: 'hover:bg-[#EAE1FB]' },
  ];

  return (
    <div
      className={`w-full grid gap-2.5 sm:gap-3 ${
        options.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
      }`}
    >
      {options.map((opt, idx) => {
        const style = optionColors[idx % optionColors.length];
        const isSelected = selectedIdx === idx;

        return (
          <motion.button
            key={opt.id ?? idx}
            type="button"
            whileHover={!disabled ? { scale: 1.015, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.98, y: 1 } : {}}
            onClick={() => handleSelect(opt, idx)}
            disabled={disabled}
            className={`w-full p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-[#1C1D1F] text-left font-heading font-black text-sm sm:text-base text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] transition-all flex items-center space-x-3 group relative overflow-hidden select-none ${
              style.hover
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
              isSelected ? 'ring-4 ring-[#1C1D1F] bg-[#FEE77B]' : ''
            }`}
          >
            <span
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${style.badge} border-2 border-[#1C1D1F] flex items-center justify-center text-xs sm:text-sm font-black text-[#1C1D1F] shrink-0 shadow-[0_1.5px_0_0_#1C1D1F]`}
            >
              {idx + 1}
            </span>
            <span className="flex-1 leading-snug tracking-tight font-extrabold text-[#1C1D1F]">
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

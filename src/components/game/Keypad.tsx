'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Delete, ArrowRight, RotateCcw } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface KeypadProps {
  onSubmit: (answer: number) => void;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
}

export const Keypad: React.FC<KeypadProps> = ({
  onSubmit,
  disabled = false,
  maxLength = 6,
  placeholder = '?'
}) => {
  const [value, setValue] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Handle digit press
  const handleDigit = useCallback((digit: string) => {
    if (disabled) return;
    if (value.length >= maxLength) return;

    sounds.playKeypad(digit);
    setValue((prev) => {
      // Avoid leading zeroes unless just '0'
      if (prev === '0') return digit;
      return prev + digit;
    });
  }, [disabled, value.length, maxLength]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (disabled || value.length === 0) return;
    sounds.playBackspace();
    setValue((prev) => prev.slice(0, -1));
  }, [disabled, value.length]);

  // Handle clear
  const handleClear = useCallback(() => {
    if (disabled || value.length === 0) return;
    sounds.playBackspace();
    setValue('');
  }, [disabled, value.length]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (disabled || value.length === 0) return;
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onSubmit(num);
      setValue('');
    }
  }, [disabled, value, onSubmit]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        setActiveKey(e.key);
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setActiveKey('backspace');
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setActiveKey('submit');
        handleSubmit();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setActiveKey('clear');
        handleClear();
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, handleDigit, handleBackspace, handleSubmit, handleClear]);

  const digits = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ];

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center select-none px-2 sm:px-3">
      {/* Input Display Screen - Workshop Caliper/Gauge Style */}
      <div className="w-full mb-2 sm:mb-3">
        <div className="h-12 sm:h-14 w-full rounded-2xl bg-white border-2 border-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] sm:shadow-[0_4px_0_0_#1C1D1F] flex items-center justify-between px-3.5">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EDE8E1] border border-[#1C1D1F] text-[#1C1D1F]">
            Respuesta
          </span>

          <div className="flex items-center space-x-2">
            <span
              className={`text-2xl sm:text-3xl font-heading font-black tracking-wider ${
                value ? 'text-[#1C1D1F]' : 'text-slate-400'
              }`}
            >
              {value || placeholder}
            </span>
            {/* Blinking indicator */}
            {!disabled && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1 h-5 sm:h-6 bg-[#1C1D1F] rounded"
              />
            )}
          </div>

          {/* Quick Clear Button */}
          {value && !disabled ? (
            <button
              onClick={handleClear}
              className="text-[#595B5F] hover:text-[#FF7A59] p-1 rounded-full hover:bg-[#EDE8E1] transition-colors"
              title="Borrar todo"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>
      </div>

      {/* Grid Keypad - Molded Plastic Tiles */}
      <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {/* Digits 1 to 9 */}
        {digits.map((row) =>
          row.map((digit) => (
            <motion.button
              key={digit}
              whileHover={disabled ? undefined : { scale: 1.02, y: -2 }}
              whileTap={disabled ? undefined : { scale: 0.92, y: 2 }}
              onClick={() => handleDigit(digit)}
              disabled={disabled}
              className={`
                h-12 sm:h-15 rounded-xl sm:rounded-2xl font-heading font-black text-xl sm:text-2xl
                border-2 border-[#1C1D1F] flex items-center justify-center transition-colors duration-75
                ${
                  disabled
                    ? 'bg-[#EDE8E1] text-slate-400 border-slate-400 shadow-none cursor-not-allowed'
                    : activeKey === digit
                    ? 'bg-[#FEE77B] text-[#1C1D1F] shadow-[0_1px_0_0_#1C1D1F]'
                    : 'bg-white hover:bg-[#FBF9F5] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] sm:shadow-[0_4px_0_0_#1C1D1F] active:shadow-[0_1px_0_0_#1C1D1F]'
                }
              `}
            >
              {digit}
            </motion.button>
          ))
        )}

        {/* Backspace Button - Coral Plastic */}
        <motion.button
          whileHover={disabled || value.length === 0 ? undefined : { scale: 1.02, y: -2 }}
          whileTap={disabled || value.length === 0 ? undefined : { scale: 0.92, y: 2 }}
          onClick={handleBackspace}
          disabled={disabled || value.length === 0}
          className={`
            h-12 sm:h-15 rounded-xl sm:rounded-2xl font-heading font-black border-2 border-[#1C1D1F]
            flex items-center justify-center transition-colors duration-75
            ${
              disabled || value.length === 0
                ? 'bg-[#EDE8E1] text-slate-400 border-slate-400 shadow-none cursor-not-allowed'
                : activeKey === 'backspace'
                ? 'bg-[#FF6640] text-white shadow-[0_1px_0_0_#1C1D1F]'
                : 'bg-[#FF7A59] hover:bg-[#FF6640] text-white shadow-[0_3px_0_0_#1C1D1F] sm:shadow-[0_4px_0_0_#1C1D1F] active:shadow-[0_1px_0_0_#1C1D1F]'
            }
          `}
          title="Borrar dígito"
        >
          <Delete className="w-5 h-5 stroke-[2.5]" />
        </motion.button>

        {/* 0 Button */}
        <motion.button
          whileHover={disabled ? undefined : { scale: 1.02, y: -2 }}
          whileTap={disabled ? undefined : { scale: 0.92, y: 2 }}
          onClick={() => handleDigit('0')}
          disabled={disabled}
          className={`
            h-12 sm:h-15 rounded-xl sm:rounded-2xl font-heading font-black text-xl sm:text-2xl
            border-2 border-[#1C1D1F] flex items-center justify-center transition-colors duration-75
            ${
              disabled
                ? 'bg-[#EDE8E1] text-slate-400 border-slate-400 shadow-none cursor-not-allowed'
                : activeKey === '0'
                ? 'bg-[#FEE77B] text-[#1C1D1F] shadow-[0_1px_0_0_#1C1D1F]'
                : 'bg-white hover:bg-[#FBF9F5] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] sm:shadow-[0_4px_0_0_#1C1D1F] active:shadow-[0_1px_0_0_#1C1D1F]'
            }
          `}
        >
          0
        </motion.button>

        {/* Submit / OK Button - Precious Plastic Yellow / Mint */}
        <motion.button
          whileHover={disabled || value.length === 0 ? undefined : { scale: 1.03, y: -2 }}
          whileTap={disabled || value.length === 0 ? undefined : { scale: 0.92, y: 2 }}
          onClick={handleSubmit}
          disabled={disabled || value.length === 0}
          className={`
            h-12 sm:h-15 rounded-xl sm:rounded-2xl font-heading font-black text-base sm:text-xl
            border-2 border-[#1C1D1F] flex items-center justify-center space-x-1 transition-colors duration-75
            ${
              disabled || value.length === 0
                ? 'bg-[#EDE8E1] text-slate-400 border-slate-400 shadow-none cursor-not-allowed'
                : activeKey === 'submit'
                ? 'bg-[#FEE77B] text-[#1C1D1F] shadow-[0_1px_0_0_#1C1D1F]'
                : 'bg-[#FEE77B] hover:bg-[#FFDE59] text-[#1C1D1F] shadow-[0_3px_0_0_#1C1D1F] sm:shadow-[0_4px_0_0_#1C1D1F] active:shadow-[0_1px_0_0_#1C1D1F]'
            }
          `}
          title="Enviar respuesta"
        >
          <span>OK</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
        </motion.button>
      </div>
    </div>
  );
};

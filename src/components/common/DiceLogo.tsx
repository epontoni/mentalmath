'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DiceLogoProps {
  size?: number; // size in pixels, default 42
  className?: string;
  autoRotate?: boolean;
}

interface FaceData {
  id: string;
  label: string;
  symbol: string | React.ReactNode;
  bg: string;
  textColor: string;
  transform: string;
}

export const DiceLogo: React.FC<DiceLogoProps> = ({
  size = 42,
  className = '',
  autoRotate = true
}) => {
  // Current face index: 0 = Front (⚡), 1 = Right (+), 2 = Back (-), 3 = Left (×), 4 = Top (%), 5 = Bottom (🧠)
  const [faceIndex, setFaceIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [extraRotation, setExtraRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const half = Math.round(size / 2);

  // Rotation angles to display each face
  // Face 0: Front -> (0, 0)
  // Face 1: Right -> (0, -90)
  // Face 2: Back  -> (0, -180)
  // Face 3: Left  -> (0, 90)
  // Face 4: Top   -> (-90, 0)
  // Face 5: Bottom-> (90, 0)
  const faceAngles: { x: number; y: number }[] = [
    { x: -10, y: 15 },       // Front (⚡) with a subtle 3D tilt
    { x: -10, y: -75 },      // Right (+)
    { x: 10, y: -165 },      // Back (-)
    { x: 10, y: 105 },       // Left (×)
    { x: -80, y: 15 },       // Top (%)
    { x: 100, y: 15 }        // Bottom (🧠)
  ];

  // Auto-cycle through faces every 2.4s
  useEffect(() => {
    if (!autoRotate) return;

    const timer = setInterval(() => {
      if (!isHovered) {
        setFaceIndex((prev) => (prev + 1) % 6);
      }
    }, 2400);

    return () => clearInterval(timer);
  }, [autoRotate, isHovered]);

  // Handle click to roll randomly
  const handleRoll = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pick random next face different from current
    setFaceIndex((prev) => {
      let next = Math.floor(Math.random() * 6);
      if (next === prev) next = (prev + 1) % 6;
      return next;
    });
    // Add extra spin flare
    setExtraRotation({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40
    });
    setTimeout(() => {
      setExtraRotation({ x: 0, y: 0 });
    }, 600);
  };

  const faces: FaceData[] = [
    {
      id: 'brain',
      label: 'Cerebro',
      symbol: '🧠',
      bg: 'bg-[#EDE8E1]', // Plastic Sand
      textColor: 'text-[#1C1D1F]',
      transform: `rotateY(0deg) translateZ(${half}px)`
    },
    {
      id: 'lightning',
      label: 'Rayo',
      symbol: '⚡',
      bg: 'bg-[#FEE77B]', // Plastic Yellow
      textColor: 'text-[#1C1D1F]',
      transform: `rotateY(90deg) translateZ(${half}px)`
    },
    {
      id: 'plus',
      label: 'Suma',
      symbol: '➕',
      bg: 'bg-[#BFDEBA]', // Plastic Mint Green
      textColor: 'text-[#1C1D1F]',
      transform: `rotateY(180deg) translateZ(${half}px)`
    },
    {
      id: 'minus',
      label: 'Resta',
      symbol: '➖',
      bg: 'bg-[#FF7A59]', // Plastic Coral
      textColor: 'text-white',
      transform: `rotateY(-90deg) translateZ(${half}px)`
    },
    {
      id: 'multiply',
      label: 'Multiplicación',
      symbol: '✖️',
      bg: 'bg-[#ABD3DF]', // Plastic Sky Blue
      textColor: 'text-[#1C1D1F]',
      transform: `rotateX(90deg) translateZ(${half}px)`
    },
    {
      id: 'divide',
      label: 'División',
      symbol: '➗',
      bg: 'bg-[#D7C7F4]', // Plastic Lavender
      textColor: 'text-[#1C1D1F]',
      transform: `rotateX(-90deg) translateZ(${half}px)`
    }
  ];

  const currentAngle = faceAngles[faceIndex] || faceAngles[0];
  const rotX = currentAngle.x + extraRotation.x;
  const rotY = currentAngle.y + extraRotation.y;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block cursor-pointer select-none group ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '600px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRoll}
      title="MentalMath — Haz clic para rodar el dado (🧠 ⚡ ➕ ➖ ✖️ ➗)"
      role="img"
      aria-label="MentalMath Dado Animado con 🧠 ⚡ ➕ ➖ ✖️ ➗"
    >
      {/* 3D Rolling Cube */}
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Airtight 6-Face Solid Core Body to eliminate any gaps or empty vertices */}
        {[
          `rotateY(0deg) translateZ(${half - 0.5}px)`,
          `rotateY(90deg) translateZ(${half - 0.5}px)`,
          `rotateY(180deg) translateZ(${half - 0.5}px)`,
          `rotateY(-90deg) translateZ(${half - 0.5}px)`,
          `rotateX(90deg) translateZ(${half - 0.5}px)`,
          `rotateX(-90deg) translateZ(${half - 0.5}px)`
        ].map((coreTransform, idx) => (
          <div
            key={`core-${idx}`}
            className="absolute inset-0 bg-[#1C1D1F] pointer-events-none rounded-none"
            style={{
              width: size,
              height: size,
              transform: coreTransform,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        ))}

        {/* Molded colored faces with tight 4px radius and solid borders */}
        {faces.map((face) => (
          <div
            key={face.id}
            className={`absolute inset-0 rounded-[4px] border-2 border-[#1C1D1F] ${face.bg} ${face.textColor} flex items-center justify-center font-heading font-black shadow-[inset_0_2px_3px_rgba(255,255,255,0.45)] overflow-hidden`}
            style={{
              width: size,
              height: size,
              transform: face.transform,
              fontSize: size * 0.52,
              lineHeight: 1,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Symbol */}
            <span className="relative z-10 flex items-center justify-center transform group-hover:scale-115 transition-transform duration-200 select-none">
              {face.symbol}
            </span>
          </div>
        ))}
      </div>

      {/* Tactile 3D bottom shadow plate */}
      <div
        className="absolute -bottom-1 left-1 right-1 h-1.5 bg-[#1C1D1F]/25 rounded-full blur-[1px] -z-10 transition-all duration-300 group-hover:scale-110 group-hover:opacity-40"
      />
    </div>
  );
};

'use client'
import React from 'react';

interface DiceProps {
  value: number;
  rolling: boolean;
  onClick: () => void;
}

export const Dice: React.FC<DiceProps> = ({ value, rolling, onClick }) => {
  const faceTransforms = {
    1: 'rotateY(0deg) translateZ(48px)',
    2: 'rotateX(-90deg) translateZ(48px)',
    3: 'rotateY(-90deg) translateZ(48px)',
    4: 'rotateY(90deg) translateZ(48px)',
    5: 'rotateX(90deg) translateZ(48px)',
    6: 'rotateX(180deg) translateZ(48px)',
  } as const;

  const viewRotations = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(90deg) rotateY(0deg)',
    3: 'rotateX(0deg) rotateY(90deg)',
    4: 'rotateX(0deg) rotateY(-90deg)',
    5: 'rotateX(-90deg) rotateY(0deg)',
    6: 'rotateX(180deg) rotateY(0deg)',
  } as const;

  const currentRotation = rolling ? 
    `rotateX(${Math.random() * 720 + 720}deg) rotateY(${Math.random() * 720 + 720}deg)` : 
    viewRotations[value as keyof typeof viewRotations];

  return (
    <div className="perspective-1000 w-24 h-24 cursor-pointer" onClick={onClick}>
      <div 
        className="w-full h-full relative transition-transform duration-[1000ms] ease-out preserve-3d"
        style={{ transform: currentRotation, transformStyle: 'preserve-3d' }}
      >
        {([1, 2, 3, 4, 5, 6] as const).map(face => (
          <div 
            key={face}
            className={`absolute w-24 h-24 bg-white border border-slate-200 rounded-2xl shadow-inner flex items-center justify-center backface-hidden`}
            style={{ transform: faceTransforms[face] }}
          >
             <div className="grid grid-cols-3 gap-1 p-4 w-full h-full pointer-events-none">
                {[...Array(9)].map((_, i) => {
                    const patterns: Record<number, number[]> = {
                        1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
                    };
                    return (
                        <div key={i} className="flex items-center justify-center">
                            {patterns[face].includes(i) && <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-sm" />}
                        </div>
                    );
                })}
             </div>
          </div>
        ))}
      </div>
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

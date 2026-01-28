'use client'
import React from 'react';
import { PLAYER_ICONS, PLAYER_COLORS, Property, Player } from '../constants';

interface BoardTileProps {
  property: Property;
  isActive: boolean;
  isStart: boolean;
  playersHere: (Player & { position: number })[];
  gridRow: number;
  gridCol: number;
}

export const BoardTile: React.FC<BoardTileProps> = ({ 
  property, 
  isActive, 
  isStart, 
  playersHere, 
  gridRow, 
  gridCol 
}) => {
  return (
    <div 
      className={`relative  border flex flex-col items-center justify-between transition-all duration-500 overflow-hidden
        ${isActive 
          ? 'bg-sky-200 border-2 border-red-50 shadow-md z-20' 
          : 'bg-green-200 border-2 border-neutral-950  z-10'}
        ${isStart ? 'border-red-400 bg-sky-100' : ''}
      `}
      style={{ 
        gridRow, 
        gridColumn: gridCol,
      }}
    >
        {/* TITLE */}
        {!property.position_title ? (
            <div className={`w-full text-center ${property.title_color} p-2`}>
            <span className="text-[10px] sm:text-[9px] font-bold text-slate-500 uppercase leading-none block truncate">
                {property.name}
            </span>
        </div>
        ): ''}

{/* ICON */}
<div className="flex-grow flex items-center justify-center w-full px-2">
    {React.isValidElement(property.icon) 
      ? React.cloneElement(property.icon as React.ReactElement<any>, { 
          className: `w-full h-full max-h-8 max-w-8 transition-colors duration-300
              ${isActive 
                  ? `${property.color.replace('bg-', 'text-').replace('100', '600').replace('500', '600')}` 
                  : `${property.color.replace('bg-', 'text-').replace('100', '400').replace('500', '400')} opacity-70`
              }` 
      })
      : property.icon
    }
</div>
        
        {/* MESSAGE (Only if active) */}
        {isActive && (
            <div className="w-full text-center px-1 mb-1 animate-fade-in">
                <span className="text-[10px] leading-tight font-bold text-slate-500 block">
                    {property.message}
                </span>
            </div>
        )}

        {/* PLAYER AVATARS */}
        <div className="h-4 w-full flex items-center justify-center gap-[-4px] mb-1">
            {playersHere.map((p, pIdx) => {
                const Icon = PLAYER_ICONS.find(i => i.id === p.iconId)?.icon;
                if (!Icon) return null;
                return (
                    <div key={pIdx} className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-white ${PLAYER_COLORS[p.colorIndex]} text-white -ml-1 first:ml-0`}>
                        <Icon size={10} />
                    </div>
                );
            })}
        </div>
                {/* TITLE */}
                
{property.position_title ? (
            <div className={`w-full text-center ${property.title_color} p-2`}>
            <span className="text-[10px] sm:text-[9px] font-bold text-slate-50 uppercase leading-none block truncate">
                {property.name}
            </span>
        </div>
        ): ''}
        <style>{`
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

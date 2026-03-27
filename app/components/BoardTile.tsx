'use client'
import React from 'react';
import { PLAYER_COLORS, Property, Player } from '../constants';

interface BoardTileProps {
  property: Property;
  isActive: boolean;
  isStart: boolean;
  playersHere: (Player & { position: number, colorIndex: number })[];
  gridRow: number;
  gridCol: number;
  ownerColor?: string; // e.g. 'border-red-500' or hex
}


export const BoardTile: React.FC<BoardTileProps> = ({
  property,
  isActive,
  isStart,
  playersHere,
  gridRow,
  gridCol,
  ownerColor
}) => {

  return (
    <div
      className={`relative w-full h-full min-w-0 min-h-0 border flex flex-col items-center justify-between transition-all duration-500 overflow-hidden
        ${isActive
          ? `bg-emerald-100 border-4 shadow-md z-20`
          : `bg-emerald-100 border-2 z-10`}
        ${isStart ? 'border-emerald-400 bg-emerald-50' : ''}
      `}
      style={{
        gridRow,
        gridColumn: gridCol,
        borderColor: playersHere.length > 0
          ? playersHere.map(p => PLAYER_COLORS[p.colorIndex].hex).join(',')
          : undefined,
      }}
    >
      {/* OWNER INDICATOR — thin subtle top bar */}
      {ownerColor && (
        <div className="absolute top-0 left-0 w-full h-1 z-0 opacity-50" style={{ backgroundColor: ownerColor }} />
      )}

      {/* TITLE */}

      {!property.position_title ? (
        <div className={`w-full text-center ${property.title_color !== 'none' ? property.title_color : ''} p-2 overflow-hidden min-h-0 shrink-0`}>
          <span className={`text-[10px] sm:text-[9px] font-bold uppercase leading-none block truncate ${property.title_color === 'none' ? 'text-black' : 'text-slate-50'}`}>
            {property.name}
          </span>
        </div>
      ) : ''}

      {/* ICON */}
      <div className="flex-grow flex items-center justify-center w-full px-2 flex-col gap-0.5 min-h-0 overflow-hidden">
        {property.icon}
        {property.price && (
          <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-1 rounded-sm border border-slate-100 shrink-0">
            ${property.price}
          </span>
        )}
      </div>


      {/* MESSAGE (Only if active) */}

      <div className="w-full text-center px-1 mb-1 animate-fade-in flex items-center justify-center overflow-hidden min-h-0">
        <span className="text-[10px] leading-tight font-bold text-slate-500 block truncate w-full text-balance">
          {property.message}
        </span>
      </div>


      {/* PLAYER INDICATORS Y DUEÑO - COLORES */}
      <div className="w-full flex justify-center gap-1 mb-1 flex-wrap px-1 min-h-[18px]">
        {/* Ficha fija del dueño */}
        {ownerColor && (
          <div className="flex flex-col items-center">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: ownerColor }}
              title="Propiedad comprada"
            />
          </div>
        )}
        
        {/* Fichas de jugadores actuales */}
        {playersHere.map((player, idx) => (
          <div key={`player-${idx}`} className="flex flex-col items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 border-slate-800 shadow-md transform scale-110 z-10 ${PLAYER_COLORS[player.colorIndex].bg}`}
              title={player.name}
            />
          </div>
        ))}
      </div>

      {property.position_title ? (
        <div className={`w-full text-center ${property.title_color !== 'none' ? property.title_color : ''} p-2 mt-auto overflow-hidden min-h-0 shrink-0`}>
          <span className={`text-[10px] sm:text-[9px] font-bold uppercase leading-none block truncate ${property.title_color === 'none' ? 'text-black' : 'text-slate-50'}`}>
            {property.name}
          </span>
        </div>
      ) : ''}
    </div>
  );
};

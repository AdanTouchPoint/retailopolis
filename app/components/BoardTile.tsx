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
      className={`relative border flex flex-col items-center justify-between transition-all duration-500 overflow-hidden
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
          : (ownerColor || undefined), // Show owner color if no players here, or override? logic below handles conflict
        borderWidth: ownerColor ? '4px' : undefined
      }}
    >
      {/* OWNER INDICATOR (Subtle background fill or top bar) */}
      {ownerColor && (
        <div className="absolute top-0 left-0 w-full h-1.5 z-0" style={{ backgroundColor: ownerColor }} />
      )}

      {/* TITLE */}

      {!property.position_title ? (
        <div className={`w-full text-center ${property.title_color} p-2`}>
          <span className="text-[10px] sm:text-[9px] font-bold text-slate-50 uppercase leading-none block truncate">
            {property.name}
          </span>
        </div>
      ) : ''}

      {/* ICON */}
      <div className="flex-grow flex items-center justify-center w-full px-2 flex-col gap-0.5">
        {property.icon}
        {property.price && (
          <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-1 rounded-sm border border-slate-100">
            ${property.price}
          </span>
        )}
      </div>


      {/* MESSAGE (Only if active) */}
      {isActive && (
        <div className="w-full text-center px-1 mb-1 animate-fade-in">
          <span className="text-[10px] leading-tight font-bold text-slate-500 block">

          </span>
        </div>
      )}

      {/* PLAYER INDICATORS - COLORES */}
      <div className="w-full flex justify-center gap-1 mb-1 flex-wrap px-1">
        {playersHere.map((player, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Círculo de color */}
            <div
              className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${PLAYER_COLORS[player.colorIndex].bg}`}
              title={player.name}
            />
            {/* Nombre jugador removido por solicitud */}

          </div>
        ))}
      </div>

      {property.position_title ? (
        <div className={`w-full text-center ${property.title_color} p-2 mt-auto`}>
          <span className="text-[10px] sm:text-[9px] font-bold text-slate-50 uppercase leading-none block truncate">
            {property.name}
          </span>
        </div>
      ) : ''}
    </div>
  );
};

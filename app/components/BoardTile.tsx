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
      className={`relative border flex flex-col items-center justify-between transition-all duration-500 overflow-hidden
        ${isActive
          ? `bg-white border-4 shadow-md z-20`
          : `bg-white border-2 z-10`}
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
      {/* TITLE */}
      {!property.position_title ? (
        <div className={`w-full text-center ${property.title_color} p-2`}>
          <span className="text-[10px] sm:text-[9px] font-bold text-slate-50 uppercase leading-none block truncate">
            {property.name}
          </span>
        </div>
      ) : ''}

      {/* ICON */}
      <div className="flex-grow flex items-center justify-center w-full px-2">
        {property.icon}
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
            {/* Nombre jugador (solo si hay espacio) */}
            {playersHere.length === 1 && (
              <span className="text-[7px] font-bold text-slate-600 text-center truncate w-full">
                {player.name.substring(0, 3)}
              </span>
            )}
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

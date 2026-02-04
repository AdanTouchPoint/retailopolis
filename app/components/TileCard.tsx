'use client'
import React from 'react';
import { Property } from '../constants';

interface TileCardProps {
  tile: Property;
  isWinner: boolean;
  onNextTurn: () => void;
  // New props
  owner?: { name: string; color: string } | null;
  canBuy?: boolean;
  onBuy?: () => void;
}

export const TileCard: React.FC<TileCardProps> = ({
  tile,
  isWinner,
  onNextTurn,
  owner,
  canBuy,
  onBuy
}) => {

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm animate-scale-in">
      {/* MESSAGE CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full text-center mb-6 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${tile.color}`}></div>

        <h2 className="text-2xl font-black text-slate-800 uppercase mb-2">{tile.name}</h2>

        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${tile.color} bg-opacity-20`}>
          {tile.icon}
        </div>

        <p className="text-lg font-medium text-slate-600">
          {isWinner ? "¡Juego Completado!" : tile.message}
        </p>

        {/* PRICE & OWNER INFO */}
        {tile.price && (
          <div className="mt-4 flex flex-col gap-2 items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor</span>
            <span className="text-3xl font-black text-slate-700">${tile.price}</span>

            {owner && (
              <div className={`mt-2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-sm ${owner.color}`}>
                Propiedad de {owner.name}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 w-full justify-center">
        {canBuy && onBuy && (
          <button
            onClick={onBuy}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
          >
            COMPRAR
          </button>
        )}

        <button
          onClick={onNextTurn}
          className={`
                ${canBuy ? 'flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700' : 'w-full bg-indigo-600 hover:bg-indigo-700 text-white'}
                font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95
              `}
        >
          {isWinner ? "REINICIAR" : (canBuy ? "PASAR" : "TERMINAR TURNO")}
        </button>
      </div>

      <style>{`
          @keyframes scale-in {
              0% { transform: scale(0.9); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
    </div>
  );
};
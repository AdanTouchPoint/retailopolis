'use client'
import React from 'react';
import { Property } from '../constants';

interface TileCardProps {
  tile: Property;
  isWinner: boolean;
  onNextTurn: () => void;
}

export const TileCard: React.FC<TileCardProps> = ({ tile, isWinner, onNextTurn }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm animate-scale-in">
        {/* MESSAGE CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full text-center mb-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${tile.color}`}></div>
            
            <h2 className="text-2xl font-black text-slate-800 uppercase mb-2">{tile.name}</h2>
            
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${tile.color} bg-opacity-20`}>
                {React.cloneElement(tile.icon, { 
                    className: `w-10 h-10 ${tile.color.replace('bg-', 'text-').replace('100', '600').replace('500', '600')}` 
                })}
            </div>
            
            <p className="text-lg font-medium text-slate-600">
                {isWinner ? "¡Juego Completado!" : tile.message}
            </p>
        </div>

        {/* BUTTON */}
        <button 
            onClick={onNextTurn}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
        >
            {isWinner ? "REINICIAR JUEGO" : "TERMINAR TURNO"}
        </button>
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

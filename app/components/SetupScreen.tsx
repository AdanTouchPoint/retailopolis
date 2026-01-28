'use client'
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { PLAYER_ICONS, PLAYER_COLORS, Player } from '../constants';

interface SetupScreenProps {
  onStartGame: (players: Player[]) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<Player[]>([
    { name: 'Jugador 1', iconId: 'car', colorIndex: 0 },
    { name: 'Jugador 2', iconId: 'ship', colorIndex: 1 }
  ]);

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { 
        name: `Jugador ${players.length + 1}`, 
        iconId: PLAYER_ICONS[players.length % 4].id, 
        colorIndex: players.length 
      }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    }
  };

  const updatePlayer = (index: number, field: keyof Player, value: string | number) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value as never;
    setPlayers(newPlayers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="md:w-5/12 bg-indigo-600 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
           <ShoppingBag size={80} className="mb-4 relative z-10" />
           <h1 className="text-4xl font-black mb-2 text-center relative z-10">TIENDA<br/>MONOPOLIS</h1>
           <p className="text-indigo-200 text-center relative z-10">¡Completa el recorrido!</p>
        </div>
        <div className="md:w-7/12 p-8 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Configurar Jugadores</h2>
          <div className="space-y-3 mb-8">
            {players.map((p, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                <div className={`w-10 h-10 rounded-lg ${PLAYER_COLORS[p.colorIndex]} flex items-center justify-center text-white shadow-md`}>
                  {React.createElement(PLAYER_ICONS.find(i => i.id === p.iconId)!.icon, { size: 20 })}
                </div>
                <input 
                  value={p.name} 
                  onChange={(e) => updatePlayer(idx, 'name', e.target.value)}
                  className="bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none px-2 py-1 flex-grow text-slate-700 font-medium"
                  placeholder="Nombre"
                />
                <button 
                    onClick={() => {
                        const nextIconIdx = (PLAYER_ICONS.findIndex(i => i.id === p.iconId) + 1) % PLAYER_ICONS.length;
                        updatePlayer(idx, 'iconId', PLAYER_ICONS[nextIconIdx].id);
                    }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600"
                >
                    Cambiar
                </button>
                {players.length > 2 && (
                  <button onClick={() => removePlayer(idx)} className="text-red-400 hover:text-red-600 p-1">✕</button>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
             <button onClick={addPlayer} disabled={players.length >= 4} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-500 font-medium transition-colors disabled:opacity-50">
                + Agregar Jugador
             </button>
             <button onClick={() => onStartGame(players)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98]">
                INICIAR PARTIDA
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

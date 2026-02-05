'use client'
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { PLAYER_COLORS, Player } from '../constants';

interface SetupScreenProps {
  onPlayersSelected: (players: Player[]) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onPlayersSelected }) => {
  const [players, setPlayers] = useState<Array<{ name: string; colorIndex: number }>>([
    { name: '', colorIndex: 0 },
  ]);

  const [usedColors, setUsedColors] = useState<Set<number>>(new Set([0]));

  const handleAddPlayer = () => {
    if (players.length < 4) {
      // Encontrar primer color no usado
      let availableColor = 0;
      for (let i = 0; i < PLAYER_COLORS.length; i++) {
        if (!usedColors.has(i)) {
          availableColor = i;
          break;
        }
      }

      setPlayers([...players, { name: '', colorIndex: availableColor }]);
      setUsedColors(new Set([...usedColors, availableColor]));
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 1) {
      const removed = players[index];
      const newUsedColors = new Set(usedColors);
      newUsedColors.delete(removed.colorIndex);

      setPlayers(players.filter((_, i) => i !== index));
      setUsedColors(newUsedColors);
    }
  };

  const handleColorChange = (index: number, newColorIndex: number) => {
    const oldColor = players[index].colorIndex;
    const newUsedColors = new Set(usedColors);
    newUsedColors.delete(oldColor);
    newUsedColors.add(newColorIndex);

    const newPlayers = [...players];
    newPlayers[index].colorIndex = newColorIndex;
    setPlayers(newPlayers);
    setUsedColors(newUsedColors);
  };

  const handleNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleStart = () => {
    const validPlayers = players.filter(p => p.name.trim());
    if (validPlayers.length >= 1) {
      onPlayersSelected(validPlayers.map((p, i) => ({
        id: `player-${i}`,
        name: p.name,
        colorIndex: p.colorIndex,
        position: 0,
        money: 2000,
        laps: 0,
      })));


    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="md:w-5/12 bg-indigo-600 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
          <ShoppingBag size={80} className="mb-4 relative z-10" />
          <h1 className="text-4xl font-black mb-2 text-center relative z-10">TIENDA<br />MONOPOLIS</h1>
          <p className="text-indigo-200 text-center relative z-10">¡Completa el recorrido!</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            <h1 className="text-4xl font-black text-center mb-8 text-indigo-700">
              RetailOpoly
            </h1>

            <div className="space-y-4 mb-6">
              {players.map((player, index) => (
                <div key={index} className="flex gap-3 items-end">
                  {/* Nombre */}
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Jugador {index + 1}
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="Nombre del jugador"
                      className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Selector de Color */}
                  <div className="flex gap-2">
                    {PLAYER_COLORS.map((color, colorIdx) => (
                      <button
                        key={color.id}
                        onClick={() => handleColorChange(index, colorIdx)}
                        className={`w-12 h-12 rounded-lg transition-all ${color.bg} ${player.colorIndex === colorIdx
                          ? `ring-4 ring-offset-2 ${color.border}`
                          : 'opacity-60 hover:opacity-80'
                          }`}
                        title={color.name}
                      />
                    ))}
                  </div>

                  {/* Botón Eliminar */}
                  {players.length > 1 && (
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Botón Agregar Jugador */}
            {players.length < 4 && (
              <button
                onClick={handleAddPlayer}
                className="w-full mb-6 px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-bold"
              >
                + Agregar Jugador
              </button>
            )}

            {/* Botón Comenzar */}
            <button
              onClick={handleStart}
              className="w-full px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-black text-lg"
            >
              COMENZAR JUEGO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

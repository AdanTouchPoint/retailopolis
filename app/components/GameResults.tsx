import React from 'react';
import { Player, Property, PLAYER_COLORS } from '../constants';
import { Trophy, Coins, Building2 } from 'lucide-react';

interface GameResultsProps {
    players: Player[];
    properties: Property[];
    ownership: Map<number, string>;
    onRestart: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({ players, properties, ownership, onRestart }) => {
    // Calculate Scores
    const results = players.map(player => {
        const ownedProperties = properties.filter(p => ownership.get(p.id) === player.id);
        const propertyValue = ownedProperties.reduce((sum, p) => sum + (p.price || 0), 0);
        const totalScore = player.money + propertyValue;

        return {
            ...player,
            propertyValue,
            ownedCount: ownedProperties.length,
            totalScore
        };
    }).sort((a, b) => b.totalScore - a.totalScore); // Sort by highest score

    const winner = results[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full border-4 border-indigo-500 overflow-hidden relative">

                {/* Confetti / Celebration Header */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500 to-transparent opacity-20 pointer-events-none"></div>

                <div className="text-center mb-8 relative">
                    <div className="inline-block bg-yellow-400 p-4 rounded-full shadow-lg mb-4 animate-bounce">
                        <Trophy className="w-12 h-12 text-yellow-900" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2">
                        ¡Juego Terminado!
                    </h2>
                    <p className="text-slate-500 font-bold text-lg">
                        Ganador: <span className={`${winner.colorIndex !== undefined ? `text-${PLAYER_COLORS[winner.colorIndex].name}-600` : 'text-indigo-600'}`}>{winner.name}</span>
                    </p>
                </div>

                {/* Scoreboard */}
                <div className="space-y-4 mb-8">
                    {results.map((player, idx) => (
                        <div
                            key={player.id}
                            className={`flex items-center p-4 rounded-xl border-2 transition-all
                ${idx === 0 ? 'bg-yellow-50 border-yellow-400 transform scale-105 shadow-md' : 'bg-white border-slate-100'}
              `}
                        >
                            <div className="flex-shrink-0 font-black text-2xl text-slate-300 w-8">
                                #{idx + 1}
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-3 h-3 rounded-full ${PLAYER_COLORS[player.colorIndex].bg}`} />
                                    <span className="font-bold text-slate-800">{player.name}</span>
                                </div>
                                <div className="flex gap-4 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Coins className="w-3 h-3" /> Base: ${player.money}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Building2 className="w-3 h-3" /> Propiedades: +${player.propertyValue} ({player.ownedCount})
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-400 uppercase block">Total</span>
                                <span className="text-2xl font-black text-emerald-600">
                                    ${player.totalScore.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onRestart}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 text-lg"
                >
                    JUGAR DE NUEVO
                </button>

            </div>
            <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
        </div>
    );
};

import React from 'react';
import { Player, PLAYER_COLORS } from '../constants';
import { Wallet, Building2, User } from 'lucide-react';

interface PlayerStatsProps {
    players: Player[];
    currentPlayerId: string;
    ownership: Map<number, string>; // tileId -> playerId
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ players, currentPlayerId, ownership }) => {
    return (
        <div className="flex flex-col gap-3 z-20 w-full">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-200 mb-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Marcador</h3>
            </div>
            {players.map((player) => {
                const isTurn = player.id === currentPlayerId;
                const ownedCount = Array.from(ownership.values()).filter(id => id === player.id).length;

                return (
                    <div
                        key={player.id}
                        className={`
                          relative flex flex-col p-3 rounded-xl shadow-lg border-2 transition-all duration-500
                          ${isTurn ? 'scale-105 -translate-y-1 z-30 ring-4 ring-offset-2 ring-indigo-200' : 'bg-white opacity-80 hover:opacity-100 scale-100 z-10'}
                          ${PLAYER_COLORS[player.colorIndex].bg} 
                          ${PLAYER_COLORS[player.colorIndex].border}
                        `}
                        style={{ minWidth: '160px' }}
                    >
                        {isTurn && (
                            <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-yellow-200 animate-bounce">
                                TU TURNO
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-2 border-b border-white/20 pb-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm drop-shadow-md truncate">
                                {player.name}
                            </span>
                        </div>

                        <div className="bg-white/95 backdrop-blur-md rounded-lg p-2.5 flex flex-col gap-1.5 shadow-inner">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="bg-emerald-100 p-1 rounded-md">
                                        <Wallet className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Efectivo</span>
                                </div>
                                <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 rounded-md">
                                    ${(player.money || 0).toLocaleString()}
                                </span>
                            </div>

                            <div className="w-full h-px bg-slate-100 my-0.5"></div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="bg-purple-100 p-1 rounded-md">
                                        <Building2 className="w-3 h-3 text-purple-600" />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Propiedades</span>
                                </div>
                                <span className="text-sm font-black text-purple-700 bg-purple-50 px-2 rounded-md">
                                    {ownedCount}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

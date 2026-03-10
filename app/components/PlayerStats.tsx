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
        <div className="flex flex-col md:flex-row gap-4 z-20 w-full justify-center items-end h-full  space-x-4">
            {players.map((player) => {
                const isTurn = player.id === currentPlayerId;

                // Get all properties owned by this player
                const ownedTiles = Array.from(ownership.entries())
                    .filter(([_, ownerId]) => ownerId === player.id)
                    .map(([tileId, _]) => tileId);

                // We need the colors of the owned properties for the dots
                // Properties are imported from constants, but we need to map them here
                // We will hardcode some simple default colors for the dots if we don't import PROPERTIES here
                // Better approach: just use some nice colors based on the tileId for now, or we can pass PROPERTIES down.
                // Assuming we can derive a color from the tileId or just use generic dot colors.
                // For this implementation, I will use some predefined colors for the dots based on index to mock the image, 
                // since PROPERTIES array is not passed to PlayerStats by default.
                const dotColors = ['bg-blue-400', 'bg-pink-500', 'bg-emerald-500', 'bg-purple-500', 'bg-yellow-400', 'bg-orange-500'];

                return (
                    <div
                        key={player.id}
                        className={`
                          relative flex flex-col rounded-xl overflow-hidden shadow-lg border-[3px] border-slate-800 transition-all duration-300
                          ${isTurn ? 'scale-110 z-30 mb-4' : 'scale-100 z-10 hover:scale-105'}
                        `}
                        style={{ minWidth: '220px', backgroundColor: '#d1fae5' /* emerald-100 equivalent for the light green bg */ }}
                    >
                        {/* Top Header Label */}
                        <div className={`
                            w-full text-center py-1.5 font-bold text-white text-sm tracking-widest border-b-[3px] border-slate-800
                            ${PLAYER_COLORS[player.colorIndex].bg}
                        `}>
                            {player.name.toUpperCase()}
                        </div>

                        {/* Main Card Content */}
                        <div className="p-3">
                            <div className="flex gap-3 items-center mb-4">

                                {/* Avatar Box (Color Circle instead of Icon) */}
                                <div className="w-14 h-14 bg-gradient-to-b from-slate-200 to-slate-400 rounded-2xl flex items-center justify-center p-1 border border-white/50 shadow-inner flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full shadow-md ${PLAYER_COLORS[player.colorIndex].bg} border-2 border-white/60`}></div>
                                </div>

                                {/* Saldo Box */}
                                <div className="flex flex-col flex-grow">
                                    <span className="text-[10px] font-black text-slate-800 mb-0.5">SALDO</span>
                                    <div className="bg-white rounded-md px-3 py-1.5 text-center shadow-sm border border-slate-200">
                                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                                            ${(player.money || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Acquired Area */}
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-800 mb-1">TECNOLOGÍA ADQUIRIDA</span>
                                <div className="flex gap-1.5">
                                    {/* Create 6 slots for the dots */}
                                    {[0, 1, 2, 3, 4, 5].map((index) => {
                                        const hasTech = index < ownedTiles.length;
                                        // Pick a color for the dot if they own the tech
                                        const dotColor = hasTech ? dotColors[index % dotColors.length] : '';

                                        return (
                                            <div key={index} className="w-6 h-6 bg-white rounded-md shadow-sm border border-emerald-50/50 flex items-center justify-center">
                                                {hasTech && (
                                                    <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
};

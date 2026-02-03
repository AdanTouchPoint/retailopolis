'use client'
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Dice } from './Dice';
import { TileCard } from './TileCard';
import { BoardTile } from './BoardTile';
import { BOARD_WIDTH, BOARD_HEIGHT, TOTAL_TILES, PROPERTIES, PLAYER_ICONS, PLAYER_COLORS, Player, Property } from '../constants';
import { PngIcon } from './Icons/Icon';
interface GameBoardProps {
  players: Player[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ players: initialPlayers }) => {
  const [players, setPlayers] = useState<(Player & { position: number })[]>(
    initialPlayers.map(p => ({ ...p, position: 0 }))
  );
  const [turn, setTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'rolling' | 'showing_result' | 'moving' | 'landed'>('idle');
  const [currentTileData, setCurrentTileData] = useState<Property | null>(null);
  const [winner, setWinner] = useState<(Player & { position: number }) | null>(null);

  const currentPlayer = players[turn];

  const rollDice = () => {
    if (gameState !== 'idle') return;

    setGameState('rolling');
    
    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      setGameState('showing_result');

      setTimeout(() => {
          setGameState('moving');
          movePlayer(rolled);
      }, 1000); 

    }, 1000); 
  };

  const movePlayer = (steps: number) => {
    let currentPos = currentPlayer.position;
    const targetPos = (currentPos + steps) >= TOTAL_TILES ? 0 : currentPos + steps;
    const isFinishing = (currentPos + steps) >= TOTAL_TILES;
    let actualStepsToMove = isFinishing ? (TOTAL_TILES - currentPos) : steps;

    const stepInterval = setInterval(() => {
      if (actualStepsToMove > 0) {
        currentPos = (currentPos + 1) % TOTAL_TILES;
        
        setPlayers(prev => {
            const newPlayers = [...prev];
            newPlayers[turn].position = currentPos;
            return newPlayers;
        });

        actualStepsToMove--;
      } else {
        clearInterval(stepInterval);
        setCurrentTileData(PROPERTIES[currentPos] as Property);
        setGameState('landed');
        
        if (isFinishing) {
             setWinner(currentPlayer);
        }
      }
    }, 600);
  };

  const nextTurn = () => {
      if (winner) {
          window.location.reload();
          return;
      }
      setGameState('idle');
      setCurrentTileData(null);
      setTurn((turn + 1) % players.length);
  };

  const getGridArea = (index: number) => {
    if (index >= 0 && index <= 6) return { row: 5, col: 7 - index };
    if (index >= 7 && index <= 9) return { row: 5 - (index - 6), col: 1 };
    if (index >= 10 && index <= 16) return { row: 1, col: 1 + (index - 10) };
    if (index >= 17 && index <= 19) return { row: 1 + (index - 16), col: 7 };
    return { row: 1, col: 1 };
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none font-sans text-slate-800">
      
      <div className="relative bg-white rounded-3xl shadow-2xl p-1 md:p-4 border-4 border-white" 
           style={{ 
             width: 'min(95vw, 1000px)', 
             aspectRatio: '7/5',
             display: 'grid',
             gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
             gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
             gap: '0.9px',
             //backgroundColor: '#1a67b5',
           }}>

        {/* CENTER AREA */}
        <div className="bg-slate-50 rounded-2xl flex flex-col items-center justify-center relative border-2 border-slate-100 overflow-hidden" 
             style={{ gridArea: `2 / 2 / 5 / 7` }}>
          
          {/* Decorative Background */}
          <div className="absolute inset-0 flex items-center justify-center  pointer-events-none">
             <PngIcon src="/icons/img_centro.png" alt="fondo" className="w-120 h-150" />
          </div>

          {/* MAIN CONTENT */}
          <div className="z-10 w-full h-full flex flex-col items-center justify-center p-4">
            
            {/* TURN HEADER */}
            <div className="absolute top-4 flex items-center gap-2 bg-white px-4 py-1 rounded-full shadow-sm border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase">Turno</span>
                <div className={`flex items-center gap-2 ${PLAYER_COLORS[currentPlayer.colorIndex]} text-white px-2 py-0.5 rounded-full`}>
                     {React.createElement(PLAYER_ICONS.find(i => i.id === currentPlayer.iconId)!.icon, { size: 14 })}
                     <span className="text-sm font-bold">{currentPlayer.name}</span>
                </div>
            </div>

            {/* DICE STATE */}
            {(gameState === 'idle' || gameState === 'rolling' || gameState === 'showing_result' || gameState === 'moving') && (
                <div className="flex flex-col items-center animate-fade-in">
                    <div className="mb-8 mt-6">
                        <Dice value={diceValue} rolling={gameState === 'rolling'} onClick={rollDice} />
                    </div>
                    
                    {gameState === 'idle' && (
                        <button 
                            onClick={rollDice}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-3xl shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <span className="text-lg">TIRAR DADO</span>
                        </button>
                    )}
                    {gameState === 'moving' && (
                         <span className="text-slate-400 font-bold animate-pulse">Avanzando...</span>
                    )}
                </div>
            )}

            {/* LANDED STATE */}
            {(gameState === 'landed' && currentTileData) && (
                <TileCard 
                  tile={currentTileData}
                  isWinner={winner !== null}
                  onNextTurn={nextTurn}
                />
            )}

          </div>
        </div>

        {/* BOARD TILES */}
        {PROPERTIES.map((prop, idx) => {
           const pos = getGridArea(idx);
           const isStart = idx === 0;
           const playersHere = players.filter(p => p.position === idx);
           const isActive = playersHere.length > 0;
           
           return (
             <BoardTile
               key={idx}
               property={prop as Property}
               isActive={isActive}
               isStart={isStart}
               playersHere={playersHere}
               gridRow={pos.row}
               gridCol={pos.col}
             />
           );
        })}
      </div>
      
      <style>{`
        @keyframes scale-in {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: scale-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

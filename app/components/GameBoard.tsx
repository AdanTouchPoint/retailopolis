'use client'
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Dice } from './Dice';
import { TileCard } from './TileCard';
import { BoardTile } from './BoardTile';
import { PlayerStats } from './PlayerStats';
import { GameResults } from './GameResults';


import { BOARD_WIDTH, BOARD_HEIGHT, TOTAL_TILES, PROPERTIES, PLAYER_COLORS, Player, Property } from '../constants';
import { PngIcon } from './Icons/Icon';

interface GameBoardProps {
  players: Player[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ players: initialPlayers }) => {
  const [players, setPlayers] = useState<(Player & { position: number })[]>(
    initialPlayers.map(p => ({ ...p, position: 0, money: p.money || 2000, laps: 0 }))
  );

  const [turn, setTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'rolling' | 'showing_result' | 'moving' | 'landed'>('idle');
  const [currentTileData, setCurrentTileData] = useState<Property | null>(null);
  const [winner, setWinner] = useState<(Player & { position: number }) | null>(null);

  // New State: Ownership (tileId -> playerId)
  const [ownership, setOwnership] = useState<Map<number, string>>(new Map());

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
    // Remove isFinishing check, allow wrapping
    let actualStepsToMove = steps;

    const stepInterval = setInterval(() => {

      if (actualStepsToMove > 0) {
        currentPos = (currentPos + 1) % TOTAL_TILES;

        // LAP COUNTING LOGIC
        if (currentPos === 0) { // Passed Start
          // Updates laps in state later or track here? 
          // Better to track when setting players below
        }

        setPlayers(prev => {
          const newPlayers = [...prev];
          const movingPlayer = { ...newPlayers[turn] };

          if (currentPos === 0) {
            movingPlayer.laps = (movingPlayer.laps || 0) + 1;
          }
          movingPlayer.position = currentPos;

          newPlayers[turn] = movingPlayer;
          return newPlayers;
        });

        actualStepsToMove--;
      } else {
        clearInterval(stepInterval);
        setCurrentTileData(PROPERTIES[currentPos] as Property);
        setGameState('landed');

        // CHECK GAME OVER (2 Laps)
        const updatedPlayer = players[turn]; // Need fresh state? 
        // Note: players state inside interval might be stale, but we updated it via callback. 
        // However, we need to check the Laps of the current player.
        // Let's check the *local* tracking we did or use a ref effectively. 
        // Simplest: Check the player state in the next render cycle or use the loop variable.

        // Actually best to check in the setInterval closure using the updated value we just pushed?
        // We can't easily access the result of setPlayers immediately.
        // Instead, let's check it based on our calculation of Laps (currentPos === 0 logic).

        // Better approach: We know if they finished because `isFinishing` was true (passed total).
        // Wait, isFinishing logic in original code meant "Reaching strict end"? 
        // Here we want looping. 

        // Let's re-read logic:
        // movePlayer is called. We calculate target. 

        // Correction: We need to detect if they completed 2 laps NOW.
        setPlayers(prev => {
          if (prev[turn].laps >= 2) {
            setWinner(prev[turn]); // Game Over Trigger
          }
          return prev;
        });
      }
    }, 600);

  };

  const nextTurn = () => {
    if (winner) return; // Wait for restart

    setGameState('idle');
    setCurrentTileData(null);
    setTurn((turn + 1) % players.length);
  };

  const buyProperty = () => {
    if (!currentTileData || !currentTileData.price) return;

    // Check if player has enough money
    if (currentPlayer.money < currentTileData.price) {
      alert("No tienes suficiente dinero"); // Simple alert for now, could be better UI
      return;
    }

    // Deduct money
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[turn] = {
        ...newPlayers[turn],
        money: newPlayers[turn].money - (currentTileData.price || 0)
      };
      return newPlayers;
    });

    // Add ownership
    setOwnership(prev => {
      const newOwnership = new Map(prev);
      newOwnership.set(currentTileData.id, currentPlayer.id);
      return newOwnership;
    });

    nextTurn();
  };

  // Helper to get owner of a tile
  const getOwner = (tileId: number) => {
    const ownerId = ownership.get(tileId);
    if (!ownerId) return null;
    return players.find(p => p.id === ownerId);
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

      {winner && (
        <GameResults
          players={players}
          properties={PROPERTIES}
          ownership={ownership}
          onRestart={() => window.location.reload()}
        />
      )}

      <div className="flex flex-col md:flex-row items-start gap-8 w-full max-w-[1400px]">

        {/* STATS PANEL - LEFT/TOP */}
        <div className="w-full md:w-auto flex-shrink-0">
          <PlayerStats
            players={players}
            currentPlayerId={currentPlayer.id}
            ownership={ownership}
          />
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl p-1 md:p-4 border-4 border-white flex-grow"
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
                <div className={`flex items-center gap-2 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full`}>
                  <div className={`w-3 h-3 rounded-full ${PLAYER_COLORS[currentPlayer.colorIndex].bg}`} />
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
                  owner={(() => {
                    const owner = getOwner(currentTileData.id);
                    return owner ? { name: owner.name, color: PLAYER_COLORS[owner.colorIndex].bg } : null;
                  })()}
                  canBuy={currentTileData.type === 'property' && !ownership.has(currentTileData.id) && (currentPlayer.money >= (currentTileData.price || 0))}
                  onBuy={buyProperty}
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
            const owner = getOwner(idx);


            return (
              <BoardTile
                key={idx}
                property={prop}
                isActive={isActive}
                isStart={isStart}
                playersHere={playersHere}
                gridRow={pos.row}
                gridCol={pos.col}
                ownerColor={owner ? PLAYER_COLORS[owner.colorIndex].hex : undefined}
              />

            );
          })}
        </div>
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

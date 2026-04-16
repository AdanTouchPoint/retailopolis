'use client'
import React, { useState } from 'react';
import Script from 'next/script';
import { ShoppingBag } from 'lucide-react';
import { Dice } from './Dice';
import { TileCard } from './TileCard';
import { BoardTile } from './BoardTile';
import { PlayerStats } from './PlayerStats';
import { GameResults } from './GameResults';
import { Banner } from './Banner';


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

  // New State: Intro Flow
  const [introState, setIntroState] = useState<'initial' | 'rules' | 'playing'>('initial');

  // New State: Penalty Modal
  const [penaltyModal, setPenaltyModal] = useState<{ amount: number; message: string; recipient?: string } | null>(null);

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

        // ── Compute penalty/rent BEFORE setPlayers so values are ready for setPenaltyModal ──
        const RENT_AMOUNT = 30;
        let penaltyAmount = 0;
        let penaltyMessage = '';
        let penaltyRecipient: string | undefined = undefined;

        // Corner penalties
        if (currentPos === 6) { penaltyAmount = 20; penaltyMessage = '¡Vas a la cárcel! Pierdes $20.'; }
        else if (currentPos === 10) { penaltyAmount = 40; penaltyMessage = 'Impuesto al mal dato. Pierdes $40.'; }
        else if (currentPos === 16) { penaltyAmount = 60; penaltyMessage = 'Estacionamiento. Pierdes $60.'; }

        // Rent: is the tile owned by ANOTHER player?
        const tileOwnerId = ownership.get(currentPos);
        const isRent = !!(tileOwnerId && tileOwnerId !== players[turn].id);
        if (isRent) {
          const owner = players.find(p => p.id === tileOwnerId);
          if (owner) {
            penaltyAmount = RENT_AMOUNT;
            penaltyMessage = `¡Caíste en la tecnología de ${owner.name}! Pagas $${RENT_AMOUNT} de impuesto.`;
            penaltyRecipient = owner.name;
          }
        }

        // Snapshot values so closures are safe
        const finalAmount = penaltyAmount;
        const finalMessage = penaltyMessage;
        const finalRecipient = penaltyRecipient;
        const finalTileOwnerId = tileOwnerId;

        setPlayers(prev => {
          const newPlayers = [...prev];

          if (isRent && finalTileOwnerId) {
            const ownerIndex = newPlayers.findIndex(p => p.id === finalTileOwnerId);
            if (ownerIndex !== -1) {
              // Deduct from current player
              newPlayers[turn] = {
                ...newPlayers[turn],
                money: newPlayers[turn].money - RENT_AMOUNT
              };
              // Transfer to owner
              newPlayers[ownerIndex] = {
                ...newPlayers[ownerIndex],
                money: newPlayers[ownerIndex].money + RENT_AMOUNT
              };
            }
          } else if (finalAmount > 0) {
            // Corner penalty — deduct only
            newPlayers[turn] = {
              ...newPlayers[turn],
              money: newPlayers[turn].money - finalAmount
            };
          }

          if (newPlayers[turn].laps >= 2) {
            setWinner(newPlayers[turn]);
          }
          return newPlayers;
        });

        if (finalAmount > 0) {
          setPenaltyModal({ amount: finalAmount, message: finalMessage, recipient: finalRecipient });
        }
      }
    }, 600);

  };

  const nextTurn = () => {
    if (winner) return; // Wait for restart

    setPenaltyModal(null);
    setGameState('idle');
    setCurrentTileData(null);
    setTurn((turn + 1) % players.length);
  };

  const buyProperty = () => {
    if (!currentTileData || !currentTileData.price) return;
    if (currentPlayer.money < currentTileData.price) return;

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
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 pt-28 sm:pt-32 overflow-hidden select-none font-sans text-slate-800">
      <Script id="meta-pixel-lead" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2124396274984399');
          fbq('track', 'Lead');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2124396274984399&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      {winner && (
        <GameResults
          players={players}
          properties={PROPERTIES}
          ownership={ownership}
          onRestart={() => window.location.reload()}
        />
      )}

      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 w-full max-w-[1600px] mb-8 z-10">

        <div className="relative bg-white rounded-3xl shadow-2xl p-1 md:p-4 border-4 border-white flex-shrink-0"
          style={{
            width: 'min(95vw, 1000px)',
            aspectRatio: '7/5',
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, 130px)`,
            gridTemplateRows: `repeat(${BOARD_HEIGHT}, 130px)`,
            gap: '0.9px',
            //backgroundColor: '#1a67b5',
          }}>

          {/* CENTER AREA */}

          <div className="bg-slate-50 rounded-2xl flex flex-col items-center justify-center relative border-2 border-slate-100 z-30"
            style={{ gridArea: `2 / 2 / 5 / 7` }}>

            {/* Decorative Background */}
            <div className="absolute inset-0 flex items-center justify-center  pointer-events-none">
              <PngIcon src="/icons/img_centro.png" alt="fondo" className="w-120 h-150" />
            </div>

            {/* MAIN CONTENT */}
            <div className="z-10 w-full h-full flex flex-col items-center justify-center p-4">

              {/* INITIAL STATE */}
              {introState === 'initial' && (
                <div className="flex flex-col items-center justify-end animate-fade-in w-full h-full">
                  <button
                    onClick={() => setIntroState('rules')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-10 rounded-full shadow-2xl transform transition hover:scale-105 active:scale-95 text-xl border-4 border-emerald-500/30 mb-2"
                  >
                    Iniciar
                  </button>
                </div>
              )}

              {/* RULES STATE */}
              {introState === 'rules' && (
                <div className="flex flex-col items-center justify-center animate-fade-in w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-slate-100">
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-4 text-center uppercase tracking-wider text-emerald-600">Reglas del juego</h2>
                  <div className="text-slate-600 text-[15px] sm:text-base mb-6 text-center leading-relaxed space-y-3 font-medium">
                    <p>Tira los dados y avanza por el tablero. Cada casilla tiene un valor: compra las que puedas para implementar la mejor tecnología en tu tienda.</p>
                    <p><strong>Tu objetivo es tener más innovación que los demás al completar 2 vueltas.</strong></p>
                    <p>Empiezas con un presupuesto limitado de $200, así que planea bien tus decisiones. Pero cuidado… hay casillas que te pueden hacer perder dinero. ¡Juega con estrategia!</p>
                  </div>
                  <button
                    onClick={() => setIntroState('playing')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-3xl shadow-lg transform transition hover:scale-105 active:scale-95 text-lg flex items-center gap-2"
                  >
                    <span>Tirar dado</span>
                  </button>
                </div>
              )}

              {/* PLAYING STATE */}
              {introState === 'playing' && (
                <>
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
                    <div className="flex flex-col items-center justify-center animate-fade-in w-full h-full pb-6 relative">
                      {/* Dice Container */}
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-slate-100 mt-12 mb-auto flex items-center justify-center min-w-[200px] min-h-[200px] aspect-square p-8">
                        <Dice value={diceValue} rolling={gameState === 'rolling'} onClick={rollDice} />
                      </div>

                      {/* Action Button Area - Bottom aligned */}
                      <div className="mt-auto flex justify-center w-full">
                        {gameState === 'idle' && (
                          <button
                            onClick={rollDice}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-full shadow-2xl transform transition hover:scale-105 active:scale-95 flex items-center gap-2 text-xl border-4 border-emerald-500/30"
                          >
                            <span>TIRAR DADO</span>
                          </button>
                        )}
                        {gameState === 'moving' && (
                          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-slate-100">
                            <span className="text-slate-600 font-bold text-xl animate-pulse">Avanzando...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* LANDED STATE - moved to board overlay */}
                </>
              )}



            </div>
          </div>

          {/* MODAL OVERLAY - rendered at board level to overlay all tiles */}
          {introState === 'playing' && gameState === 'landed' && currentTileData && !penaltyModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm rounded-2xl animate-fade-in p-4 pointer-events-none">
              <div className="pointer-events-auto">
                <TileCard
                  tile={currentTileData}
                  isWinner={winner !== null}
                  onNextTurn={nextTurn}
                  owner={(() => {
                    const owner = getOwner(currentTileData.id);
                    return owner ? { name: owner.name, color: PLAYER_COLORS[owner.colorIndex].bg } : null;
                  })()}
                  isOwnedByCurrentPlayer={ownership.get(currentTileData.id) === currentPlayer.id}
                  canBuy={currentTileData.type === 'property' && !ownership.has(currentTileData.id) && currentPlayer.money >= (currentTileData.price || 0)}
                  onBuy={buyProperty}
                />
              </div>
            </div>
          )}

          {/* PENALTY MODAL OVERLAY */}
          {penaltyModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm rounded-2xl animate-fade-in p-4">
              <div className={`bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-scale-in border-4 ${penaltyModal.recipient ? 'border-amber-500' : 'border-red-500'}`}>
                <div className={`${penaltyModal.recipient ? 'bg-amber-100' : 'bg-red-100'} p-4 rounded-full mb-4`}>
                  <span className="text-4xl">{penaltyModal.recipient ? '🏪' : '⚠️'}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">
                  {penaltyModal.recipient ? '¡Impuesto!' : 'Penalización'}
                </h3>
                <p className="text-slate-600 font-medium mb-6">{penaltyModal.message}</p>
                <div className={`${penaltyModal.recipient ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'} w-full py-4 rounded-xl border mb-8`}>
                  <span className={`text-sm font-bold ${penaltyModal.recipient ? 'text-amber-400' : 'text-red-400'} block mb-1`}>CANTIDAD PAGADA</span>
                  <span className={`text-4xl font-black ${penaltyModal.recipient ? 'text-amber-600' : 'text-red-600'}`}>-${penaltyModal.amount}</span>
                </div>
                <button
                  onClick={nextTurn}
                  className={`w-full ${penaltyModal.recipient ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 text-lg`}
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}

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

        {/* STATS PANEL - RIGHT */}
        <div className="w-full xl:w-auto mt-4 xl:mt-0 xl:h-auto flex flex-col justify-start">
          <PlayerStats
            players={players}
            currentPlayerId={currentPlayer.id}
            ownership={ownership}
          />
        </div>
      </div>

      {/* BANNER CTA */}
      <div className="w-full max-w-[1600px] mb-8 z-10 px-2 sm:px-4">
        <Banner />
      </div>

      {/* FOOTER */}
      <div className="w-full bg-black py-4 z-40 mt-auto">
        <p className="text-center text-slate-400 text-sm font-medium tracking-wide">
          2025 - Términos y condiciones | Aviso de privacidad
        </p>
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

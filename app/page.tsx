'use client'
import React, { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { GameBoard } from './components/GameBoard';
import { Player } from './constants';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Inject Tailwind script if it's missing to prevent "tailwind is not defined" error
    if (!document.getElementById('tailwind-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-script';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const handleStart = (playerData: Player[]) => { 
    setPlayers(playerData); 
    setGameStarted(true); 
  };

  return gameStarted ? <GameBoard players={players} /> : <SetupScreen onStartGame={handleStart} />;
}
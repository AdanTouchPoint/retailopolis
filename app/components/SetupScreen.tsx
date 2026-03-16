'use client'
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { PLAYER_COLORS, Player } from '../constants';
import { PUBLIC_EMAIL_DOMAINS } from '../utils/public_email_domains';

interface SetupScreenProps {
  onPlayersSelected: (players: Player[]) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onPlayersSelected }) => {
  // --- Step 1: Lead Capture State ---
  const [step, setStep] = useState<1 | 2>(1);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });

  // --- Step 2: Player Selection State ---
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

  const handleNextStep = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', company: '', role: '' };

    // 1. Name validation (required, max length 50)
    if (!leadData.name.trim()) {
      newErrors.name = 'El nombre es requerido.';
      isValid = false;
    } else if (leadData.name.length > 50) {
      newErrors.name = 'El nombre es muy largo (máx 50 caracteres).';
      isValid = false;
    }

    // 2. Email validation (required, format, max length 100, business only)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadData.email.trim()) {
      newErrors.email = 'El correo es requerido.';
      isValid = false;
    } else if (!emailRegex.test(leadData.email)) {
      newErrors.email = 'Formato de correo inválido.';
      isValid = false;
    } else if (leadData.email.length > 100) {
      newErrors.email = 'El correo es muy largo.';
      isValid = false;
    } else {
      // Check if it's a public domain
      const domainParts = leadData.email.split('@');
      if (domainParts.length === 2) {
        const domain = domainParts[1].toLowerCase();
        if (PUBLIC_EMAIL_DOMAINS.includes(domain)) {
          newErrors.email = 'Usa un correo corporativo, por favor.';
          isValid = false;
        }
      }
    }

    // 3. Company validation (required, max length 100)
    if (!leadData.company.trim()) {
      newErrors.company = 'La empresa es requerida.';
      isValid = false;
    } else if (leadData.company.length > 100) {
      newErrors.company = 'El nombre es muy largo.';
      isValid = false;
    }

    // 4. Role validation (required, max length 50)
    if (!leadData.role.trim()) {
      newErrors.role = 'El cargo es requerido.';
      isValid = false;
    } else if (leadData.role.length > 50) {
      newErrors.role = 'El cargo es muy largo.';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Pre-fill Player 1's name with the Lead name
      setPlayers((prev) => {
        const newPlayers = [...prev];
        if (newPlayers.length > 0 && !newPlayers[0].name) {
          newPlayers[0].name = leadData.name.trim();
        }
        return newPlayers;
      });
      setStep(2);
    }
  };

  const handleStart = () => {
    const validPlayers = players.filter(p => p.name.trim());
    if (validPlayers.length >= 1) {
      onPlayersSelected(validPlayers.map((p, i) => ({
        id: `player-${i}`,
        name: p.name,
        colorIndex: p.colorIndex,
        position: 0,
        money: 200,
        laps: 0,
      })));


    }
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="md:w-5/12 bg-green-200 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
          <ShoppingBag size={80} className="mb-4 text-slate-600 relative z-10" />
          <h1 className="text-4xl text-slate-600 font-black mb-2 text-center relative z-10">RETAILOPOLY</h1>
          <p className="text-slate-600 text-center relative z-10">¡Completa el recorrido!</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
          <div className="bg-slate-50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            <h1 className="text-4xl text-slate-600 font-black text-center mb-6 text-indigo-700">
              RETAILOPOLY
            </h1>

            {step === 1 ? (
              // --- STEP 1: LEAD CAPTURE ---
              <div className="animate-fade-in">
                <p className="text-slate-600 text-center mb-6 font-medium text-lg">
                  Antes de jugar, comparte unos datos con nosotros.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      maxLength={50}
                      value={leadData.name}
                      onChange={(e) => {
                        setLeadData({ ...leadData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                      placeholder="Tu nombre"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.name ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-300 focus:border-indigo-500'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      maxLength={100}
                      value={leadData.email}
                      onChange={(e) => {
                        setLeadData({ ...leadData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                      placeholder="tu@correo.com"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.email ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-300 focus:border-indigo-500'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Empresa</label>
                      <input
                        type="text"
                        maxLength={100}
                        value={leadData.company}
                        onChange={(e) => {
                          setLeadData({ ...leadData, company: e.target.value });
                          if (errors.company) setErrors({ ...errors, company: '' });
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                        placeholder="Nombre de tu empresa"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.company ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-300 focus:border-indigo-500'}`}
                      />
                      {errors.company && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.company}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Cargo</label>
                      <input
                        type="text"
                        maxLength={50}
                        value={leadData.role}
                        onChange={(e) => {
                          setLeadData({ ...leadData, role: e.target.value });
                          if (errors.role) setErrors({ ...errors, role: '' });
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                        placeholder="Ej. Gerente"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.role ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-300 focus:border-indigo-500'}`}
                      />
                      {errors.role && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.role}</p>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
                >
                  SIGUIENTE
                </button>
              </div>
            ) : (
              // --- STEP 2: PLAYER SELECTION ---
              <div className="animate-fade-in relative">
                <button 
                  onClick={() => setStep(1)}
                  className="absolute -top-14 left-0 text-sm font-bold text-slate-400 hover:text-indigo-600 transition flex items-center gap-1"
                >
                  ← Volver
                </button>
                
                <p className="text-slate-600 text-center mb-6 font-medium">
                  Elige los nombres y colores de los jugadores.
                </p>

                <div className="space-y-4 mb-6">
                  {players.map((player, index) => (
                    <div key={index} className="flex gap-3 items-end bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      {/* Nombre */}
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Jugador {index + 1}
                        </label>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                          placeholder="Nombre del jugador"
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                        />
                      </div>

                      {/* Selector de Color */}
                      <div className="flex gap-2">
                        {PLAYER_COLORS.map((color, colorIdx) => {
                          const takenByOther = players.some((p, i) => i !== index && p.colorIndex === colorIdx);
                          const isSelected = player.colorIndex === colorIdx;
                          return (
                            <button
                              key={color.id}
                              onClick={() => !takenByOther && handleColorChange(index, colorIdx)}
                              disabled={takenByOther}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl transition-all ${color.bg} ${
                                isSelected
                                  ? `ring-4 ring-offset-2 ${color.border} shadow-md transform scale-105`
                                  : takenByOther
                                  ? 'opacity-20 cursor-not-allowed grayscale'
                                  : 'opacity-60 hover:opacity-100 hover:scale-105 hover:shadow-sm'
                              }`}
                              title={takenByOther ? `Color en uso` : color.name}
                            />
                          );
                        })}
                      </div>

                      {/* Botón Eliminar */}
                      {players.length > 1 && (
                        <button
                          onClick={() => handleRemovePlayer(index)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex p-2 h-11 sm:h-12 items-center justify-center font-bold"
                          title="Eliminar jugador"
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
                    className="w-full mb-6 px-4 py-3 bg-indigo-50 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl hover:bg-indigo-100 hover:border-indigo-300 transition font-bold"
                  >
                    + Agregar otro jugador
                  </button>
                )}

                {/* Botón Comenzar */}
                <button
                  onClick={handleStart}
                  className="w-full px-6 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition font-black text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
                >
                  COMENZAR JUEGO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

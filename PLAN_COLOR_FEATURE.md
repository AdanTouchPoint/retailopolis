# Plan de Implementación: Cambio de Figuras a Colores

## 📋 Resumen Ejecutivo

Cambiar el sistema de selección de figuras (Coche, Barco, Avión, Hexágono) por un sistema simple de colores. Los jugadores elegirán solo un color y las casillas mostrarán los colores de los jugadores que están en ella.

---

## 🔍 Análisis Actual

### Estado Actual
- **SetupScreen.tsx**: Permite elegir figura + color
- **Player type**: Contiene `iconId` (referencia a figura) y `colorIndex`
- **BoardTile.tsx**: Muestra el icono del jugador en el tablero
- **PLAYER_ICONS**: Array con 4 figuras diferentes
- **PLAYER_COLORS**: Array con 4 colores

### Problema
- Demasiada complejidad visual
- Difícil ver múltiples jugadores en la misma casilla
- Los iconos compiten por espacio con el icono de la propiedad

---

## 🎯 Objetivo Final

```
ANTES:
┌─────────────┐
│  Paseantes  │
│   [Person]  │  ← Ícono de propiedad
│    🚗       │  ← Ícono del jugador (coche)
└─────────────┘

DESPUÉS:
┌─────────────┐
│  Paseantes  │
│   [Person]  │  ← Ícono de propiedad
│ [Red][Blue] │  ← Colores de jugadores (sin iconos)
└─────────────┘
```

---

## 📊 Cambios Necesarios

### 1. **constants.tsx**

#### 1.1 Eliminar PLAYER_ICONS
```typescript
// ❌ ELIMINAR ESTO
export const PLAYER_ICONS = [
  { id: 'car', icon: Car, label: 'Coche' },
  { id: 'ship', icon: Ship, label: 'Barco' },
  { id: 'plane', icon: Plane, label: 'Avión' },
  { id: 'hex', icon: Hexagon, label: 'Ficha' },
];
```

#### 1.2 Expandir PLAYER_COLORS
```typescript
// ✅ CAMBIAR A
export const PLAYER_COLORS = [
  { 
    id: 'red', 
    bg: 'bg-red-500', 
    border: 'border-red-600',
    hex: '#ef4444',
    name: 'Rojo' 
  },
  { 
    id: 'blue', 
    bg: 'bg-blue-500', 
    border: 'border-blue-600',
    hex: '#3b82f6',
    name: 'Azul' 
  },
  { 
    id: 'green', 
    bg: 'bg-emerald-500', 
    border: 'border-emerald-600',
    hex: '#10b981',
    name: 'Verde' 
  },
  { 
    id: 'orange', 
    bg: 'bg-amber-500', 
    border: 'border-amber-600',
    hex: '#f59e0b',
    name: 'Naranja' 
  },
];
```

#### 1.3 Actualizar tipo Player
```typescript
// ❌ ANTES
export type Player = {
  name: string;
  iconId: string;      // ← ELIMINAR
  colorIndex: number;
  position?: number;
};

// ✅ DESPUÉS
export type Player = {
  id: string;
  name: string;
  colorIndex: number;
  position: number;
};
```

---

### 2. **SetupScreen.tsx**

#### Cambios principales:
- ❌ Eliminar selector de figuras
- ✅ Agregar selector de colores visuales (botones de color)
- ✅ Prevenir duplicados de colores
- ✅ Mostrar nombre y color del jugador

```typescript
// Nueva estructura
{players.map((p, idx) => (
  <div key={idx} className="flex items-end gap-3">
    {/* INPUT NOMBRE */}
    <input value={p.name} onChange={...} />
    
    {/* SELECTOR COLOR */}
    <div className="flex gap-2">
      {PLAYER_COLORS.map((color, colorIdx) => (
        <button
          onClick={() => updateColor(idx, colorIdx)}
          className={`w-10 h-10 rounded-lg ${color.bg} ${
            p.colorIndex === colorIdx ? 'ring-4 ring-offset-2' : 'opacity-60'
          }`}
        />
      ))}
    </div>
    
    {/* BOTÓN ELIMINAR */}
    {players.length > 1 && <button onClick={() => removePlayer(idx)}>✕</button>}
  </div>
))}
```

---

### 3. **BoardTile.tsx**

#### Cambios principales:
- ❌ Eliminar renderizado de iconos de jugadores
- ✅ Agregar indicadores de colores debajo del icono de propiedad
- ✅ Mostrar múltiples colores en la misma casilla
- ✅ Iluminar borde según color del jugador (opcional)

```typescript
// Nueva sección para mostrar jugadores
{/* PLAYER COLOR INDICATORS */}
<div className="w-full flex justify-center gap-1 mb-1 flex-wrap px-1">
  {playersHere.map((player, idx) => (
    <div 
      key={idx}
      className={`w-4 h-4 rounded-full border border-white shadow-sm ${
        PLAYER_COLORS[player.colorIndex].bg
      }`}
      title={player.name}
    />
  ))}
</div>
```

---

### 4. **GameBoard.tsx**

#### Cambios principales:
- Actualizar inicialización de posiciones
- Pasar solo `colorIndex` a BoardTile (no iconId)

```typescript
// CAMBIO EN PROPS
playersHere={players
  .filter(p => p.position === position)
  .map(p => ({ 
    id: p.id, 
    name: p.name, 
    colorIndex: p.colorIndex 
  }))}
```

---

### 5. **page.tsx**

#### Cambio mínimo:
```typescript
// Actualizar inicialización en SetupScreen cuando crea nuevos jugadores
const newPlayers = [...players, {
  id: `player-${players.length}`,
  name: `Jugador ${players.length + 1}`,
  colorIndex: nextAvailableColor,
  position: 0
}];
```

---

## 📱 Visualización de Cambios

### SetupScreen - ANTES
```
┌──────────────────────────────────┐
│ Jugador 1: [INPUT] [Cambiar] 🚗  │
│ Jugador 2: [INPUT] [Cambiar] ⛵  │
└──────────────────────────────────┘
```

### SetupScreen - DESPUÉS
```
┌──────────────────────────────────┐
│ Jugador 1: [INPUT] [🔴][🔵][🟢][🟠]│
│ Jugador 2: [INPUT] [🔴][🔵][🟢][🟠]│
└──────────────────────────────────┘
```

### BoardTile - ANTES
```
┌─────────────┐
│  Paseantes  │
│   [Person]  │
│    🚗 ⛵     │
└─────────────┘
```

### BoardTile - DESPUÉS
```
┌─────────────┐
│  Paseantes  │
│   [Person]  │
│ [●][●][●]   │
└─────────────┘
```

---

## 🔧 Plan de Implementación - Paso a Paso

### ✅ Fase 1: Actualizar Tipos (15 min)
```
1. Modificar constants.tsx:
   - Eliminar PLAYER_ICONS
   - Expandir PLAYER_COLORS
   - Actualizar tipo Player
```

### ✅ Fase 2: SetupScreen (30 min)
```
1. Eliminar lógica de iconos
2. Agregar selector de colores (botones)
3. Prevenir colores duplicados
4. Actualizar visualización
```

### ✅ Fase 3: BoardTile (20 min)
```
1. Eliminar renderizado de iconos de jugadores
2. Agregar indicadores de color
3. Actualizar props
4. Ajustar estilos
```

### ✅ Fase 4: GameBoard (15 min)
```
1. Actualizar cómo pasa props a BoardTile
2. Eliminar referencias a iconId
3. Pasar colorIndex correctamente
```

### ✅ Fase 5: Testing (20 min)
```
1. Probar selección de colores
2. Probar múltiples jugadores en casilla
3. Probar restricción de colores duplicados
4. Responsive en móvil
```

**Tiempo Total: ~100 minutos**

---

## 📋 Checklist de Archivos a Modificar

| Archivo | Cambios | Prioridad |
|---------|---------|-----------|
| `constants.tsx` | Tipos y colores | 🔴 CRÍTICO |
| `SetupScreen.tsx` | UI selector colores | 🔴 CRÍTICO |
| `BoardTile.tsx` | Mostrar colores | 🔴 CRÍTICO |
| `GameBoard.tsx` | Props | 🟡 IMPORTANTE |
| `page.tsx` | Inicialización | 🟢 MENOR |
| `Dice.tsx` | No cambios | ✅ OK |
| `TileCard.tsx` | No cambios | ✅ OK |
| `GameBoard.tsx` | Verificar imports | 🟡 IMPORTANTE |

---

## 🎨 Opciones de Visualización para Múltiples Jugadores

### Opción A: Círculos Alineados (Recomendado)
```
┌─────────────┐
│  Paseantes  │
│   [Person]  │
│  [●][●][●]  │ ← 3 círculos separados
└─────────────┘
```

### Opción B: Anillos Concéntricos
```
┌─────────────┐
│  Paseantes  │
│   [Person]  │
│   [●●●]     │ ← Anillos superpuestos
└─────────────┘
```

### Opción C: Borde Multicolor (Gradiente)
```
┌───────────────┐
│ ████████████  │ ← Borde con colores mezclados
│  Paseantes    │
│   [Person]    │
│   [●][●][●]   │
└───────────────┘
```

---

## 🚀 Ventajas del Nuevo Sistema

✅ **Más simple**: Solo elegir color (4 opciones)  
✅ **Mejor UX**: Interfaz clara y limpia  
✅ **Soporte múltiple**: Muestra varios jugadores por casilla  
✅ **Mejor visual**: Los colores son más visibles  
✅ **Escalable**: Fácil agregar más jugadores/colores  
✅ **Performance**: Menos iconos = menos renderizaciones  

---

## ⚠️ Consideraciones Especiales

### Restricción de Colores Duplicados
```typescript
// Cada color solo puede ser usado por UN jugador
const availableColors = PLAYER_COLORS.filter(
  (_, idx) => !usedColors.has(idx)
);
```

### Máximo de Jugadores
- Actual: 4 (4 figuras)
- Nuevo: 4 (4 colores)
- Si quieres más: Agregar más colores a PLAYER_COLORS

### Persistencia en Juego
```typescript
// El colorIndex se mantiene durante toda la partida
// Se usa para:
// - Identificar al jugador
// - Mostrar en tablero
// - TileCard muestra color del jugador actual
```

---

## 💡 Casos de Uso

### Caso 1: Un jugador por casilla
```
[Rojo] en casilla 5
Visualización: Un círculo rojo
```

### Caso 2: Dos jugadores en la misma casilla
```
[Rojo] y [Azul] en casilla 5
Visualización: Dos círculos (rojo y azul)
```

### Caso 3: Tres o cuatro jugadores
```
[Rojo], [Azul], [Verde] en casilla 5
Visualización: Tres círculos alineados
```

---

¿Listo para implementar? Comienza por Fase 1 (constants.tsx).

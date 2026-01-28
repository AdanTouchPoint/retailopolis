# Guía de Estilos - RetailOpoly

## Descripción General

Este documento explica cómo modificar la apariencia de los componentes en RetailOpoly. El proyecto utiliza **Tailwind CSS** para los estilos y **Lucide React** para los iconos.

---

## 1. Cambiar Colores de las Fichas (Propiedades)

### Ubicación: `app/constants.tsx`

Cada propiedad tiene un campo `color` que define el fondo de la ficha:

```typescript
{ 
  id: 0, 
  name: "TIENDA", 
  color: "bg-emerald-500",  // ← Cambiar este valor
  icon: <ShoppingBag className="w-full h-full text-white p-2"/> 
}
```

**Colores disponibles en Tailwind:**
- `bg-red-500`, `bg-blue-500`, `bg-emerald-500`, `bg-amber-500`
- `bg-purple-100`, `bg-yellow-100`, `bg-pink-100`, `bg-orange-100`
- `bg-green-100`, `bg-teal-100`, `bg-indigo-200`, `bg-gray-100`

**Ejemplo:** Cambiar de `bg-emerald-500` a `bg-blue-600`:

```typescript
{ id: 0, name: "TIENDA", color: "bg-blue-600", ... }
```

---

## 2. Cambiar Iconos de las Fichas

### Ubicación: `app/constants.tsx`

Cada propiedad tiene un campo `icon` que renderiza un icono de Lucide:

```typescript
icon: <ShoppingBag className="w-full h-full text-white p-2"/>
//     ^^^^^^^^^^^^ Cambiar este componente
```

**Pasos para cambiar un icono:**

1. Importar el nuevo icono de `lucide-react`:
```typescript
import { ShoppingBag, Store, Package } from 'lucide-react';
```

2. Reemplazar en la propiedad:
```typescript
// Antes
icon: <ShoppingBag className="w-full h-full text-white p-2"/>

// Después
icon: <Package className="w-full h-full text-white p-2"/>
```

**Iconos disponibles:** Visita [lucide.dev](https://lucide.dev) para ver todos los iconos disponibles.

---

## 3. Cambiar Color del Icono

El color del icono está en la clase `text-*`:

```typescript
icon: <ShoppingBag className="w-full h-full text-white p-2"/>
//                                            ^^^^^^^^^^
```

**Cambiar de blanco a otro color:**

```typescript
// Blanco
className="w-full h-full text-white p-2"

// Verde
className="w-full h-full text-green-500 p-2"

// Rojo
className="w-full h-full text-red-400 p-2"
```

---

## 4. Modificar Estilos de BoardTile

### Ubicación: `app/components/BoardTile.tsx`

Los estilos principales están en el `className` principal del componente:

```typescript
className={`relative border flex flex-col items-center justify-between p-1 transition-all duration-500 overflow-hidden
  ${isActive 
    ? 'bg-indigo-50 border-indigo-400 shadow-md z-20'  // ← Estilo cuando está activo
    : 'bg-emerald-50 border-black opacity-100'          // ← Estilo por defecto
  }
`}
```

**Cambiar el borde:**
```typescript
border                    // Borde fino
border-2                  // Borde más grueso
border-black              // Color del borde
rounded-lg                // Esquinas redondeadas
```

**Cambiar el fondo:**
```typescript
bg-emerald-50            // Fondo claro
bg-emerald-100           // Fondo más oscuro
opacity-100              // Opacidad
```

**Cambiar la sombra:**
```typescript
shadow-md                // Sombra mediana
shadow-lg                // Sombra grande
shadow-sm                // Sombra pequeña
```

---

## 5. Cambiar Tamaño del Icono

### En `BoardTile.tsx`

El tamaño del icono está controlado por `max-h-8 max-w-8`:

```typescript
className: `w-full h-full max-h-8 max-w-8 transition-colors duration-300`
//                         ^^^^^^ ^^^^^^
```

**Opciones de tamaño:**
- `max-h-6 max-w-6` = 24px (pequeño)
- `max-h-8 max-w-8` = 32px (mediano) ← Actual
- `max-h-10 max-w-10` = 40px (grande)
- `max-h-12 max-w-12` = 48px (muy grande)

**Ejemplo:** Hacer los iconos más grandes:
```typescript
className: `w-full h-full max-h-12 max-w-12 transition-colors duration-300`
```

---

## 6. Cambiar Colores del Texto

### Mensajes de las fichas

En `BoardTile.tsx`, el estilo del texto del mensaje:

```typescript
<span className="text-[7px] leading-tight font-bold text-slate-500 block">
//                                              ^^^^^^^^^^^^^^
```

**Colores disponibles:**
- `text-slate-500` = Gris
- `text-red-600` = Rojo
- `text-blue-600` = Azul
- `text-green-600` = Verde

---

## 7. Resumen de Cambios Comunes

| Cambio | Ubicación | Cómo hacerlo |
|--------|-----------|-------------|
| Color fondo ficha | `constants.tsx` → `color:` | Cambiar `bg-*` |
| Icono ficha | `constants.tsx` → `icon:` | Importar nuevo + reemplazar |
| Color icono | `constants.tsx` → `icon` className | Cambiar `text-*` |
| Tamaño icono | `BoardTile.tsx` línea 46 | Cambiar `max-h-* max-w-*` |
| Borde ficha | `BoardTile.tsx` línea 25 | Agregar `border-*` o `rounded-*` |
| Sombra ficha | `BoardTile.tsx` línea 25 | Cambiar `shadow-*` |

---

## 8. Herramientas Útiles

- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/docs)
- **Lucide Icons**: [lucide.dev](https://lucide.dev)
- **Tailwind Color Reference**: [tailwindcss.com/docs/customizing-colors](https://tailwindcss.com/docs/customizing-colors)

---

## 9. Ejemplo Completo: Cambiar una Ficha

**Cambiar "PASILLO 1" a color azul con icono de caja:**

1. Abrir `app/constants.tsx`
2. Encontrar la línea con `id: 1`
3. Modificar:

```typescript
// Antes
{ id: 1, name: "PASILLO 1", message: "Zona de limpieza.", type: "property", color: "bg-purple-100", icon: <Layers className="w-full h-full text-purple-400 p-2"/> },

// Después
{ id: 1, name: "PASILLO 1", message: "Zona de limpieza.", type: "property", color: "bg-blue-100", icon: <Box className="w-full h-full text-blue-500 p-2"/> },
```

4. Agregar `Box` a las importaciones:
```typescript
import { Box } from 'lucide-react';
```

---

¡Listo! Ahora cualquier desarrollador puede hacer cambios de apariencia fácilmente.
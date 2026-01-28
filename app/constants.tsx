import { 
  Car, Ship, Plane, Hexagon,
  ShoppingBag, Star, User, Gift,
  MapPin, Tag, Layers, Zap, Archive, CreditCard, Ticket, Anchor
} from 'lucide-react';
import { PngIcon } from '@/app/components/Icons/Pederestian';

// Board Configuration
export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 5;
export const TOTAL_TILES = 20;

// Properties/Tiles Configuration
export const PROPERTIES = [
  { id: 0, name: "SALIDA", message: "", type: "start" as const, color: "bg-emerald-500" },
  { id: 1, name: "", message: "¡Comienza tu camino con visibilidad real del piso de ventas!", type: "property" as const, color: "bg-purple-100" },
  { id: 2, name: "", message: "¡50% de descuento!", type: "chance" as const, color: "bg-yellow-100" },
  { id: 3, name: "PASEANTES", message: "¿Cuántas personas pasan frente a tu tienda cada día?", type: "property" as const, color: "bg-purple-100" },
  { id: 4, name: "ATRACCION", message: "¿Logras que entren? Mejora tus vitrinas y activa el interés.", type: "property" as const, color: "bg-purple-100" },
  { id: 5, name: "TIENDA A PIE DE CALLE", message: "¿Analizas o supones lo que afecta al éxito de tu tienda?", type: "chance" as const, color: "bg-pink-100" },
  { id: 6, name: "VAS A LA CARCEL", message: "Decidir sin medir te lleva a cometer errores costosos.", type: "corner" as const, color: "bg-blue-200" },
  { id: 7, name: "VISITAS", message: "Cuenta solo a quienes realmente se quedan en tu tienda.", type: "property" as const, color: "bg-orange-100" },
  { id: 8, name: "PERMANENCIA", message: "¿Cuánto tiempo permanecen? Detecta áreas de valor.", type: "chance" as const, color: "bg-red-100" },
  { id: 9, name: "CONVERSION", message: "Mide qué porcentaje de tus visitas se convierte en clientes.", type: "property" as const, color: "bg-orange-100" },
  { id: 10, name: "IMPUESTO AL MAL DATO", message: "Tomar decisiones sin datos te cuesta más de lo que crees.", type: "corner" as const, color: "bg-indigo-200" },
  { id: 11, name: "ARTICULOS POR TICKET", message: "Eleva tu venta promedio. ¿Qué tan bien haces cross-selling?", type: "property" as const, color: "bg-green-100" },
  { id: 12, name: "TIENDA EN CENTRO COMERCIAL", message: "¿Estás vendiendo mejor que tus vecinos o necesitas ajustar tu estrategia?", type: "chance" as const, color: "bg-teal-100" },
  { id: 13, name: "TICKET PROMEDIO", message: "¿Cuánto vale cada venta? Activa estrategias de incremento.", type: "property" as const, color: "bg-green-100" },
  { id: 14, name: "VENTAS TOTALES", message: "¿Vendes lo que podrías vender? Revisa tu rendimiento total.", type: "property" as const, color: "bg-green-100" },
  { id: 15, name: "REGIONALIZACION", message: "No todas tus tiendas rinden igual. Segmenta por región.", type: "chance" as const, color: "bg-pink-100" },
  { id: 16, name: "ESTACIONAMIENTO", message: "Un lugar de estacionamiento puede cambiar el rumbo de tus ventas.", type: "corner" as const, color: "bg-yellow-200" },
  { id: 17, name: "COMPARATIVOS", message: "Compara tu tienda con otras del sector. ¿Estás por debajo?", type: "property" as const, color: "bg-red-100" },
  { id: 18, name: "PREDICCIONES", message: "Usa los datos para anticiparte a los cambios. No reacciones, adelántate.", type: "chance" as const, color: "bg-gray-100" },
  { id: 19, name: "LATIENDA PERFECTA", message: "Cada decisión basada en datos te acercó a ella. Eficiente, rentable y lista para el futuro.", type: "property" as const, color: "bg-red-100" }
];

// Player Icons Configuration
export const PLAYER_ICONS = [
  { id: 'car', icon: Car, label: 'Coche' },
  { id: 'ship', icon: Ship, label: 'Barco' },
  { id: 'plane', icon: Plane, label: 'Avión' },
  { id: 'hex', icon: Hexagon, label: 'Ficha' },
];

// Player Colors Configuration
export const PLAYER_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'
];

// Type Definitions
export type Player = {
  name: string;
  iconId: string;
  colorIndex: number;
  position?: number;
};

export type Property = {
  id: number;
  name: string;
  message: string;
  type: 'start' | 'property' | 'chance' | 'corner';
  color: string;
  title_color?: string;
  position_title?: string;
  icon: React.ReactNode;
};
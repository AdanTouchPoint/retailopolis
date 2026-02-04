import {
  ShoppingBag, Star, User, Gift,
  MapPin, Tag, Layers, Zap, Archive, CreditCard, Ticket, Anchor
} from 'lucide-react';
import { PngIcon } from '@/app/components/Icons/Icon';

// Board Configuration
export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 5;
export const TOTAL_TILES = 20;

// Properties/Tiles Configuration
export const PROPERTIES = [
  { id: 0, name: "SALIDA", message: "", type: "start" as const, color: "bg-emerald-500", title_color: 'none', icon: <PngIcon src="/icons/flecha_icon.png" alt="Salida" className="w-8 h-8" /> },
  { id: 1, name: "", message: "¡Comienza tu camino con visibilidad real del piso de ventas!", type: "property" as const, price: 100, color: "bg-purple-100", title_color: 'none', icon: <PngIcon src="/icons/gettin_icon.png" alt="Paseantes" className="w-8 h-8" /> },

  { id: 2, name: "", message: "¡50% de descuento!", type: "chance" as const, color: "bg-yellow-100", title_color: 'none', icon: <PngIcon src="/icons/gettin_router_icon.png" alt="Descuento" className="w-full h-full" /> },
  { id: 3, name: "PASEANTES", message: "¿Cuántas personas pasan frente a tu tienda cada día?", title_color: 'bg-sky-500', type: "property" as const, price: 150, color: "bg-purple-100", icon: <PngIcon src="/icons/pederestian_icon.png" alt="Paseantes" className="w-8 h-8" /> },
  { id: 4, name: "ATRACCION", message: "¿Logras que entren? Mejora tus vitrinas y activa el interés.", type: "property" as const, price: 180, color: "bg-purple-100", title_color: 'bg-sky-500', icon: <PngIcon src="/icons/atraccion_icon.png" alt="Atracción" className="w-8 h-8" /> },

  { id: 5, name: "TIENDA A PIE DE CALLE", message: "¿Analizas o supones lo que afecta al éxito de tu tienda?", type: "chance" as const, color: "bg-pink-100", title_color: 'bg-pink-500', icon: <PngIcon src="/icons/tienda_calle_icon.png" alt="Atracción" className="w-8 h-8" /> },
  { id: 6, name: "VAS A LA CARCEL", message: "Decidir sin medir te lleva a cometer errores costosos.", type: "corner" as const, color: "bg-blue-200", title_color: 'none', icon: <PngIcon src="/icons/carcel_icon.png" alt="Atracción" className="w-8 h-8" /> },
  { id: 7, name: "VISITAS", message: "Cuenta solo a quienes realmente se quedan en tu tienda.", type: "property" as const, price: 200, color: "bg-orange-100", title_color: 'bg-purple-500', icon: <PngIcon src="/icons/visitas_icon.png" alt="Visitas" className="w-8 h-8" /> },

  { id: 8, name: "PERMANENCIA", message: "¿Cuánto tiempo permanecen? Detecta áreas de valor.", type: "chance" as const, color: "bg-red-100", title_color: 'bg-purple-500', icon: <PngIcon src="/icons/permanencia_icon.png" alt="Permanencia" className="w-8 h-8" /> },
  { id: 9, name: "CONVERSION", message: "Mide qué porcentaje de tus visitas se convierte en clientes.", type: "property" as const, price: 220, color: "bg-orange-100", title_color: 'bg-yellow-500', icon: <PngIcon src="/icons/conversion_icon.png" alt="Conversión" className="w-8 h-8" /> },

  { id: 10, position_title: "bottom", name: "IMPUESTO AL MAL DATO", message: "Tomar decisiones sin datos te cuesta más de lo que crees.", type: "corner" as const, color: "bg-indigo-200", title_color: 'none', icon: <PngIcon src="/icons/impuesto_icon.png" alt="Atracción" className="w-8 h-8" /> },
  { id: 11, position_title: "bottom", name: "ARTICULOS POR TICKET", message: "Eleva tu venta promedio. ¿Qué tan bien haces cross-selling?", type: "property" as const, price: 250, color: "bg-green-100", title_color: 'bg-yellow-500', icon: <PngIcon src="/icons/ticket_icon.png" alt="Artículos" className="w-8 h-8" /> },

  { id: 12, position_title: "bottom", name: "TIENDA EN CENTRO COMERCIAL", message: "¿Estás vendiendo mejor que tus vecinos o necesitas ajustar tu estrategia?", type: "chance" as const, color: "bg-teal-100", title_color: 'bg-pink-500', icon: <PngIcon src="/icons/tienda_centro_icon.png" alt="Ticket Promedio" className="w-8 h-8" /> },
  { id: 13, position_title: "bottom", name: "TICKET PROMEDIO", message: "¿Cuánto vale cada venta? Activa estrategias de incremento.", type: "property" as const, price: 280, color: "bg-green-100", title_color: 'bg-red-500', icon: <PngIcon src="/icons/ticket_promedio_icon.png" alt="Ticket Promedio" className="w-8 h-8" /> },
  { id: 14, position_title: "bottom", name: "VENTAS TOTALES", message: "¿Vendes lo que podrías vender? Revisa tu rendimiento total.", type: "property" as const, price: 300, color: "bg-green-100", title_color: 'bg-red-500', icon: <PngIcon src="/icons/ventas_totales_icon.png" alt="Ventas Totales" className="w-8 h-8" /> },

  { id: 15, position_title: "bottom", name: "REGIONALIZACION", message: "No todas tus tiendas rinden igual. Segmenta por región.", type: "chance" as const, color: "bg-pink-100", title_color: 'bg-green-500', icon: <PngIcon src="/icons/regionalizacion_icon.png" alt="Regionalización" className="w-8 h-8" /> },
  { id: 16, position_title: "bottom", name: "ESTACIONAMIENTO", message: "Un lugar de estacionamiento puede cambiar el rumbo de tus ventas.", type: "corner" as const, color: "bg-yellow-200", title_color: 'none', icon: <PngIcon src="/icons/estacionamiento_icon.png" alt="Estacionamiento" className="w-8 h-8" /> },
  { id: 17, name: "COMPARATIVOS", message: "Compara tu tienda con otras del sector. ¿Estás por debajo?", type: "property" as const, price: 320, color: "bg-red-100", title_color: 'bg-green-500', icon: <PngIcon src="/icons/comparativos_icon.png" alt="Comparativos" className="w-8 h-8" /> },

  { id: 18, name: "PREDICCIONES", message: "Usa los datos para anticiparte a los cambios. No reacciones, adelántate.", type: "chance" as const, color: "bg-gray-100", title_color: 'bg-blue-500', icon: <PngIcon src="/icons/predicciones_icon.png" alt="Predicciones" className="w-8 h-8" /> },
  { id: 19, name: "LATIENDA PERFECTA", message: "Cada decisión basada en datos te acercó a ella. Eficiente, rentable y lista para el futuro.", type: "property" as const, price: 400, color: "bg-red-100", title_color: 'bg-blue-500', icon: <PngIcon src="/icons/tienda_perfecta_icon.png" alt="Tienda Perfecta" className="w-8 h-8" /> },

];


// Player Colors Configuration
export const PLAYER_COLORS = [
  { id: 'red', bg: 'bg-red-500', border: 'border-red-600', name: 'Rojo', hex: '#ef4444' },
  { id: 'blue', bg: 'bg-blue-500', border: 'border-blue-600', name: 'Azul', hex: '#3b82f6' },
  { id: 'green', bg: 'bg-emerald-500', border: 'border-emerald-600', name: 'Verde', hex: '#10b981' },
  { id: 'orange', bg: 'bg-amber-500', border: 'border-amber-600', name: 'Naranja', hex: '#f59e0b' },
];

// Type Definitions
export type Player = {
  id: string;
  name: string;
  colorIndex: number;
  position: number;
  money: number;
};


export type Property = {
  id: number;
  name: string;
  message: string;
  type: 'start' | 'property' | 'chance' | 'corner';
  color: string;
  title_color?: string;
  position_title?: string;
  icon?: React.ReactNode;
  price?: number;
};

// --- CONSTANTES (Reemplazo de Enums) ---
export const ProductCondition = {
  NEW: 'Nuevo',
  USED: 'De Uso'
} as const;
export type ProductCondition = typeof ProductCondition[keyof typeof ProductCondition];

export const DeviceType = {
  MOBILE: 'Móvil',
  TABLET: 'Tablet',
  LAPTOP: 'Laptop'
} as const;
export type DeviceType = typeof DeviceType[keyof typeof DeviceType];

export const PartType = {
  SCREEN: 'Pantalla',
  BATTERY: 'Batería',
  PORT: 'Puerto de Carga',
  STORAGE: 'Almacenamiento',
  RAM: 'Memoria RAM',
  OTHER: 'Otros'
} as const;
export type PartType = typeof PartType[keyof typeof PartType];

// --- INTERFACES PRINCIPALES ---

export interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
  web?: string;
  etiquetas?: string;
  provincia?: string;
}

export interface Anuncio {
  id: string;
  fecha: string;
  texto: string;
  contacto: string;
  tipo: string;
  nombre: string;
  estado: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  brand: string;
  condition: ProductCondition;
  pricePartOnly: number;
  priceInstalled: number;
  imageUrl: string;
  inStock: boolean;
  deviceType?: DeviceType;
  partType?: string;
  negocio?: string; // Campo opcional para vincular producto con negocio
}

export interface CartItem {
  product: Product;
  isInstalled: boolean;
  price: number;
  quantity: number;
}
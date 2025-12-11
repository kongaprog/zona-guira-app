// --- ENUMS (Opciones Fijas) ---
export enum ProductCondition {
  NEW = 'Nuevo',
  USED = 'De Uso'
}

export enum DeviceType {
  MOBILE = 'Móvil',
  TABLET = 'Tablet',
  LAPTOP = 'Laptop'
}

export enum PartType {
  SCREEN = 'Pantalla',
  BATTERY = 'Batería',
  PORT = 'Puerto de Carga',
  STORAGE = 'Almacenamiento',
  RAM = 'Memoria RAM',
  OTHER = 'Otros'
}

// --- INTERFACES PRINCIPALES (Plaza Cuba) ---

// 1. Para el Mapa y Perfiles
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
}

// 2. Para el Muro de Anuncios
export interface Anuncio {
  id: string;
  fecha: string;
  texto: string;
  contacto: string;
  tipo: string;
  nombre: string;
  estado: string;
}

// 3. Para la Tienda / Catálogo
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
}

// 4. Para el Carrito de Compras
export interface CartItem {
  product: Product;
  isInstalled: boolean;
  price: number;
  quantity: number;
}
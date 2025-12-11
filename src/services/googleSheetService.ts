import Papa from 'papaparse';
// 1. Importamos VALORES (Constantes)
import { ProductCondition, PartType } from '../types'; 
// 2. Importamos TIPOS (Interfaces)
import type { Negocio, Product, Anuncio } from '../types';

// --- ENLACES ---
const NEGOCIOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=874763755&single=true&output=csv';
const PRODUCTOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=52042393&single=true&output=csv'; 
const MURO_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=150919361&single=true&output=csv'; 

// --- FUNCIONES DE AYUDA ---
const procesarFoto = (rawUrl: string): string => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  
  let url = rawUrl.trim();
  
  // Si es un enlace de Google Drive, extraemos el ID
  if (url.includes('drive.google') || url.includes('googleusercontent')) {
    const idMatch = url.match(/[-\w]{25,}/);
    if (idMatch) {
      // Usamos lh3 para máxima velocidad y compatibilidad
      return `https://lh3.googleusercontent.com/d/${idMatch[0]}=s1000?authuser=0`;
    }
  }
  
  return url;
};

const limpiarCoordenadas = (input: string): string => {
  if (!input) return '';
  const texto = input.trim();
  if (texto.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) return texto;
  return ''; 
};

const buscarDato = (row: any, keywords: string[]) => {
  const keys = Object.keys(row);
  const keyEncontrada = keys.find(key => 
    keywords.some(palabra => key.toLowerCase().includes(palabra.toLowerCase()))
  );
  return keyEncontrada ? row[keyEncontrada] : '';
};

// --- FETCH NEGOCIOS ---
export const fetchNegocios = async (): Promise<Negocio[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(NEGOCIOS_CSV_URL, {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row: any) => ({
          id: buscarDato(row, ['marca', 'timestamp']) || Math.random().toString(), 
          nombre: buscarDato(row, ['nombre', 'negocio']) || 'Sin Nombre',
          whatsapp: buscarDato(row, ['whatsapp', 'numero']) || '', 
          categoria: buscarDato(row, ['categoría', 'categoria']) || 'Varios',
          descripcion: buscarDato(row, ['descripción', 'descripcion']) || '',
          ubicacion: limpiarCoordenadas(buscarDato(row, ['ubicación', 'ubicacion', 'coordenada'])),
          foto: procesarFoto(buscarDato(row, ['foto', 'imagen'])),
          web: buscarDato(row, ['enlaces', 'web', 'facebook', 'grupo']) || '', 
          etiquetas: buscarDato(row, ['etiquetas', 'clave']) || '',
          provincia: buscarDato(row, ['provincia', 'municipio']) || 'Todas',
        }));
        resolve(data.filter((n) => n.ubicacion.includes(',') && n.nombre !== 'Sin Nombre'));
      },
      error: (error) => reject(error),
    });
  });
};

// --- FETCH PRODUCTOS ---
export const fetchProductos = async (nombreNegocio: string): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(PRODUCTOS_CSV_URL, {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const products = results.data.map((row: any, index: number) => {
            const precio = parseFloat(buscarDato(row, ['precio', 'costo']) || '0');
            return {
                id: index.toString(),
                title: buscarDato(row, ['producto', 'nombre']) || 'Producto',
                description: buscarDato(row, ['descripcion', 'detalles']) || '',
                brand: buscarDato(row, ['marca', 'fabricante']) || 'General',
                condition: ProductCondition.NEW,
                pricePartOnly: precio,
                priceInstalled: 0,
                // 👇 ESTA LÍNEA ES LA CLAVE: Asignamos a 'foto'
                foto: procesarFoto(buscarDato(row, ['foto', 'imagen'])),
                partType: PartType.OTHER,
                inStock: true,
                negocio: buscarDato(row, ['negocio', 'tienda']) || ''
            };
        });
        resolve(products.filter(p => p.negocio && p.negocio.trim().toLowerCase() === nombreNegocio.trim().toLowerCase()));
      },
      error: (error) => reject(error),
    });
  });
};

// --- FETCH ANUNCIOS ---
export const fetchAnuncios = async (): Promise<Anuncio[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(MURO_CSV_URL, {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const anuncios = results.data.map((row: any, index: number) => ({
          id: index.toString(),
          fecha: buscarDato(row, ['marca', 'fecha']) || '',
          texto: buscarDato(row, ['anuncio', 'mensaje', 'descripcion', 'publicar']) || '',
          contacto: buscarDato(row, ['contacto', 'whatsapp']) || '',
          tipo: buscarDato(row, ['tipo', 'categoria']) || 'Varios',
          nombre: buscarDato(row, ['nombre', 'usuario']) || 'Anónimo',
          estado: buscarDato(row, ['estado', 'status']) || 'activo',
          foto: procesarFoto(buscarDato(row, ['foto', 'imagen', 'adjunto', 'captura'])) 
        }));
        resolve(anuncios.filter(a => !a.estado.toLowerCase().includes('ocultar')).reverse());
      },
      error: (error) => reject(error),
    });
  });
};
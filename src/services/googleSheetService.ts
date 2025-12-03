import Papa from 'papaparse';

// --- DEFINICIONES ---
export interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
  web: string; // 👇 NUEVO: Aquí guardaremos el enlace
}

export interface Producto {
  id: string;
  negocio: string;
  nombre: string;
  precio: number;
  foto: string;
  categoria: string;
}

// 1. LINK DE NEGOCIOS (Tu enlace original)
const NEGOCIOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=874763755&single=true&output=csv';

// 2. LINK DE PRODUCTOS (Tu enlace de productos)
const PRODUCTOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=1126609695&single=true&output=csv'; 

// --- FUNCIONES DE AYUDA ---
const limpiarCoordenadas = (input: string): string => {
  if (!input) return '';
  const texto = input.trim();
  if (texto.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) return texto;
  if (texto.includes('@') || texto.includes('coordinate=')) {
    const match = texto.match(/([-0-9.]+),\s*([-0-9.]+)/);
    if (match) return `${match[1]}, ${match[2]}`;
  }
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
        const data = results.data.map((row: any) => {
          const rawUbicacion = buscarDato(row, ['ubicación', 'ubicacion', 'coordenada']);
          return {
            id: buscarDato(row, ['marca', 'timestamp']) || Math.random().toString(), 
            nombre: buscarDato(row, ['nombre', 'negocio']) || 'Sin Nombre',
            whatsapp: buscarDato(row, ['whatsapp', 'numero']) || '', 
            categoria: buscarDato(row, ['categoría', 'categoria']) || 'Varios',
            descripcion: buscarDato(row, ['descripción', 'descripcion']) || '',
            ubicacion: limpiarCoordenadas(rawUbicacion),
            foto: buscarDato(row, ['foto', 'imagen']) || '',
            // 👇 AQUÍ ESTÁ EL CAMBIO: Buscamos palabras clave de tu columna nueva
            web: buscarDato(row, ['enlaces', 'web', 'facebook', 'grupo', 'redes']) || '', 
          };
        });
        resolve(data.filter((n) => n.ubicacion !== '' && n.nombre !== 'Sin Nombre'));
      },
      error: (error) => reject(error),
    });
  });
};

// --- FETCH PRODUCTOS ---
export const fetchProductos = async (nombreNegocio: string): Promise<Producto[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(PRODUCTOS_CSV_URL, {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const todosLosProductos = results.data.map((row: any, index: number) => ({
          id: index.toString(),
          negocio: buscarDato(row, ['negocio', 'tienda']) || '',
          nombre: buscarDato(row, ['producto', 'nombre', 'item']) || 'Producto sin nombre',
          precio: parseFloat(buscarDato(row, ['precio', 'costo']) || '0'),
          foto: buscarDato(row, ['foto', 'imagen']) || '',
          categoria: buscarDato(row, ['categoria', 'tipo']) || 'General'
        }));

        const productosDelNegocio = todosLosProductos.filter(p => 
          p.negocio.trim().toLowerCase() === nombreNegocio.trim().toLowerCase()
        );

        resolve(productosDelNegocio);
      },
      error: (error) => reject(error),
    });
  });
};
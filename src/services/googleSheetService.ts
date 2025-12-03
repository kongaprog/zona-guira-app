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
  web: string;       // Enlace a Facebook, Web propia o Grupo
  etiquetas: string; // 👇 CLAVE: Palabras clave para el buscador (ej: "pizza, queso, delivery")
}

export interface Producto {
  id: string;
  negocio: string;
  nombre: string;
  precio: number;
  foto: string;
  categoria: string;
}

// 1. LINK DE NEGOCIOS (Tu enlace de siempre)
const NEGOCIOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=874763755&single=true&output=csv';

// 2. LINK DE PRODUCTOS (Tu enlace de productos)
const PRODUCTOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=1126609695&single=true&output=csv'; 

// --- FUNCIONES DE AYUDA ---

// Limpia coordenadas sucias o enlaces de mapas
const limpiarCoordenadas = (input: string): string => {
  if (!input) return '';
  const texto = input.trim();
  // Caso ideal: ya viene limpio (22.123, -82.123)
  if (texto.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) return texto;
  // Caso enlaces: busca los números dentro del link
  if (texto.includes('@') || texto.includes('coordinate=')) {
    const match = texto.match(/([-0-9.]+),\s*([-0-9.]+)/);
    if (match) return `${match[1]}, ${match[2]}`;
  }
  return ''; 
};

// Busca una columna aunque le cambien el nombre (Mayúsculas, acentos, etc.)
const buscarDato = (row: any, keywords: string[]) => {
  const keys = Object.keys(row);
  const keyEncontrada = keys.find(key => 
    keywords.some(palabra => key.toLowerCase().includes(palabra.toLowerCase()))
  );
  return keyEncontrada ? row[keyEncontrada] : '';
};

// --- FETCH NEGOCIOS (CARGAR EL MAPA) ---
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
            
            // 👇 WEB EXTERNA: Busca columnas que parezcan enlaces
            web: buscarDato(row, ['enlaces', 'web', 'facebook', 'grupo', 'redes']) || '', 
            
            // 👇 ETIQUETAS SECRETAS: Busca la columna que creaste en el Excel
            etiquetas: buscarDato(row, ['etiquetas', 'clave', 'tags', 'palabras', 'productos']) || '', 
          };
        });
        
        // Filtramos para que no salgan negocios sin ubicación
        resolve(data.filter((n) => n.ubicacion !== '' && n.nombre !== 'Sin Nombre'));
      },
      error: (error) => reject(error),
    });
  });
};

// --- FETCH PRODUCTOS (CARGAR LA TIENDA) ---
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

        // Filtramos: Solo devolvemos los productos de ESTE negocio
        const productosDelNegocio = todosLosProductos.filter(p => 
          p.negocio.trim().toLowerCase() === nombreNegocio.trim().toLowerCase()
        );

        resolve(productosDelNegocio);
      },
      error: (error) => reject(error),
    });
  });
};
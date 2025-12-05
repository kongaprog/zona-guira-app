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
  web: string;
  etiquetas: string;
  provincia: string;
}

export interface Producto {
  id: string;
  negocio: string;
  nombre: string;
  precio: number;
  foto: string;
  categoria: string;
  descripcion: string;
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

// --- ENLACES ---
const NEGOCIOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=874763755&single=true&output=csv';
const PRODUCTOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=52042393&single=true&output=csv'; 
const MURO_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=150919361&single=true&output=csv'; 

// --- FUNCIONES DE AYUDA ---

// 👇 FUNCIÓN DE FOTO BLINDADA (Extrae ID para mayor compatibilidad)
const procesarFoto = (rawUrl: string): string => {
  if (!rawUrl) return '';
  const url = rawUrl.split(',')[0].trim(); // Toma la primera si hay varias

  // Si es Google Drive, intentamos extraer la ID y usar el enlace de thumbnail
  if (url.includes('drive.google.com')) {
    let id = '';
    // Intenta encontrar la ID en formato /file/d/ID/
    const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    // Intenta encontrar la ID en formato id=ID
    const matchId = url.match(/id=([a-zA-Z0-9_-]+)/);

    if (matchFile) id = matchFile[1];
    else if (matchId) id = matchId[1];

    if (id) {
      // Usamos el enlace de thumbnail grande (w800) que es más rápido y seguro
      return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
    }
  }
  return url;
};

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

// --- FUNCIONES FETCH ---

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
          foto: procesarFoto(buscarDato(row, ['foto', 'imagen']) || ''),
          web: buscarDato(row, ['enlaces', 'web', 'facebook', 'grupo']) || '', 
          etiquetas: buscarDato(row, ['etiquetas', 'clave']) || '',
          provincia: buscarDato(row, ['provincia', 'municipio']) || 'Todas',
        }));
        resolve(data.filter((n) => n.ubicacion !== '' && n.nombre !== 'Sin Nombre'));
      },
      error: (error) => reject(error),
    });
  });
};

export const fetchProductos = async (nombreNegocio: string): Promise<Producto[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(PRODUCTOS_CSV_URL, {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const todos = results.data.map((row: any, index: number) => ({
          id: index.toString(),
          negocio: buscarDato(row, ['negocio', 'tienda']) || '',
          nombre: buscarDato(row, ['producto', 'nombre']) || 'Producto',
          precio: parseFloat(buscarDato(row, ['precio', 'costo']) || '0'),
          foto: procesarFoto(buscarDato(row, ['foto', 'imagen']) || ''),
          categoria: buscarDato(row, ['categoria', 'tipo']) || 'General',
          descripcion: buscarDato(row, ['descripcion', 'detalles']) || '', 
        }));
        resolve(todos.filter(p => p.negocio.trim().toLowerCase() === nombreNegocio.trim().toLowerCase()));
      },
      error: (error) => reject(error),
    });
  });
};

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
        }));
        const visibles = anuncios.filter(a => !a.estado.toLowerCase().includes('ocultar'));
        resolve(visibles.reverse());
      },
      error: (error) => reject(error),
    });
  });
};
import Papa from 'papaparse';

// --- 1. DEFINICIONES (Interfaces) ---

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
  descripcion: string; // 👇 NUEVO: Para el detalle del producto/servicio
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

// --- 2. ENLACES A TUS HOJAS DE EXCEL ---

// Link de Negocios
const NEGOCIOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=874763755&single=true&output=csv';

// Link de Productos
const PRODUCTOS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=1126609695&single=true&output=csv'; 

// Link del Muro
const MURO_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=150919361&single=true&output=csv'; 


// --- 3. FUNCIONES DE AYUDA ---

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

// --- 4. FUNCIONES DE CARGA (FETCH) ---

// Cargar Mapa
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
            web: buscarDato(row, ['enlaces', 'web', 'facebook', 'grupo', 'redes']) || '', 
            etiquetas: buscarDato(row, ['etiquetas', 'clave', 'tags']) || '', 
            provincia: buscarDato(row, ['provincia', 'municipio', 'lugar', 'zona']) || 'Todas',
          };
        });
        resolve(data.filter((n) => n.ubicacion !== '' && n.nombre !== 'Sin Nombre'));
      },
      error: (error) => reject(error),
    });
  });
};

// Cargar Tienda
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
          categoria: buscarDato(row, ['categoria', 'tipo']) || 'General',
          // 👇 NUEVO: Busca la descripción del producto/servicio
          descripcion: buscarDato(row, ['descripcion', 'detalles', 'info', 'caracteristicas']) || '', 
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

// Cargar Muro
export const fetchAnuncios = async (): Promise<Anuncio[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(MURO_CSV_URL, {
      download: true, header: true, skipEmptyLines: true,
      complete: (results) => {
        const anuncios = results.data.map((row: any, index: number) => ({
          id: index.toString(),
          fecha: buscarDato(row, ['marca', 'fecha', 'timestamp']) || '',
          texto: buscarDato(row, ['anuncio', 'mensaje', 'descripcion', 'publicar', 'que', 'vend']) || '',
          contacto: buscarDato(row, ['contacto', 'whatsapp', 'numero']) || '',
          tipo: buscarDato(row, ['tipo', 'categoria']) || 'Varios',
          nombre: buscarDato(row, ['nombre', 'usuario']) || 'Anónimo',
          estado: buscarDato(row, ['estado', 'status', 'control', 'visible']) || 'activo', 
        }));

        const anunciosVisibles = anuncios.filter(a => {
          const estado = a.estado.toLowerCase();
          return !estado.includes('ocultar') && !estado.includes('borrar');
        });

        resolve(anunciosVisibles.reverse());
      },
      error: (error) => reject(error),
    });
  });
};
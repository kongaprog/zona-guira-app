import Papa from 'papaparse';

// ⚠️ NO BORRES ESTO: La definición que necesita el Mapa
export interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
}

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlW4nMl5_NutZ13UESh9P7J8CVgjoaNfJGwngCmSjnMTWiDKPeg_05x4Wm4llSNl46s1qzwFc5IF1r/pub?gid=874763755&single=true&output=csv';

// 🧠 Función para limpiar coordenadas (Grados -> Decimales)
const limpiarCoordenadas = (input: string): string => {
  if (!input) return '';
  const texto = input.trim();
  // Decimales simples (22.7, -82.5)
  if (texto.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) return texto;
  // Enlaces de Google/Apple
  if (texto.includes('@') || texto.includes('coordinate=')) {
    const match = texto.match(/([-0-9.]+),\s*([-0-9.]+)/);
    if (match) return `${match[1]}, ${match[2]}`;
  }
  return ''; 
};

// 🕵️‍♂️ DETECTIVE DE COLUMNAS: Busca la columna correcta aunque cambie el nombre
const buscarDato = (row: any, keywords: string[]) => {
  // Buscamos entre todas las columnas de esa fila
  const keys = Object.keys(row);
  // Encontramos la clave que contenga alguna de las palabras clave
  const keyEncontrada = keys.find(key => 
    keywords.some(palabra => key.toLowerCase().includes(palabra.toLowerCase()))
  );
  return keyEncontrada ? row[keyEncontrada] : '';
};

export const fetchNegocios = async (): Promise<Negocio[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row: any) => {
          // 👇 AQUÍ ESTÁ LA MAGIA: Busca por palabras clave
          const rawUbicacion = buscarDato(row, ['ubicación', 'ubicacion', 'coordenada', 'mapa', 'dirección']);
          
          return {
            id: buscarDato(row, ['marca temporal', 'timestamp', 'fecha']) || Math.random().toString(), 
            nombre: buscarDato(row, ['nombre', 'negocio', 'empresa']) || 'Sin Nombre',
            whatsapp: buscarDato(row, ['whatsapp', 'celular', 'teléfono', 'numero']) || '', 
            categoria: buscarDato(row, ['categoría', 'categoria', 'tipo']) || 'Varios',
            descripcion: buscarDato(row, ['descripción', 'descripcion', 'detalles']) || '',
            ubicacion: limpiarCoordenadas(rawUbicacion),
            foto: buscarDato(row, ['foto', 'imagen', 'logo']) || '',
          };
        });

        // Solo dejamos pasar los que tienen ubicación válida
        const negociosValidos = data.filter((n) => n.ubicacion !== '' && n.nombre !== 'Sin Nombre');
        console.log("Negocios encontrados:", negociosValidos);
        resolve(negociosValidos);
      },
      error: (error) => reject(error),
    });
  });
};
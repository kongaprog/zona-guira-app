import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Negocio {
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

// 👇 1. DEFINIMOS EL CERCO DIGITAL (La Caja de Cuba)
// Formato: [[Lat Sur, Lon Oeste], [Lat Norte, Lon Este]]
const CUBA_BOUNDS: L.LatLngBoundsExpression = [
  [19.00, -85.50], // Esquina Abajo-Izquierda (Mar al sur de Pinar)
  [24.00, -73.50]  // Esquina Arriba-Derecha (Mar al norte de Oriente)
];

// Centro inicial
const CENTER_CUBA: [number, number] = [21.9324, -79.4589]; 

interface Props {
  negocios: Negocio[];
  alSeleccionar: (negocio: Negocio) => void;
}

export const Mapa = ({ negocios, alSeleccionar }: Props) => {
  
  const obtenerEmoji = (negocio: Negocio) => {
    const texto = (negocio.categoria + " " + (negocio.etiquetas || "") + " " + negocio.nombre).toLowerCase();
    if (texto.match(/celular|movil|iphone|android|tecno/)) return "📱";
    if (texto.match(/laptop|pc|computadora|ordenador/)) return "💻";
    if (texto.match(/taller|reparacion|mecanic/)) return "🛠️";
    if (texto.match(/pizza|burger|comida|cafe|restaurante/)) return "🍔";
    if (texto.match(/barber|pelo|uñas|salud|farmacia/)) return "💈";
    if (texto.match(/taxi|moto|carro|transporte/)) return "🚖";
    if (texto.match(/casa|alquiler|hostal/)) return "🏠";
    if (texto.match(/ropa|zapato|tienda/)) return "🛍️";
    return "📍"; 
  };

  const crearIconoEmoji = (emoji: string) => {
    return L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="
          background-color: #0f172a;
          color: white;
          border-radius: 50%; 
          width: 36px; height: 36px; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 18px; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          border: 2px solid #38bdf8;
        ">
          ${emoji}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18], 
      popupAnchor: [0, -25] 
    });
  };

  if (!negocios) return <div style={{ padding: "40px", textAlign: "center" }}>Cargando...</div>;

  return (
    <div className="h-[70vh] w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative z-10 bg-slate-900">
      <MapContainer 
        key="mapa-cuba-limitado" 
        center={CENTER_CUBA} 
        zoom={6} 
        // 👇 AQUÍ ESTÁ LA MAGIA DE LOS LÍMITES
        minZoom={6}                 // No pueden alejar más que esto (para ver solo la isla)
        maxBounds={CUBA_BOUNDS}     // La pared invisible
        maxBoundsViscosity={1.0}    // 1.0 significa "Muro Sólido" (no se puede arrastrar fuera ni un poquito)
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} 
      >
        <TileLayer 
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        
        {negocios.map((negocio) => {
          if (!negocio.ubicacion || !negocio.ubicacion.includes(',')) return null;
          const [lat, lng] = negocio.ubicacion.split(',').map(c => parseFloat(c.trim()));
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={negocio.id} position={[lat, lng]} icon={crearIconoEmoji(obtenerEmoji(negocio))}>
              <Popup>
                {/* FICHA FLOTANTE PREMIUM */}
                <div className="w-[240px] bg-slate-900/95 backdrop-blur-md text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700 font-sans">
                  
                  {/* Foto Panorámica */}
                  <div className="h-28 w-full relative bg-slate-800">
                    <img 
                      src={negocio.foto} 
                      alt={negocio.nombre} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/240x120?text=Sin+Foto'}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    
                    <span className="absolute bottom-2 left-3 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wide">
                      {negocio.categoria}
                    </span>
                  </div>
                  
                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-base mb-1 leading-tight">{negocio.nombre}</h3>
                    <p className="text-slate-400 text-xs flex items-center gap-1 mb-3 truncate">
                      📍 {negocio.ubicacion.split(',')[0]}
                    </p>
                    
                    <button 
                      onClick={() => alSeleccionar(negocio)}
                      className="w-full bg-white text-slate-900 py-2 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors shadow-lg flex items-center justify-center gap-1"
                    >
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
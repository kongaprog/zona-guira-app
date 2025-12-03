import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 👇 DEFINICIÓN LOCAL (Para romper la dependencia circular con App)
interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
}

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const CENTER_GUIRA: [number, number] = [22.79680, -82.50694]; 

interface Props {
  negocios: Negocio[];
  alSeleccionar: (negocio: Negocio) => void;
}

export const Mapa = ({ negocios, alSeleccionar }: Props) => {
  // Protección por si los datos vienen vacíos
  if (!negocios) return <div>Cargando mapa...</div>;

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "2px solid #ccc", position: "relative", zIndex: 1 }}>
      <MapContainer key="mapa-guira" center={CENTER_GUIRA} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {negocios.map((negocio) => {
          if (!negocio.ubicacion || !negocio.ubicacion.includes(',')) return null;
          const [lat, lng] = negocio.ubicacion.split(',').map(c => parseFloat(c.trim()));
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={negocio.id} position={[lat, lng]}>
              <Popup>
                <div style={{ textAlign: "center", minWidth: "150px" }}>
                  <strong style={{ display: "block", marginBottom: "5px" }}>{negocio.nombre}</strong>
                  <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "5px" }}>{negocio.categoria}</span>
                  <button 
                    onClick={() => alSeleccionar(negocio)}
                    style={{ 
                      backgroundColor: "#3b82f6", color: "white", border: "none",
                      padding: "6px 12px", borderRadius: "15px", cursor: "pointer",
                      width: "100%", fontWeight: "bold", marginTop: "5px"
                    }}
                  >
                    🏪 Ver Tienda
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 👇 AQUÍ ESTÁ EL TRUCO: Definimos "Negocio" aquí mismo.
// Al no importarlo de fuera, es IMPOSIBLE que te de el error de "export named Negocio".
interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
}

// Iconos desde la nube para evitar errores de archivos
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Coordenadas de Güira de Melena
const CENTER_GUIRA: [number, number] = [22.79680, -82.50694]; 

interface Props {
  negocios: Negocio[];
}

export const Mapa = ({ negocios }: Props) => {
  // Protección contra pantalla blanca si los datos tardan en llegar
  if (!negocios) return <div style={{ padding: "20px", textAlign: "center" }}>Cargando mapa...</div>;

  return (
    <div style={{ 
      height: "500px", 
      width: "100%", 
      borderRadius: "12px", 
      overflow: "hidden", 
      border: "2px solid #ccc",
      backgroundColor: "#e2e8f0", 
      position: "relative",
      zIndex: 1
    }}>
      <MapContainer 
        key="mapa-guira" 
        center={CENTER_GUIRA} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {negocios.map((negocio) => {
          // Si no tiene ubicación válida con coma, lo saltamos
          if (!negocio.ubicacion || !negocio.ubicacion.includes(',')) return null;

          const partes = negocio.ubicacion.split(',');
          if (partes.length !== 2) return null;

          const lat = parseFloat(partes[0].trim());
          const lng = parseFloat(partes[1].trim());

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={negocio.id} position={[lat, lng]}>
              <Popup>
                <div style={{ textAlign: "center", minWidth: "150px" }}>
                  <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontWeight: "bold" }}>{negocio.nombre}</h3>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                    {negocio.categoria}
                  </span>
                  
                  {negocio.foto && (
                    <img 
                      src={negocio.foto} 
                      alt="Foto" 
                      style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}

                  <a 
                    href={`https://wa.me/53${negocio.whatsapp}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      display: "block", 
                      backgroundColor: "#22c55e", 
                      color: "white", 
                      padding: "8px", 
                      borderRadius: "6px", 
                      textDecoration: "none", 
                      fontWeight: "bold"
                    }}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
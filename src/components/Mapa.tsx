import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Negocio } from '../services/googleSheetService';

// 👇 AQUÍ ESTABA EL ERROR: Borramos las líneas de "import icon..." que no se usaban.
// Usamos enlaces directos para evitar problemas de compilación.

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// 📍 Coordenadas de Güira de Melena
const CENTER_GUIRA: [number, number] = [22.79680, -82.50694]; 

interface Props {
  negocios: Negocio[];
}

export const Mapa = ({ negocios }: Props) => {
  return (
    <div style={{ 
      height: "500px", 
      width: "100%", 
      borderRadius: "12px", 
      overflow: "hidden", 
      border: "2px solid #ccc",
      backgroundColor: "#ddd"
    }}>
      <MapContainer 
        center={CENTER_GUIRA} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {negocios.map((negocio) => {
          if (!negocio.ubicacion || !negocio.ubicacion.includes(',')) return null;

          const partes = negocio.ubicacion.split(',');
          if (partes.length !== 2) return null;

          const lat = parseFloat(partes[0].trim());
          const lng = parseFloat(partes[1].trim());

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={negocio.id} position={[lat, lng]}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong>{negocio.nombre}</strong><br/>
                  <span style={{ fontSize: "12px", color: "gray" }}>{negocio.categoria}</span><br/>
                  <a href={`https://wa.me/53${negocio.whatsapp}`} target="_blank" style={{ color: "green", fontWeight: "bold" }}>
                    WhatsApp
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
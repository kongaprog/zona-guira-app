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

// --- 🎨 ICONOS ---
// Azul (Servicios)
const IconoServicio = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// Rojo (Comida)
const IconoComida = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// Amarillo (Transporte)
const IconoTransporte = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// Verde (Ventas/Tiendas)
const IconoVenta = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// 🟣 Violeta (Vivienda/Alquiler) - ¡NUEVO!
const IconoVivienda = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// 🟠 Naranja (Eventos/Fiestas) - ¡NUEVO!
const IconoFiesta = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const CENTER_GUIRA: [number, number] = [22.79680, -82.50694]; 

interface Props {
  negocios: Negocio[];
  alSeleccionar: (negocio: Negocio) => void;
}

export const Mapa = ({ negocios, alSeleccionar }: Props) => {
  
  // 🧠 CEREBRO DE CATEGORÍAS (Actualizado)
  const obtenerIcono = (categoria: string) => {
    const cat = categoria.toLowerCase();
    
    if (cat.match(/gastronom|comida|cafe|pan|dulce|restaurante|pizza|hamburguesa/)) return IconoComida;
    if (cat.match(/transporte|taxi|bici|carrera|moto|mudanza/)) return IconoTransporte;
    
    // Tiendas + Salud + Belleza + Tecnología (Verde)
    if (cat.match(/tienda|venta|ropa|celular|tecnologia|mercado|bodega|agro|vianda|regalo|zapato|belleza|salud|farmacia/)) return IconoVenta;
    
    // 👇 NUEVAS CATEGORÍAS
    if (cat.match(/vivienda|alquiler|casa|renta|permuta/)) return IconoVivienda;
    if (cat.match(/evento|fiesta|payaso|decoracion|cumpleaños|buffet/)) return IconoFiesta;

    return IconoServicio; // Servicios generales (Azul)
  };

  if (!negocios) return <div style={{ padding: "20px", textAlign: "center" }}>Cargando mapa...</div>;

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "2px solid #ccc", position: "relative", zIndex: 1, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
      <MapContainer key="mapa-guira" center={CENTER_GUIRA} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {negocios.map((negocio) => {
          if (!negocio.ubicacion || !negocio.ubicacion.includes(',')) return null;
          const [lat, lng] = negocio.ubicacion.split(',').map(c => parseFloat(c.trim()));
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={negocio.id} position={[lat, lng]} icon={obtenerIcono(negocio.categoria)}>
              <Popup>
                <div style={{ textAlign: "center", minWidth: "150px" }}>
                  <strong style={{ display: "block", marginBottom: "5px", fontSize: "1.1rem" }}>{negocio.nombre}</strong>
                  <span style={{ fontSize: "11px", color: "white", backgroundColor: "#64748b", padding: "2px 8px", borderRadius: "10px", display: "inline-block", marginBottom: "8px" }}>
                    {negocio.categoria}
                  </span>
                  <button 
                    onClick={() => alSeleccionar(negocio)}
                    style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "8px 15px", borderRadius: "20px", cursor: "pointer", width: "100%", fontWeight: "bold", marginTop: "5px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
                  >
                    👉 Ver Perfil
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
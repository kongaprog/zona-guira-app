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

const CENTER_CUBA: [number, number] = [21.9324, -79.4589]; 

interface Props {
  negocios: Negocio[];
  alSeleccionar: (negocio: Negocio) => void;
}

export const Mapa = ({ negocios, alSeleccionar }: Props) => {
  
  const obtenerEmoji = (negocio: Negocio) => {
    const texto = (negocio.categoria + " " + (negocio.etiquetas || "") + " " + negocio.nombre).toLowerCase();

    if (texto.match(/celular|movil|iphone|android|samsung|xiaomi/)) return "📱";
    if (texto.match(/laptop|pc|computadora|ordenador|tecnologia|software/)) return "💻";
    if (texto.match(/reparacion|tecnico|taller|mecanic/)) return "🛠️";
    if (texto.match(/redes|wifi|internet/)) return "📡";
    if (texto.match(/pizza/)) return "🍕";
    if (texto.match(/burger|hamburguesa/)) return "🍔";
    if (texto.match(/cafe|cafeteria/)) return "☕";
    if (texto.match(/restaurante|paladar|comida|asado/)) return "🍽️";
    if (texto.match(/barber|pelo|cabello/)) return "💈";
    if (texto.match(/uñas|manicure|cejas|pestañas/)) return "💅";
    if (texto.match(/farmacia|medico|salud|clinica/)) return "⚕️";
    if (texto.match(/taxi|botero/)) return "🚖";
    if (texto.match(/moto|motorina/)) return "🛵";
    if (texto.match(/casa|alquiler|renta|hostal/)) return "🏠";
    if (texto.match(/ropa|moda|vestido/)) return "👗";
    if (texto.match(/fiesta|evento|decoracion/)) return "🎈";

    return "📍"; 
  };

  // 🎨 DISEÑO DE MARCADOR "SOFT DARK" (Integrado y Elegante)
  const crearIconoEmoji = (emoji: string) => {
    return L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="
          background: linear-gradient(145deg, #1e293b, #0f172a); /* Degradado suave oscuro */
          border-radius: 50%; 
          width: 40px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px; 
          box-shadow: 5px 5px 10px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.05); /* Sombra suave realista */
          border: 1px solid #334155; /* Borde gris sutil, nada de neón */
          position: relative;
        ">
          ${emoji}
          
          <div style="
            position: absolute; 
            bottom: -4px; 
            left: 50%; 
            transform: translateX(-50%); 
            width: 8px; 
            height: 8px; 
            background-color: #0f172a;
            border-bottom: 1px solid #334155;
            border-right: 1px solid #334155;
            transform: translateX(-50%) rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 45], 
      popupAnchor: [0, -45] 
    });
  };

  if (!negocios) return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Cargando mapa...</div>;

  return (
    // Contenedor del mapa con bordes suaves
    <div style={{ height: "70vh", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid #334155", position: "relative", zIndex: 1, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)" }}>
      <MapContainer 
        key="mapa-cuba-detailed" 
        center={CENTER_CUBA} 
        zoom={6} 
        style={{ height: "100%", width: "100%", background: "#1e293b" }}
        zoomControl={false} 
      >
        {/* 👇 USAMOS EL MAPA ORIGINAL (DETALLADO) + FILTRO CSS */}
        <TileLayer 
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        
        {negocios.map((negocio) => {
          if (!negocio.ubicacion || !negocio.ubicacion.includes(',')) return null;
          const [lat, lng] = negocio.ubicacion.split(',').map(c => parseFloat(c.trim()));
          if (isNaN(lat) || isNaN(lng)) return null;

          const emoji = obtenerEmoji(negocio);

          return (
            <Marker key={negocio.id} position={[lat, lng]} icon={crearIconoEmoji(emoji)}>
              <Popup>
                {/* FICHA MINIATURA (Estilo Tarjeta de Presentación Oscura) */}
                <div style={{ width: "220px", fontFamily: "'Inter', sans-serif", backgroundColor: "#1e293b" }}>
                  
                  {/* FOTO */}
                  <div style={{ width: "calc(100% + 2px)", margin: "-1px -1px 0 -1px", height: "110px", borderRadius: "12px 12px 0 0", overflow: "hidden", backgroundColor: "#0f172a", position: "relative" }}>
                    <img 
                      src={negocio.foto} 
                      alt={negocio.nombre} 
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
                      onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/220x110?text=Sin+Foto'}}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #1e293b 0%, transparent 50%)" }}></div>
                  </div>
                  
                  {/* INFO */}
                  <div style={{ padding: "12px" }}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px"}}>
                       <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#f8fafc", lineHeight: "1.2", flex: 1 }}>{negocio.nombre}</h3>
                       <span style={{ fontSize: "10px", backgroundColor: "#334155", color: "#cbd5e1", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px" }}>
                         {negocio.categoria.substring(0, 8)}..
                       </span>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "12px", color: "#94a3b8", fontSize: "11px" }}>
                      <span>📍</span>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
                        {negocio.ubicacion.split(',')[0]}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => alSeleccionar(negocio)}
                      style={{ 
                        width: "100%", 
                        backgroundColor: "#3b82f6", /* Azul Profesional (Facebook/LinkedIn) en vez de Cian neón */
                        color: "white", 
                        border: "none", 
                        padding: "10px 0", 
                        borderRadius: "8px", 
                        cursor: "pointer", 
                        fontWeight: "600", 
                        fontSize: "13px",
                        boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)",
                        transition: "background 0.2s"
                      }}
                    >
                      Entrar
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
import { useState } from 'react';
import { Tienda } from './Tienda';

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

interface Props {
  negocio: Negocio;
  alVolver: () => void;
}

export const PerfilNegocio = ({ negocio, alVolver }: Props) => {
  const [verTienda, setVerTienda] = useState(false);

  // 🕵️‍♂️ Validar Enlaces
  const esEnlaceValido = (texto?: string) => {
    if (!texto || texto.length < 4) return false;
    const t = texto.toLowerCase();
    return t.includes('http') || t.includes('www.') || t.includes('.com') || t.includes('.cu') || t.includes('facebook') || t.includes('instagram');
  };
  const tieneWebReal = esEnlaceValido(negocio.web);

  // --- LÓGICA DE CATEGORÍAS ---
  const cat = negocio.categoria.toLowerCase();
  const esComida = cat.match(/gastronom|comida|cafe|pan|dulce|restaurante|pizza|hamburguesa/);
  const esComercio = cat.match(/tienda|venta|ropa|celular|tecnologia|mercado|bodega|agro|vianda|regalo|zapato|belleza|salud|farmacia/);
  const esTransporte = cat.match(/transporte|taxi|bici|carrera|moto|mudanza/);
  const esServicio = cat.match(/taller|reparacion|peluqueria|barberia|unas|uñas|masaje|consultoria|diseño|foto|agencia|oficio/);
  const esVivienda = cat.match(/vivienda|alquiler|casa|renta|permuta/);
  const esFiesta = cat.match(/evento|fiesta|payaso|decoracion|cumpleaños/);

  const tieneTiendaInterna = (esComida || esComercio || esFiesta) && !tieneWebReal;
  const tieneListaServicios = (esServicio || esVivienda) && !tieneWebReal;

  if (verTienda) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#f8fafc", zIndex: 6000, overflowY: "auto" }}>
        <Tienda 
          nombreNegocio={negocio.nombre} 
          numeroWhatsApp={negocio.whatsapp}
          esModoServicio={!!(esServicio || esVivienda)}
          alCerrar={() => setVerTienda(false)} 
        />
      </div>
    );
  }

  // --- ETIQUETAS DE COLOR ---
  let badgeColor = "bg-blue-100 text-blue-800";
  if (esComida) badgeColor = "bg-red-100 text-red-800";
  else if (esTransporte) badgeColor = "bg-yellow-100 text-yellow-800";
  else if (esVivienda) badgeColor = "bg-purple-100 text-purple-800";

  // Estilos en línea para asegurar compatibilidad
  const estiloBadge = {
    backgroundColor: esComida ? "#fee2e2" : esTransporte ? "#fef9c3" : esVivienda ? "#f3e8ff" : "#e0f2fe",
    color: esComida ? "#991b1b" : esTransporte ? "#854d0e" : esVivienda ? "#6b21a8" : "#0369a1",
    padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase" as const, display: "inline-block"
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "white", zIndex: 5000, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      
      {/* 1. HEADER (FOTO) - ESTILO CINE NEGRO LIMPIO */}
      <div style={{ height: "40vh", minHeight: "300px", backgroundColor: "black", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        
        {/* Botón Atrás Flotante */}
        <button 
          onClick={alVolver} 
          style={{ 
            position: "absolute", top: "20px", left: "20px", 
            backgroundColor: "white", color: "black", 
            border: "none", borderRadius: "50%", 
            width: "45px", height: "45px", 
            fontSize: "1.5rem", cursor: "pointer", 
            zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
          }}
        >
          ←
        </button>

        {negocio.foto ? (
          <img 
            src={negocio.foto} 
            alt={negocio.nombre} 
            referrerPolicy="no-referrer"
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "contain", // La foto se ve ENTERA, sin recortes. El fondo es negro.
              zIndex: 10 
            }} 
            onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Sin+Foto'}}
          />
        ) : (
          <div style={{ color: "#334155", fontSize: "1.2rem" }}>Sin Foto Disponible</div>
        )}
      </div>

      {/* 2. CONTENIDO (Información Organizada) */}
      <div style={{ flex: 1, padding: "30px 20px", marginTop: "-20px", backgroundColor: "white", borderRadius: "24px 24px 0 0", position: "relative", zIndex: 15 }}>
        
        {/* Cabecera Info */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
             <span style={estiloBadge}>{negocio.categoria}</span>
             {negocio.ubicacion && <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>📍 {negocio.ubicacion.split(',')[0]}</span>}
          </div>
          <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#0f172a", fontWeight: "900", lineHeight: "1.1" }}>{negocio.nombre}</h1>
        </div>

        {/* Descripción */}
        <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "16px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#94a3b8", textTransform: "uppercase" }}>Sobre el negocio</h3>
          <p style={{ color: "#334155", lineHeight: "1.6", fontSize: "1rem", whiteSpace: "pre-wrap" }}>
            {negocio.descripcion || "Encuéntranos en Plaza Cuba. Ofrecemos los mejores servicios para ti."}
          </p>
        </div>

        {/* 3. BOTONES DE ACCIÓN (Grandes y Claros) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* Botón Web */}
          {tieneWebReal && negocio.web && (
             <a href={negocio.web.startsWith('http') ? negocio.web : `https://${negocio.web}`} target="_blank" style={{ backgroundColor: "#1e293b", color: "white", padding: "18px", borderRadius: "16px", textAlign: "center", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 12px rgba(30, 41, 59, 0.2)" }}>
               🌐 Visitar Sitio Web
             </a>
          )}

          {/* Botón Tienda Interna */}
          {tieneTiendaInterna && (
            <button onClick={() => setVerTienda(true)} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "18px", borderRadius: "16px", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}>
              {esFiesta ? '🎉 Ver Paquetes' : (esComida ? '🍽️ Ver Menú' : '🛍️ Ver Catálogo')}
            </button>
          )}

          {/* Botón Servicios */}
          {tieneListaServicios && (
             <button onClick={() => setVerTienda(true)} style={{ backgroundColor: "#7c3aed", color: "white", border: "none", padding: "18px", borderRadius: "16px", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)" }}>
               {esVivienda ? '🏠 Ver Precios / Fotos' : '🛠️ Ver Servicios'}
             </button>
          )}

          {/* Botón WhatsApp (Principal) */}
          <a href={`https://wa.me/53${negocio.whatsapp}?text=${encodeURIComponent("Hola, vi su negocio en Plaza Cuba 👋")}`} target="_blank" style={{ backgroundColor: "#16a34a", color: "white", padding: "18px", borderRadius: "16px", textAlign: "center", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)" }}>
            💬 Contactar por WhatsApp
          </a>

        </div>
        
        <div style={{ height: "40px" }}></div> {/* Espacio extra abajo */}
      </div>
    </div>
  );
};
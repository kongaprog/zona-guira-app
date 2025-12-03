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

  // --- LÓGICA DE CATEGORÍAS (Actualizada) ---
  const cat = negocio.categoria.toLowerCase();

  const esComida = cat.match(/gastronom|comida|cafe|pan|dulce|restaurante|pizza|hamburguesa/);
  const esComercio = cat.match(/tienda|venta|ropa|celular|tecnologia|mercado|bodega|agro|vianda|regalo|zapato|belleza|salud|farmacia/);
  const esTransporte = cat.match(/transporte|taxi|bici|carrera|moto|mudanza/);
  const esServicio = cat.match(/taller|reparacion|peluqueria|barberia|unas|uñas|masaje|consultoria|diseño|foto|agencia|oficio/);
  
  // 👇 NUEVOS
  const esVivienda = cat.match(/vivienda|alquiler|casa|renta|permuta/);
  const esFiesta = cat.match(/evento|fiesta|payaso|decoracion|cumpleaños/);

  // Lógica: Tienda interna si es (Comida, Comercio o Fiesta) Y (No tiene web)
  const tieneTiendaInterna = (esComida || esComercio || esFiesta) && !tieneWebReal;

  // Lógica: Servicios también pueden tener "Lista de Precios" (Tienda modo servicio)
  const tieneListaServicios = (esServicio || esVivienda) && !tieneWebReal;

  if (verTienda) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#f8fafc", zIndex: 2000, overflowY: "auto" }}>
        <Tienda 
          nombreNegocio={negocio.nombre} 
          numeroWhatsApp={negocio.whatsapp}
          // Si es servicio o vivienda, activamos modo servicio (lista de precios)
          esModoServicio={!!(esServicio || esVivienda)}
          alCerrar={() => setVerTienda(false)} 
        />
      </div>
    );
  }

  // --- COLOR DEL BADGE (ETIQUETA) ---
  let colorFondo = "#e0f2fe"; // Azul (Default)
  let colorTexto = "#0284c7";
  let iconoDefault = "🏪";

  if (esComida) { colorFondo = "#fecaca"; colorTexto = "#991b1b"; iconoDefault = "🍽️"; }
  else if (esTransporte) { colorFondo = "#fef08a"; colorTexto = "#854d0e"; iconoDefault = "🚖"; }
  else if (esVivienda) { colorFondo = "#e9d5ff"; colorTexto = "#6b21a8"; iconoDefault = "🏠"; } // Morado
  else if (esFiesta) { colorFondo = "#fed7aa"; colorTexto = "#9a3412"; iconoDefault = "🎉"; } // Naranja
  else if (esServicio) { colorFondo = "#ddd6fe"; colorTexto = "#5b21b6"; iconoDefault = "🛠️"; }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#f8fafc", zIndex: 2000, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      
      {/* PORTADA */}
      <div style={{ height: "250px", backgroundColor: "#cbd5e1", position: "relative" }}>
        {negocio.foto ? (
          <img src={negocio.foto} alt={negocio.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "#64748b" }}>
            {iconoDefault}
          </div>
        )}
        <button onClick={alVolver} style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "1.5rem", cursor: "pointer" }}>←</button>
      </div>

      {/* INFO */}
      <div style={{ flex: 1, marginTop: "-30px", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", backgroundColor: "white", padding: "25px 20px", boxShadow: "0 -4px 10px rgba(0,0,0,0.1)" }}>
        <span style={{ backgroundColor: colorFondo, color: colorTexto, padding: "5px 12px", borderRadius: "15px", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>
          {negocio.categoria}
        </span>
        
        <h1 style={{ margin: "15px 0 10px 0", fontSize: "1.8rem", color: "#0f172a" }}>{negocio.nombre}</h1>
        <p style={{ color: "#64748b", lineHeight: "1.6", marginBottom: "30px" }}>
          {negocio.descripcion || "Encuéntranos en Zona Güira."}
        </p>

        {/* 👇 BOTONES DINÁMICOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* WEB EXTERNA */}
          {tieneWebReal && negocio.web && (
             <a href={negocio.web.startsWith('http') ? negocio.web : `https://${negocio.web}`} target="_blank" style={{ backgroundColor: "#0f172a", color: "white", padding: "15px", borderRadius: "12px", textAlign: "center", textDecoration: "none", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0, 0.3)" }}>
               🌐 Visitar Web / Redes
             </a>
          )}

          {/* TIENDA (CATÁLOGO) */}
          {tieneTiendaInterna && (
            <button onClick={() => setVerTienda(true)} style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "15px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)" }}>
              {esFiesta ? '🎉 Ver Paquetes' : (esComida ? '🍽️ Ver Menú' : '🛍️ Ver Catálogo')}
            </button>
          )}

          {/* LISTA DE SERVICIOS */}
          {tieneListaServicios && (
             <button onClick={() => setVerTienda(true)} style={{ backgroundColor: "#8b5cf6", color: "white", border: "none", padding: "15px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1.1rem" }}>
               {esVivienda ? '🏠 Ver Precios / Fotos' : '🛠️ Ver Servicios y Precios'}
             </button>
          )}

          {/* WHATSAPP */}
          <a href={`https://wa.me/53${negocio.whatsapp}?text=${encodeURIComponent("Hola, vi su negocio en Zona Güira 👋")}`} target="_blank" style={{ backgroundColor: "#22c55e", color: "white", padding: "15px", borderRadius: "12px", textAlign: "center", textDecoration: "none", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(34, 197, 94, 0.3)" }}>
            💬 Contactar por WhatsApp
          </a>

        </div>
      </div>
    </div>
  );
};
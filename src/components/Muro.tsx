import { useState, useEffect } from 'react';
import { fetchAnuncios } from '../services/googleSheetService';

// Definición Local
interface Anuncio {
  id: string;
  fecha: string;
  texto: string;
  contacto: string;
  tipo: string;
  nombre: string;
  estado: string;
}

export const Muro = () => {
  const [todosLosAnuncios, setTodosLosAnuncios] = useState<Anuncio[]>([]);
  const [anunciosFiltrados, setAnunciosFiltrados] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filtroActivo, setFiltroActivo] = useState("Todos");

  // 👇 AQUÍ ESTÁ TU NUEVO ENLACE AL FORMULARIO
  const LINK_PUBLICAR = "https://docs.google.com/forms/d/e/1FAIpQLSfHqC6Cbq4mTLGt0CyO_qgEHQUf1HeBDIbw9sgcvbJNzWqgtA/viewform?usp=header"; 

  useEffect(() => {
    fetchAnuncios().then((data) => {
      // Truco de TypeScript
      const datosLimpios = data as unknown as Anuncio[];
      setTodosLosAnuncios(datosLimpios);
      setAnunciosFiltrados(datosLimpios);
      setLoading(false);
    });
  }, []);

  // Lógica de Filtrado
  useEffect(() => {
    if (filtroActivo === "Todos") {
      setAnunciosFiltrados(todosLosAnuncios);
    } else {
      setAnunciosFiltrados(todosLosAnuncios.filter(a => 
        a.tipo.toLowerCase().includes(filtroActivo.toLowerCase())
      ));
    }
  }, [filtroActivo, todosLosAnuncios]);

  const getColorTipo = (tipo: string) => {
    const t = (tipo || "").toLowerCase();
    if (t.includes('venta')) return { bg: '#dcfce7', text: '#166534' }; 
    if (t.includes('compra')) return { bg: '#dbeafe', text: '#1e40af' }; 
    if (t.includes('cambio')) return { bg: '#f3e8ff', text: '#6b21a8' }; 
    if (t.includes('divisa') || t.includes('usd')) return { bg: '#ffedd5', text: '#9a3412' }; 
    return { bg: '#f1f5f9', text: '#475569' }; 
  };

  const BOTONES_MURO = ["Todos", "Venta", "Compra", "Cambio", "Divisas", "Otro"];

  return (
    <div style={{ paddingBottom: "80px" }}>
      
      {/* CABECERA */}
      <div style={{ backgroundColor: "white", padding: "20px", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 }}>
        <h2 style={{ margin: "0 0 5px 0", fontSize: "1.5rem", color: "#0f172a" }}>El Muro 📢</h2>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>Anuncios flash de 24h.</p>
        
        {/* BOTONES DE FILTRO */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "5px", marginTop: "15px", scrollbarWidth: "none" }}>
          {BOTONES_MURO.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroActivo(cat)}
              style={{
                padding: "6px 12px", borderRadius: "15px", border: "1px solid #cbd5e1", 
                whiteSpace: "nowrap", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem",
                backgroundColor: filtroActivo === cat ? "#0f172a" : "white",
                color: filtroActivo === cat ? "white" : "#475569"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BOTÓN DE PUBLICAR */}
        <a 
          href={LINK_PUBLICAR} 
          target="_blank"
          style={{ 
            display: "block", marginTop: "15px", backgroundColor: "#ef4444", color: "white", 
            textAlign: "center", padding: "12px", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "1rem", boxShadow: "0 4px 10px rgba(239,68,68,0.3)"
          }}
        >
          ✍️ Publicar Anuncio
        </a>
      </div>

      {/* LISTA DE ANUNCIOS */}
      <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>Cargando anuncios...</div>
        ) : anunciosFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            <div style={{ fontSize: "2rem" }}>📭</div>
            <p>No hay anuncios de "{filtroActivo}" por ahora.</p>
          </div>
        ) : (
          anunciosFiltrados.map((anuncio) => {
            const estilo = getColorTipo(anuncio.tipo);
            return (
              <div key={anuncio.id} style={{ backgroundColor: "white", padding: "15px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontWeight: "bold", color: "#334155" }}>{anuncio.nombre}</span>
                  <span style={{ backgroundColor: estilo.bg, color: estilo.text, padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>
                    {anuncio.tipo}
                  </span>
                </div>
                <p style={{ margin: "0 0 15px 0", fontSize: "1rem", lineHeight: "1.5", color: "#1e293b" }}>{anuncio.texto}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{anuncio.fecha}</span>
                   <a 
                     href={`https://wa.me/53${anuncio.contacto}?text=Hola, vi tu anuncio en el Muro: ${anuncio.texto.substring(0, 15)}...`}
                     target="_blank"
                     style={{ backgroundColor: "#22c55e", color: "white", padding: "6px 12px", borderRadius: "20px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "bold" }}
                   >
                     💬 Contactar
                   </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
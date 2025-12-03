// 👇 DEFINICIÓN LOCAL (Rompe el círculo)
interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
}

interface Props {
  negocio: Negocio;
  alVolver: () => void;
}

export const PerfilNegocio = ({ negocio, alVolver }: Props) => {
  return (
    <div style={{ 
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: "#f8fafc", zIndex: 2000, overflowY: "auto",
      display: "flex", flexDirection: "column"
    }}>
      
      {/* PORTADA */}
      <div style={{ height: "250px", backgroundColor: "#cbd5e1", position: "relative" }}>
        {negocio.foto ? (
          <img src={negocio.foto} alt={negocio.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🏪</div>
        )}
        <button 
          onClick={alVolver}
          style={{ 
            position: "absolute", top: "15px", left: "15px", 
            backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", 
            borderRadius: "50%", width: "40px", height: "40px", fontSize: "1.5rem", cursor: "pointer"
          }}
        >
          ←
        </button>
      </div>

      {/* INFO */}
      <div style={{ flex: 1, marginTop: "-30px", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", backgroundColor: "white", padding: "25px 20px", boxShadow: "0 -4px 10px rgba(0,0,0,0.1)" }}>
        <span style={{ backgroundColor: "#e0f2fe", color: "#0284c7", padding: "5px 12px", borderRadius: "15px", fontSize: "0.8rem", fontWeight: "bold" }}>
          {negocio.categoria}
        </span>
        <h1 style={{ margin: "15px 0 10px 0", fontSize: "1.8rem", color: "#0f172a" }}>{negocio.nombre}</h1>
        <p style={{ color: "#64748b", lineHeight: "1.6", marginBottom: "30px" }}>
          {negocio.descripcion || "Bienvenido a mi negocio en Zona Güira."}
        </p>

        {/* BOTONES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <a 
            href={`https://wa.me/53${negocio.whatsapp}`} 
            target="_blank"
            style={{ backgroundColor: "#22c55e", color: "white", padding: "12px", borderRadius: "12px", textAlign: "center", textDecoration: "none", fontWeight: "bold" }}
          >
            💬 WhatsApp
          </a>
          <button style={{ backgroundColor: "#f1f5f9", color: "#94a3b8", border: "none", padding: "12px", borderRadius: "12px", fontWeight: "bold", cursor: "not-allowed" }}>
            🛍️ Productos (Pronto)
          </button>
        </div>
      </div>
    </div>
  );
};
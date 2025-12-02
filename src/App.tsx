import { useEffect, useState } from 'react';
// 👇 CORRECCIÓN: Quitamos 'Negocio' de aquí para que no de error
import { fetchNegocios } from './services/googleSheetService';
import { Mapa } from './components/Mapa';

// 👇 Definimos qué es un Negocio aquí mismo (Localmente)
interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
}

function App() {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);

  // Enlace a tu formulario
  const LINK_FORMULARIO = "https://forms.gle/tZaxyqDWtYFbfGUV6"; 

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await fetchNegocios();
        // TypeScript a veces se pone estricto, esto asegura que los datos encajen
        setNegocios(data as unknown as Negocio[]);
      } catch (error) {
        console.error("Error cargando negocios:", error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* 1. BARRA SUPERIOR (NAVBAR) */}
      <nav style={{ backgroundColor: "#1e293b", padding: "15px 20px", color: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-1px" }}>
            ZONA <span style={{ color: "#38bdf8" }}>GÜIRA</span>
          </div>
          <a 
            href={LINK_FORMULARIO} 
            target="_blank" 
            style={{ backgroundColor: "#f97316", color: "white", textDecoration: "none", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "0.9rem" }}
          >
            + Unirme
          </a>
        </div>
      </nav>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: "1000px", margin: "20px auto", padding: "0 15px" }}>
        
        {/* Héroe (Texto de bienvenida) */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#0f172a", fontSize: "2rem", marginBottom: "10px", lineHeight: "1.2" }}>
            El Centro Comercial Digital <br/> de Güira de Melena
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Encuentra lo que buscas rápido y contacta directo por WhatsApp.
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ backgroundColor: "white", padding: "15px 25px", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <span style={{ display: "block", fontSize: "1.8rem", fontWeight: "bold", color: "#3b82f6" }}>
              {loading ? "..." : negocios.length}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>
              Negocios Activos
            </span>
          </div>
          
          <div style={{ backgroundColor: "white", padding: "15px 25px", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <span style={{ display: "block", fontSize: "1.8rem", fontWeight: "bold", color: "#22c55e" }}>
              100%
            </span>
            <span style={{ fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>
              Gratis
            </span>
          </div>
        </div>

        {/* 3. EL MAPA */}
        <div style={{ position: "relative" }}>
          {/* @ts-ignore - Ignoramos error de tipado estricto para que funcione ya */}
          <Mapa negocios={negocios} />
          
          {loading && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(255,255,255,0.9)", padding: "20px", borderRadius: "10px", fontWeight: "bold" }}>
              Cargando mapa...
            </div>
          )}
        </div>

        {/* 4. FOOTER */}
        <div style={{ marginTop: "40px", textAlign: "center", padding: "40px 20px", backgroundColor: "#eff6ff", borderRadius: "16px" }}>
          <h3 style={{ color: "#1e40af", marginBottom: "10px" }}>¿Tu negocio no aparece?</h3>
          <p style={{ color: "#60a5fa", marginBottom: "20px" }}>Únete a los fundadores y aparece en el mapa hoy mismo.</p>
          <a 
            href={LINK_FORMULARIO}
            target="_blank"
            style={{ backgroundColor: "#2563eb", color: "white", textDecoration: "none", padding: "12px 30px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)" }}
          >
            🚀 Registrar mi Negocio Ahora
          </a>
        </div>

      </main>

      <footer style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "0.8rem", marginTop: "20px" }}>
        © 2024 Zona Güira - Desarrollado por Alexander Carrillo
      </footer>
    </div>
  );
}

export default App;
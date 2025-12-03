import { useEffect, useState } from 'react';
import { fetchNegocios } from './services/googleSheetService';
import { Mapa } from './components/Mapa';
import { PerfilNegocio } from './components/PerfilNegocio'; // 👇 Importamos la nueva pantalla

// Exportamos esto para usarlo en otros archivos si hace falta
export interface Negocio {
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
  
  // 👇 ESTADO NUEVO: ¿Hay algún negocio seleccionado?
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<Negocio | null>(null);

  const LINK_FORMULARIO = "https://forms.gle/tZaxyqDWtYFbfGUV6"; 

  useEffect(() => {
    fetchNegocios().then((data) => {
      setNegocios(data as unknown as Negocio[]);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* 👇 LÓGICA DE PANTALLAS: Si hay negocio seleccionado, mostramos su perfil. Si no, el Home normal */}
      {negocioSeleccionado ? (
        <PerfilNegocio 
          negocio={negocioSeleccionado} 
          alVolver={() => setNegocioSeleccionado(null)} 
        />
      ) : (
        <>
          {/* BARRA SUPERIOR */}
          <nav style={{ backgroundColor: "#1e293b", padding: "15px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: "900", fontSize: "1.2rem" }}>ZONA <span style={{ color: "#38bdf8" }}>GÜIRA</span></div>
            <a href={LINK_FORMULARIO} target="_blank" style={{ backgroundColor: "#f97316", color: "white", textDecoration: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>+ Unirme</a>
          </nav>

          <main style={{ maxWidth: "1000px", margin: "20px auto", padding: "0 15px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1 style={{ fontSize: "1.8rem", color: "#0f172a", marginBottom: "5px" }}>Centro Comercial Digital</h1>
              <p style={{ color: "#64748b" }}>{negocios.length} Negocios Fundadores activos</p>
            </div>

            {/* MAPA */}
            <div style={{ position: "relative" }}>
              {/* @ts-ignore */}
              <Mapa 
                negocios={negocios} 
                alSeleccionar={(n) => setNegocioSeleccionado(n)} // Pasamos la función
              />
              {loading && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", padding: "10px" }}>Cargando...</div>}
            </div>
            
            <div style={{ marginTop: "30px", textAlign: "center", padding: "30px", backgroundColor: "#eff6ff", borderRadius: "10px" }}>
              <h3 style={{ color: "#1e40af" }}>¿Tienes un negocio?</h3>
              <a href={LINK_FORMULARIO} target="_blank" style={{ display: "inline-block", marginTop: "10px", backgroundColor: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>Registrarme Gratis</a>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
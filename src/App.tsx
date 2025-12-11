import { useEffect, useState } from 'react';
import { fetchNegocios } from './services/googleSheetService';
import { Mapa } from './components/Mapa';
import { PerfilNegocio } from './components/PerfilNegocio';
import { Muro } from './components/Muro';
import { Bienvenida } from './components/Bienvenida';

// Definición Local de Negocio
export interface Negocio {
  id: string;
  nombre: string;
  whatsapp: string;
  categoria: string;
  descripcion: string;
  ubicacion: string;
  foto: string;
  web?: string;
  etiquetas?: string;
  provincia?: string;
}

function App() {
  const [todosLosNegocios, setTodosLosNegocios] = useState<Negocio[]>([]);
  const [negociosFiltrados, setNegociosFiltrados] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<Negocio | null>(null);
  
  // Estados de Navegación
  const [pestanaActiva, setPestanaActiva] = useState<'mapa' | 'muro'>('mapa');
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [provinciaUsuario, setProvinciaUsuario] = useState<string>("");

  // Estados de Filtro
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  // Enlaces
  const LINK_FORMULARIO_UNIRSE = "https://forms.gle/tZaxyqDWtYFbfGUV6";
  const LINK_QUEJAS = "https://docs.google.com/forms/d/e/1FAIpQLScfYDqj8d4xai2Rz4VaOh5757ATT5ubfHJ_yRLNVt9PB1yiIA/viewform?usp=header";

  useEffect(() => {
    fetchNegocios().then((data) => {
      const datosLimpios = data as unknown as Negocio[];
      setTodosLosNegocios(datosLimpios);
      setLoading(false);
    });
  }, []);

  const entrarApp = (provincia: string) => {
    setProvinciaUsuario(provincia);
    setMostrarBienvenida(false);
  };

  const limpiarTexto = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // --- EL CEREBRO DE FILTRADO ---
  useEffect(() => {
    let resultado = todosLosNegocios;

    if (provinciaUsuario && provinciaUsuario !== "Todas") {
      resultado = resultado.filter(n => {
        const provNegocio = n.provincia ? n.provincia.toLowerCase() : "";
        return provNegocio === "" || provNegocio === "todas" || provNegocio.includes(provinciaUsuario.toLowerCase());
      });
    }

    if (categoriaActiva !== "Todas") {
      const catFilter = (n: Negocio, regex: RegExp) => n.categoria.toLowerCase().match(regex);
      if (categoriaActiva === "Comida") resultado = resultado.filter(n => catFilter(n, /gastronom|comida|cafe|pan|dulce|restaurante|pizza|hamburguesa/));
      else if (categoriaActiva === "Tiendas") resultado = resultado.filter(n => catFilter(n, /tienda|venta|ropa|celular|tecnologia|mercado|bodega|agro|vianda|belleza|salud|farmacia/));
      else if (categoriaActiva === "Transporte") resultado = resultado.filter(n => catFilter(n, /transporte|taxi|bici|carrera|moto|mudanza/));
      else if (categoriaActiva === "Vivienda") resultado = resultado.filter(n => catFilter(n, /vivienda|alquiler|casa|renta|permuta/));
      else if (categoriaActiva === "Eventos") resultado = resultado.filter(n => catFilter(n, /evento|fiesta|payaso|decoracion|cumpleaños/));
      else if (categoriaActiva === "Servicios") resultado = resultado.filter(n => catFilter(n, /taller|reparacion|peluqueria|barberia|unas|uñas|masaje|consultoria|diseño|foto|agencia|oficio/));
    }

    if (busqueda !== "") {
      const textoBuscado = limpiarTexto(busqueda);
      resultado = resultado.filter(n => {
        const nombre = limpiarTexto(n.nombre);
        const desc = limpiarTexto(n.descripcion || "");
        const cat = limpiarTexto(n.categoria);
        const tags = limpiarTexto(n.etiquetas || ""); 
        return nombre.includes(textoBuscado) || desc.includes(textoBuscado) || cat.includes(textoBuscado) || tags.includes(textoBuscado);
      });
    }

    setNegociosFiltrados(resultado);
  }, [busqueda, categoriaActiva, todosLosNegocios, provinciaUsuario]);

  const CATEGORIAS_BOTONES = ["Todas", "Comida", "Tiendas", "Transporte", "Vivienda", "Eventos", "Servicios"];

  if (mostrarBienvenida) {
    return <Bienvenida alComenzar={entrarApp} />;
  }

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* BARRA SUPERIOR */}
      <div style={{ backgroundColor: "#0f172a", color: "#94a3b8", padding: "8px 15px", fontSize: "0.8rem", textAlign: "center", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
        <span>📍 Estás viendo: <strong style={{ color: "white" }}>{provinciaUsuario === "Todas" ? "Toda Cuba" : provinciaUsuario}</strong></span>
        <button onClick={() => setMostrarBienvenida(true)} style={{ background: "none", border: "1px solid #475569", color: "white", borderRadius: "5px", padding: "2px 10px", cursor: "pointer", fontSize: "0.7rem" }}>Cambiar</button>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        
        {/* --- SECCIÓN MAPA --- */}
        <div style={{ display: pestanaActiva === 'mapa' ? 'block' : 'none', height: '100%' }}>
            
            <nav style={{ backgroundColor: "#1e293b", padding: "15px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
              <div style={{ fontWeight: "900", fontSize: "1.3rem", letterSpacing: "-0.5px" }}>PLAZA <span style={{ color: "#ef4444" }}>CUBA</span></div>
              <a href={LINK_FORMULARIO_UNIRSE} target="_blank" style={{ backgroundColor: "#ef4444", color: "white", textDecoration: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" }}>+ Unirme</a>
            </nav>

            <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "15px", paddingBottom: "80px", width: "100%", boxSizing: "border-box" }}>
              <div style={{ marginBottom: "15px" }}>
                <input type="text" placeholder={`🔍 Buscar en ${provinciaUsuario}...`} value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: "100%", padding: "14px 15px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", outline: "none" }} />
              </div>
              
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "5px", scrollbarWidth: "none" }}>
                {CATEGORIAS_BOTONES.map((cat) => (
                  <button key={cat} onClick={() => { setCategoriaActiva(cat); setBusqueda(""); }} style={{ padding: "8px 16px", borderRadius: "20px", border: "none", whiteSpace: "nowrap", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem", backgroundColor: categoriaActiva === cat ? "#0f172a" : "#e2e8f0", color: categoriaActiva === cat ? "white" : "#475569", transition: "all 0.2s" }}>
                     {cat === "Todas" ? "Todo" : cat}
                  </button>
                ))}
              </div>
              
              <div style={{ marginBottom: "10px", fontSize: "0.85rem", color: "#64748b", fontWeight: "bold" }}>📍 {negociosFiltrados.length} resultados</div>
              
              <div style={{ position: "relative" }}>
                {/* @ts-ignore */}
                <Mapa negocios={negociosFiltrados} alSeleccionar={(n) => setNegocioSeleccionado(n)} />
                {loading && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", padding: "15px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", fontWeight: "bold", color: "#0f172a" }}>Cargando Plaza Cuba...</div>}
              </div>
              
              <div style={{ marginTop: "30px", textAlign: "center", padding: "30px 20px", backgroundColor: "#fff1f2", borderRadius: "16px" }}>
                <h3 style={{ color: "#991b1b", fontSize: "1.1rem", margin: "0 0 10px 0" }}>¿Tu negocio no aparece?</h3>
                <a href={LINK_FORMULARIO_UNIRSE} target="_blank" style={{ display: "inline-block", backgroundColor: "#ef4444", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>Registrarme Gratis</a>
              </div>
            </main>
        </div>

        {/* --- SECCIÓN MURO --- */}
        {pestanaActiva === 'muro' && <Muro />}

        {/* --- CAPA FLOTANTE: PERFIL --- */}
        {negocioSeleccionado && (
           <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000, backgroundColor: '#f8fafc', overflowY: 'auto' }}>
              <PerfilNegocio negocio={negocioSeleccionado} alVolver={() => setNegocioSeleccionado(null)} />
           </div>
        )}

        {/* BOTÓN FLOTANTE: QUEJAS Y SUGERENCIAS */}
        {!negocioSeleccionado && (
          <a 
            href={LINK_QUEJAS} 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "fixed",
              bottom: "80px", 
              right: "20px",
              backgroundColor: "#1e293b",
              color: "white",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              zIndex: 1000,
              textDecoration: "none",
              fontSize: "20px",
              border: "1px solid #334155"
            }}
            title="Buzón de Sugerencias"
          >
            📩
          </a>
        )}

      </div>

      {/* MENÚ INFERIOR */}
      {!negocioSeleccionado && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 1000, boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
          <button onClick={() => setPestanaActiva('mapa')} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", cursor: "pointer", color: pestanaActiva === 'mapa' ? "#ef4444" : "#94a3b8" }}>
            <span style={{ fontSize: "1.5rem" }}>🗺️</span><span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>Mapa</span>
          </button>
          <button onClick={() => setPestanaActiva('muro')} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", cursor: "pointer", color: pestanaActiva === 'muro' ? "#ef4444" : "#94a3b8" }}>
            <span style={{ fontSize: "1.5rem" }}>📰</span><span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>El Muro</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
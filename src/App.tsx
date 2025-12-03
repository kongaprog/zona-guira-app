import { useEffect, useState } from 'react';
import { fetchNegocios } from './services/googleSheetService';
import { Mapa } from './components/Mapa';
import { PerfilNegocio } from './components/PerfilNegocio';

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
}

function App() {
  const [todosLosNegocios, setTodosLosNegocios] = useState<Negocio[]>([]);
  const [negociosFiltrados, setNegociosFiltrados] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<Negocio | null>(null);
  
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  // 👇 Asegúrate de actualizar este link en el futuro con el formulario nacional
  const LINK_FORMULARIO = "https://forms.gle/tZaxyqDWtYFbfGUV6"; 

  useEffect(() => {
    fetchNegocios().then((data) => {
      const datosLimpios = data as unknown as Negocio[];
      setTodosLosNegocios(datosLimpios);
      setNegociosFiltrados(datosLimpios);
      setLoading(false);
    });
  }, []);

  const limpiarTexto = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    let resultado = todosLosNegocios;

    // FILTROS
    if (categoriaActiva !== "Todas") {
      const catFilter = (n: Negocio, regex: RegExp) => n.categoria.toLowerCase().match(regex);

      if (categoriaActiva === "Comida") {
        resultado = resultado.filter(n => catFilter(n, /gastronom|comida|cafe|pan|dulce|restaurante|pizza|hamburguesa/));
      } else if (categoriaActiva === "Tiendas") {
        resultado = resultado.filter(n => catFilter(n, /tienda|venta|ropa|celular|tecnologia|mercado|bodega|agro|vianda|belleza|salud|farmacia/));
      } else if (categoriaActiva === "Transporte") {
        resultado = resultado.filter(n => catFilter(n, /transporte|taxi|bici|carrera|moto|mudanza/));
      } else if (categoriaActiva === "Vivienda") {
        resultado = resultado.filter(n => catFilter(n, /vivienda|alquiler|casa|renta|permuta/));
      } else if (categoriaActiva === "Eventos") {
        resultado = resultado.filter(n => catFilter(n, /evento|fiesta|payaso|decoracion|cumpleaños/));
      } else if (categoriaActiva === "Servicios") {
        resultado = resultado.filter(n => catFilter(n, /taller|reparacion|peluqueria|barberia|unas|uñas|masaje|consultoria|diseño|foto|agencia|oficio/));
      }
    }

    // BUSCADOR
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
  }, [busqueda, categoriaActiva, todosLosNegocios]);

  const CATEGORIAS_BOTONES = ["Todas", "Comida", "Tiendas", "Transporte", "Vivienda", "Eventos", "Servicios"];

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {negocioSeleccionado ? (
        <PerfilNegocio 
          negocio={negocioSeleccionado} 
          alVolver={() => setNegocioSeleccionado(null)} 
        />
      ) : (
        <>
          {/* 👇 1. NAV ACTUALIZADO: PLAZA CUBA */}
          <nav style={{ backgroundColor: "#1e293b", padding: "15px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
            <div style={{ fontWeight: "900", fontSize: "1.3rem", letterSpacing: "-0.5px" }}>
              PLAZA <span style={{ color: "#ef4444" }}>CUBA</span>
            </div>
            <a href={LINK_FORMULARIO} target="_blank" style={{ backgroundColor: "#ef4444", color: "white", textDecoration: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", boxShadow: "0 2px 5px rgba(239, 68, 68, 0.4)" }}>
              + Unirme
            </a>
          </nav>

          <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "15px", width: "100%", boxSizing: "border-box" }}>
            
            {/* 👇 2. HERO ACTUALIZADO */}
            <div style={{ textAlign: "center", marginBottom: "20px", padding: "10px 0" }}>
              <h1 style={{ margin: "0 0 5px 0", color: "#0f172a", fontSize: "1.6rem" }}>El Centro Comercial Digital de Cuba</h1>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Encuentra negocios, servicios y productos en toda la isla.</p>
            </div>

            {/* BUSCADOR */}
            <div style={{ marginBottom: "15px" }}>
              <input 
                type="text" 
                placeholder="🔍 Buscar (Pizza, Taxi, Vedado, Celular...)" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: "100%", padding: "14px 15px", borderRadius: "12px", border: "1px solid #cbd5e1",
                  fontSize: "1rem", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", boxSizing: "border-box", outline: "none"
                }}
              />
            </div>

            {/* FILTROS */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "5px", scrollbarWidth: "none" }}>
              {CATEGORIAS_BOTONES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategoriaActiva(cat); setBusqueda(""); }} 
                  style={{
                    padding: "8px 16px", borderRadius: "20px", border: "none", whiteSpace: "nowrap", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem",
                    backgroundColor: categoriaActiva === cat ? "#0f172a" : "#e2e8f0",
                    color: categoriaActiva === cat ? "white" : "#475569",
                    transition: "all 0.2s"
                  }}
                >
                   {cat === "Todas" ? "🇨🇺 Todo" : 
                    cat === "Comida" ? "🍔 Comida" : 
                    cat === "Tiendas" ? "🛍️ Tiendas" : 
                    cat === "Transporte" ? "🚕 Taxis" : 
                    cat === "Vivienda" ? "🏠 Vivienda" : 
                    cat === "Eventos" ? "🎉 Eventos" : 
                    "🛠️ Servicios"}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "10px", fontSize: "0.85rem", color: "#64748b", fontWeight: "bold" }}>
              📍 {negociosFiltrados.length} resultados en el mapa
            </div>

            {/* MAPA */}
            <div style={{ position: "relative" }}>
              {/* @ts-ignore */}
              <Mapa negocios={negociosFiltrados} alSeleccionar={(n) => setNegocioSeleccionado(n)} />
              {loading && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", padding: "15px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", fontWeight: "bold", color: "#0f172a" }}>Cargando Plaza Cuba...</div>}
            </div>
            
            <div style={{ marginTop: "30px", textAlign: "center", padding: "30px 20px", backgroundColor: "#fff1f2", borderRadius: "16px" }}>
              <h3 style={{ color: "#991b1b", fontSize: "1.2rem", margin: "0 0 10px 0" }}>¿Tu negocio no está en Plaza Cuba?</h3>
              <p style={{ color: "#b91c1c", marginBottom: "15px", fontSize: "0.9rem" }}>Únete gratis hoy y aparece en el mapa nacional.</p>
              <a href={LINK_FORMULARIO} target="_blank" style={{ display: "inline-block", backgroundColor: "#ef4444", color: "white", padding: "12px 25px", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)" }}>🚀 Registrar mi Negocio</a>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
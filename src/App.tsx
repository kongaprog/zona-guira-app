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

  const LINK_FORMULARIO = "https://forms.gle/tZaxyqDWtYFbfGUV6"; 

  useEffect(() => {
    fetchNegocios().then((data) => {
      const datosLimpios = data as unknown as Negocio[];
      setTodosLosNegocios(datosLimpios);
      setNegociosFiltrados(datosLimpios);
      setLoading(false);
    });
  }, []);

  // Función de limpieza de texto (quita tildes y mayúsculas)
  const limpiarTexto = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    let resultado = todosLosNegocios;

    // 1. FILTRO POR BOTONES (Categorías)
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
        // Servicios es "todo lo demás" que no entró arriba (Talleres, oficios, etc.)
        resultado = resultado.filter(n => catFilter(n, /taller|reparacion|peluqueria|barberia|unas|uñas|masaje|consultoria|diseño|foto|agencia|oficio/));
      }
    }

    // 2. FILTRO POR BUSCADOR (Texto y Etiquetas)
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

  // Lista de Botones para mostrar en pantalla
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
          <nav style={{ backgroundColor: "#1e293b", padding: "15px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ fontWeight: "900", fontSize: "1.2rem" }}>ZONA <span style={{ color: "#38bdf8" }}>GÜIRA</span></div>
            <a href={LINK_FORMULARIO} target="_blank" style={{ backgroundColor: "#f97316", color: "white", textDecoration: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>+ Unirme</a>
          </nav>

          <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "15px", width: "100%", boxSizing: "border-box" }}>
            
            {/* BUSCADOR */}
            <div style={{ marginBottom: "15px" }}>
              <input 
                type="text" 
                placeholder="🔍 Buscar (Pizza, Taxi, Celular, Alquiler...)" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: "100%", padding: "12px 15px", borderRadius: "10px", border: "1px solid #cbd5e1",
                  fontSize: "1rem", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", boxSizing: "border-box", outline: "none"
                }}
              />
            </div>

            {/* BOTONES DE FILTRO (Scroll Horizontal) */}
            <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px", marginBottom: "5px", scrollbarWidth: "none" }}>
              {CATEGORIAS_BOTONES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategoriaActiva(cat); setBusqueda(""); }} 
                  style={{
                    padding: "8px 16px", borderRadius: "20px", border: "none", whiteSpace: "nowrap", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem",
                    backgroundColor: categoriaActiva === cat ? "#0f172a" : "#e2e8f0",
                    color: categoriaActiva === cat ? "white" : "#64748b",
                    transition: "all 0.2s"
                  }}
                >
                   {cat === "Todas" ? "🏠 Todo" : 
                    cat === "Comida" ? "🍔 Comida" : 
                    cat === "Tiendas" ? "🛍️ Tiendas" : 
                    cat === "Transporte" ? "🚕 Taxis" : 
                    cat === "Vivienda" ? "🏠 Vivienda" : 
                    cat === "Eventos" ? "🎉 Eventos" : 
                    "🛠️ Servicios"}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "10px", fontSize: "0.85rem", color: "#64748b" }}>
              Encontramos {negociosFiltrados.length} resultados
            </div>

            {/* MAPA */}
            <div style={{ position: "relative" }}>
              {/* @ts-ignore */}
              <Mapa negocios={negociosFiltrados} alSeleccionar={(n) => setNegocioSeleccionado(n)} />
              {loading && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>Cargando...</div>}
            </div>
            
            <div style={{ marginTop: "30px", textAlign: "center", padding: "20px", backgroundColor: "#eff6ff", borderRadius: "10px" }}>
              <h3 style={{ color: "#1e40af", fontSize: "1.1rem", margin: "0 0 10px 0" }}>¿Falta tu negocio?</h3>
              <a href={LINK_FORMULARIO} target="_blank" style={{ display: "inline-block", backgroundColor: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>Registrarme Gratis</a>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
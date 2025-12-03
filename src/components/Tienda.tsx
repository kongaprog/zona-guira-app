import { useState, useEffect } from 'react';
import { fetchProductos } from '../services/googleSheetService';

interface Producto {
  id: string;
  negocio: string;
  nombre: string;
  precio: number;
  foto: string;
  categoria: string;
}

interface Props {
  nombreNegocio: string;
  numeroWhatsApp: string;
  categoria: string; // 👇 NUEVO: Necesitamos saber la categoría aquí
  alCerrar: () => void;
}

export const Tienda = ({ nombreNegocio, numeroWhatsApp, categoria, alCerrar }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Detectamos si es un servicio (Taller, Peluquería, etc.)
  const esServicio = categoria.toLowerCase().match(/taller|reparacion|peluqueria|barberia|unas|uñas|masaje|consultoria|diseño|foto|agencia|tecnico/);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await fetchProductos(nombreNegocio);
        setProductos(data as unknown as Producto[]);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [nombreNegocio]);

  const agregar = (producto: Producto) => {
    setCarrito([...carrito, producto]);
  };

  const total = carrito.reduce((suma, item) => suma + item.precio, 0);

  const generarPedido = () => {
    if (carrito.length === 0) return;
    
    const resumen = carrito.reduce((acc, item) => {
      acc[item.nombre] = (acc[item.nombre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mensaje diferente si es servicio o producto
    let mensaje = `Hola *${nombreNegocio}*, ${esServicio ? 'me interesan estos servicios' : 'quisiera hacer un pedido'}: \n\n`;
    
    Object.entries(resumen).forEach(([nombre, cantidad]) => {
      mensaje += `▪️ ${cantidad}x ${nombre}\n`;
    });
    mensaje += `\n💰 *Total Estimado: $${total} CUP*`;
    
    const link = `https://wa.me/53${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, '_blank');
  };

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      
      {/* Encabezado */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
        <button onClick={alCerrar} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", marginRight: "15px", color: "#64748b" }}>←</button>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#1e293b" }}>{nombreNegocio}</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", fontWeight: "bold" }}>
            {esServicio ? '📋 Lista de Precios y Servicios' : '🛍️ Catálogo de Productos'}
          </p>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Cargando...</div>
      ) : productos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f1f5f9", borderRadius: "10px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📭</div>
          <p>{esServicio ? 'No hay servicios publicados.' : 'Catálogo vacío.'}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {productos.map((prod) => (
            <div key={prod.id} style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              backgroundColor: "white", padding: "12px 15px", borderRadius: "10px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9"
            }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1 }}>
                {/* LÓGICA VISUAL: Si es servicio, NO mostramos icono grande a menos que tenga foto explícita */}
                {!esServicio && (
                  prod.foto ? (
                    <img src={prod.foto} alt={prod.nombre} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} onError={(e) => {e.currentTarget.style.display='none'}} />
                  ) : (
                    <span style={{ fontSize: "1.8rem" }}>📦</span>
                  )
                )}
                
                {/* Si es servicio, usamos un icono pequeño genérico si no hay foto */}
                {esServicio && prod.foto && (
                   <img src={prod.foto} alt={prod.nombre} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }} />
                )}

                <div>
                  <h4 style={{ margin: "0 0 2px 0", color: "#334155", fontSize: "0.95rem" }}>{prod.nombre}</h4>
                  <span style={{ color: "#16a34a", fontWeight: "bold", fontSize: "0.9rem" }}>${prod.precio}</span>
                </div>
              </div>

              <button 
                onClick={() => agregar(prod)}
                style={{ 
                  backgroundColor: esServicio ? "#f3e8ff" : "#eff6ff", 
                  color: esServicio ? "#7e22ce" : "#2563eb", 
                  border: "none", padding: "8px 12px", borderRadius: "8px", 
                  fontSize: "0.8rem", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" 
                }}
              >
                {esServicio ? 'Agendar +' : 'Agregar +'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Carrito Flotante */}
      {carrito.length > 0 && (
        <div style={{ position: "fixed", bottom: "20px", left: "20px", right: "20px", backgroundColor: "#1e293b", color: "white", padding: "15px 20px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 3000 }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{carrito.length} {esServicio ? 'servicios' : 'ítems'}</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>${total} CUP</div>
          </div>
          <button onClick={generarPedido} style={{ backgroundColor: "#22c55e", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
            {esServicio ? 'Solicitar Cita →' : 'Hacer Pedido →'}
          </button>
        </div>
      )}
    </div>
  );
};
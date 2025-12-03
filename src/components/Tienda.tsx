import { useState, useEffect } from 'react';
// 👇 CAMBIO CLAVE: Quitamos 'Producto' de la importación. Solo traemos la función.
import { fetchProductos } from '../services/googleSheetService';

// 👇 Definimos "Producto" aquí mismo para que no dependa de nadie
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
  alCerrar: () => void;
}

export const Tienda = ({ nombreNegocio, numeroWhatsApp, alCerrar }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos REALES al abrir
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await fetchProductos(nombreNegocio);
        // Truco de magia para que TypeScript no se queje de los tipos
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
    
    // Resumen del pedido
    const resumen = carrito.reduce((acc, item) => {
      acc[item.nombre] = (acc[item.nombre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let mensaje = `Hola *${nombreNegocio}*, pedido desde Zona Güira: \n\n`;
    Object.entries(resumen).forEach(([nombre, cantidad]) => {
      mensaje += `▪️ ${cantidad}x ${nombre}\n`;
    });
    mensaje += `\n💰 *Total: $${total} CUP*`;
    
    // Abrir WhatsApp
    const link = `https://wa.me/53${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, '_blank');
  };

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      
      {/* Encabezado */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <button onClick={alCerrar} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", marginRight: "10px" }}>←</button>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#1e293b" }}>{nombreNegocio}</h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Catálogo Oficial</p>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Cargando productos...</div>
      ) : productos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f1f5f9", borderRadius: "10px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📭</div>
          <p>Este negocio aún no ha subido productos.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {productos.map((prod) => (
            <div key={prod.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "15px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {/* FOTO: Si tiene link la muestra, si no pone un emoji */}
                {prod.foto ? (
                   <img src={prod.foto} alt={prod.nombre} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} onError={(e) => {e.currentTarget.style.display='none'}} />
                ) : (
                   <span style={{ fontSize: "2rem" }}>📦</span>
                )}
                
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#334155" }}>{prod.nombre}</h4>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>${prod.precio}</span>
                </div>
              </div>
              <button 
                onClick={() => agregar(prod)}
                style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "none", width: "35px", height: "35px", borderRadius: "50%", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Carrito Flotante */}
      {carrito.length > 0 && (
        <div style={{ position: "fixed", bottom: "20px", left: "20px", right: "20px", backgroundColor: "#1e293b", color: "white", padding: "15px 20px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 3000 }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{carrito.length} ítems</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>${total} CUP</div>
          </div>
          <button onClick={generarPedido} style={{ backgroundColor: "#22c55e", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>Hacer Pedido →</button>
        </div>
      )}
    </div>
  );
};
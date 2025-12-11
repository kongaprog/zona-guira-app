import { useState, useEffect } from 'react';
import { fetchProductos } from '../services/googleSheetService';

interface Producto {
  id: string;
  negocio: string;
  nombre: string;
  precio: number;
  foto: string;
  categoria: string;
  descripcion: string;
}

interface Props {
  nombreNegocio: string;
  numeroWhatsApp: string;
  esModoServicio: boolean; 
  alCerrar: () => void;
}

export const Tienda = ({ nombreNegocio, numeroWhatsApp, esModoServicio, alCerrar }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

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

  const limpiarCarrito = () => {
    if (window.confirm("¿Vaciar el carrito?")) {
      setCarrito([]);
    }
  };

  const total = carrito.reduce((suma, item) => suma + item.precio, 0);

  const generarPedido = () => {
    if (carrito.length === 0) return;
    const resumen = carrito.reduce((acc, item) => {
      acc[item.nombre] = (acc[item.nombre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let mensaje = `Hola *${nombreNegocio}*, ${esModoServicio ? 'me interesa agendar:' : 'quisiera pedir:'}: \n\n`;
    Object.entries(resumen).forEach(([nombre, cantidad]) => {
      mensaje += `▪️ ${cantidad}x ${nombre}\n`;
    });
    mensaje += `\n💰 *Total: $${total} CUP*`;
    const link = `https://wa.me/53${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, '_blank');
  };

  return (
    <div className="p-5 pb-28 font-sans">
      
      {/* Encabezado */}
      <div className="flex items-center mb-6 border-b border-slate-200 pb-4 sticky top-0 bg-[#f8fafc] z-10">
        <button onClick={alCerrar} className="text-2xl text-slate-500 mr-4 active:scale-90 transition-transform">←</button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-none">{nombreNegocio}</h2>
          <p className={`text-xs font-bold mt-1 uppercase tracking-wide ${esModoServicio ? "text-purple-600" : "text-blue-600"}`}>
            {esModoServicio ? '📋 Servicios' : '🛍️ Catálogo'}
          </p>
        </div>
      </div>

      {/* Lista Productos */}
      {loading ? (
        <div className="text-center py-10 text-slate-400">Cargando...</div>
      ) : productos.length === 0 ? (
        <div className="text-center py-10 bg-slate-100 rounded-xl">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-slate-500 text-sm">No hay elementos disponibles.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {productos.map((prod) => (
            <div key={prod.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                
                {/* FOTO - OPTIMIZADA PARA MÓVIL */}
                {/* shrink-0 evita que se aplaste. w-16 h-16 le da buen tamaño */}
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                   {prod.foto ? (
                     <img 
                        src={prod.foto} 
                        alt={prod.nombre} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {e.currentTarget.style.display='none'}} 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                   )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{prod.nombre}</h4>
                  {prod.descripcion && <p className="text-xs text-slate-500 truncate">{prod.descripcion}</p>}
                  <span className="text-emerald-600 font-bold text-sm mt-1 block">${prod.precio}</span>
                </div>
              </div>

              <button 
                onClick={() => agregar(prod)} 
                className={`ml-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  esModoServicio ? "bg-purple-50 text-purple-700 hover:bg-purple-100" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {esModoServicio ? 'Agendar +' : 'Agregar +'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CARRITO FLOTANTE */}
      {carrito.length > 0 && (
        <div className="fixed bottom-5 left-5 right-5 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center z-50">
          
          <div>
            <div className="text-xs text-slate-400 font-medium">{carrito.length} {esModoServicio ? 'servicios' : 'ítems'}</div>
            <div className="text-lg font-bold">${total} CUP</div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={limpiarCarrito}
              className="bg-red-500/20 text-red-400 p-3 rounded-xl hover:bg-red-500/30 transition-colors"
            >
              🗑️
            </button>

            <button 
              onClick={generarPedido} 
              className="bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
            >
              {esModoServicio ? 'Pedir Cita' : 'Pedir'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
import { useState, useEffect } from 'react';
import { fetchAnuncios } from '../services/googleSheetService';
import type { Anuncio } from '../types';
import { MessageCircle, Clock, Megaphone, CheckCircle2 } from 'lucide-react';

export const Muro = () => {
  const [todosLosAnuncios, setTodosLosAnuncios] = useState<Anuncio[]>([]);
  const [anunciosFiltrados, setAnunciosFiltrados] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState("Todos");

  const LINK_PUBLICAR = "https://docs.google.com/forms/d/e/1FAIpQLSfHqC6Cbq4mTLGt0CyO_qgEHQUf1HeBDIbw9sgcvbJNzWqgtA/viewform?usp=header"; 

  useEffect(() => {
    fetchAnuncios().then((data) => {
      setTodosLosAnuncios(data);
      setAnunciosFiltrados(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (filtroActivo === "Todos") {
      setAnunciosFiltrados(todosLosAnuncios);
    } else {
      setAnunciosFiltrados(todosLosAnuncios.filter(a => 
        a.tipo.toLowerCase().includes(filtroActivo.toLowerCase())
      ));
    }
  }, [filtroActivo, todosLosAnuncios]);

  // Estilos de Etiquetas
  const getEstiloTipo = (tipo: string) => {
    const t = (tipo || "").toLowerCase();
    if (t.includes('venta')) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'VENTA' }; 
    if (t.includes('compra')) return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'COMPRA' }; 
    if (t.includes('cambio')) return { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'CAMBIO' }; 
    if (t.includes('divisa')) return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'DIVISAS' }; 
    return { bg: 'bg-slate-50 text-slate-700 border-slate-200', label: 'VARIOS' }; 
  };

  const BOTONES_MURO = ["Todos", "Venta", "Compra", "Cambio", "Divisas", "Otro"];

  return (
    <div className="pb-24 min-h-screen bg-slate-50 font-sans">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                EL MURO <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">En Vivo</span>
              </h2>
            </div>
            <a href={LINK_PUBLICAR} target="_blank" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs shadow hover:bg-black transition-colors flex items-center gap-2">
              <Megaphone size={14} /> Publicar
            </a>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {BOTONES_MURO.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroActivo(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  filtroActivo === cat 
                    ? "bg-slate-800 text-white border-slate-800" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEED */}
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Cargando anuncios...</div>
        ) : anunciosFiltrados.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p>No hay anuncios de "{filtroActivo}"</p>
          </div>
        ) : (
          anunciosFiltrados.map((anuncio) => {
            const estilo = getEstiloTipo(anuncio.tipo);
            const inicial = anuncio.nombre ? anuncio.nombre.charAt(0).toUpperCase() : "U";
            
            return (
              <div key={anuncio.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Header Tarjeta */}
                <div className="p-4 pb-2 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-200">
                      {inicial}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-none">{anuncio.nombre}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <Clock size={10} /> {anuncio.fecha}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${estilo.bg}`}>
                    {estilo.label}
                  </span>
                </div>

                {/* Texto */}
                <div className="px-4 py-2">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {anuncio.texto}
                  </p>
                </div>

                {/* Foto (Si hay) */}
                {anuncio.foto && (
                  <div className="px-4 pb-2">
                    <img 
                      src={anuncio.foto} 
                      className="w-full h-auto max-h-80 object-cover rounded-lg border border-slate-100"
                      loading="lazy" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {e.currentTarget.style.display = 'none'}}
                    />
                  </div>
                )}

                {/* Footer Botón */}
                <div className="px-4 pb-4 pt-2">
                  <a 
                    href={`https://wa.me/53${anuncio.contacto}?text=Hola, vi tu anuncio en el Muro: ${anuncio.texto.substring(0, 15)}...`} 
                    target="_blank"
                    className="w-full bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-700 border border-slate-200 hover:border-green-200 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle size={16} className="text-green-600" />
                    Contactar por WhatsApp
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
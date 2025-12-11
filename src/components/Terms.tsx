import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { BUSINESS_NAME } from '../constants';

interface TermsProps {
  onBack: () => void;
}

const Terms: React.FC<TermsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-white p-6 pt-24">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-gold hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <div className="bg-brand-light p-8 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
              <FileText size={32} />
            </div>
            <h1 className="text-3xl font-bold font-heading">Términos y Condiciones</h1>
          </div>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              Bienvenido a <strong>{BUSINESS_NAME}</strong>. Al usar nuestro servicio, aceptas los siguientes términos:
            </p>
            
            <h3 className="text-xl font-bold text-white mt-6">1. Pedidos</h3>
            <p>Los pedidos realizados a través de esta web no constituyen una compra final hasta que sean confirmados por nuestro equipo vía WhatsApp.</p>

            <h3 className="text-xl font-bold text-white mt-6">2. Precios</h3>
            <p>Los precios mostrados están sujetos a cambios y disponibilidad del inventario físico en el momento de la confirmación.</p>

            <h3 className="text-xl font-bold text-white mt-6">3. Garantía</h3>
            <p>Las garantías de los productos físicos (celulares, piezas) se rigen por la política entregada en el comprobante físico al momento de la compra/reparación.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
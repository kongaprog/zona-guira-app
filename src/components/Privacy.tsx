import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { BUSINESS_NAME } from '../constants';

interface PrivacyProps {
  onBack: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
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
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-bold font-heading">Política de Privacidad</h1>
          </div>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              En <strong>{BUSINESS_NAME}</strong>, valoramos tu privacidad. Esta política explica cómo manejamos tu información.
            </p>
            
            <h3 className="text-xl font-bold text-white mt-6">1. Uso de Datos</h3>
            <p>No almacenamos datos personales en servidores propios. La información de tus pedidos se utiliza únicamente para generar el mensaje de WhatsApp que tú mismo envías.</p>

            <h3 className="text-xl font-bold text-white mt-6">2. Cookies</h3>
            <p>Utilizamos almacenamiento local solo para recordar tus preferencias de visualización (como el carrito de compras) mientras navegas.</p>

            <h3 className="text-xl font-bold text-white mt-6">3. Contacto</h3>
            <p>Cualquier comunicación se realiza directamente a través de WhatsApp, asegurando el cifrado de extremo a extremo propio de esa plataforma.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
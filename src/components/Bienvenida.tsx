import { useState } from 'react';

const PROVINCIAS = [
  "La Habana", "Artemisa", "Pinar del Río", "Mayabeque", "Matanzas", 
  "Cienfuegos", "Villa Clara", "Sancti Spíritus", "Ciego de Ávila", 
  "Camagüey", "Las Tunas", "Holguín", "Granma", "Santiago de Cuba", "Guantánamo", "Isla de la Juventud"
];

interface Props {
  alComenzar: (provincia: string) => void;
}

export const Bienvenida = ({ alComenzar }: Props) => {
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  return (
    <div style={{ 
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      // Fondo oscuro elegante con imagen de fondo
      backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1500759285222-a95626b934cb?q=80&w=1000&auto=format&fit=crop')",
      backgroundSize: "cover", backgroundPosition: "center",
      color: "white", padding: "20px"
    }}>
      
      {/* CONTENEDOR CENTRAL (Efecto Cristal) */}
      <div style={{ 
        width: "100%", maxWidth: "400px", 
        backgroundColor: "rgba(255, 255, 255, 0.1)", 
        backdropFilter: "blur(12px)", 
        padding: "40px 30px", 
        borderRadius: "24px", 
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        textAlign: "center"
      }}>
        
        {/* LOGO */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.8rem", margin: 0, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>
            PLAZA <br/><span style={{ color: "#ef4444" }}>CUBA</span>
          </h1>
          <div style={{ height: "4px", width: "60px", backgroundColor: "#ef4444", margin: "15px auto", borderRadius: "2px" }}></div>
          <p style={{ color: "#cbd5e1", fontSize: "1.1rem" }}>Conectando la isla 🇨🇺</p>
        </div>

        {/* SELECTOR */}
        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#94a3b8", fontWeight: "bold" }}>
            SELECCIONA TU PROVINCIA
          </label>
          
          <select 
            value={provinciaSeleccionada}
            onChange={(e) => setProvinciaSeleccionada(e.target.value)}
            style={{ 
              width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", 
              fontSize: "1rem", backgroundColor: "#1e293b", color: "white", marginBottom: "20px", 
              cursor: "pointer", appearance: "none", outline: "none"
            }}
          >
            <option value="" disabled>Tocá aquí para elegir...</option>
            {PROVINCIAS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <button 
            onClick={() => {
              if (provinciaSeleccionada) alComenzar(provinciaSeleccionada);
            }}
            disabled={!provinciaSeleccionada}
            style={{ 
              width: "100%", padding: "16px", borderRadius: "12px", border: "none", 
              backgroundColor: provinciaSeleccionada ? "#ef4444" : "#475569", 
              color: "white", fontSize: "1.1rem", fontWeight: "bold", 
              cursor: provinciaSeleccionada ? "pointer" : "not-allowed", 
              transition: "all 0.3s",
              boxShadow: provinciaSeleccionada ? "0 4px 15px rgba(239, 68, 68, 0.4)" : "none"
            }}
          >
            {provinciaSeleccionada ? "ENTRAR AHORA 🚀" : "Elige una provincia"}
          </button>
        </div>

        <button 
          onClick={() => alComenzar("Todas")}
          style={{ marginTop: "20px", background: "none", border: "none", color: "#94a3b8", textDecoration: "underline", cursor: "pointer", fontSize: "0.9rem" }}
        >
          O ver el mapa completo de Cuba
        </button>

      </div>
      
      <p style={{ position: "absolute", bottom: "20px", fontSize: "0.8rem", color: "#64748b" }}>
        © 2024 Plaza Cuba - Beta
      </p>

    </div>
  );
};
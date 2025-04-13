import React, { useEffect, useState } from "react";
import "./Estrategias.css"; // Aquí pondremos el estilo del mapa

const Estrategias = () => {
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [showPopup, setShowPopup] = useState(false);
  const [pregunta, setPregunta] = useState(null);

  // Preguntas en distintas áreas
  const desafios = {
    "50-50": { pregunta: "¿Qué es TCP/IP?", opciones: ["Un protocolo", "Un virus"], correcta: "Un protocolo" },
    "200-100": { pregunta: "¿Cuál es el puerto de HTTP?", opciones: ["443", "80"], correcta: "80" },
    "300-300": { pregunta: "¿Qué significa DNS?", opciones: ["Dynamic Name Service", "Domain Name System"], correcta: "Domain Name System" },
  };

  // Movimiento del jugador con flechas
  useEffect(() => {
    const handleKeyPress = (e) => {
      let newX = posX;
      let newY = posY;

      if (e.key === "ArrowUp") newY -= 50;
      if (e.key === "ArrowDown") newY += 50;
      if (e.key === "ArrowLeft") newX -= 50;
      if (e.key === "ArrowRight") newX += 50;

      const posKey = `${newX}-${newY}`;
      if (desafios[posKey]) {
        setShowPopup(true);
        setPregunta(desafios[posKey]);
      } else {
        setPosX(newX);
        setPosY(newY);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [posX, posY]);

  return (
    <div className="game-container">
      <h1>🏫 Explora la Escuela y Aprende</h1>
      <div className="map">
        <div className="player" style={{ left: `${posX}px`, top: `${posY}px` }}></div>
      </div>

      {showPopup && (
        <div className="popup">
          <h2>❓ {pregunta.pregunta}</h2>
          {pregunta.opciones.map((op, index) => (
            <button key={index} onClick={() => {
              if (op === pregunta.correcta) {
                alert("✅ Correcto! Sigue avanzando.");
                setShowPopup(false);
              } else {
                alert("❌ Incorrecto! Intenta otra vez.");
              }
            }}>
              {op}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Estrategias;

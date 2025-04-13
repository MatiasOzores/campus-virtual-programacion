import { useEffect, useRef } from 'react';

const MatrixEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ajustar el tamaño del canvas al contenedor
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configuración del efecto
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    // Caracteres que se mostrarán
    const chars = '01';
    const charArray = chars.split('');

    // Función de dibujo
    const draw = () => {
      // Fondo semi-transparente para crear efecto de rastro
      ctx.fillStyle = 'rgba(26, 26, 46, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Color de los caracteres
      ctx.fillStyle = 'rgba(0, 180, 216, 0.4)';
      ctx.font = `${fontSize}px monospace`;

      // Dibujar los caracteres
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reiniciar la gota cuando llega al fondo
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i] += 1.2;
      }
    };

    // Iniciar la animación
    const interval = setInterval(draw, 25);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: 0.5
      }}
    />
  );
};

export default MatrixEffect; 
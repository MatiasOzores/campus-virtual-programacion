import React, { useState, useContext, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaSearchPlus, FaSearchMinus, FaHandPaper, FaInfoCircle } from 'react-icons/fa';
import './Roadmap.css';

const Roadmap = () => {
  const { isAuthenticated } = useAuth();
  const { darkMode } = useContext(ThemeContext);
  const [cards, setCards] = useState([
    {
      id: 1,
      title: 'Introducción a la Programación',
      description: 'Variables, constantes, tipos de datos, operadores, estructuras de control, funciones, etc.',
      position: { x: 100, y: 100 },
      tip: 'Durante las primeras clases Jasinski va querer ver el nivel con el que viene el curso y va de alguna forma buscar crear una BASE para el curso para arrancar con lo jodido. Es importante tener en claro los conceptos básicos.'
    },
    {
      id: 2,
      title: 'Tipos de datos: De referencia y primitivos',
      description: 'Tener en claro que son y cuales son las diferencias entre ellos.',
      position: { x: 500, y: 100 }
    },


    {
      id: 5,
      title: 'Buffer del scanner',
      description: 'Saber limpiarlo, porque hay que limpiarlo, saber cuando hay que limpiarlo.',
      position: { x: 500, y: 300 }
    },
    {
      id: 6,
      title: 'Convenciones de escritura de codigo',
      description: 'Saber cuando usar camelCase, UpperCamelCase en JAVA. Utilizar "final" para constantes y respetar sus convenciones. Crear variables con nombres que sean representativos de lo que almacenan.',
      position: { x: 900, y: 300 }
    },

  ]);
  const [connections, setConnections] = useState([
    { id: 1, sourceId: 1, targetId: 2 },
    { id: 2, sourceId: 2, targetId: 3 },
    { id: 3, sourceId: 3, targetId: 4 },
    { id: 4, sourceId: 1, targetId: 5 },
    { id: 5, sourceId: 5, targetId: 6 },
    { id: 6, sourceId: 6, targetId: 7 }
  ]);
  const [boardTransform, setBoardTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showTips, setShowTips] = useState(true);
  const roadmapRef = useRef(null);
  const canvasRef = useRef(null);

  // Inicializar el canvas
  useEffect(() => {
    if (canvasRef.current && roadmapRef.current) {
      const canvas = canvasRef.current;
      canvas.width = roadmapRef.current.offsetWidth;
      canvas.height = roadmapRef.current.offsetHeight;
      drawConnections();
    }
  }, []);

  // Dibujar las líneas de conexión
  const drawConnections = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    connections.forEach(connection => {
      const sourceCard = cards.find(card => card.id === connection.sourceId);
      const targetCard = cards.find(card => card.id === connection.targetId);
      
      if (sourceCard && targetCard) {
        // Calcular puntos de inicio y fin
        const sourceX = sourceCard.position.x + 150; // Centro de la tarjeta
        const sourceY = sourceCard.position.y + 50;  // Centro de la tarjeta
        const targetX = targetCard.position.x;
        const targetY = targetCard.position.y + 50;  // Centro de la tarjeta
        
        // Aplicar transformación del tablero
        const transformedSourceX = sourceX * boardTransform.scale + boardTransform.x;
        const transformedSourceY = sourceY * boardTransform.scale + boardTransform.y;
        const transformedTargetX = targetX * boardTransform.scale + boardTransform.x;
        const transformedTargetY = targetY * boardTransform.scale + boardTransform.y;
        
        // Determinar si las tarjetas están alineadas horizontalmente o verticalmente
        const isHorizontal = Math.abs(transformedSourceY - transformedTargetY) < 30;
        const isVertical = Math.abs(transformedSourceX - transformedTargetX) < 30;
        
        // Dibujar línea recta si las tarjetas están alineadas
        if (isHorizontal || isVertical) {
          ctx.beginPath();
          ctx.moveTo(transformedSourceX, transformedSourceY);
          ctx.lineTo(transformedTargetX, transformedTargetY);
          ctx.strokeStyle = darkMode ? '#666' : '#999';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Dibujar flecha
          const angle = Math.atan2(
            transformedTargetY - transformedSourceY,
            transformedTargetX - transformedSourceX
          );
          
          const arrowLength = 15;
          const arrowWidth = 8;
          
          ctx.beginPath();
          ctx.moveTo(transformedTargetX, transformedTargetY);
          ctx.lineTo(
            transformedTargetX - arrowLength * Math.cos(angle - Math.PI / 6),
            transformedTargetY - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            transformedTargetX - arrowLength * Math.cos(angle + Math.PI / 6),
            transformedTargetY - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = darkMode ? '#666' : '#999';
          ctx.fill();
        } else {
          // Calcular la distancia entre las tarjetas
          const distance = Math.sqrt(
            Math.pow(transformedTargetX - transformedSourceX, 2) + 
            Math.pow(transformedTargetY - transformedSourceY, 2)
          );
          
          // Ajustar la curvatura según la distancia
          const curvature = Math.min(0.3, Math.max(0.05, 50 / distance));
          
          // Calcular puntos de control para la curva
          const midX = (transformedSourceX + transformedTargetX) / 2;
          const midY = (transformedSourceY + transformedTargetY) / 2;
          
          // Calcular el vector perpendicular para la curvatura
          const dx = transformedTargetX - transformedSourceX;
          const dy = transformedTargetY - transformedSourceY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const perpX = -dy / length;
          const perpY = dx / length;
          
          // Ajustar la curvatura según la dirección
          const controlPoint1X = midX + perpX * distance * curvature;
          const controlPoint1Y = midY + perpY * distance * curvature;
          const controlPoint2X = midX + perpX * distance * curvature;
          const controlPoint2Y = midY + perpY * distance * curvature;
          
          // Dibujar línea curva
          ctx.beginPath();
          ctx.moveTo(transformedSourceX, transformedSourceY);
          ctx.bezierCurveTo(
            controlPoint1X, controlPoint1Y,
            controlPoint2X, controlPoint2Y,
            transformedTargetX, transformedTargetY
          );
          
          // Estilo de la línea
          ctx.strokeStyle = darkMode ? '#666' : '#999';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Dibujar flecha
          const angle = Math.atan2(
            transformedTargetY - controlPoint2Y,
            transformedTargetX - controlPoint2X
          );
          
          const arrowLength = 15;
          const arrowWidth = 8;
          
          ctx.beginPath();
          ctx.moveTo(transformedTargetX, transformedTargetY);
          ctx.lineTo(
            transformedTargetX - arrowLength * Math.cos(angle - Math.PI / 6),
            transformedTargetY - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            transformedTargetX - arrowLength * Math.cos(angle + Math.PI / 6),
            transformedTargetY - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = darkMode ? '#666' : '#999';
          ctx.fill();
        }
      }
    });
  };

  // Actualizar el canvas cuando cambie el zoom o la posición
  useEffect(() => {
    drawConnections();
  }, [boardTransform, cards, connections, darkMode]);

  // Actualizar el canvas cuando se redimensione la ventana
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && roadmapRef.current) {
        canvasRef.current.width = roadmapRef.current.offsetWidth;
        canvasRef.current.height = roadmapRef.current.offsetHeight;
        drawConnections();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funciones para mover el tablero
  const handleBoardMouseDown = (e) => {
    // Solo permitir arrastrar si el clic no es en una tarjeta
    if (e.target.closest('.roadmap-card')) {
      return;
    }
    
    setIsDraggingBoard(true);
    setDragStart({
      x: e.clientX - boardTransform.x,
      y: e.clientY - boardTransform.y
    });
  };

  const handleBoardMouseMove = (e) => {
    if (isDraggingBoard) {
      // Usar requestAnimationFrame para un movimiento más fluido
      requestAnimationFrame(() => {
        setBoardTransform({
          ...boardTransform,
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      });
    }
  };

  const handleBoardMouseUp = () => {
    setIsDraggingBoard(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    
    // Siempre hacer zoom con la rueda del ratón
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, boardTransform.scale * delta));
    
    // Calcular el punto de zoom (centrado en el cursor)
    const rect = roadmapRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Ajustar la posición para mantener el punto bajo el cursor
    const newX = mouseX - (mouseX - boardTransform.x) * (newScale / boardTransform.scale);
    const newY = mouseY - (mouseY - boardTransform.y) * (newScale / boardTransform.scale);
    
    setBoardTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  };

  const handleZoomIn = () => {
    setBoardTransform({
      ...boardTransform,
      scale: Math.min(3, boardTransform.scale * 1.2)
    });
  };

  const handleZoomOut = () => {
    setBoardTransform({
      ...boardTransform,
      scale: Math.max(0.1, boardTransform.scale * 0.8)
    });
  };

  const handleResetView = () => {
    setBoardTransform({ x: 0, y: 0, scale: 1 });
  };

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  if (!isAuthenticated) {
    return (
      <div className="no-auth-message">
        <h2>Inicia sesión para ver el Roadmap</h2>
        <p>Necesitas estar autenticado para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className={`roadmap-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="roadmap-header">
        <h1>Roadmap de Contenidos</h1>
        <p>Esta es una de las formas en la que se puede graficar la materia Programación Sobre Redes de Pablo Jasinski</p>
      </div>

      <div className="board-controls">
        <button 
          className="board-control-button"
          onClick={handleZoomIn}
          title="Acercar"
        >
          <FaSearchPlus />
        </button>
        <button 
          className="board-control-button"
          onClick={handleZoomOut}
          title="Alejar"
        >
          <FaSearchMinus />
        </button>
        <button 
          className="board-control-button"
          onClick={handleResetView}
          title="Restablecer vista"
        >
          <FaHandPaper />
        </button>
        <button 
          className={`board-control-button ${showTips ? 'active' : ''}`}
          onClick={toggleTips}
          title={showTips ? "Ocultar consejos" : "Mostrar consejos"}
        >
          <FaInfoCircle />
        </button>
      </div>

      <div 
        className="roadmap-content"
        ref={roadmapRef}
        onMouseDown={handleBoardMouseDown}
        onMouseMove={handleBoardMouseMove}
        onMouseUp={handleBoardMouseUp}
        onMouseLeave={handleBoardMouseUp}
        onWheel={handleWheel}
      >
        <canvas 
          ref={canvasRef} 
          className="connections-canvas"
        />
        
        <div 
          className="board-container"
          style={{
            transform: `translate(${boardTransform.x}px, ${boardTransform.y}px) scale(${boardTransform.scale})`,
            transformOrigin: '0 0'
          }}
        >
          {cards.map(card => (
            <div
              key={card.id}
              data-card-id={card.id}
              className="roadmap-card"
              style={{
                left: `${card.position.x}px`,
                top: `${card.position.y}px`
              }}
            >
              <div className="card-header">
                <h3>{card.title}</h3>
              </div>
              <p>{card.description}</p>
              {showTips && card.tip && (
                <div className="card-tip">
                  <span className="tip-icon">💡</span>
                  <p>{card.tip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap; 
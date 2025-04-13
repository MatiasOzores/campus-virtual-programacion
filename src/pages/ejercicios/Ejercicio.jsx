import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getEjercicioById } from '../../data/ejercicios';
import { EjerciciosContext } from '../../context/EjerciciosContext';
import './Ejercicio.css';

const Ejercicio = () => {
  const { unidadId, ejercicioId } = useParams();
  const [ejercicio, setEjercicio] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('java');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [versionSeleccionada, setVersionSeleccionada] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isEjercicioCompletado, toggleCompletado } = useContext(EjerciciosContext);

  const localStorageKey = `ejercicio-${unidadId}-${ejercicioId}`;

  useEffect(() => {
    // Cargar el ejercicio
    try {
      const ejercicioData = getEjercicioById(parseInt(ejercicioId));
      if (!ejercicioData) {
        setError('Ejercicio no encontrado');
      } else {
        setEjercicio(ejercicioData);
      }
    } catch (err) {
      console.error('Error al cargar el ejercicio:', err);
      setError('Error al cargar el ejercicio');
    } finally {
      setLoading(false);
    }

    // Cargar historial de versiones desde localStorage
    const historialGuardado = localStorage.getItem(`${localStorageKey}-historial`);
    if (historialGuardado) {
      setHistorial(JSON.parse(historialGuardado));
    }

    // Cargar estado guardado
    const savedContent = localStorage.getItem(`${localStorageKey}-content`);
    const savedName = localStorage.getItem(`${localStorageKey}-name`);
    
    if (savedContent) setFileContent(savedContent);
    if (savedName) setFileName(savedName);

    // Verificar que el archivo guardado sea .java
    if (savedName && !savedName.endsWith('.java')) {
      setFileName('');
      setFileContent('');
      localStorage.removeItem(`${localStorageKey}-content`);
      localStorage.removeItem(`${localStorageKey}-name`);
    }
  }, [unidadId, ejercicioId, localStorageKey]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar que sea un archivo .java
      if (!file.name.endsWith('.java')) {
        alert('Por favor, sube solo archivos .java');
        event.target.value = ''; // Limpiar el input
        return;
      }

      setFileName(file.name);
      setLanguage('java');

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
        localStorage.setItem(`${localStorageKey}-content`, content);
        localStorage.setItem(`${localStorageKey}-name`, file.name);
        
        // Agregar al historial de versiones
        agregarVersion(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  const agregarVersion = (contenido, nombreArchivo) => {
    const nuevaVersion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      contenido,
      nombreArchivo
    };
    
    const nuevoHistorial = [nuevaVersion, ...historial];
    setHistorial(nuevoHistorial);
    localStorage.setItem(`${localStorageKey}-historial`, JSON.stringify(nuevoHistorial));
  };

  const handleDownload = () => {
    if (!fileContent) return;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'solucion.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCompletionToggle = () => {
    toggleCompletado(unidadId, parseInt(ejercicioId));
  };

  const handleVersionSelect = (version) => {
    setVersionSeleccionada(version);
    setFileContent(version.contenido);
    setFileName(version.nombreArchivo);
    setShowHistorial(false);
  };

  const formatFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="ejercicio-container">
        <div className="ejercicio-loading">
          <div className="loading-spinner"></div>
          <p>Cargando ejercicio...</p>
        </div>
      </div>
    );
  }

  if (error || !ejercicio) {
    return (
      <div className="ejercicio-container">
        <div className="error-message">
          <h2>Ejercicio no encontrado</h2>
          <p>El ejercicio que buscas no existe o ha sido eliminado.</p>
          <Link to={`/ejercicios/unidad/${unidadId}`} className="btn-volver">
            Volver a la unidad
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ejercicio-container">
      <div className="ejercicio-header">
        <h1>{ejercicio.titulo}</h1>
        <div className="ejercicio-meta">
          <span className="unidad-badge">Unidad {unidadId}</span>
          <span className="ejercicio-badge">Ejercicio {ejercicioId}</span>
          <span className={`dificultad-badge ${ejercicio.dificultad.toLowerCase()}`}>
            {ejercicio.dificultad}
          </span>
        </div>
      </div>

      <div className="ejercicio-content">
        <div className="enunciado-section">
          <h2>📝 Enunciado</h2>
          <p>{ejercicio.descripcion}</p>
        </div>

        <div className="solucion-section">
          <div className="solucion-header">
            <h2>💻 Tu Solución</h2>
            {historial.length > 0 && (
              <button 
                className="btn-historial"
                onClick={() => setShowHistorial(!showHistorial)}
              >
                {showHistorial ? '🔽 Ocultar Historial' : '🔼 Ver Historial'}
              </button>
            )}
          </div>
          
          {showHistorial && (
            <div className="historial-versiones">
              <h3>Historial de Versiones</h3>
              <div className="versiones-lista">
                {historial.map((version) => (
                  <div 
                    key={version.id} 
                    className={`version-item ${versionSeleccionada?.id === version.id ? 'selected' : ''}`}
                    onClick={() => handleVersionSelect(version)}
                  >
                    <div className="version-info">
                      <span className="version-fecha">{formatFecha(version.fecha)}</span>
                      <span className="version-archivo">{version.nombreArchivo}</span>
                    </div>
                    <button 
                      className="btn-restaurar"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVersionSelect(version);
                      }}
                    >
                      Restaurar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="file-upload-section">
            <label className="file-upload-label">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".java"
              />
              <span className="upload-icon">📤</span>
              <span>Subir archivo</span>
            </label>
            
            {fileName && (
              <div className="file-info">
                <span className="file-name">📄 {fileName}</span>
                <button onClick={handleDownload} className="btn-download">
                  📥 Descargar
                </button>
              </div>
            )}
          </div>

          {fileContent && (
            <div className="code-preview">
              <div className="code-header">
                <h3>Código</h3>
                <button 
                  className="btn-toggle"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? '🔽 Ver menos' : '🔼 Ver más'}
                </button>
              </div>
              
              <div className={`code-container ${isExpanded ? 'expanded' : ''}`}>
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    width: '100%',
                    maxWidth: '100%'
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                  showLineNumbers={true}
                >
                  {fileContent}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>

        <div className="completion-section">
          <label className="completion-label">
            <input
              type="checkbox"
              checked={isEjercicioCompletado(unidadId, parseInt(ejercicioId))}
              onChange={handleCompletionToggle}
            />
            <span className="completion-text">
              {isEjercicioCompletado(unidadId, parseInt(ejercicioId)) ? '✅ Ejercicio completado' : '⏳ Marcar como completado'}
            </span>
          </label>
        </div>
      </div>

      <div className="ejercicio-footer">
        <Link to={`/ejercicios/unidad/${unidadId}`} className="btn-volver">
          ← Volver a la unidad
        </Link>
      </div>
    </div>
  );
};

export default Ejercicio;

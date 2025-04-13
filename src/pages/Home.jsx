import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { EjerciciosContext } from "../context/EjerciciosContext";
import { useVideos } from "../context/VideosContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaGavel, FaTrophy, FaChartBar, FaBook, FaClock, FaCheck, 
  FaHourglassHalf, FaYoutube, FaFilePdf, FaDownload, FaCode, 
  FaVideo, FaRocket, FaRedo, FaTools, FaBox, FaBuilding, 
  FaFolder, FaDatabase, FaBookOpen, FaLaptopCode, FaGraduationCap 
} from 'react-icons/fa';
import { getEjerciciosByUnidad } from '../data/ejercicios';
import MatrixEffect from '../components/MatrixEffect';
import "./Home.css";

const unidades = [
  { 
    id: 1, 
    nombre: "Estructuras de Control", 
    icono: <FaFolder />,
    descripcion: "Aprende a controlar el flujo de tu programa con condicionales y bucles."
  },
  { 
    id: 2, 
    nombre: "Arreglos", 
    icono: <FaFolder />,
    descripcion: "Domina el manejo de colecciones de datos y operaciones con arrays."
  },
  { 
    id: 3, 
    nombre: "Métodos", 
    icono: <FaFolder />,
    descripcion: "Crea y utiliza métodos para organizar y reutilizar tu código."
  },
  { 
    id: 4, 
    nombre: "POO y Clases", 
    icono: <FaFolder />,
    descripcion: "Introducción a la Programación Orientada a Objetos y diseño de clases."
  },
  { 
    id: 5, 
    nombre: "Hilos y aplicaciones", 
    icono: <FaFolder />,
    descripcion: "Explora la programación concurrente y el manejo de hilos."
  },
  { 
    id: 6, 
    nombre: "Multithreading", 
    icono: <FaFolder />,
    descripcion: "Profundiza en la programación multihilo y sincronización."
  },
  { 
    id: 7, 
    nombre: "Neworking", 
    icono: <FaFolder />,
    descripcion: "Aprende sobre comunicación en red y protocolos de red."
  }
];

// Datos de ejemplo para recursos y tareas
const recursosRecientes = [
  { id: 1, tipo: "video", titulo: "Introducción a POO", fecha: "2024-04-05", icono: "🎥" },
  { id: 2, tipo: "apunte", titulo: "Guía de Arrays", fecha: "2024-04-04", icono: "📄" },
  { id: 3, tipo: "practica", titulo: "Ejercicios POO", fecha: "2024-04-03", icono: "💻" }
];

const proximosVideos = [
  { id: 1, title: "Introducción a POO", unit: 4, type: "video" },
  { id: 2, title: "Herencia y Polimorfismo", unit: 4, type: "video" },
  { id: 3, title: "Interfaces y Clases Abstractas", unit: 4, type: "video" }
];

const truncateTitle = (title, maxLength = 30) => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
};

const proximosPDFs = [
  { id: 0, title: "Introducción a la Programación - PDF", unit: 1, type: "pdf", file: "/pdfs/unidad-1.pdf" },
  { id: 1, title: "Fundamentos de la Programación: Tipos, Variables y Operadores", unit: 2, type: "pdf", file: "/pdfs/unidad-2.pdf" },
  { id: 2, title: "Entrada/Salida, Control de Flujo y Manejo de Datos", unit: 3, type: "pdf", file: "/pdfs/unidad-3.pdf" },
  { id: 3, title: "Métodos: Organización y Reutilización del Código", unit: 4, type: "pdf", file: "/pdfs/unidad-4.pdf" },
  { id: 4, title: "Introducción a POO, composición, herencia, polimorfismo", unit: 5, type: "pdf", file: "/pdfs/unidad-5.pdf" },
  { id: 5, title: "Programación Concurrente: Hilos y Aplicaciones Multihilo", unit: 6, type: "pdf", file: "/pdfs/unidad-6.pdf" },
  { id: 6, title: "Multithreading: Ejecución Paralela y Eficiencia en la Programación", unit: 7, type: "pdf", file: "/pdfs/unidad-7.pdf" },
  { id: 7, title: "Networking en Java: Comunicación entre Dispositivos", unit: 8, type: "pdf", file: "/pdfs/unidad-8.pdf" }
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const { getProgresoUnidad, getEjerciciosUnidad } = useContext(EjerciciosContext);
  const { getProgresoTotal, getTotalVideos, getVideosVistos, isVideoVisto, getVideos } = useVideos();
  const [unidadProgreso, setUnidadProgreso] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [progresoGeneral, setProgresoGeneral] = useState(0);
  const [progresoVideos, setProgresoVideos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [videosVistos, setVideosVistos] = useState(0);
  const [proximosVideos, setProximosVideos] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const calcularProgreso = () => {
      const progresoInicial = {};
      let totalEjercicios = 0;
      let ejerciciosCompletados = 0;

      unidades.forEach(unidad => {
        const ejercicios = getEjerciciosByUnidad(unidad.id);
        const progreso = getProgresoUnidad(unidad.id);
        
        const total = ejercicios?.length || 0;
        const completados = progreso?.completados || 0;
        
        totalEjercicios += total;
        ejerciciosCompletados += completados;

        const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

        progresoInicial[unidad.id] = {
          total,
          completados,
          porcentaje
        };
      });

      setUnidadProgreso(progresoInicial);
      setProgresoGeneral(totalEjercicios > 0 ? Math.round((ejerciciosCompletados / totalEjercicios) * 100) : 0);
    };

    calcularProgreso();
  }, [getProgresoUnidad, getEjerciciosUnidad]);

  useEffect(() => {
    // Calcular progreso de videos
    const total = getTotalVideos();
    const vistos = getVideosVistos();
    const progreso = total > 0 ? Math.round((vistos / total) * 100) : 0;
    
    setTotalVideos(total);
    setVideosVistos(vistos);
    setProgresoVideos(progreso);
  }, [getTotalVideos, getVideosVistos]);

  useEffect(() => {
    // Obtener los próximos 3 videos no vistos
    const videos = getVideos();
    const videosNoVistos = videos.filter(video => !isVideoVisto(video.id));
    setProximosVideos(videosNoVistos.slice(0, 3));
  }, [getVideos, isVideoVisto]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setIsSearching(true);

    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Buscar ejercicios en todas las unidades
    const resultados = [];
    unidades.forEach(unidad => {
      const ejercicios = getEjerciciosByUnidad(unidad.id);
      ejercicios?.forEach(ejercicio => {
        const tituloMatch = ejercicio.titulo?.toLowerCase().includes(query);
        const descripcionMatch = ejercicio.descripcion?.toLowerCase().includes(query);
        const contenidoMatch = ejercicio.contenido?.toLowerCase().includes(query);
        
        if (tituloMatch || descripcionMatch || contenidoMatch) {
          resultados.push({
            ...ejercicio,
            unidadId: unidad.id,
            unidadNombre: unidad.nombre,
            matchType: tituloMatch ? 'título' : descripcionMatch ? 'descripción' : 'contenido'
          });
        }
      });
    });

    // Simular un pequeño retraso para mostrar el estado de carga
    setTimeout(() => {
      setSearchResults(resultados);
      setIsSearching(false);
    }, 300);
  };

  const handleResultClick = (unidadId, ejercicioId) => {
    navigate(`/ejercicios/unidad/${unidadId}/ejercicio/${ejercicioId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className={`home-wrapper ${user ? 'logged-in' : ''}`}>
      {!user ? (
        <div className="landing-page">
          <div className="hero-section">
            <MatrixEffect />
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Programación sobre Redes</h1>
              <p className="hero-subtitle">Aprueba la materia con esta plataforma de aprendizaje</p>
              
              <div className="hero-cta">
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>

          <section className="landing-dark-section">
            <div className="landing-dark-content">
              <h2 className="landing-dark-title">¿Qué encontrarás en la plataforma?</h2>
              <p className="landing-dark-description">
                Todo el material necesario para dominar la programación en redes, organizado y accesible
              </p>
              
              <div className="landing-dark-grid">
                <div className="landing-dark-card">
                  <div className="landing-dark-icon">
                    <FaBook />
                  </div>
                  <h3>Material Completo</h3>
                  <p>
                    Accede a apuntes detallados, ejercicios prácticos y recursos de estudio organizados por unidades.
                  </p>
                </div>
                
                <div className="landing-dark-card">
                  <div className="landing-dark-icon">
                    <FaCode />
                  </div>
                  <h3>Ejercicios Prácticos</h3>
                  <p>
                    Practica con ejercicios interactivos y desafíos que te ayudarán a dominar los conceptos.
                  </p>
                </div>
                
                <div className="landing-dark-card">
                  <div className="landing-dark-icon">
                    <FaVideo />
                  </div>
                  <h3>Videos Explicativos</h3>
                  <p>
                    Aprende con videos tutoriales que explican los conceptos de manera clara y práctica.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-dark-section" style={{ background: '#16213e' }}>
            <div className="landing-dark-content">
              <h2 className="landing-dark-title">Arrancá ahora, es cuestion de tiempo y constancia</h2>
              <p className="landing-dark-description">
                Todavía me encuentro cursando la materia, pero sé que la constancia y una buen metodología de estudio te llevarán a aprobarla.
              </p>
              <div className="landing-dark-button-container">
                <button 
                  className="landing-dark-button"
                  onClick={() => navigate('/login')}
                >
                  Comenzar Ahora
                </button>
              </div>
            </div>
          </section>

          <footer className="landing-dark-footer">
            <p className="landing-dark-footer-text">
              Necesitás iniciar sesión para acceder al contenido completo
            </p>
            <div className="landing-dark-footer-links">
              <a href="/login">Iniciar Sesión</a>
              <a href="/register">Registrarse</a>
            </div>
          </footer>
        </div>
      ) : (
        <div className="dashboard">
          <div className="dashboard-header">
            <div className="header-top">
              <h1>
                Panel de Control
              </h1>
            </div>
            <p className="welcome-text">Bienvenido de nuevo, {user?.username || 'Usuario'}. Estás viendo la página de inicio</p>
            
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Buscar ejercicios por título, descripción o contenido..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                {isSearching && <div className="search-loading">Buscando...</div>}
              </div>
              {searchResults.length > 0 ? (
                <div className="search-results">
                  {searchResults.map((resultado) => (
                    <div
                      key={`${resultado.unidadId}-${resultado.id}`}
                      className="search-result-item"
                      onClick={() => handleResultClick(resultado.unidadId, resultado.id)}
                    >
                      <div className="result-header">
                        <span className="result-title">{resultado.titulo}</span>
                        <span className="result-match-type">Coincidencia en {resultado.matchType}</span>
                      </div>
                      <span className="result-unit">Unidad {resultado.unidadId}: {resultado.unidadNombre}</span>
                      {resultado.descripcion && (
                        <p className="result-description">{resultado.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : searchQuery && !isSearching ? (
                <div className="no-results">
                  No se encontraron resultados para "{searchQuery}"
                </div>
              ) : null}
            </div>
          </div>

          <div className="progress-overview">
            <h2>
              Progreso General
            </h2>
            <div className="progress-stats-container">
              <div className="progress-stat-card">
                <FaBookOpen />
                <span className="stat-value">
                  {progresoGeneral}%
                </span>
                <span className="stat-label">Ejercicios Completados</span>
              </div>
              <div className="progress-stat-card">
                <FaVideo />
                <span className="stat-value">{progresoVideos}%</span>
                <span className="stat-label">Videos Vistos ({videosVistos}/{totalVideos})</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-section unidades-progress">
              <h2>
                Progreso en Unidades
              </h2>
              <div className="unidades-grid">
                {unidades.map((unidad) => {
                  const progreso = unidadProgreso[unidad.id] || { total: 0, completados: 0, porcentaje: 0 };
                  return (
                    <div key={unidad.id} className="unidad-card">
                      <div className="unidad-header">
                        <span className="unidad-icon">{unidad.icono}</span>
                        <h3>Unidad {unidad.id}</h3>
                      </div>
                      <p className="unidad-nombre">{unidad.nombre}</p>
                      <p className="unidad-descripcion">{unidad.descripcion}</p>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${progreso.porcentaje}%`,
                            backgroundColor: progreso.porcentaje === 100 ? '#4CAF50' : '#2196F3'
                          }}
                        ></div>
                      </div>
                      <div className="progress-stats">
                        <span>{progreso.completados}/{progreso.total} ejercicios</span>
                        <span>{progreso.porcentaje}%</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/ejercicios/unidad/${unidad.id}`)}
                        className="btn-continuar"
                      >
                        {progreso.completados === progreso.total && progreso.total > 0 ? 
                          <>Completado</> : 
                          <>Continuar</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dashboard-section recursos-recientes">
              <h2>
                Próximos Videos
              </h2>
              <div className="recursos-list">
                {proximosVideos.length > 0 ? (
                  proximosVideos.map((video) => (
                    <div key={video.id} className="recurso-card">
                      <span className="recurso-icon"><FaYoutube /></span>
                      <div className="recurso-info">
                        <h3>{video.title}</h3>
                        <p className="recurso-unidad">
                          Unidad {video.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/materiales?unidad=${video.unit}`)}
                        className="btn-ver-unidad"
                      >
                        <FaBook className="mr-2" /> Ver unidad
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-videos">
                    <p>¡Felicidades! Has visto todos los videos disponibles.</p>
                  </div>
                )}
              </div>

              <h2 className="mt-8">
                Apuntes
              </h2>
              <div className="recursos-list">
                {proximosPDFs.length > 0 ? (
                  proximosPDFs.map((pdf) => (
                    <div key={pdf.id} className="recurso-card">
                      <span className="recurso-icon"><FaFilePdf /></span>
                      <div className="recurso-info">
                        <h3>{truncateTitle(pdf.title)}</h3>
                        <p className="recurso-unidad">
                          Unidad {pdf.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => window.open(pdf.file, '_blank')}
                        className="btn-descargar"
                        title="Descargar material"
                      >
                        <FaDownload /> Descargar
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-videos">
                    <p>No hay apuntes disponibles en este momento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

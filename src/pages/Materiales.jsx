import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useVideos } from '../context/VideosContext';
import { FaBook, FaCode, FaTrophy, FaSearch, FaFilter, FaTimes, FaBookmark, FaEye, FaEyeSlash, FaPlus, FaFilePdf, FaUpload, FaDownload, FaTrash, FaYoutube, FaVideo } from 'react-icons/fa';
import './Materiales.css';

const Materiales = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const { toggleVideoVisto, isVideoVisto, getProgresoUnidad, getProgresoTotal } = useVideos();
  const navigate = useNavigate();
  
  const [currentUnit, setCurrentUnit] = useState('1');
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [videosVistos, setVideosVistos] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    date: 'newest'
  });
  const [readingMode, setReadingMode] = useState(false);
  const [unidadesProgress, setUnidadesProgress] = useState({}); // Nuevo estado para el progreso por unidad

  const unidades = [
    { id: '1', name: 'Introducción a la Programación', icon: <FaBook /> },
    { id: '2', name: 'Fundamentos de la Programación', icon: <FaCode /> },
    { id: '3', name: 'Entrada/Salida y Control de Flujo', icon: <FaBook /> },
    { id: '4', name: 'Métodos y Organización del Código', icon: <FaCode /> },
    { id: '5', name: 'Programación Orientada a Objetos', icon: <FaBook /> },
    { id: '6', name: 'Programación Concurrente', icon: <FaCode /> },
    { id: '7', name: 'Multithreading', icon: <FaBook /> },
    { id: '8', name: 'Networking en Java', icon: <FaCode /> }
  ];

  // Datos de ejemplo para materiales
  const materialesEjemplo = [
    {
      id: 1,
      title: 'Breve historia de la programación',
      description: 'Un recorrido por la evolución de la programación desde sus inicios hasta la actualidad',
      type: 'video',
      date: '2023-05-16',
      unit: '1',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=TUhVJa4ejjo',
      videoId: 'TUhVJa4ejjo'
    },
    {
      id: 2,
      title: 'Conceptos sobre lenguajes de programación',
      description: 'Introducción a los conceptos fundamentales de los lenguajes de programación',
      type: 'video',
      date: '2023-05-17',
      unit: '1',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=n3ceOky83Go',
      videoId: 'n3ceOky83Go'
    },
    {
      id: 3,
      title: 'Compiladores e intérpretes',
      description: 'Explicación sobre cómo funcionan los compiladores e intérpretes en la programación',
      type: 'video',
      date: '2023-05-18',
      unit: '1',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=Me6JUDPdZB4',
      videoId: 'Me6JUDPdZB4'
    },
    {
      id: 4,
      title: 'La historia completa de Java',
      description: 'Un recorrido por la historia y evolución del lenguaje de programación Java',
      type: 'video',
      date: '2023-05-19',
      unit: '1',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=Kcflug9eegw',
      videoId: 'Kcflug9eegw'
    },
    {
      id: 5,
      title: 'La máquina virtual de Java',
      description: 'Explicación detallada sobre la JVM y su funcionamiento',
      type: 'video',
      date: '2023-05-20',
      unit: '1',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=DoDLdTgM7g0',
      videoId: 'DoDLdTgM7g0'
    },
    {
      id: 6,
      title: 'Características de Java',
      description: 'Análisis de las principales características y ventajas del lenguaje Java',
      type: 'video',
      date: '2023-05-21',
      unit: '1',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=y_hF0ryBOAY',
      videoId: 'y_hF0ryBOAY'
    },
    {
      id: 7,
      title: 'Instalación de Eclipse',
      description: 'Guía paso a paso para instalar y configurar el IDE Eclipse',
      type: 'video',
      date: '2023-05-22',
      unit: '1',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=MGDSjkszNGo',
      videoId: 'MGDSjkszNGo'
    },
    {
      id: 8,
      title: 'Introducción a la Programación - PDF',
      description: 'Material de estudio sobre los conceptos básicos de programación',
      type: 'pdf',
      unit: '1',
      viewed: false,
      file: '/pdfs/unidad-1.pdf',
      fileName: 'unidad-1.pdf'
    },
    {
      id: 9,
      title: 'Fundamentos de la Programación: Tipos, Variables y Operadores',
      description: 'En esta sección exploramos los elementos esenciales para comenzar a programar: los distintos tipos de datos, cómo declarar y usar variables y constantes, los operadores más comunes y las convenciones de escritura que ayudan a mantener un código limpio, legible y profesional.',
      type: 'pdf',
      unit: '2',
      viewed: false,
      file: '/pdfs/unidad-2.pdf',
      fileName: 'unidad-2.pdf'
    },
    {
      id: 10,
      title: 'Entrada/Salida, Control de Flujo y Manejo de Datos',
      description: 'En esta unidad aprenderás a interactuar con el usuario mediante print y Scanner, controlar el flujo del programa con estructuras condicionales y bucles, trabajar con arreglos para almacenar múltiples datos, entender el alcance de las variables dentro del código, y manejar errores a través del uso de excepciones.',
      type: 'pdf',
      unit: '3',
      viewed: false,
      file: '/pdfs/unidad-3.pdf',
      fileName: 'unidad-3.pdf'
    },
    {
      id: 11,
      title: 'Métodos: Organización y Reutilización del Código',
      description: 'Los métodos permiten estructurar el código en bloques reutilizables que realizan tareas específicas. En este tema aprenderás cómo declarar, invocar y utilizar métodos con o sin parámetros y valores de retorno, facilitando la legibilidad, el mantenimiento y la modularidad de tus programas.',
      type: 'pdf',
      unit: '4',
      viewed: false,
      file: '/pdfs/unidad-4.pdf',
      fileName: 'unidad-4.pdf'
    },
    {
      id: 12,
      title: 'Introducción a POO, composición, herencia, polimorfismo',
      description: 'En esta sección descubrirás los pilares fundamentales de la Programación Orientada a Objetos: cómo modelar el mundo real con clases y objetos, cómo utilizar la composición para construir objetos complejos, aplicar la herencia para reutilizar y extender funcionalidades, y emplear el polimorfismo para escribir código más flexible y escalable.',
      type: 'pdf',
      unit: '5',
      viewed: false,
      file: '/pdfs/unidad-5.pdf',
      fileName: 'unidad-5.pdf'
    },
    {
      id: 13,
      title: 'Programación Concurrente: Hilos y Aplicaciones Multihilo',
      description: 'Aprende a ejecutar múltiples tareas al mismo tiempo mediante el uso de hilos (threads). Esta unidad te introducirá a la programación concurrente, mostrando cómo crear y controlar hilos, sincronizar procesos y desarrollar aplicaciones multihilo eficientes que aprovechen mejor los recursos del sistema.',
      type: 'pdf',
      unit: '6',
      viewed: false,
      file: '/pdfs/unidad-6.pdf',
      fileName: 'unidad-6.pdf'
    },
    {
      id: 14,
      title: 'Multithreading: Ejecución Paralela y Eficiencia en la Programación',
      description: 'El multithreading permite que un programa ejecute múltiples hilos de manera simultánea, mejorando la eficiencia y rendimiento en tareas intensivas o que requieren espera. En esta unidad aprenderás cómo implementar y gestionar múltiples hilos, coordinar su ejecución, evitar condiciones de carrera y diseñar aplicaciones capaces de realizar varias operaciones al mismo tiempo sin perder estabilidad.',
      type: 'pdf',
      unit: '7',
      viewed: false,
      file: '/pdfs/unidad-7.pdf',
      fileName: 'unidad-7.pdf'
    },
    {
      id: 15,
      title: 'Networking en Java: Comunicación entre Dispositivos',
      description: 'Esta unidad te introduce al mundo de las redes desde la programación con Java. Aprenderás cómo establecer comunicación entre dispositivos utilizando sockets, enviar y recibir datos a través de protocolos como TCP/IP, y construir aplicaciones cliente-servidor capaces de intercambiar información en tiempo real.',
      type: 'pdf',
      unit: '8',
      viewed: false,
      file: '/pdfs/unidad-8.pdf',
      fileName: 'unidad-8.pdf'
    },
    {
      id: 16,
      title: 'Instalación de Java y Eclipse en Linux',
      description: 'Guía paso a paso para instalar Java y Eclipse en sistemas Linux',
      type: 'video',
      date: '2023-05-24',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=rtpBvwHbN6Q',
      videoId: 'rtpBvwHbN6Q'
    },
    {
      id: 17,
      title: 'Instalación de Java y Eclipse en macOS',
      description: 'Guía paso a paso para instalar Java y Eclipse en sistemas macOS',
      type: 'video',
      date: '2023-05-25',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=hsQK0rnRMYI',
      videoId: 'hsQK0rnRMYI'
    },
    {
      id: 18,
      title: 'Primeros pasos con Eclipse',
      description: 'Introducción al uso básico del IDE Eclipse',
      type: 'video',
      date: '2023-05-26',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=uC4gyOAdg8o',
      videoId: 'uC4gyOAdg8o'
    },
    {
      id: 19,
      title: 'Personalización de Eclipse',
      description: 'Cómo personalizar el entorno de desarrollo Eclipse',
      type: 'video',
      date: '2023-05-27',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=VGQcsbl7XjU',
      videoId: 'VGQcsbl7XjU'
    },
    {
      id: 20,
      title: '¡Hola mundo!',
      description: 'Creación del primer programa en Java',
      type: 'video',
      date: '2023-05-28',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=8Kfg4coTBaU',
      videoId: '8Kfg4coTBaU'
    },
    {
      id: 21,
      title: 'Atributos y tipos de datos primitivos',
      description: 'Introducción a los tipos de datos primitivos en Java',
      type: 'video',
      date: '2023-05-29',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=2WUIhS5YIbI',
      videoId: '2WUIhS5YIbI'
    },
    {
      id: 22,
      title: 'Tipos de datos de referencia',
      description: 'Explicación de los tipos de datos de referencia en Java',
      type: 'video',
      date: '2023-05-30',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=umo-QAaKfN8',
      videoId: 'umo-QAaKfN8'
    },
    {
      id: 23,
      title: 'El tipo de dato String',
      description: 'Uso y manipulación de cadenas de texto en Java',
      type: 'video',
      date: '2023-05-31',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=t10sfxsgyqg',
      videoId: 't10sfxsgyqg'
    },
    {
      id: 24,
      title: 'Conversión entre tipos de datos',
      description: 'Cómo realizar conversiones entre diferentes tipos de datos',
      type: 'video',
      date: '2023-06-01',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=uUvIMVx3_3k',
      videoId: 'uUvIMVx3_3k'
    },
    {
      id: 25,
      title: 'Constantes',
      description: 'Uso y definición de constantes en Java',
      type: 'video',
      date: '2023-06-02',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=cfoVMckXUmI',
      videoId: 'cfoVMckXUmI'
    },
    {
      id: 26,
      title: 'Operadores',
      description: 'Operadores básicos y avanzados en Java',
      type: 'video',
      date: '2023-06-03',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=DKz7EQbj3Y8',
      videoId: 'DKz7EQbj3Y8'
    },
    {
      id: 27,
      title: 'Operadores, sentencias y convenciones de escritura',
      description: 'Buenas prácticas y convenciones de escritura en Java',
      type: 'video',
      date: '2023-06-04',
      unit: '2',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=6PocNebmJls',
      videoId: '6PocNebmJls'
    },
    {
      id: 28,
      title: 'Estructuras de selección if-else y operador ternario',
      description: 'Uso de estructuras condicionales y el operador ternario en Java',
      type: 'video',
      date: '2023-06-05',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=MunGZs8C7KY',
      videoId: 'MunGZs8C7KY'
    },
    {
      id: 29,
      title: 'Ingresar datos por consola',
      description: 'Cómo recibir y procesar datos ingresados por el usuario',
      type: 'video',
      date: '2023-06-06',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=10QiAC6W4NQ',
      videoId: '10QiAC6W4NQ'
    },
    {
      id: 30,
      title: 'Estructura de selección switch case',
      description: 'Uso de la estructura switch para múltiples condiciones',
      type: 'video',
      date: '2023-06-07',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=AOTQN0L34-Q',
      videoId: 'AOTQN0L34-Q'
    },
    {
      id: 31,
      title: 'Estructuras de repetición while y do-while',
      description: 'Implementación de bucles while y do-while en Java',
      type: 'video',
      date: '2023-06-08',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=I0flntwBGRE',
      videoId: 'I0flntwBGRE'
    },
    {
      id: 32,
      title: 'Estructura de repetición for',
      description: 'Uso del bucle for para iteraciones controladas',
      type: 'video',
      date: '2023-06-09',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=XmKm1DCl8XY',
      videoId: 'XmKm1DCl8XY'
    },
    {
      id: 33,
      title: 'Diferencias entre for, while y do-while',
      description: 'Comparación y casos de uso de los diferentes tipos de bucles',
      type: 'video',
      date: '2023-06-10',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=eUerLKJMWwI',
      videoId: 'eUerLKJMWwI'
    },
    {
      id: 34,
      title: 'Arrays',
      description: 'Introducción a los arreglos en Java',
      type: 'video',
      date: '2023-06-11',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=XeNZeauba6U',
      videoId: 'XeNZeauba6U'
    },
    {
      id: 35,
      title: 'Máximos y mínimos',
      description: 'Algoritmos para encontrar valores máximos y mínimos',
      type: 'video',
      date: '2023-06-12',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=nwUwTEQmk_M',
      videoId: 'nwUwTEQmk_M'
    },
    {
      id: 36,
      title: 'Optimización de máximos y mínimos',
      description: 'Técnicas avanzadas para optimizar búsqueda de valores extremos',
      type: 'video',
      date: '2023-06-13',
      unit: '3',
      viewed: false,
      file: 'https://www.youtube.com/watch?v=huHIvPhsrg8',
      videoId: 'huHIvPhsrg8'
    },
    {
      id: 37,
      title: 'Resolución de ejercicio con arreglos y métodos',
      description: 'Resolución de un ejercicio para obtener datos a partir de un examen universitario',
      type: 'video',
      date: '2023-06-14',
      unit: '4',
      viewed: false,
      file: 'https://www.youtube.com/live/j4ZjG3twXjg',
      videoId: 'j4ZjG3twXjg'
    },
    {
      id: 38,
      title: 'Resolución de ejercicios con arreglos multidimensionales',
      description: 'Resolución de ejercicios que involucran el manejo de datos mediante estructuras de arreglos multi-dimensionales',
      type: 'video',
      date: '2023-06-15',
      unit: '4',
      viewed: false,
      file: 'https://www.youtube.com/live/kZks0F1NQV0',
      videoId: 'kZks0F1NQV0'
    },
    {
      id: 39,
      title: 'Introducción al paradigma orientado a objetos',
      description: 'Temas: El progreso de la abstracción, enfoque orientado a objetos, objetos, clases, envío de mensajes y polimorfismo',
      type: 'video',
      date: '2023-06-16',
      unit: '5',
      viewed: false,
      file: 'https://www.youtube.com/live/GyP0LQagwp0',
      videoId: 'GyP0LQagwp0'
    },
    {
      id: 40,
      title: 'Práctica en la creación de clases y objetos',
      description: 'Temas: Práctica en creación de clases y objetos, método constructor, declaración de atributos y métodos estáticos',
      type: 'video',
      date: '2023-06-17',
      unit: '5',
      viewed: false,
      file: 'https://www.youtube.com/live/OPYUEQ3ALeY',
      videoId: 'OPYUEQ3ALeY'
    }
  ];

  // Calcular el número de materiales por unidad
  const materialesPorUnidad = useMemo(() => {
    const conteo = {};
    unidades.forEach(unidad => {
      conteo[unidad.id] = materialesEjemplo.filter(m => m.unit === unidad.id).length;
    });
    return conteo;
  }, []);

  useEffect(() => {
    // Obtener la unidad de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const unidadParam = urlParams.get('unidad');
    if (unidadParam) {
      setCurrentUnit(unidadParam);
    }
  }, []);

  useEffect(() => {
    // Cargar materiales de la unidad actual
    const materialesUnidad = materialesEjemplo.filter(m => m.unit === currentUnit);
    setMaterials(materialesUnidad);
    
    // Calcular progreso basado en videos vistos
    const progreso = getProgresoUnidad(currentUnit, materialesUnidad);
    setProgress(progreso);
    
    // Calcular el progreso para todas las unidades
    const nuevoProgresoUnidades = {};
    unidades.forEach(unidad => {
      const materialesDeUnidad = materialesEjemplo.filter(m => m.unit === unidad.id);
      nuevoProgresoUnidades[unidad.id] = getProgresoUnidad(unidad.id, materialesDeUnidad);
    });
    setUnidadesProgress(nuevoProgresoUnidades);

    // Calcular total de videos y videos vistos SOLO para la unidad actual
    const videosUnidad = materialesUnidad.filter(m => m.type === 'video');
    const videosVistosCount = videosUnidad.filter(m => isVideoVisto(m.id)).length;
    
    setTotalVideos(videosUnidad.length);
    setVideosVistos(videosVistosCount);
  }, [currentUnit, getProgresoUnidad, isVideoVisto]);

  useEffect(() => {
    // Búsqueda de materiales
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const resultados = materials.filter(material => 
      material.title.toLowerCase().includes(query) || 
      material.description.toLowerCase().includes(query)
    );
    
    setSearchResults(resultados);
  }, [searchQuery, materials]);

  const handleUnitChange = (unitId) => {
    setCurrentUnit(unitId);
  };

  const toggleReadingMode = () => {
    setReadingMode(!readingMode);
  };

  const formatDate = (material) => {
    if (material.type === 'video') {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(material.date).toLocaleDateString('es-ES', options);
    }
    return '';
  };

  // Función para descargar un material
  const handleDownload = (material) => {
    if (material.type === 'pdf') {
      // Para PDFs, simplemente abrimos el archivo en una nueva pestaña
      window.open(material.file, '_blank');
    }
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaBook />;
      case 'video': return <FaCode />;
      case 'exercise': return <FaTrophy />;
      default: return <FaBookmark />;
    }
  };

  const filteredMaterials = searchResults.length > 0 ? searchResults : materials;

  // Función para extraer el ID del video de YouTube de una URL
  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Función para validar URL de YouTube
  const isValidYoutubeUrl = (url) => {
    return extractYoutubeId(url) !== null;
  };

  // Función para renderizar el contenido del material según su tipo
  const renderMaterialContent = (material) => {
    if (material.type === 'pdf') {
      return (
        <div className="material-actions">
          <button 
            className="btn-descargar" 
            onClick={() => handleDownload(material)}
            title="Descargar material"
          >
            <FaDownload /> Descargar
          </button>
        </div>
      );
    } else if (material.type === 'video') {
      return (
        <div className="video-card">
          <div className="video-container">
            <iframe
              src={`https://www.youtube.com/embed/${material.videoId}`}
              title={material.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-info">
            <h3>{material.title}</h3>
            <p>{material.description}</p>
            <button 
              className={`btn-visto ${isVideoVisto(material.id) ? 'visto' : ''}`}
              onClick={() => handleToggleVisto(material)}
              title={isVideoVisto(material.id) ? "Marcar como no visto" : "Marcar como visto"}
            >
              <FaEye /> {isVideoVisto(material.id) ? "Visto" : "Marcar como visto"}
            </button>
          </div>
          <div className="video-actions">
            <a 
              href={material.file} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-descargar"
            >
              <FaYoutube /> Ver en YouTube
            </a>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleToggleVisto = (material) => {
    if (material.type === 'video') {
      toggleVideoVisto(material.id);
      const nuevosMateriales = materials.map(m => 
        m.id === material.id ? { ...m, viewed: !m.viewed } : m
      );
      setMaterials(nuevosMateriales);
      const progreso = getProgresoUnidad(currentUnit, nuevosMateriales);
      setProgress(progreso);
      
      // Actualizar el progreso de la unidad actual
      setUnidadesProgress(prev => ({
        ...prev,
        [currentUnit]: progreso
      }));

      // Actualizar contadores de videos
      const videosUnidad = nuevosMateriales.filter(m => m.type === 'video');
      const videosVistosCount = videosUnidad.filter(m => isVideoVisto(m.id)).length;
      
      setTotalVideos(videosUnidad.length);
      setVideosVistos(videosVistosCount);
    }
  };

  if (!user) {
    return (
      <div className="materiales-container">
        <div className="materiales-content">
          <div className="no-auth-message">
            <h2>Inicia sesión para acceder a los materiales</h2>
            <button onClick={() => navigate('/login')} className="btn-login">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`materiales-container ${readingMode ? 'modo-lectura' : ''}`}>
      <div className="materiales-sidebar">
        <div className="sidebar-header">
          <h2>Unidades</h2>
        </div>
        
        <div className="unidades-list">
          {unidades.map(unidad => (
            <div 
              key={unidad.id} 
              className={`unidad-item ${currentUnit === unidad.id ? 'active' : ''}`}
              onClick={() => handleUnitChange(unidad.id)}
            >
              <span className="unidad-icon">{unidad.icon}</span>
              <div className="unidad-info">
                <h3>{unidad.name}</h3>
                <p>Materiales: {materialesPorUnidad[unidad.id]}</p>
              </div>
              <div className="unidad-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${unidadesProgress[unidad.id] || 0}%` }}
                  ></div>
                </div>
                <span className="progress-text">{Math.round(unidadesProgress[unidad.id] || 0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="materiales-content">
        <div className="content-header">
          <div className="header-top">
            <h1>{unidades.find(u => u.id === currentUnit)?.name || 'Materiales'}</h1>
          </div>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar materiales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
          
          <div className="progreso-unidad">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <span>Progreso: {Math.round(progress)}%</span>
              <span>{videosVistos} de {totalVideos} videos vistos</span>
            </div>
          </div>
        </div>
        
        {filteredMaterials.length > 0 ? (
          <div className="materiales-grid">
            {/* Sección de Videos */}
            <div className="materiales-section">
              <h2 className="section-title">
                <FaYoutube /> Videos
              </h2>
              <div className="videos-carousel">
                {filteredMaterials
                  .filter(material => material.type === 'video')
                  .map(material => (
                    <div key={material.id} className="video-card">
                      <div className="video-container">
                        <iframe
                          src={`https://www.youtube.com/embed/${material.videoId}`}
                          title={material.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="video-info">
                        <h3>{material.title}</h3>
                        <p>{material.description}</p>
                        <button 
                          className={`btn-visto ${isVideoVisto(material.id) ? 'visto' : ''}`}
                          onClick={() => handleToggleVisto(material)}
                          title={isVideoVisto(material.id) ? "Marcar como no visto" : "Marcar como visto"}
                        >
                          <FaEye /> {isVideoVisto(material.id) ? "Visto" : "Marcar como visto"}
                        </button>
                      </div>
                      <div className="video-actions">
                        <a 
                          href={material.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-descargar"
                        >
                          <FaYoutube /> Ver en YouTube
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Sección de PDFs */}
            <div className="materiales-section">
              <h2 className="section-title">
                <FaFilePdf /> Materiales PDF
              </h2>
              <div className="materiales-list">
                {filteredMaterials
                  .filter(material => material.type === 'pdf')
                  .map(material => (
                    <div key={material.id} className="material-card">
                      <span className="material-icon">{getMaterialIcon(material.type)}</span>
                      <div className="material-info">
                        <h3>{material.title}</h3>
                        <p>{material.description}</p>
                      </div>
                      <div className="material-meta">
                        {material.type === 'video' && <span>{formatDate(material)}</span>}
                        <span>{material.type.toUpperCase()}</span>
                      </div>
                      {material.viewed && (
                        <span className="material-visto" title="Material visto">
                          <FaEye />
                        </span>
                      )}
                      {renderMaterialContent(material)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-materiales">
            {searchQuery ? (
              <p>No se encontraron resultados para "{searchQuery}"</p>
            ) : (
              <p>No hay materiales disponibles para esta unidad</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materiales; 
import React, { createContext, useState, useEffect } from 'react';

export const MaterialContext = createContext();

export const MaterialProvider = ({ children }) => {
  // Estados para los materiales
  const [materiales, setMateriales] = useState(() => {
    const savedMateriales = localStorage.getItem('materiales');
    return savedMateriales ? JSON.parse(savedMateriales) : {};
  });
  
  // Estado para materiales vistos
  const [materialesVistos, setMaterialesVistos] = useState(() => {
    const savedVistos = localStorage.getItem('materialesVistos');
    return savedVistos ? JSON.parse(savedVistos) : {};
  });
  
  // Estado para notas personales
  const [notasPersonales, setNotasPersonales] = useState(() => {
    const savedNotas = localStorage.getItem('notasPersonales');
    return savedNotas ? JSON.parse(savedNotas) : {};
  });
  
  // Estado para comentarios
  const [comentarios, setComentarios] = useState(() => {
    const savedComentarios = localStorage.getItem('comentarios');
    return savedComentarios ? JSON.parse(savedComentarios) : {};
  });
  
  // Estado para progreso de unidades
  const [progresoUnidades, setProgresoUnidades] = useState(() => {
    const savedProgreso = localStorage.getItem('progresoMateriales');
    return savedProgreso ? JSON.parse(savedProgreso) : {};
  });

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const materialesGuardados = localStorage.getItem('materiales');
    const vistosGuardados = localStorage.getItem('materialesVistos');
    const notasGuardadas = localStorage.getItem('notasPersonales');
    const comentariosGuardados = localStorage.getItem('comentarios');
    const progresoGuardado = localStorage.getItem('progresoMateriales');

    if (materialesGuardados) {
      setMateriales(JSON.parse(materialesGuardados));
    } else {
      // Inicializar con datos de ejemplo
      const materialesIniciales = {
        1: [
          { 
            id: 1, 
            titulo: "Introducción a Redes", 
            tipo: "video", 
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            descripcion: "Conceptos básicos de redes informáticas",
            fecha: "2024-04-01",
            duracion: "15:30"
          },
          { 
            id: 2, 
            titulo: "Fundamentos de TCP/IP", 
            tipo: "pdf", 
            url: "/materiales/tcp-ip-fundamentos.pdf",
            descripcion: "Guía completa sobre el protocolo TCP/IP",
            fecha: "2024-04-02",
            tamanio: "2.5 MB"
          }
        ],
        2: [
          { 
            id: 1, 
            titulo: "Arquitectura de Redes", 
            tipo: "video", 
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            descripcion: "Diferentes arquitecturas de red y sus aplicaciones",
            fecha: "2024-04-03",
            duracion: "20:15"
          }
        ]
      };
      setMateriales(materialesIniciales);
      localStorage.setItem('materiales', JSON.stringify(materialesIniciales));
    }

    if (vistosGuardados) {
      setMaterialesVistos(JSON.parse(vistosGuardados));
    } else {
      setMaterialesVistos({});
      localStorage.setItem('materialesVistos', JSON.stringify({}));
    }

    if (notasGuardadas) {
      setNotasPersonales(JSON.parse(notasGuardadas));
    } else {
      setNotasPersonales({});
      localStorage.setItem('notasPersonales', JSON.stringify({}));
    }

    if (comentariosGuardados) {
      setComentarios(JSON.parse(comentariosGuardados));
    } else {
      setComentarios({});
      localStorage.setItem('comentarios', JSON.stringify({}));
    }

    if (progresoGuardado) {
      setProgresoUnidades(JSON.parse(progresoGuardado));
    } else {
      setProgresoUnidades({});
      localStorage.setItem('progresoMateriales', JSON.stringify({}));
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('materiales', JSON.stringify(materiales));
  }, [materiales]);

  useEffect(() => {
    localStorage.setItem('materialesVistos', JSON.stringify(materialesVistos));
  }, [materialesVistos]);

  useEffect(() => {
    localStorage.setItem('notasPersonales', JSON.stringify(notasPersonales));
  }, [notasPersonales]);

  useEffect(() => {
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
  }, [comentarios]);

  useEffect(() => {
    localStorage.setItem('progresoMateriales', JSON.stringify(progresoUnidades));
  }, [progresoUnidades]);

  // Actualizar progreso cuando cambian los materiales vistos
  useEffect(() => {
    const nuevoProgreso = {};
    
    Object.keys(materiales).forEach(unidadId => {
      const materialesUnidad = materiales[unidadId] || [];
      const vistosUnidad = materialesVistos[unidadId] || {};
      
      const totalMateriales = materialesUnidad.length;
      const materialesVistosCount = Object.values(vistosUnidad).filter(Boolean).length;
      
      nuevoProgreso[unidadId] = {
        vistos: materialesVistosCount,
        total: totalMateriales,
        porcentaje: totalMateriales > 0 ? Math.round((materialesVistosCount / totalMateriales) * 100) : 0
      };
    });
    
    setProgresoUnidades(nuevoProgreso);
  }, [materiales, materialesVistos]);

  // Marcar un material como visto
  const marcarMaterialVisto = (unidadId, materialId, visto = true) => {
    const vistosUnidad = materialesVistos[unidadId] || {};
    
    const vistosActualizados = {
      ...materialesVistos,
      [unidadId]: {
        ...vistosUnidad,
        [materialId]: visto
      }
    };
    
    setMaterialesVistos(vistosActualizados);
  };

  // Verificar si un material está visto
  const isMaterialVisto = (unidadId, materialId) => {
    return materialesVistos[unidadId]?.[materialId] || false;
  };

  // Obtener el progreso de una unidad
  const getProgresoUnidad = (unidadId) => {
    const materialesUnidad = materiales[unidadId] || [];
    const vistosUnidad = materialesVistos[unidadId] || {};
    
    const totalMateriales = materialesUnidad.length;
    const materialesVistosCount = Object.values(vistosUnidad).filter(Boolean).length;
    
    return {
      vistos: materialesVistosCount,
      total: totalMateriales,
      porcentaje: totalMateriales > 0 ? Math.round((materialesVistosCount / totalMateriales) * 100) : 0
    };
  };

  // Obtener todos los materiales de una unidad
  const getMaterialesUnidad = (unidadId) => {
    return materiales[unidadId] || [];
  };

  // Obtener un material específico
  const getMaterial = (unidadId, materialId) => {
    const materialesUnidad = materiales[unidadId] || [];
    return materialesUnidad.find(m => m.id === parseInt(materialId));
  };

  // Guardar nota personal
  const guardarNota = (unidadId, materialId, nota) => {
    const notasUnidad = notasPersonales[unidadId] || {};
    
    const notasActualizadas = {
      ...notasPersonales,
      [unidadId]: {
        ...notasUnidad,
        [materialId]: nota
      }
    };
    
    setNotasPersonales(notasActualizadas);
  };

  // Obtener nota personal
  const getNota = (unidadId, materialId) => {
    return notasPersonales[unidadId]?.[materialId] || "";
  };

  // Agregar comentario
  const agregarComentario = (unidadId, materialId, texto, usuario) => {
    const comentariosMaterial = comentarios[`${unidadId}-${materialId}`] || [];
    
    const nuevoComentario = {
      id: Date.now(),
      texto,
      usuario,
      fecha: new Date().toISOString()
    };
    
    const comentariosActualizados = {
      ...comentarios,
      [`${unidadId}-${materialId}`]: [...comentariosMaterial, nuevoComentario]
    };
    
    setComentarios(comentariosActualizados);
  };

  // Obtener comentarios de un material
  const getComentarios = (unidadId, materialId) => {
    return comentarios[`${unidadId}-${materialId}`] || [];
  };

  // Buscar materiales
  const buscarMateriales = (query, filtros = {}) => {
    const resultados = [];
    
    Object.keys(materiales).forEach(unidadId => {
      // Filtrar por unidad si se especifica
      if (filtros.unidad && parseInt(filtros.unidad) !== parseInt(unidadId)) {
        return;
      }
      
      const materialesUnidad = materiales[unidadId] || [];
      
      materialesUnidad.forEach(material => {
        // Filtrar por tipo si se especifica
        if (filtros.tipo && material.tipo !== filtros.tipo) {
          return;
        }
        
        // Filtrar por fecha si se especifica
        if (filtros.fechaDesde && new Date(material.fecha) < new Date(filtros.fechaDesde)) {
          return;
        }
        
        if (filtros.fechaHasta && new Date(material.fecha) > new Date(filtros.fechaHasta)) {
          return;
        }
        
        // Buscar en título y descripción
        const busqueda = query.toLowerCase();
        if (
          material.titulo.toLowerCase().includes(busqueda) ||
          material.descripcion.toLowerCase().includes(busqueda)
        ) {
          resultados.push({
            ...material,
            unidadId: parseInt(unidadId)
          });
        }
      });
    });
    
    return resultados;
  };

  return (
    <MaterialContext.Provider value={{
      materiales,
      materialesVistos,
      notasPersonales,
      comentarios,
      progresoUnidades,
      marcarMaterialVisto,
      isMaterialVisto,
      getProgresoUnidad,
      getMaterialesUnidad,
      getMaterial,
      guardarNota,
      getNota,
      agregarComentario,
      getComentarios,
      buscarMateriales
    }}>
      {children}
    </MaterialContext.Provider>
  );
}; 
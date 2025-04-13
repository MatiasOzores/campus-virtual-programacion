import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ejerciciosData } from '../data/ejercicios';

export const EjerciciosContext = createContext();

export const EjerciciosProvider = ({ children }) => {
  // Estado inicial con los ejercicios reales
  const [ejercicios, setEjercicios] = useState(() => {
    try {
      const savedEjercicios = localStorage.getItem('ejercicios');
      return savedEjercicios ? JSON.parse(savedEjercicios) : ejerciciosData;
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
      return ejerciciosData;
    }
  });

  const [ejerciciosCompletados, setEjerciciosCompletados] = useState(() => {
    try {
      const savedCompletados = localStorage.getItem('ejerciciosCompletados');
      return savedCompletados ? JSON.parse(savedCompletados) : {};
    } catch (error) {
      console.error('Error al cargar ejercicios completados:', error);
      return {};
    }
  });

  const [historialVersiones, setHistorialVersiones] = useState(() => {
    try {
      const savedHistorial = localStorage.getItem('historialVersiones');
      return savedHistorial ? JSON.parse(savedHistorial) : {};
    } catch (error) {
      console.error('Error al cargar historial:', error);
      return {};
    }
  });

  // Memoizamos el cálculo del progreso
  const progresoUnidades = useMemo(() => {
    const progreso = {};
    Object.entries(ejercicios).forEach(([unidadId, ejerciciosUnidad]) => {
      const completadosUnidad = ejerciciosCompletados[unidadId] || {};
      const totalEjercicios = ejerciciosUnidad.length;
      const ejerciciosCompletadosCount = Object.values(completadosUnidad).filter(Boolean).length;
      
      progreso[unidadId] = {
        completados: ejerciciosCompletadosCount,
        total: totalEjercicios,
        porcentaje: totalEjercicios > 0 ? Math.round((ejerciciosCompletadosCount / totalEjercicios) * 100) : 0
      };
    });
    return progreso;
  }, [ejercicios, ejerciciosCompletados]);

  // Persistencia de datos
  useEffect(() => {
    try {
      localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
    } catch (error) {
      console.error('Error al guardar ejercicios:', error);
    }
  }, [ejercicios]);

  useEffect(() => {
    try {
      localStorage.setItem('ejerciciosCompletados', JSON.stringify(ejerciciosCompletados));
    } catch (error) {
      console.error('Error al guardar ejercicios completados:', error);
    }
  }, [ejerciciosCompletados]);

  useEffect(() => {
    try {
      localStorage.setItem('historialVersiones', JSON.stringify(historialVersiones));
    } catch (error) {
      console.error('Error al guardar historial:', error);
    }
  }, [historialVersiones]);

  // Funciones memoizadas
  const agregarEjercicio = useCallback((unidadId, titulo, enunciado) => {
    setEjercicios(prevEjercicios => {
      const ejerciciosUnidad = prevEjercicios[unidadId] || [];
      const nuevoId = ejerciciosUnidad.length > 0 
        ? Math.max(...ejerciciosUnidad.map(e => e.id)) + 1 
        : 1;
      
      return {
        ...prevEjercicios,
        [unidadId]: [...ejerciciosUnidad, { id: nuevoId, titulo, enunciado }]
      };
    });
  }, []);

  const marcarEjercicioCompletado = useCallback((unidadId, ejercicioId, completado = true) => {
    setEjerciciosCompletados(prev => ({
      ...prev,
      [unidadId]: {
        ...(prev[unidadId] || {}),
        [ejercicioId]: completado
      }
    }));
  }, []);

  const isEjercicioCompletado = useCallback((unidadId, ejercicioId) => {
    return ejerciciosCompletados[unidadId]?.[ejercicioId] || false;
  }, [ejerciciosCompletados]);

  const getProgresoUnidad = useCallback((unidadId) => {
    return progresoUnidades[unidadId] || { completados: 0, total: 0, porcentaje: 0 };
  }, [progresoUnidades]);

  const getEjerciciosUnidad = useCallback((unidadId) => {
    return ejercicios[unidadId] || [];
  }, [ejercicios]);

  const getEjercicio = useCallback((unidadId, ejercicioId) => {
    const ejerciciosUnidad = ejercicios[unidadId] || [];
    return ejerciciosUnidad.find(e => e.id === parseInt(ejercicioId));
  }, [ejercicios]);

  const eliminarEjercicio = useCallback((unidadId, ejercicioId) => {
    setEjercicios(prev => ({
      ...prev,
      [unidadId]: prev[unidadId].filter(e => e.id !== ejercicioId)
    }));

    setEjerciciosCompletados(prev => {
      const completadosUnidad = prev[unidadId] || {};
      const { [ejercicioId]: eliminado, ...restoCompletados } = completadosUnidad;
      return {
        ...prev,
        [unidadId]: restoCompletados
      };
    });
  }, []);

  const toggleCompletado = useCallback((unidadId, ejercicioId) => {
    setEjerciciosCompletados(prev => {
      const completadosUnidad = prev[unidadId] || {};
      return {
        ...prev,
        [unidadId]: {
          ...completadosUnidad,
          [ejercicioId]: !completadosUnidad[ejercicioId]
        }
      };
    });
  }, []);

  const agregarVersion = useCallback((unidadId, ejercicioId, contenido, nombreArchivo) => {
    const versionKey = `${unidadId}-${ejercicioId}`;
    const nuevaVersion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      contenido,
      nombreArchivo
    };

    setHistorialVersiones(prev => ({
      ...prev,
      [versionKey]: [...(prev[versionKey] || []), nuevaVersion].slice(-10)
    }));
  }, []);

  const getHistorialVersiones = useCallback((unidadId, ejercicioId) => {
    const versionKey = `${unidadId}-${ejercicioId}`;
    return historialVersiones[versionKey] || [];
  }, [historialVersiones]);

  // Memoizamos el valor del contexto
  const contextValue = useMemo(() => ({
    ejercicios,
    ejerciciosCompletados,
    progresoUnidades,
    agregarEjercicio,
    marcarEjercicioCompletado,
    isEjercicioCompletado,
    getProgresoUnidad,
    getEjerciciosUnidad,
    getEjercicio,
    eliminarEjercicio,
    toggleCompletado,
    agregarVersion,
    getHistorialVersiones
  }), [
    ejercicios,
    ejerciciosCompletados,
    progresoUnidades,
    agregarEjercicio,
    marcarEjercicioCompletado,
    isEjercicioCompletado,
    getProgresoUnidad,
    getEjerciciosUnidad,
    getEjercicio,
    eliminarEjercicio,
    toggleCompletado,
    agregarVersion,
    getHistorialVersiones
  ]);

  return (
    <EjerciciosContext.Provider value={contextValue}>
      {children}
    </EjerciciosContext.Provider>
  );
}; 
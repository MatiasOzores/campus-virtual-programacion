import React, { useState, useEffect, useCallback, memo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEjerciciosByUnidad } from '../../data/ejercicios';
import { EjerciciosContext } from '../../context/EjerciciosContext';
import './Unidad.css';

// Componente memoizado para la tarjeta de ejercicio
const EjercicioCard = memo(({ ejercicio, unidadId, onToggleCompletado }) => (
  <div className={`ejercicio-card ${ejercicio.completado ? 'completado' : ''}`}>
    <div className="ejercicio-card-header">
      <h2 className="ejercicio-card-title">{ejercicio.titulo}</h2>
      <span className={`dificultad-badge ${ejercicio.dificultad.toLowerCase()}`}>
        {ejercicio.dificultad}
      </span>
    </div>
    <div className="ejercicio-card-body">
      <p className="ejercicio-descripcion">{ejercicio.descripcion}</p>
    </div>
    <div className="ejercicio-card-footer">
      <span className={`ejercicio-estado-badge ${ejercicio.completado ? 'completado' : 'pendiente'}`}>
        {ejercicio.completado ? '✅ Completado' : '⏳ Pendiente'}
      </span>
      <div className="ejercicio-actions">
        <button 
          className={`toggle-completado-btn ${ejercicio.completado ? 'completado' : ''}`}
          onClick={() => onToggleCompletado(ejercicio.id)}
          aria-label={ejercicio.completado ? "Marcar como pendiente" : "Marcar como completado"}
        >
          {ejercicio.completado ? '✓' : '○'}
        </button>
        <Link 
          to={`/ejercicios/unidad/${unidadId}/ejercicio/${ejercicio.id}`}
          className="ver-ejercicio-btn"
        >
          Ver ejercicio
        </Link>
      </div>
    </div>
  </div>
));

// Componente memoizado para el mensaje de carga
const LoadingSpinner = memo(() => (
  <div className="unidad-loading">
    <div className="loading-spinner"></div>
    <p>Cargando ejercicios...</p>
  </div>
));

// Componente memoizado para el mensaje de no ejercicios
const NoEjercicios = memo(() => (
  <div className="no-ejercicios">
    <p>No hay ejercicios disponibles para esta unidad.</p>
  </div>
));

const Unidad = () => {
  const { unidadId } = useParams();
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleCompletado, isEjercicioCompletado } = useContext(EjerciciosContext);

  // Memoizamos la función de carga de ejercicios
  const cargarEjercicios = useCallback(async () => {
    try {
      const ejerciciosUnidad = await getEjerciciosByUnidad(parseInt(unidadId));
      // Agregar el estado de completado a cada ejercicio
      const ejerciciosConEstado = ejerciciosUnidad.map(ejercicio => ({
        ...ejercicio,
        completado: isEjercicioCompletado(unidadId, ejercicio.id)
      }));
      setEjercicios(ejerciciosConEstado);
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    } finally {
      setLoading(false);
    }
  }, [unidadId, isEjercicioCompletado]);

  useEffect(() => {
    cargarEjercicios();
  }, [cargarEjercicios]);

  // Memoizamos la función de toggle completado
  const handleToggleCompletado = useCallback(async (ejercicioId) => {
    try {
      // Actualizamos el estado local de manera optimista
      setEjercicios(prevEjercicios => 
        prevEjercicios.map(ejercicio => 
          ejercicio.id === ejercicioId 
            ? { ...ejercicio, completado: !ejercicio.completado }
            : ejercicio
        )
      );
      
      // Actualizamos en el contexto
      toggleCompletado(unidadId, ejercicioId);
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
      // Revertimos el cambio en caso de error
      setEjercicios(prevEjercicios => 
        prevEjercicios.map(ejercicio => 
          ejercicio.id === ejercicioId 
            ? { ...ejercicio, completado: !ejercicio.completado }
            : ejercicio
        )
      );
    }
  }, [unidadId, toggleCompletado]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="unidad-container">
      <div className="unidad-header">
        <Link to="/ejercicios" className="back-button">
          ← Volver a Unidades
        </Link>
        <h1>Unidad {unidadId}</h1>
      </div>

      {ejercicios.length === 0 ? (
        <NoEjercicios />
      ) : (
        <div className="ejercicios-grid">
          {ejercicios.map((ejercicio) => (
            <EjercicioCard
              key={ejercicio.id}
              ejercicio={ejercicio}
              unidadId={unidadId}
              onToggleCompletado={handleToggleCompletado}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(Unidad);

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { materialesEjemplo } from '../data/materiales';

const VideosContext = createContext();

export const VideosProvider = ({ children }) => {
  const [videosVistos, setVideosVistos] = useState(() => {
    const saved = localStorage.getItem('videosVistos');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('videosVistos', JSON.stringify(videosVistos));
  }, [videosVistos]);

  const marcarVideoVisto = (videoId) => {
    setVideosVistos(prev => ({
      ...prev,
      [videoId]: true
    }));
  };

  const marcarVideoNoVisto = (videoId) => {
    setVideosVistos(prev => {
      const newState = { ...prev };
      delete newState[videoId];
      return newState;
    });
  };

  const toggleVideoVisto = (videoId) => {
    if (videosVistos[videoId]) {
      marcarVideoNoVisto(videoId);
    } else {
      marcarVideoVisto(videoId);
    }
  };

  const isVideoVisto = (videoId) => {
    return !!videosVistos[videoId];
  };

  const getProgresoUnidad = useCallback((unidadId, materiales) => {
    const videosUnidad = materiales.filter(m => m.type === 'video');
    if (videosUnidad.length === 0) return 0;
    
    const videosVistos = videosUnidad.filter(m => isVideoVisto(m.id)).length;
    return (videosVistos / videosUnidad.length) * 100;
  }, [isVideoVisto]);

  const getProgresoTotal = (videos) => {
    const totalVideos = videos.length;
    const totalVistos = videos.filter(v => isVideoVisto(v.id)).length;
    return totalVideos > 0 ? (totalVistos / totalVideos) * 100 : 0;
  };

  const getTotalVideos = useCallback(() => {
    return materialesEjemplo.filter(m => m.type === 'video').length;
  }, []);

  const getVideosVistos = useCallback(() => {
    return materialesEjemplo.filter(m => m.type === 'video' && isVideoVisto(m.id)).length;
  }, [isVideoVisto]);

  const getVideos = useCallback(() => {
    return materialesEjemplo.filter(m => m.type === 'video');
  }, []);

  const value = {
    videosVistos,
    marcarVideoVisto,
    marcarVideoNoVisto,
    toggleVideoVisto,
    isVideoVisto,
    getProgresoUnidad,
    getProgresoTotal,
    getTotalVideos,
    getVideosVistos,
    getVideos
  };

  return (
    <VideosContext.Provider value={value}>
      {children}
    </VideosContext.Provider>
  );
};

export const useVideos = () => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error('useVideos debe ser usado dentro de un VideosProvider');
  }
  return context;
}; 
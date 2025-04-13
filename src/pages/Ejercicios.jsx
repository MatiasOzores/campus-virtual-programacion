import React from "react";
import { Link } from "react-router-dom";
import "./Ejercicios.css";

const unidades = [
  { 
    id: 1, 
    nombre: "Estructuras de Control", 
    descripcion: "Aprende a controlar el flujo de tu programa con condicionales y bucles."
  },
  { 
    id: 2, 
    nombre: "Arreglos", 
    descripcion: "Domina el manejo de colecciones de datos y operaciones con arrays."
  },
  { 
    id: 3, 
    nombre: "Métodos", 
    descripcion: "Crea y utiliza métodos para organizar y reutilizar tu código."
  },
  { 
    id: 4, 
    nombre: "POO y Clases", 
    descripcion: "Introducción a la Programación Orientada a Objetos y diseño de clases."
  },
  { 
    id: 5, 
    nombre: "Hilos y aplicaciones", 
    descripcion: "Explora la programación concurrente y el manejo de hilos."
  },
  { 
    id: 6, 
    nombre: "Multithreading", 
    descripcion: "Profundiza en la programación multihilo y sincronización."
  },
  { 
    id: 7, 
    nombre: "Neworking", 
    descripcion: "Aprende sobre comunicación en red y protocolos de red."
  }
];

const Ejercicios = () => {
  return (
    <div className="ejercicios-wrapper">
      <div className="ejercicios-header">
        <h1>
          Unidades de Ejercicios
        </h1>
        <p className="ejercicios-subtitle">
          Selecciona una unidad para comenzar a practicar y mejorar tus habilidades de programación
        </p>
      </div>

      <div className="ejercicios-grid">
        {unidades.map((unidad) => (
          <Link 
            key={unidad.id} 
            to={`/ejercicios/unidad/${unidad.id}`} 
            className="unidad-card"
          >
            <div className="unidad-content">
              <div className="unidad-header">
                <h2>Unidad {unidad.id}</h2>
              </div>
              <p className="unidad-nombre">{unidad.nombre}</p>
              <p className="unidad-descripcion">{unidad.descripcion}</p>
              <div className="unidad-footer">
                <span className="unidad-estado">Comenzar</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Ejercicios;

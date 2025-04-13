import React from 'react';
import { FaBrain, FaTools, FaRocket, FaGraduationCap, FaBook, FaChartLine, FaLinkedin, FaGithub, FaFolder, FaPlay, FaCode, FaMap, FaUsers, FaLightbulb, FaChartBar, FaMapSigns, FaBookOpen } from 'react-icons/fa';
import './Sobre.css';

const Sobre = () => {
  return (
    <div className="sobre-container">
      <div className="sobre-header">
        <h1>Sobre la Página</h1>
        <p className="subtitle">Conoce la motivación y el estado actual del proyecto</p>
      </div>

      <div className="sobre-content">
        <section className="motivacion-section">
          <div className="section-header">
            <FaBrain className="section-icon" />
            <h2>Motivación del Proyecto</h2>
          </div>
          
          <div className="motivacion-content">
            <div className="motivacion-card">
              <FaGraduationCap className="card-icon" />
              <h3>Desafío Académico</h3>
              <p>Esta página se creo a partir de todos los recursos que fue dando el profesor Pablo Jasinski en la materia Programación sobre Redes, conocida por su alto nivel de exigencia y complejidad.</p>
            </div>

            <div className="motivacion-card">
              <FaBook className="card-icon" />
              <h3>Centralización de Recursos</h3>
              <p>Mi objetivo principal es centralizar todos los recursos necesarios para la materia: videos de su canal de youtube, apuntes que sube al Discord y ejercicios prácticos (disponibles en sus guías), todo en un solo lugar accesible y organizado.</p>
            </div>

            <div className="motivacion-card">
              <FaRocket className="card-icon" />
              <h3>Experiencia Interactiva</h3>
              <p>La página ofrece un sistema completo de aprendizaje con ejercicios prácticos, seguimiento de progreso por unidad, visualización de materiales multimedia y un roadmap interactivo que guía el aprendizaje de la materia de manera estructurada y eficiente.</p>
            </div>
          </div>
        </section>

        <section className="estado-section">
          <div className="section-header">
            <FaTools className="section-icon" />
            <h2>Estado Actual del Proyecto</h2>
          </div>

          <div className="estado-content">
            <div className="estado-card">
              <h3>Funcionalidades Implementadas</h3>
              <ul>
                <li><FaFolder className="list-icon" /> Sistema de Materiales organizado por unidades</li>
                <li><FaPlay className="list-icon" /> Visualización de videos y PDFs</li>
                <li><FaChartLine className="list-icon" /> Seguimiento de progreso por unidad</li>
                <li><FaCode className="list-icon" /> Sistema de ejercicios prácticos</li>
                <li><FaMap className="list-icon" /> Roadmap de aprendizaje</li>
              </ul>
            </div>

            <div className="estado-card">
              <h3>Planes a futuro...</h3>
              <ul>
                <li><FaUsers className="list-icon" /> Mejorar sistema de usuarios</li>
                <li><FaLightbulb className="list-icon" /> Apartado de tips: cosas que te enteras solo asistiendo a la materia</li>
                <li><FaChartBar className="list-icon" /> Panel de estadísticas más avanzado</li>
                <li><FaMapSigns className="list-icon" /> Terminar de estructurar Roadmap de aprendizaje</li>
                <li><FaBookOpen className="list-icon" /> Agregar lo que falte de materiales</li>
              </ul>
            </div>
          </div>

          <div className="estado-badge">
            <FaChartLine className="badge-icon" />
            <span>Estado de la plataforma: Beta Activa</span>
            <p>Actualmente estoy cursando, a medida que avanzo en la materia, iré agregando más contenido y mejorando la plataforma.</p>
          </div>
        </section>
      </div>

      <footer className="sobre-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Desarrollado por</h3>
            <p className="developer-name">Matías Ozores</p>
            <p className="footer-description">Técnico en Computación</p>
          </div>
          
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/mat%C3%ADas-ozores-57795030a/" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaLinkedin className="social-icon" />
              LinkedIn
            </a>
            <a href="https://github.com/matiasozores" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaGithub className="social-icon" />
              GitHub
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Simulación de Campus Virtual para la materia Programación sobre Redes - Profesor: Pablo Jasinski</p>
        </div>
      </footer>
    </div>
  );
};

export default Sobre; 
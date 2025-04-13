import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar-display">
              <span className="avatar-emoji">🚧</span>
            </div>
          </div>
          <h2>Perfil en Desarrollo</h2>
          <p className="user-email">Funcionalidades próximamente</p>
        </div>

        <div className="coming-soon-content">
          <h3>¡Estamos trabajando en ello!</h3>          
          
          <p className="beta-notice">
            Esta es una versión beta de la aplicación. A futuro se agregarán más funcionalidades...
          </p>

          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
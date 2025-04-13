import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Cargar datos de progreso del usuario actual
  const [userProgress, setUserProgress] = useState(() => {
    if (!user) return {};
    const savedProgress = localStorage.getItem(`progress_${user.username}`);
    return savedProgress ? JSON.parse(savedProgress) : {
      ejerciciosCompletados: {},
      videosVistos: {}
    };
  });

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Guardar usuario actual en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Guardar progreso del usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem(`progress_${user.username}`, JSON.stringify(userProgress));
    }
  }, [userProgress, user]);

  const login = async (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    setUser(user);
    return user;
  };

  const register = async (username, password) => {
    if (users.some(u => u.username === username)) {
      throw new Error('El usuario ya existe');
    }
    const newUser = {
      username,
      password,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    users,
    userProgress,
    login,
    register,
    logout,
    isAuthenticated,
    setUserProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

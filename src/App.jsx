import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EjerciciosProvider } from "./context/EjerciciosContext";
import { ThemeProvider } from "./context/ThemeContext";
import { VideosProvider } from "./context/VideosContext";
import Navbar from "./components/Navbar"; // ✅ Nuevo Navbar
import Home from "./pages/Home";
import Estrategias from "./pages/Estrategias";
import Foro from "./pages/Foro";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ejercicios from "./pages/Ejercicios";
import Unidad from "./pages/ejercicios/Unidad";
import Ejercicio from "./pages/ejercicios/Ejercicio";
import Materiales from "./pages/Materiales";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import Sobre from "./pages/Sobre";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EjerciciosProvider>
          <VideosProvider>
            <Router>
              <Navbar /> {/* ✅ Usa el nuevo Navbar aquí */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/#/" element={<Home />} />
                <Route path="/#/estrategias" element={<Estrategias />} />
                <Route path="/#/foro" element={<Foro />} />
                <Route path="/#/contacto" element={<Contacto />} />
                <Route path="/#/login" element={<Login />} />
                <Route path="/#/register" element={<Register />} />
                <Route path="/#/ejercicios" element={<PrivateRoute><Ejercicios /></PrivateRoute>} />
                <Route path="/#/ejercicios/unidad/:unidadId" element={<PrivateRoute><Unidad /></PrivateRoute>} />
                <Route path="/#/ejercicios/unidad/:unidadId/ejercicio/:ejercicioId" element={<PrivateRoute><Ejercicio /></PrivateRoute>} />
                <Route path="/#/materiales" element={<PrivateRoute><Materiales /></PrivateRoute>} />
                <Route path="/#/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
                <Route path="/#/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/#/sobre" element={<Sobre />} />
              </Routes>
            </Router>
          </VideosProvider>
        </EjerciciosProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

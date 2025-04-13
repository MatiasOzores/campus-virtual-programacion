import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Foro = () => {
  const { user } = useContext(AuthContext);
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);

  // Cargar comentarios desde Local Storage
  useEffect(() => {
    const savedComentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    setComentarios(savedComentarios);
  }, []);

  // Guardar comentarios en Local Storage cada vez que se actualizan
  useEffect(() => {
    localStorage.setItem("comentarios", JSON.stringify(comentarios));
  }, [comentarios]);

  const handlePublicar = () => {
    if (comentario.trim() && user) {
      const nuevoComentario = {
        id: Date.now(),
        autor: user,
        texto: comentario,
        fecha: new Date().toLocaleString(),
        likes: 0,
        respuestas: [],
      };
      setComentarios([nuevoComentario, ...comentarios]);
      setComentario(""); // Limpiar el textarea
    }
  };

  const handleLike = (id) => {
    setComentarios(comentarios.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleResponder = (id, respuesta) => {
    if (!respuesta.trim() || !user) return;

    setComentarios(comentarios.map(c => 
      c.id === id 
        ? { ...c, respuestas: [...c.respuestas, { autor: user, texto: respuesta, fecha: new Date().toLocaleString() }] } 
        : c
    ));
  };

  return (
    <div className="container">
      <h1>💬 Foro de Discusión</h1>

      {user ? (
        <>
          <textarea
            placeholder="Escribe tu comentario aquí..."
            rows="4"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            style={{ width: "100%", marginTop: "10px" }}
          ></textarea>
          <button onClick={handlePublicar} style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}>
            Publicar
          </button>
        </>
      ) : (
        <p>🔒 Debes <strong>iniciar sesión</strong> para comentar.</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3>📝 Comentarios:</h3>
        {comentarios.length === 0 ? (
          <p>No hay comentarios aún. Sé el primero en participar.</p>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <p><strong>{c.autor}</strong> - <small>{c.fecha}</small></p>
              <p>{c.texto}</p>
              <button onClick={() => handleLike(c.id)} style={{ marginRight: "10px" }}>👍 {c.likes}</button>
              
              <Responder comentarioId={c.id} handleResponder={handleResponder} />

              {c.respuestas.length > 0 && (
                <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                  <h4>Respuestas:</h4>
                  {c.respuestas.map((r, index) => (
                    <div key={index} style={{ borderLeft: "2px solid #ddd", paddingLeft: "10px", marginBottom: "5px" }}>
                      <p><strong>{r.autor}</strong> - <small>{r.fecha}</small></p>
                      <p>{r.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Componente de Responder
const Responder = ({ comentarioId, handleResponder }) => {
  const [respuesta, setRespuesta] = useState("");

  const handleSubmit = () => {
    handleResponder(comentarioId, respuesta);
    setRespuesta("");
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <textarea
        placeholder="Responder..."
        rows="2"
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        style={{ width: "100%" }}
      ></textarea>
      <button onClick={handleSubmit} style={{ marginTop: "5px", padding: "5px 10px", cursor: "pointer" }}>
        Responder
      </button>
    </div>
  );
};

export default Foro;

import { startTransition, useEffect, useState } from "react";

const API_URL = "/api/comments";

function Comentario() {
  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [novoComentario, setNovoComentario] = useState({ nome: "", texto: "" });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarComentarios = async () => {
    try {
      const response = await fetch(API_URL, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "comments-unavailable");
      }
      if (!Array.isArray(data.results)) {
        throw new Error("invalid-comments-response");
      }

      const ordenados = [...data.results].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      startTransition(() => {
        setComentarios(ordenados);
        setErro("");
      });
      return true;
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
      startTransition(() => {
        setErro("Não foi possível carregar os comentários agora.");
      });
      return false;
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarComentarios();
  }, []);

  const comentariosVisiveis = mostrarTodos
    ? comentarios
    : comentarios.slice(0, 6);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nome = novoComentario.nome.trim();
    const texto = novoComentario.texto.trim();

    if (!nome || !texto) {
      setErro("Preencha seu nome e escreva um comentário antes de enviar.");
      return;
    }

    setEnviando(true);
    setErro("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, texto }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "comment-unavailable");
      }

      setNovoComentario({ nome: "", texto: "" });
      const recarregado = await carregarComentarios();
      setErro(
        recarregado
          ? "Comentário adicionado com sucesso."
          : "Comentário publicado, mas não foi possível atualizar a lista.",
      );
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      setErro("Não foi possível adicionar o comentário agora.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      className="comentarios-section"
      aria-labelledby="comentarios-title"
    >
      <div className="comentarios-heading">
        <div>
          <p className="section-kicker">Vozes dos leitores</p>
          <h2 id="comentarios-title">Comentários</h2>
        </div>
        <span className="comentarios-count">
          {comentarios.length}{" "}
          {comentarios.length === 1 ? "comentário" : "comentários"}
        </span>
      </div>

      {erro && (
        <p className="comment-status" role="status">
          {erro}
        </p>
      )}

      <form className="comentario-form" onSubmit={handleSubmit}>
        <div className="comment-form-fields">
          <label htmlFor="comentario-nome">
            Seu nome
            <input
              id="comentario-nome"
              type="text"
              placeholder="Como podemos chamar você?"
              maxLength="80"
              required
              value={novoComentario.nome}
              onChange={(event) =>
                setNovoComentario((prev) => ({
                  ...prev,
                  nome: event.target.value,
                }))
              }
            />
          </label>
          <label htmlFor="comentario-texto">
            Seu comentário
            <textarea
              id="comentario-texto"
              rows="4"
              placeholder="Compartilhe sua impressão sobre a história..."
              maxLength="1000"
              required
              value={novoComentario.texto}
              onChange={(event) =>
                setNovoComentario((prev) => ({
                  ...prev,
                  texto: event.target.value,
                }))
              }
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Publicar comentário"}
        </button>
      </form>

      <div className="comentarios-list">
        {carregando ? (
          <p className="comments-empty">Carregando comentários...</p>
        ) : comentariosVisiveis.length > 0 ? (
          comentariosVisiveis.map((comentario) => (
            <article
              key={comentario.objectId || comentario.createdAt}
              className="comentario-item"
            >
              <div className="comment-author">
                <span className="comment-avatar" aria-hidden="true">
                  {(comentario.nome || "L").charAt(0).toUpperCase()}
                </span>
                <h4>{comentario.nome}</h4>
              </div>
              <p>{comentario.texto}</p>
            </article>
          ))
        ) : !erro ? (
          <p className="comments-empty">
            Ainda não há comentários. Seja o primeiro a compartilhar uma
            impressão.
          </p>
        ) : null}
      </div>

      {comentarios.length > 6 && (
        <div className="comments-actions">
          <button
            type="button"
            className="comments-toggle"
            onClick={() => setMostrarTodos((val) => !val)}
            aria-expanded={mostrarTodos}
          >
            <span>{mostrarTodos ? "Ver menos" : "Ver todos"}</span>
            <span aria-hidden="true">{mostrarTodos ? "↑" : "↓"}</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default Comentario;

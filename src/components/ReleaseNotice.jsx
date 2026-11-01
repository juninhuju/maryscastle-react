import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const API_URL = "/classes/AvisoLancamento";
const apiConfigured = Boolean(
  import.meta.env.VITE_PARSE_APP_ID && import.meta.env.VITE_PARSE_JS_KEY,
);

function ReleaseNotice({ children, className = "" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const openNotice = () => {
    document.getElementById("release-notice")?.showModal();
  };

  const closeOnBackdrop = (event) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!apiConfigured) {
      setStatus({
        type: "error",
        message: "O cadastro está temporariamente indisponível.",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setSubmitting(true);
    setStatus(null);

    try {
      await axios.post(API_URL, {
        email: normalizedEmail,
        consentimento: true,
        origem: window.location.pathname,
      });
      setEmail(normalizedEmail);
      setStatus({
        type: "success",
        message: "Cadastro confirmado. Avisaremos você quando o livro for lançado.",
      });
    } catch (error) {
      console.error("Erro ao registrar aviso de lançamento:", error);
      const apiError = error.response?.data;
      const alreadyRegistered =
        apiError?.code === 137 ||
        (typeof apiError?.error === "string" &&
          apiError.error.toLowerCase().includes("unique"));
      setStatus({
        type: alreadyRegistered ? "already-registered" : "error",
        message: alreadyRegistered
          ? "Este e-mail já está na lista. Você receberá o aviso quando o livro for lançado."
          : "Não foi possível registrar seu e-mail agora. Tente novamente mais tarde.",
      });
      if (alreadyRegistered) {
        setEmail(normalizedEmail);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={openNotice}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      <dialog
        id="release-notice"
        className="release-notice"
        aria-labelledby="release-notice-title"
        onClick={closeOnBackdrop}
      >
        <div className="release-notice-content">
          <button
            type="button"
            className="release-notice-close"
            onClick={() =>
              document.getElementById("release-notice")?.close()
            }
            aria-label="Fechar aviso"
            autoFocus
          >
            ×
          </button>
          <p className="section-kicker">Em breve</p>
          <h2 id="release-notice-title">O livro ainda não está à venda</h2>
          <p>
            Deixe seu e-mail e avisaremos quando{" "}
            <em>O Castelo das Marias</em> estiver disponível.
          </p>
          {apiConfigured ? (
            <form className="release-notice-form" onSubmit={handleSubmit}>
              <label htmlFor="release-notice-email">Seu e-mail</label>
              <input
                id="release-notice-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                placeholder="voce@exemplo.com"
                required
                disabled={submitting || status?.type === "success"}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setStatus(null);
                }}
              />
              <label className="release-notice-consent">
                <input
                  type="checkbox"
                  required
                  disabled={submitting || status?.type === "success"}
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    setStatus(null);
                  }}
                />
                <span>
                  Aceito receber um e-mail sobre o lançamento. Posso pedir a
                  remoção do meu cadastro pelo contato informado no rodapé.
                </span>
              </label>
              <button
                type="submit"
                className="purchase-button release-notice-submit"
                disabled={submitting || status?.type === "success"}
              >
                {submitting
                  ? "Cadastrando..."
                  : status?.type === "success"
                    ? "Cadastro confirmado"
                    : "Avisem-me do lançamento"}
              </button>
              {status && (
                <div
                  className={`release-notice-status ${status.type}`}
                  role={
                    status.type === "error" ? "alert" : "status"
                  }
                >
                  <span aria-hidden="true">
                    {status.type === "success"
                      ? "✓"
                      : status.type === "already-registered"
                        ? "i"
                        : "!"}
                  </span>
                  <p>{status.message}</p>
                </div>
              )}
            </form>
          ) : (
            <div className="release-notice-status error" role="status">
              <span aria-hidden="true">!</span>
              <p>
                O cadastro por e-mail está temporariamente indisponível. Você
                ainda pode acompanhar as redes sociais.
              </p>
            </div>
          )}
          <Link className="release-notice-reading-link" to="/livro">
            Enquanto isso, leia os quatro primeiros capítulos grátis
          </Link>
          <div className="release-notice-links">
            <a
              href="https://www.instagram.com/ocastelodasmarias/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@ocastelodasmariaslivro/"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default ReleaseNotice;

import { useState } from "react";

function ReleaseNotice({ children, className = "", standalone = false }) {
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

  const Heading = standalone ? "h1" : "h2";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!consent) return;

    const normalizedEmail = email.trim().toLowerCase();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/book-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          consentimento: true,
          origem: window.location.pathname,
        }),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("invalid-registration-response");
      }
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "registration-failed");
      }

      setEmail(normalizedEmail);
      setStatus({
        type: result.alreadyRegistered ? "already-registered" : "success",
        message: result.alreadyRegistered
          ? "Este e-mail já está cadastrado."
          : "Pronto! Você será avisado.",
      });
    } catch (error) {
      console.error("Erro ao registrar interesse no livro:", error);
      setStatus({
        type: "error",
        message: "Não foi possível cadastrar. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="release-notice-content">
      {!standalone && (
        <button
          type="button"
          className="release-notice-close"
          onClick={() => document.getElementById("release-notice")?.close()}
          aria-label="Fechar aviso"
        >
          ×
        </button>
      )}
      <p className="section-kicker">O Castelo das Marias</p>
      <Heading id={standalone ? "purchase-page-title" : "release-notice-title"}>
        Receba o aviso de lançamento
      </Heading>
      <p className="release-notice-description">
        O livro ainda não está à venda. Deixe seu e-mail para saber quando
        estiver disponível.
      </p>
      <form className="release-notice-form" onSubmit={handleSubmit}>
        <label htmlFor={standalone ? "purchase-email" : "release-notice-email"}>
          Seu e-mail
        </label>
        <input
          id={standalone ? "purchase-email" : "release-notice-email"}
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
          <span>Quero receber o aviso de lançamento por e-mail.</span>
        </label>
        <button
          type="submit"
          className="purchase-button release-notice-submit"
          disabled={!consent || submitting || status?.type === "success"}
        >
          {submitting
            ? "Enviando..."
            : status?.type === "success"
              ? "Cadastro confirmado"
              : "Quero ser avisado"}
        </button>
        {status && (
          <div
            className={`release-notice-status ${status.type}`}
            role={status.type === "error" ? "alert" : "status"}
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
    </div>
  );

  if (standalone) {
    return (
      <main className="purchase-page" aria-labelledby="purchase-page-title">
        <section className="purchase-page-panel">{content}</section>
      </main>
    );
  }

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
        {content}
      </dialog>
    </>
  );
}

export default ReleaseNotice;

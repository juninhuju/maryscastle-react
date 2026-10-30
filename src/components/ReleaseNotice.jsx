function ReleaseNotice({ children, className = "" }) {
  const openNotice = () => {
    document.getElementById("release-notice")?.showModal();
  };

  const closeOnBackdrop = (event) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
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
            Acompanhe as redes sociais para receber novidades sobre o lançamento
            de <em>O Castelo das Marias</em>.
          </p>
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

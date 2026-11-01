import { useEffect, useState, useSyncExternalStore } from "react";
import { Link, useParams } from "react-router-dom";
import capitulos from "../data/capitulos.json";
import ReleaseNotice from "../components/ReleaseNotice";
import NotFoundPage from "./NotFoundPage";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
    </svg>
  );
}

const PREFERENCIAS_LEITURA_KEY = "castelo-das-marias-preferencias-leitura";
const PREFERENCIAS_LEITURA_EVENTO = "preferencias-leitura-alteradas";
const PREFERENCIAS_LEITURA_PADRAO = JSON.stringify({
  fontSize: 1.1,
  theme: "dark",
});
let preferenciasLeituraEmMemoria = PREFERENCIAS_LEITURA_PADRAO;

function obterSnapshotPreferencias() {
  if (typeof window === "undefined") {
    return PREFERENCIAS_LEITURA_PADRAO;
  }

  try {
    return (
      window.localStorage.getItem(PREFERENCIAS_LEITURA_KEY) ||
      preferenciasLeituraEmMemoria
    );
  } catch (error) {
    console.error("Não foi possível carregar as preferências de leitura.", error);
    return preferenciasLeituraEmMemoria;
  }
}

function assinarPreferencias(callback) {
  window.addEventListener(PREFERENCIAS_LEITURA_EVENTO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PREFERENCIAS_LEITURA_EVENTO, callback);
    window.removeEventListener("storage", callback);
  };
}

function salvarPreferencias(preferencias) {
  const snapshot = JSON.stringify(preferencias);
  preferenciasLeituraEmMemoria = snapshot;

  try {
    window.localStorage.setItem(PREFERENCIAS_LEITURA_KEY, snapshot);
  } catch (error) {
    console.error("Não foi possível salvar as preferências de leitura.", error);
  }

  window.dispatchEvent(new Event(PREFERENCIAS_LEITURA_EVENTO));
}

function interpretarPreferencias(snapshot) {
  try {
    const preferencias = JSON.parse(snapshot);
    const fontSize = Number(preferencias.fontSize);

    return {
      fontSize:
        Number.isFinite(fontSize) && fontSize >= 0.9 && fontSize <= 1.5
          ? fontSize
          : 1.1,
      theme: preferencias.theme === "light" ? "light" : "dark",
    };
  } catch (error) {
    console.error("As preferências de leitura salvas são inválidas.", error);
    return { fontSize: 1.1, theme: "dark" };
  }
}

function LivroPage() {
  const { chapter: chapterParam = "1" } = useParams();
  const chapterNumber = Number(chapterParam);
  const chapter = capitulos.find((item) => item.number === chapterNumber);
  const preferenciasSnapshot = useSyncExternalStore(
    assinarPreferencias,
    obterSnapshotPreferencias,
    () => PREFERENCIAS_LEITURA_PADRAO,
  );
  const preferencias = interpretarPreferencias(preferenciasSnapshot);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { fontSize, theme } = preferencias;

  const setPreferencias = (atualizar) => {
    salvarPreferencias(
      typeof atualizar === "function" ? atualizar(preferencias) : atualizar,
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        totalHeight > 0
          ? Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
          : 0,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [chapterNumber]);

  if (!chapter) {
    return <NotFoundPage />;
  }

  const controlTextColor = "var(--lightbeige)";

  return (
    <main className={`container-fluid livro-page theme-${theme}`}>
      <div
        className="reading-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Progresso da leitura do capítulo"
      />

      <p className="section-kicker page-kicker">Leitura imersiva</p>
      <h1 className="chapter-heading">
        <span className="chapter-heading-label">Capítulo {chapter.number}</span>
        <span className="chapter-heading-title">{chapter.title}</span>
      </h1>

      <p className="chapter-free-intro">
        Os quatro primeiros capítulos estão disponíveis gratuitamente. Escolha
        por onde continuar:
      </p>
      <nav className="chapter-index" aria-label="Capítulos gratuitos">
        {capitulos.map((item) => (
          <Link
            key={item.number}
            className="chapter-index-link"
            to={item.number === 1 ? "/livro" : `/livro/${item.number}`}
            aria-current={item.number === chapter.number ? "page" : undefined}
          >
            <span>Capítulo {item.number}</span>
            <strong>{item.title}</strong>
          </Link>
        ))}
      </nav>

      <div className="reading-meta">
        <div className="reading-controls" aria-label="Ajustes de leitura">
          <div
            className="font-controls"
            role="group"
            aria-label="Tamanho da fonte"
          >
            <button
              type="button"
              className="ctrl-btn"
              style={{ color: controlTextColor }}
              onClick={() =>
                setPreferencias((current) => ({
                  ...current,
                  fontSize: Number(Math.max(0.9, current.fontSize - 0.1).toFixed(1)),
                }))
              }
              aria-label="Diminuir fonte"
              disabled={fontSize <= 0.9}
            >
              A−
            </button>
            <button
              type="button"
              className="ctrl-btn"
              style={{ color: controlTextColor }}
              onClick={() =>
                setPreferencias((current) => ({ ...current, fontSize: 1.1 }))
              }
              aria-label="Restaurar tamanho padrão da fonte"
              title="Restaurar tamanho padrão da fonte"
            >
              Padrão
            </button>
            <button
              type="button"
              className="ctrl-btn"
              style={{ color: controlTextColor }}
              onClick={() =>
                setPreferencias((current) => ({
                  ...current,
                  fontSize: Number(Math.min(1.5, current.fontSize + 0.1).toFixed(1)),
                }))
              }
              aria-label="Aumentar fonte"
              disabled={fontSize >= 1.5}
            >
              A+
            </button>
          </div>

          <div className="theme-controls" role="group" aria-label="Tema visual de leitura">
            <button
              type="button"
              className={`ctrl-btn ${theme === "dark" ? "active" : ""}`}
              style={{ color: controlTextColor }}
              onClick={() =>
                setPreferencias((current) => ({ ...current, theme: "dark" }))
              }
              aria-pressed={theme === "dark"}
            >
              Escuro
            </button>
            <button
              type="button"
              className={`ctrl-btn ${theme === "light" ? "active" : ""}`}
              style={{ color: controlTextColor }}
              onClick={() =>
                setPreferencias((current) => ({ ...current, theme: "light" }))
              }
              aria-pressed={theme === "light"}
            >
              Claro
            </button>
          </div>
        </div>
      </div>

      <div className="chapter-download-row">
        <a
          className="chapter-download"
          href="/capitulos"
          download="O-Castelo-das-Marias-Capitulos-1-a-4.pdf"
          aria-label="Baixar os quatro primeiros capítulos em PDF"
        >
          <DownloadIcon />
          <span>Baixar capítulos 1–4 (PDF)</span>
        </a>
      </div>

      <article
        className="capitulo"
        style={{ "--reader-font-size": `${fontSize}rem` }}
      >
        {chapter.paragraphs.map((paragraph, index) => (
          <p
            key={`${chapter.number}-${index}`}
            className={paragraph.startsWith("—") ? "dialogue-line" : undefined}
          >
            {paragraph}
          </p>
        ))}
      </article>

      {chapter.number === capitulos.length && (
        <section className="chapter-end-cta">
          <p className="section-kicker">A jornada continua</p>
          <h2>Qual caminho você seguirá agora?</h2>
          <p>
            Explore os reinos que cercam Joaquim ou descubra qual deles combina
            com suas escolhas.
          </p>
          <div className="chapter-end-actions">
            <ReleaseNotice className="btn purchase-button chapter-end-purchase">
              Comprar o livro
            </ReleaseNotice>
            <Link to="/reinos" className="btn btn-secondary">
              Conhecer os reinos
            </Link>
            <Link to="/quiz" className="btn btn-primary">
              Fazer o quiz
            </Link>
          </div>
        </section>
      )}

      <nav className="chapter-navigation" aria-label="Navegação entre capítulos">
        {chapter.number > 1 && (
          <Link
            className="chapter-navigation-link chapter-previous"
            to={chapter.number === 2 ? "/livro" : `/livro/${chapter.number - 1}`}
          >
            <span aria-hidden="true">←</span> Capítulo anterior
          </Link>
        )}
        {chapter.number < capitulos.length && (
          <Link
            className="chapter-navigation-link chapter-next"
            to={`/livro/${chapter.number + 1}`}
          >
            Próximo capítulo <span aria-hidden="true">→</span>
          </Link>
        )}
      </nav>
    </main>
  );
}

export default LivroPage;

import { useEffect, useState } from "react";
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

function LivroPage() {
  const { chapter: chapterParam = "1" } = useParams();
  const chapterNumber = Number(chapterParam);
  const chapter = capitulos.find((item) => item.number === chapterNumber);
  const [fontSize, setFontSize] = useState(1.1);
  const [theme, setTheme] = useState("dark");
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const controlTextColor =
    theme === "dark" ? "var(--lightbeige)" : "var(--surface-wine)";

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
                setFontSize((size) => Number(Math.max(0.9, size - 0.1).toFixed(1)))
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
              onClick={() => setFontSize(1.1)}
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
                setFontSize((size) => Number(Math.min(1.5, size + 0.1).toFixed(1)))
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
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
            >
              Escuro
            </button>
            <button
              type="button"
              className={`ctrl-btn ${theme === "light" ? "active" : ""}`}
              style={{ color: controlTextColor }}
              onClick={() => setTheme("light")}
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
          href="/Cap1a4"
          download="O-Castelo-das-Marias-Capitulos-1-a-4.pdf"
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

      <nav className="chapter-navigation" aria-label="Navegação entre capítulos">
        {chapter.number > 1 && (
          <Link
            className="chapter-navigation-link chapter-previous"
            to={chapter.number === 2 ? "/livro" : `/livro/${chapter.number - 1}`}
          >
            <span aria-hidden="true">←</span> Capítulo anterior
          </Link>
        )}
        {chapter.number < capitulos.length ? (
          <Link
            className="chapter-navigation-link chapter-next"
            to={`/livro/${chapter.number + 1}`}
          >
            Próximo capítulo <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <ReleaseNotice className="chapter-navigation-link chapter-next purchase-button">
            Comprar o livro
            <span aria-hidden="true">→</span>
          </ReleaseNotice>
        )}
      </nav>
    </main>
  );
}

export default LivroPage;

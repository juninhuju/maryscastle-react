import { useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <header className="site-header">
      <div className="navbar container-fluid">
        <Link to="/" className="brand-link">
          <span className="brand-title">O Castelo das Marias</span>
          <span className="brand-subtitle">um romance sobrenatural</span>
        </Link>

        <nav className="nav-links" aria-label="Navegação principal">
          <NavLink to="/" className="nav-link">
            Início
          </NavLink>
          <NavLink to="/livro" className="nav-link">
            Capítulo
          </NavLink>
          <NavLink to="/quiz" className="nav-link">
            Quiz
          </NavLink>
          <NavLink to="/downloads" className="nav-link">
            Materiais
          </NavLink>
          <NavLink to="/galeria" className="nav-link">
            Imagens
          </NavLink>
          <NavLink to="/autor" className="nav-link">
            Autor
          </NavLink>
          <NavLink to="/reinos" className="nav-link">
            Reinos
          </NavLink>
        </nav>

        <div className="audio-wrapper">
          <audio
            ref={audioRef}
            src="/magoaremix.mp3"
            preload="none"
            onEnded={() => setIsPlaying(false)}
          />
          <button
            type="button"
            className={`audio-toggle-btn ${isPlaying ? "playing" : ""}`}
            onClick={toggleAudio}
            aria-label={
              isPlaying
                ? "Pausar trilha sonora oficial"
                : "Tocar trilha sonora oficial"
            }
            title={
              isPlaying ? "Pausar trilha sonora" : "Tocar trilha sonora oficial"
            }
          >
            <span className="audio-icon" aria-hidden="true">
              {isPlaying ? "⏸️" : "🎵"}
            </span>
            <span className="audio-status-text">
              {isPlaying ? "Pausar Trilha" : "Trilha Sonora"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

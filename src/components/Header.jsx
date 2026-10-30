import { Link, NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="site-header">
      <div className="navbar container-fluid">
        <Link to="/" className="brand-link">
          <span className="brand-title">O Castelo das Marias</span>
          <span className="brand-subtitle">um romance sobrenatural</span>
        </Link>

        <nav className="nav-links" aria-label="Navegação principal">
          <NavLink
            to="/"
            end
            className="nav-link home-nav-link"
            aria-label="Página inicial"
            title="Início"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
            </svg>
            <span className="sr-only">Início</span>
          </NavLink>
          <NavLink to="/livro" className="nav-link">
            Capítulo
          </NavLink>
          <NavLink to="/quiz" className="nav-link">
            Quiz
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
      </div>
    </header>
  );
}

export default Header;

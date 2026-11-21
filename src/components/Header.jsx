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
            className="nav-link nav-link-home"
            aria-label="Início"
            title="Início"
          >
            <svg
              className="nav-home-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5.5 9.5V20h13V9.5" />
              <path d="M9.5 20v-6h5v6" />
            </svg>
            <span className="sr-only">Início</span>
          </NavLink>
          <NavLink to="/livro/" className="nav-link nav-link-reading">
            Ler grátis
          </NavLink>
          <NavLink to="/quiz/" className="nav-link">
            Quiz
          </NavLink>
          <NavLink to="/reinos/" className="nav-link">
            Reinos
          </NavLink>
          <NavLink to="/galeria/" className="nav-link">
            Galeria
          </NavLink>
          <NavLink to="/autor/" className="nav-link">
            Autor
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;

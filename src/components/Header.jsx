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
          <NavLink to="/" end className="nav-link">
            Início
          </NavLink>
          <NavLink to="/livro" className="nav-link nav-link-reading">
            Ler grátis
          </NavLink>
          <NavLink to="/quiz" className="nav-link">
            Quiz
          </NavLink>
          <NavLink to="/reinos" className="nav-link">
            Reinos
          </NavLink>
          <NavLink to="/galeria" className="nav-link">
            Imagens
          </NavLink>
          <NavLink to="/autor" className="nav-link">
            Autor
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container-fluid">
        <div className="footer-identity">
          <span className="footer-kicker">Entre no universo</span>
          <strong>O Castelo das Marias</strong>
          <span>Fantasia, mistério e o abismo da alma.</span>
        </div>
        <nav className="footer-links" aria-label="Redes sociais e contato">
            <a
              className="footer-link"
              href="https://www.instagram.com/ocastelodasmarias/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram: @ocastelodasmarias"
              title="Instagram: @ocastelodasmarias"
            >
              <svg className="footer-icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="footer-icon-dot" cx="18" cy="6" r="1" />
              </svg>
            </a>
            <a
              className="footer-link"
              href="https://www.tiktok.com/@ocastelodasmariaslivro/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok: @ocastelodasmariaslivro"
              title="TikTok: @ocastelodasmariaslivro"
            >
              <svg
                className="footer-icon footer-icon-tiktok"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19.6 8.1a7.1 7.1 0 0 1-4.3-1.4v8.1a6.1 6.1 0 1 1-5.3-6.1v3.4a2.8 2.8 0 1 0 1.9 2.7V2.5h3.4c.2 2.4 1.8 4.3 4.3 4.6v3.4Z" />
              </svg>
            </a>
            <a
              className="footer-link"
              href="mailto:ocastelodasmarias@gmail.com"
              aria-label="Enviar e-mail para ocastelodasmarias@gmail.com"
              title="E-mail: ocastelodasmarias@gmail.com"
            >
              <svg className="footer-icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
        </nav>
        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} O Castelo das Marias. Todos os direitos
            reservados.
          </p>
          <span className="footer-credit">Por Junior Cristovam</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

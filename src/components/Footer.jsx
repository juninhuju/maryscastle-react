function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container-fluid">
        <div className="footer-identity">
          <strong>O Castelo das Marias</strong>
          <span>Fantasia, mistério e o abismo da alma.</span>
        </div>
        <div className="footer-links">
          <a
            className="footer-link"
            href="https://www.instagram.com/ocastelodasmarias/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png"
              alt="Instagram"
              className="logo"
              loading="lazy"
              decoding="async"
            />
            <span>@ocastelodasmarias</span>
          </a>
          <a
            className="footer-link"
            href="https://www.tiktok.com/@ocastelodasmariaslivro/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png"
              alt="TikTok"
              className="logo"
              loading="lazy"
              decoding="async"
            />
            <span>@ocastelodasmariaslivro</span>
          </a>
          <a className="footer-link" href="mailto:ocastelodasmarias@gmail.com">
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
              alt="E-mail"
              className="logo"
              loading="lazy"
              decoding="async"
            />
            <span>ocastelodasmarias@gmail.com</span>
          </a>
        </div>
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 Castelo das Marias. Todos os direitos reservados.
          </p>
          <span className="footer-credit">Por Junior Cristovam</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

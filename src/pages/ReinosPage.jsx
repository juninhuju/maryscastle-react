import { Link } from "react-router-dom";
import { reinos } from "../data/reinos";

function ReinosPage() {
  return (
    <main className="container-fluid page-reinos">
      <p className="section-kicker page-kicker">Um universo além do conhecido</p>
      <h1>Os quatro reinos</h1>
      <p className="lead">
        Conheça Lira, Natural, Cemitério e Encruzilhada: os mundos que Joaquim
        atravessa em sua descida ao abismo, confrontando o amor traído, o rancor
        e as leis implacáveis do universo criado por Junior Cristovam.
      </p>
      <section className="kingdoms-directory" aria-label="Lista dos reinos">
        <div className="cards-grid">
          {reinos.map((reino) => (
            <article key={reino.slug} className="reino-card">
              <picture className="card-image-frame">
                <source
                  srcSet={reino.imagemSrc.replace(/\.jpeg$/, ".webp")}
                  type="image/webp"
                />
                <img
                  src={reino.imagemSrc}
                  alt={`Paisagem do Reino ${reino.titulo}`}
                  className="card-img-top"
                  loading="lazy"
                  decoding="async"
                />
                <h2 className="card-image-title">{reino.titulo}</h2>
              </picture>
              <div className="card-body">
                <p className="card-text">{reino.guardiao}</p>
                <p className="card-description">{reino.introducao}</p>
                <Link className="reino-action" to={reino.rota}>
                  <span>Acessar reino</span>
                  <span className="reino-action-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ReinosPage;

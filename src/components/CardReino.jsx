import { Link } from "react-router-dom";

function CardReino({ reino }) {
  const webpSrc = reino.imagemSrc.replace(/\.jpeg$/, ".webp");

  return (
    <article className="reino-card">
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          loading="lazy"
          decoding="async"
          alt={`Imagem do Reino ${reino.titulo} de O Castelo das Marias`}
          className="card-img-top"
          src={reino.imagemSrc}
        />
      </picture>

      <div className="card-body">
        <h4 className="card-title">{reino.titulo}</h4>
        <p className="card-text">{reino.guardiao}</p>
        <Link className="reino-action" to={reino.rota}>
          <span>Descobrir Reino</span>
          <span className="reino-action-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default CardReino;

import { Link } from "react-router-dom";

function CardReino({ reino }) {
  const webpSrc = reino.imagemSrc.replace(/\.jpeg$/, ".webp");

  return (
    <article className="reino-card">
      <picture className="card-image-frame">
        <source srcSet={webpSrc} type="image/webp" />
        <img
          loading="lazy"
          decoding="async"
          alt={`Imagem do Reino ${reino.titulo} de O Castelo das Marias`}
          className="card-img-top"
          src={reino.imagemSrc}
        />
        <h2 className="card-image-title">{reino.titulo}</h2>
      </picture>

      <div className="card-body">
        <p className="card-text">{reino.guardiao}</p>
        <p className="card-description">{reino.introducao}</p>
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

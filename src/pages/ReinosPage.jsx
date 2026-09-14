import { Link } from "react-router-dom";
import { reinos } from "../data/reinos";

function ReinosPage() {
  return (
    <main className="container-fluid page-reinos">
      <h1>
        Os Quatro Reinos | Um mundo Sobrenatural
      </h1>
      <p className="lead">
        Conheça Lira, Natural, Cemitério e Encruzilhada: os quatro planos
        espirituais que Joaquim atravessa em sua descida ao abismo, confrontando
        o amor traído, o rancor e as leis implacáveis do universo criado por
        Junior Cristovam.
      </p>
      <div className="cards-grid">
        {reinos.map((reino) => (
          <article key={reino.slug} className="reino-card">
            <img
              src={reino.imagemSrc}
              alt={reino.titulo}
              className="card-img-top"
            />
            <div className="card-body">
              <h4 className="card-title">{reino.titulo}</h4>
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
    </main>
  );
}

export default ReinosPage;

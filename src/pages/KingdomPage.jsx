import { Link, useParams } from "react-router-dom";
import { reinoMap, reinos } from "../data/reinos";
import NotFoundPage from "./NotFoundPage";

const guardiaoImages = {
  lira: { jpeg: "/guardiao-padilha.jpeg", webp: "/guardiao-padilha.webp" },
  natural: { jpeg: "/guardiao-esdras.jpeg", webp: "/guardiao-esdras.webp" },
  cemiterio: { jpeg: "/guardiao-caveira.jpeg", webp: "/guardiao-caveira.webp" },
  encruzilhada: { jpeg: "/guardiao-sete.jpeg", webp: "/guardiao-sete.webp" },
};

function KingdomPage() {
  const { slug } = useParams();
  const reino = reinoMap[slug];
  const reinoIndex = reinos.findIndex((item) => item.slug === slug);
  const reinoAnterior =
    reinos[(reinoIndex - 1 + reinos.length) % reinos.length];
  const reinoProximo = reinos[(reinoIndex + 1) % reinos.length];

  if (!reino) {
    return <NotFoundPage />;
  }

  return (
    <main className="container-fluid page-reino">
      <Link className="back-link" to="/reinos">
        Voltar para os reinos
      </Link>
      <p className="section-kicker page-kicker">Explore este plano</p>
      <h1>{reino.titulo}</h1>
      <h2>
        {reino.tratamentoGuardiao}: {reino.guardiao}
      </h2>

      <p className="lead">{reino.introducao}</p>

      <div className="kingdom-hero-image">
        <picture>
          <source srcSet={guardiaoImages[reino.slug]?.webp} type="image/webp" />
          <img
            src={guardiaoImages[reino.slug]?.jpeg}
            alt={`${reino.guardiao}, ${reino.tratamentoGuardiao.toLowerCase()} do Reino ${reino.titulo}`}
            className="guardian-image"
          />
        </picture>
      </div>

      <section
        className="kingdom-summary-card"
        aria-label="Ficha canônica do Reino"
      >
        <h3>Resumo Canônico do Reino</h3>
        <dl className="kingdom-specs">
          <div>
            <dt>Líder Supremo:</dt>
            <dd>
              {reino.guardiao} ({reino.tratamentoGuardiao})
            </dd>
          </div>
          <div>
            <dt>Princípios do Reino:</dt>
            <dd>{reino.principios}</dd>
          </div>
          <div>
            <dt>Lema / Máxima:</dt>
            <dd>
              <em>“{reino.citacao}”</em>
            </dd>
          </div>
        </dl>
      </section>

      <article className="kingdom-description">
        {reino.paragrafos.map((paragrafo) => (
          <p key={paragrafo}>{paragrafo}</p>
        ))}
      </article>

      <section className="kingdom-reading-cta">
        <p className="section-kicker">Entre na história</p>
        <h2>Descubra como os reinos transformam a jornada de Joaquim</h2>
        <p>
          Os quatro primeiros capítulos estão disponíveis gratuitamente para
          leitura online.
        </p>
        <Link to="/livro" className="btn btn-primary">
          Começar a ler grátis <span aria-hidden="true">→</span>
        </Link>
      </section>

      <nav className="kingdom-navigation" aria-label="Navegação entre reinos">
        <div className="kingdom-pager">
          <Link className="kingdom-pager-link" to={reinoAnterior.rota}>
            <span>Reino anterior</span>
            <strong>{reinoAnterior.titulo}</strong>
          </Link>
          <Link className="kingdom-pager-index" to="/reinos">
            Todos os reinos
          </Link>
          <Link
            className="kingdom-pager-link kingdom-pager-next"
            to={reinoProximo.rota}
          >
            <span>Próximo reino</span>
            <strong>{reinoProximo.titulo}</strong>
          </Link>
        </div>
      </nav>
    </main>
  );
}

export default KingdomPage;

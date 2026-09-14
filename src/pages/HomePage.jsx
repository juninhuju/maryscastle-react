import { Link } from "react-router-dom";
import Sinopse from "../components/Sinopse";
import CardReino from "../components/CardReino";
import Comentario from "../components/Comentario";
import { reinos } from "../data/reinos";

function HomePage() {
  return (
    <main className="container-fluid page-home">
      <h1>O Castelo das Marias | Romance Sobrenatural</h1>
      <p className="lead home-lead">
        Consumido pela dor da traição da esposa e por uma sede implacável de
        vingança, Joaquim é tragado para além dos limites da razão. Em um
        universo paralelo regido por quatro reinos misteriosos, ele descobre que
        o amor traído, o rancor e os desejos ocultos cobram um preço onde a
        própria alma é a moeda de troca.
      </p>

      <div className="home-quick-actions" aria-label="Comece por aqui">
        <Link to="/livro" className="quick-action quick-action-primary">
          <span className="quick-action-kicker">Entrada para a história</span>
          <strong>Ler o primeiro capítulo</strong>
          <span>Conheça Joaquim e o Castelo</span>
        </Link>
        <Link to="/quiz" className="quick-action quick-action-secondary">
          <span className="quick-action-kicker">Uma descoberta pessoal</span>
          <strong>Fazer o quiz</strong>
          <span>Descubra qual reino chama por você</span>
        </Link>
      </div>

      <div className="home-cover-frame">
        <picture>
          <source srcSet="/livro.webp" type="image/webp" />
          <img
            fetchPriority="high"
            decoding="async"
            alt="Capa do livro O Castelo das Marias, romance de fantasia de Junior Cristovam"
            id="capa-livro"
            src="/livro.jpeg"
          />
        </picture>
        <span className="home-cover-caption">O Castelo das Marias</span>
      </div>

      <Sinopse />

      <section className="cards-section">
        <h2>Conheça os quatro reinos</h2>
        <div className="cards-grid">
          {reinos.map((reino) => (
            <CardReino key={reino.slug} reino={reino} />
          ))}
        </div>
      </section>

      <section className="chapter-preview">
        <p className="section-kicker">Uma passagem para o castelo</p>
        <h2>O primeiro capítulo</h2>
        <div className="chapter-preview-layout">
          <blockquote className="chapter-banner">
            “As figuras que antes simulavam humanidade agora se retorciam em
            formas grotescas. Joaquim sentiu o calafrio: aquilo não era uma
            sala, era um covil.”
          </blockquote>
          <Link
            to="/livro"
            className="chapter-cover-link"
            aria-label="Ler o primeiro capítulo de O Castelo das Marias"
          >
            <picture>
              <source srcSet="/Adaga.webp" type="image/webp" />
              <img
                src="/Adaga.jpeg"
                alt="Capa do primeiro capítulo do livro O Castelo das Marias"
                className="chapter-cover"
                loading="lazy"
              />
            </picture>
            <span className="chapter-cover-caption">
              Abrir capítulo <span aria-hidden="true">→</span>
            </span>
          </Link>
          <blockquote className="chapter-banner">
            “Entre o sangue e a seda, a vingança de Joaquim e o renascimento de
            Maria colidem. Não espere redenção ou respostas fáceis; aqui, o
            destino só conhece caminhos tortuosos.”
          </blockquote>
        </div>
      </section>

      <Comentario />
    </main>
  );
}

export default HomePage;

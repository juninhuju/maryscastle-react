import { Link } from "react-router-dom";
import Sinopse from "../components/Sinopse";
import CardReino from "../components/CardReino";
import Comentario from "../components/Comentario";
import ReleaseNotice from "../components/ReleaseNotice";
import { reinos } from "../data/reinos";

function HomePage() {
  return (
    <main className="container-fluid page-home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="section-kicker">Romance sobrenatural · fantasia gótica</p>
          <h1 id="home-title">O Castelo das Marias</h1>
          <p className="lead home-lead">
            Consumido pela dor da traição da esposa e por uma sede implacável de
            vingança, Joaquim é tragado para além dos limites da razão. Em um
            universo paralelo regido por quatro reinos misteriosos, ele descobre
            que o amor traído, o rancor e os desejos ocultos cobram um preço onde
            a própria alma é a moeda de troca.
          </p>

          <div className="home-quick-actions" aria-label="Comece por aqui">
            <Link to="/livro" className="quick-action quick-action-primary">
              <span className="quick-action-kicker">Entre para a história</span>
              <strong>Ler os quatro primeiros capítulos</strong>
              <span>Conheça o início da jornada de Joaquim</span>
            </Link>
            <Link to="/quiz" className="quick-action quick-action-secondary">
              <span className="quick-action-kicker">Descubra seu destino</span>
              <strong>Fazer o quiz</strong>
              <span>Veja qual reino chama por você</span>
            </Link>
          </div>
          <ReleaseNotice className="home-purchase-button purchase-button">
            Comprar o livro
            <span aria-hidden="true">→</span>
          </ReleaseNotice>
        </div>

        <div className="home-cover-frame">
          <img
            fetchPriority="high"
            decoding="async"
            alt="O livro O Castelo das Marias fotografado sobre uma mesa de madeira em uma biblioteca iluminada por velas."
            id="capa-livro"
            src="/Capalivro.jpeg"
          />
          <span className="home-cover-caption">
            Uma travessia por reinos sobrenaturais e horrores ocultos
          </span>
        </div>
      </section>

      <Sinopse />

      <section className="cards-section" aria-labelledby="kingdoms-title">
        <p className="section-kicker">Quatro reinos. Um destino incerto.</p>
        <h2 id="kingdoms-title">Os reinos</h2>
        <div className="cards-grid">
          {reinos.map((reino) => (
            <CardReino key={reino.slug} reino={reino} />
          ))}
        </div>
      </section>

      <section className="chapter-preview" aria-labelledby="chapter-preview-title">
        <p className="section-kicker">Leia a prévia do livro</p>
        <h2 id="chapter-preview-title">Os quatro primeiros capítulos</h2>
        <div className="chapter-preview-layout">
          <blockquote className="chapter-banner">
            “As figuras que antes simulavam humanidade agora se retorciam em
            formas grotescas. Joaquim sentiu o calafrio: aquilo não era uma
            sala, era um covil.”
          </blockquote>
          <Link
            to="/livro"
            className="chapter-cover-link"
            aria-label="Ler os quatro primeiros capítulos de O Castelo das Marias"
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
              Começar a leitura <span aria-hidden="true">→</span>
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

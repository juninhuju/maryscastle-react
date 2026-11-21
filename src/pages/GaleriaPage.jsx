import { Link } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import VideoTrailerSection from "../components/VideoTrailerSection";
import { reinos } from "../data/reinos";

function GaleriaPage() {
  return (
    <main className="container-fluid page-galeria">
      <p className="section-kicker page-kicker">Arte e atmosfera</p>
      <h1>Galeria</h1>
      <p className="lead">
        Explore as imagens e o clipe oficial do universo de O Castelo das
        Marias.
      </p>
      <ImageCarousel />
      <VideoTrailerSection />
      <section
        className="galeria-overview"
        aria-labelledby="galeria-overview-title"
      >
        <h2 id="galeria-overview-title">
          Cenários, personagens e reinos da obra
        </h2>
        <p>
          Esta coleção reúne 25 ilustrações conceituais e o clipe oficial que
          retratam a travessia de Joaquim: ruas antigas envoltas em névoa,
          salões iluminados por velas, rituais ancestrais e os guardiões que
          governam os quatro planos de <em>O Castelo das Marias</em>.
        </p>
        <p>
          Aprofunde-se na história lendo gratuitamente os{" "}
          <Link to="/livro/">quatro primeiros capítulos</Link> ou explorando os{" "}
          <Link to="/reinos/">quatro reinos</Link>:{" "}
          {reinos.map((reino, index) => (
            <span key={reino.slug}>
              <Link to={reino.rota}>{reino.titulo}</Link>
              {index < reinos.length - 2
                ? ", "
                : index === reinos.length - 2
                  ? " e "
                  : "."}
            </span>
          ))}
        </p>
      </section>
    </main>
  );
}

export default GaleriaPage;

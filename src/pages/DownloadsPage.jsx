function DownloadsPage() {
  const imagens = Array.from({ length: 25 }, (_, index) => `${index + 1}.jpeg`);

  return (
    <main className="container-fluid page-downloads">
      <h1>Materiais para Download | O Castelo das Marias</h1>
      <p className="lead">
        Baixe gratuitamente o primeiro capítulo em PDF, as trilhas sonoras
        originais (MP3) e imagens exclusivas de O Castelo das Marias, romance
        sobrenatural de Junior Cristovam.
      </p>

      <section className="download-section" aria-labelledby="arquivos-title">
        <h2 id="arquivos-title" className="sr-only">
          Arquivos principais
        </h2>
        <article className="download-item">
          <span className="download-icon" aria-hidden="true">
            PDF
          </span>
          <h2>Primeiro capítulo</h2>
          <p>PDF com o início da jornada de Joaquim.</p>
          <a className="btn btn-primary" href="/livro.pdf" download>
            Baixar PDF
          </a>
        </article>
        <article className="download-item">
          <span className="download-icon" aria-hidden="true">
            MP3
          </span>
          <h2>Mágoa</h2>
          <p>Faixa original em formato MP3.</p>
          <a className="btn btn-secondary" href="/magoa.mp3" download>
            Baixar música
          </a>
        </article>
        <article className="download-item">
          <span className="download-icon" aria-hidden="true">
            MP3
          </span>
          <h2>Mágoa Remix</h2>
          <p>Versão remixada da trilha sonora.</p>
          <a className="btn btn-secondary" href="/magoaremix.mp3" download>
            Baixar remix
          </a>
        </article>
      </section>

      <section className="download-gallery">
        <h2>Imagens do Carrossel ({imagens.length} imagens)</h2>
        <div className="download-image-grid">
          {imagens.map((imagem, index) => {
            const num = index + 1;
            return (
              <div className="download-image-item" key={imagem}>
                <picture>
                  <source srcSet={`/carrossel/${num}.webp`} type="image/webp" />
                  <img
                    src={`/carrossel/${imagem}`}
                    alt={`Ilustração oficial ${num} do romance O Castelo das Marias`}
                    loading="lazy"
                    width="300"
                    height="300"
                  />
                </picture>
                <a
                  className="image-download"
                  href={`/carrossel/${imagem}`}
                  download={`o-castelo-das-marias-arte-${num}.jpeg`}
                  title={`Baixar ilustração ${num}`}
                  aria-label={`Baixar ilustração ${num} em alta resolução do livro O Castelo das Marias`}
                >
                  Baixar Imagem {num}
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default DownloadsPage;

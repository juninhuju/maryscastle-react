function AutorPage() {
  return (
    <main className="container-fluid page-author">
      <h1>Junior Cristovam — Autor de O Castelo das Marias</h1>
      <p className="lead author-intro">
        Escritor brasileiro de fantasia e autor do romance{" "}
        <em>O Castelo das Marias</em>. Em sua obra de estreia, mistura fantasia,
        espiritualidade, suspense e drama psicológico para criar um universo
        repleto de mistérios, escolhas e conflitos humanos.
      </p>

      <figure className="author-figure">
        <img
          src="/autor.jpeg"
          alt="Junior Cristovam, escritor brasileiro autor do romance de fantasia O Castelo das Marias"
          className="author-photo"
        />
        <figcaption>
          Junior Cristovam, autor de <em>O Castelo das Marias</em>
        </figcaption>
      </figure>

      <article className="author-description">
        <p>
          Paulista do interior e profissional do sistema financeiro, encontrou
          na literatura o contraponto necessário à rigidez das normas: um espaço
          de liberdade absoluta. Essa experiência influenciou a construção de
          <em> O Castelo das Marias</em>, sua obra de estreia, onde fantasia e
          conflitos humanos se encontram.
        </p>
        <p>
          Com uma narrativa visual e densa, o autor transporta o leitor para
          cenários onde o mistério e o sobrenatural ditam o ritmo. Seus temas
          exploram a transcendência e as consequências irremediáveis de nossas
          escolhas, desafiando tabus com uma escrita que oscila entre o lirismo
          e o suspense.
        </p>
        <p>
          Casado e pai, Junior cultiva o fascínio pela investigação, mitologias
          e religiões. Esse olhar antropológico sobre o comportamento humano é o
          combustível de sua imaginação, alimentando histórias que buscam o que
          há de oculto sob a superfície da normalidade.
        </p>
        <p>
          <em>O Castelo das Marias</em> é um convite ao desassossego: um voo por
          paisagens internas onde sombras, luzes e verdades ancestrais se
          encontram.
        </p>
      </article>
    </main>
  );
}

export default AutorPage;

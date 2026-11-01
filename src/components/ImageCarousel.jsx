import { useEffect, useState } from "react";

const descricoesSlides = [
  "Joaquim atravessa uma rua antiga coberta pela névoa.",
  "Moradores e viajantes se reúnem diante de um castelo iluminado.",
  "Um homem de capa vermelha caminha sob a lua em uma rua deserta.",
  "Uma figura vestida de vermelho segura um tridente em uma rua iluminada.",
  "Um ancião compartilha a leitura com uma criança em um campo ensolarado.",
  "Um casal se aproxima em uma sala iluminada por velas.",
  "Um homem segura um tridente enquanto figuras o observam à luz de velas.",
  "Um viajante encara um portal mágico no meio de uma floresta.",
  "Figuras encapuzadas formam uma procissão em um salão antigo.",
  "Uma mulher vestida de vermelho posa diante da lua com um tridente.",
  "Um homem imponente conversa com mulheres em uma sala de tons púrpura.",
  "Uma figura encapuzada contempla um cemitério sob a lua vermelha.",
  "Três figuras encapuzadas vigiam um caminho diante de um cemitério.",
  "Um casal troca olhares em uma igreja iluminada pelo sol.",
  "Uma viajante de capa roxa segue por um campo em direção a um castelo.",
  "Figuras de caveira se reúnem diante de um mausoléu.",
  "Uma carruagem cruza uma rua antiga ao entardecer.",
  "Um viajante encapuzado caminha entre árvores sob a lua.",
  "Um homem participa de um ritual diante de uma árvore marcada por símbolos.",
  "Um homem de capa vermelha percorre uma rua iluminada à noite.",
  "Um grupo de viajantes e guerreiros se reúne diante de um castelo.",
  "Uma figura observa um exército em uma paisagem sob a lua vermelha.",
  "Um guardião de verde recebe visitantes em uma floresta.",
  "Um casal encapuzado permanece junto em uma floresta à luz de velas.",
  "Um homem corre por uma rua cercado por figuras sombrias.",
];

const slides = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  src: `/carrossel/${index + 1}.jpeg`,
  description:
    descricoesSlides[index] ||
    `Arte conceitual de fantasia sobrenatural do universo de O Castelo das Marias, cena ${index + 1}.`,
}));

function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index) => setActiveIndex(index);
  const goToPrevious = () =>
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
  const goToNext = () =>
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

  const activeSlide = slides[activeIndex];

  return (
    <section
      className="image-carousel"
      aria-label="Galeria de imagens"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div className="carousel-stage">
        <div className="carousel-live" aria-live="polite" aria-atomic="true">
          <figure className="carousel-figure">
            <img
              src={activeSlide.src}
              alt={activeSlide.description}
              className="carousel-image"
            />
            <figcaption className="carousel-caption" aria-hidden="true">
              {activeSlide.description}
            </figcaption>
          </figure>
          <span className="sr-only">
            Imagem {activeIndex + 1} de {slides.length}
          </span>
        </div>
        <button
          type="button"
          className="carousel-control carousel-control-prev"
          onClick={goToPrevious}
          aria-label="Imagem anterior"
        >
          &#8249;
        </button>
        <button
          type="button"
          className="carousel-control carousel-control-next"
          onClick={goToNext}
          aria-label="Próxima imagem"
        >
          &#8250;
        </button>
        <a
          className="carousel-download"
          href={activeSlide.src}
          download={`O-Castelo-das-Marias-imagem-${activeSlide.id}.jpeg`}
          aria-label={`Baixar imagem ${activeSlide.id}`}
          title="Baixar esta imagem"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
          </svg>
        </a>
      </div>

      <button
        type="button"
        className="carousel-pause"
        onClick={() => setIsPaused((paused) => !paused)}
        aria-pressed={isPaused}
      >
        {isPaused
          ? "Reproduzir automaticamente"
          : "Pausar reprodução automática"}
      </button>

      <div className="carousel-indicators" aria-label="Selecionar imagem">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`carousel-indicator${index === activeIndex ? " active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para a imagem ${slide.id}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      <p className="carousel-counter">
        {activeIndex + 1} / {slides.length}
      </p>
    </section>
  );
}

export default ImageCarousel;

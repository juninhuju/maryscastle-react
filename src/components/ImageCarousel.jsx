import { useEffect, useState } from "react";

const slides = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  src: `/carrossel/${index + 1}.jpeg`,
  alt: `Imagem do carrossel ${index + 1} de O Castelo das Marias`,
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
          <img
            src={activeSlide.src}
            alt={activeSlide.alt}
            className="carousel-image"
          />
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

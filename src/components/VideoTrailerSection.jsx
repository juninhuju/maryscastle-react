import { useEffect, useId, useRef, useState } from "react";

const MEDIA_PLAY_EVENT = "castle-media-play";

export function VideoTrailerPlayer() {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleOtherMediaPlay = (event) => {
      if (event.detail?.source === "video") return;
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
    };

    window.addEventListener(MEDIA_PLAY_EVENT, handleOtherMediaPlay);
    return () => {
      window.removeEventListener(MEDIA_PLAY_EVENT, handleOtherMediaPlay);
    };
  }, []);

  const handleOverlayPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    setHasError(false);

    try {
      await video.play();
    } catch {
      // Caso o navegador bloqueie o play programático, os controles nativos ficam visíveis.
    }
  };

  const handleVideoPlay = () => {
    setHasStarted(true);
    setHasError(false);
    window.dispatchEvent(
      new CustomEvent(MEDIA_PLAY_EVENT, { detail: { source: "video" } }),
    );
  };

  return (
    <div className="video-trailer-media">
      <div className="video-trailer-frame">
        <video
          ref={videoRef}
          className="video-trailer-player"
          controls={hasStarted}
          playsInline
          preload="none"
          poster="/Capalivro.jpeg"
          width={720}
          height={1276}
          aria-label="Clipe promocional do livro O Castelo das Marias"
          onPlay={handleVideoPlay}
          onError={() => setHasError(true)}
        >
          <source src="/clipe.mp4" type="video/mp4" />
          Seu navegador não suporta a reprodução de vídeo HTML5.
        </video>

        {!hasStarted && !hasError && (
          <button
            type="button"
            className="video-trailer-overlay"
            onClick={handleOverlayPlay}
            aria-label="Assistir ao clipe oficial de O Castelo das Marias (36 segundos)"
          >
            <span className="video-trailer-play-circle" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
            </span>
            <span className="video-trailer-play-label">Assistir ao clipe</span>
            <span className="video-trailer-duration">0:36</span>
          </button>
        )}
      </div>

      {hasError && (
        <p className="video-trailer-error" role="alert">
          Não foi possível carregar o vídeo agora. Tente novamente em instantes.
        </p>
      )}
    </div>
  );
}

function VideoTrailerSection() {
  const titleId = useId();

  return (
    <section
      className="video-trailer-section video-trailer-gallery"
      aria-labelledby={titleId}
    >
      <div className="video-trailer-copy">
        <p className="section-kicker">Clipe oficial · Vídeo</p>
        <h2 id={titleId}>O Castelo em movimento</h2>
        <p className="video-trailer-lead">
          Um vislumbre de 36 segundos pela travessia de Joaquim em{" "}
          <em>O Castelo das Marias</em> — onde sedução, magia e mistérios se
          entrelaçam a cada porta.
        </p>
        <p className="video-trailer-meta">
          Ative o som para aproveitar a experiência completa. Se a trilha sonora
          da página estiver tocando, ela será pausada automaticamente ao iniciar
          o vídeo.
        </p>
      </div>

      <div className="video-trailer-stage">
        <VideoTrailerPlayer />
      </div>
    </section>
  );
}

export default VideoTrailerSection;

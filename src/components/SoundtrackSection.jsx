import { useRef, useState } from "react";

const tracks = {
  original: {
    label: "Original",
    src: "/magoa.mp3",
    downloadName: "O-Castelo-das-Marias-Trilha-Sonora-Original.mp3",
  },
  remix: {
    label: "Remix",
    src: "/magoaremix.mp3",
    downloadName: "O-Castelo-das-Marias-Trilha-Sonora-Remix.mp3",
  },
};

function SoundtrackSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("original");
  const audioRef = useRef(null);

  const playTrack = async (trackId) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (selectedTrack === trackId && !audio.paused && audio.currentSrc) {
      audio.pause();
      return;
    }

    try {
      const trackUrl = new URL(tracks[trackId].src, window.location.href).href;
      if (audio.src !== trackUrl) {
        audio.src = trackUrl;
        audio.load();
      }
      setSelectedTrack(trackId);
      await audio.play();
    } catch (error) {
      console.error(
        `Não foi possível reproduzir a trilha ${tracks[trackId].label.toLowerCase()}.`,
        error,
      );
      setIsPlaying(false);
    }
  };

  return (
    <section className="soundtrack-section" aria-labelledby="soundtrack-title">
      <div className="soundtrack-inner container-fluid">
        <div className="soundtrack-copy">
          <h2 id="soundtrack-title">A trilha sonora do Castelo</h2>
        </div>
        <div className="soundtrack-player">
          <audio
            ref={audioRef}
            preload="none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          {Object.entries(tracks).map(([trackId, track]) => {
            const isCurrentTrack = selectedTrack === trackId;
            const isCurrentTrackPlaying = isCurrentTrack && isPlaying;

            return (
              <div className="soundtrack-track" key={trackId}>
                <button
                  type="button"
                  className={`soundtrack-play-button${isCurrentTrackPlaying ? " playing" : ""}`}
                  onClick={() => playTrack(trackId)}
                  aria-label={`${isCurrentTrackPlaying ? "Pausar" : "Ouvir"} trilha ${track.label}`}
                  aria-pressed={isCurrentTrackPlaying}
                >
                  <span aria-hidden="true">
                    {isCurrentTrackPlaying ? "⏸" : "♫"}
                  </span>
                  <span>
                    {isCurrentTrackPlaying ? "Pausar" : "Ouvir"} {track.label}
                  </span>
                </button>
                <a
                  className="soundtrack-download"
                  href={track.src}
                  download={track.downloadName}
                  aria-label={`Baixar trilha ${track.label}`}
                  title={`Baixar versão ${track.label.toLowerCase()}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
                  </svg>
                  <span>Baixar</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SoundtrackSection;

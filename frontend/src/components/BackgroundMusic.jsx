import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = forwardRef(({ showButton }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Expose controls to parent App
  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.warn("Native audio play blocked:", err));
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }));

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Native play failed:", err));
    }
  };

  return (
    <>
      {/* HTML5 Native Audio player using the local MP3 */}
      <audio
        ref={audioRef}
        src="/communion_song.mp3"
        loop
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Floating Music Control Button */}
      {showButton && (
        <button 
          className="music-toggle-btn"
          onClick={toggleMusic}
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <Volume2 className="music-icon active" size={20} />
          ) : (
            <VolumeX className="music-icon" size={20} />
          )}
        </button>
      )}
    </>
  );
});

export default BackgroundMusic;

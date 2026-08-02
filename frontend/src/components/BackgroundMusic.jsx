import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = forwardRef(({ showButton }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef(null);

  // Expose play/pause controls directly to the parent App component
  useImperativeHandle(ref, () => ({
    play: () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    },
    pause: () => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      }
    }
  }));

  // Load YouTube Player API script immediately on mount
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    
    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Initialize YT Player in background
  useEffect(() => {
    if (apiReady && !playerRef.current) {
      playerRef.current = new window.YT.Player('yt-audio-player', {
        height: '0',
        width: '0',
        videoId: 'Hh6KeSAOu5A',
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: 'Hh6KeSAOu5A',
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onStateChange: (event) => {
            // Force loop by manual playback on ended state
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    }
  }, [apiReady]);

  const toggleMusic = () => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden YouTube IFrame container */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div id="yt-audio-player"></div>
      </div>

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

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic({ autoStart }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef(null);

  // Load YouTube Player API
  useEffect(() => {
    // If global YT object is already loaded, just set ready
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    // Otherwise, load script dynamically
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    
    // Set callback
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
      // Clean up callback to prevent memory leaks
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Initialize YT Player when API is ready
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
          onReady: (event) => {
            // Player is initialized and ready
            if (autoStart) {
              event.target.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event) => {
            // Ensure loop works by manually restarting when ended
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    }
  }, [apiReady]);

  // Handle auto-start trigger on envelope open
  useEffect(() => {
    if (autoStart && playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [autoStart]);

  // Sync play/pause state
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
    </>
  );
}

import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";

// GUIDE =>>> https://videojs.com/guides/react/

interface Props {
  posterUrl: string,
  onReady?: (player: Player) => void;
}

const VideoPlayer = ({ posterUrl, onReady }: Props) => {
  const videoRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<Player | null>(null);

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      if (videoRef.current) videoRef.current.appendChild(videoElement);

      const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        preload: "auto",
        sources: [{
          src: posterUrl,
          type: 'video/mp4'
        }]
      };

      const player = playerRef.current = videojs(videoElement, videoJsOptions, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });
    }
    else {
      const player = playerRef.current;
      // videoJsOptions
      player.autoplay(true);
      player.src([{
        src: posterUrl,
        type: 'video/mp4'
      }]);
    }
  }, []);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);


  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
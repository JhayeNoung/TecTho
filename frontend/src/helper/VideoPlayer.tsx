import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";

// GUIDE =>>> https://videojs.com/guides/react/

interface Props {
  posterUrl: string,
  videoUrl: string,
  onReady?: (player: Player) => void;
}

const VideoPlayer = ({ posterUrl, videoUrl, onReady }: Props) => {
  const videoRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<Player | null>(null);

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    // if playerRef.current doesn't have value, create player, reference the playerRef.current to that player
    if (!playerRef.current) {
      // create videoElement and set it to the videoRef.current 
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      if (videoRef.current) videoRef.current.appendChild(videoElement);

      const isHLS = videoUrl.endsWith(".m3u8"); // This checks if the URL is HLS
      const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        preload: "auto",
        poster: posterUrl,
        sources: isHLS
          ? [{
            src: videoUrl,
            type: 'application/x-mpegURL' // HLS
          }]
          : [{
            src: videoUrl,
            type: 'video/mp4' // MP4 fallback
          }]
      };

      // create player
      const player = playerRef.current = videojs(videoElement, videoJsOptions, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });

    }
    else {
      // if playerRef.current has value
      const player = playerRef.current;
      // videoJsOptions
      player.autoplay(false);
      const isHLS = videoUrl.endsWith(".m3u8"); // Check if the URL is HLS
      player.src(isHLS
        ? [{ src: videoUrl, type: 'application/x-mpegURL' }] // Use HLS URL
        : [{ src: videoUrl, type: 'video/mp4' }] // Use MP4 fallback
      );
      player.src([{
        src: videoUrl,
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
import React from 'react';
import { Card, CardBody, Image, HStack } from '@chakra-ui/react'
import Player from 'video.js/dist/types/player';

import { Movie } from '@/hooks/useMovie'
import MetacriticBadge from './MetacriticBadge'
import VideoPlayer from '@/helper/VideoPlayer';
import videojs from "video.js";

interface Props {
  movie: Movie
}

function MovieCard({ movie }: Props) {
  const playerRef = React.useRef<Player | null>(null);

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <Card.Root>
      {movie.poster_url.endsWith(".mp4") ?
        <VideoPlayer posterUrl={movie.poster_url} onReady={handlePlayerReady} />
        :
        <Image src={movie.poster_url} alt="Movie Poster" />
      }
      <CardBody>
        <HStack justify={'flex-end'}>
          <MetacriticBadge name={"In Stock"} score={movie.numberInStock} />
          <MetacriticBadge name={"Rental Rate"} score={movie.dailyRentalRate} />
        </HStack>
        <Card.Title key={movie._id} fontSize={20}>{movie.title}</Card.Title>
      </CardBody>
    </Card.Root>
  )
}

export default MovieCard
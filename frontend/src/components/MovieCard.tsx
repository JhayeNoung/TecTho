import React from 'react';
import { Card, CardBody, Image, HStack, Button, Stack } from '@chakra-ui/react'
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
      {movie.video_url ?
        <VideoPlayer posterUrl={movie.poster_url} videoUrl={movie.video_url} onReady={handlePlayerReady} />
        :
        <Image src={movie.poster_url} alt="Movie Poster" />
      }
      <CardBody>
        <HStack justify={'space-between'}>
          <form action="http://localhost:3001/api/stripe/create-checkout-session" method="POST">
            {/* movie object to json */}
            <input type="hidden" name="movie" value={JSON.stringify(movie)} />
            <Button type="submit">
              Rent Now
            </Button>
          </form>
          <Stack>
            <MetacriticBadge name={"In Stock"} score={movie.numberInStock} />
            <MetacriticBadge name={"Rental Rate"} score={movie.dailyRentalRate} />
          </Stack>
        </HStack>
        <Card.Title key={movie._id} fontSize={20}>{movie.title}</Card.Title>
      </CardBody>
    </Card.Root>
  )
}

export default MovieCard
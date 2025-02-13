import React from 'react';
import { Card, CardBody, Image, HStack, Button, Stack } from '@chakra-ui/react'
import Player from 'video.js/dist/types/player';
import videojs from "video.js";
import VideoPlayer from '@/helper/VideoPlayer';
import MetacriticBadge from './MetacriticBadge'

import { FetchMovie } from '@/hooks/useMovie'
import apiMovie from '@/services/api-movie';

interface Props {
  movie: FetchMovie
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

  const handleCheckout = async () => {
    // Call the backend to create a checkout session, return URL
    const response = await apiMovie.post('/stripe/create-checkout-session', { ...movie });
    const { url } = response.data;
    window.location.href = url; // window.location.href contains the URL of the current page
  }

  return (
    <Card.Root>
      {movie.video_url ?
        <VideoPlayer posterUrl={movie.poster_url} videoUrl={movie.video_url} onReady={handlePlayerReady} />
        :
        <Image src={movie.poster_url} alt="Movie Poster" />
      }
      <CardBody>
        <HStack justify={'space-between'}>
          <Button onClick={handleCheckout}>
            Rent Now
          </Button>
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